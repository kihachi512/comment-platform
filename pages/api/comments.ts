import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, QueryCommand, PutItemCommand, UpdateItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { postId, unapproved } = req.query;
    if (unapproved === "true") {
      const result = await client.send(
        new ScanCommand({
          TableName: "Comments",
          FilterExpression: "isApproved = :ap",
          ExpressionAttributeValues: {
            ":ap": { BOOL: false },
          },
        })
      );
      const items = result.Items?.map((item) => unmarshall(item));
      return res.status(200).json(items);
    }
    const result = await client.send(
      new QueryCommand({
        TableName: "Comments",
        IndexName: "postId-index",
        KeyConditionExpression: "postId = :pid",
        ExpressionAttributeValues: {
          ":pid": { S: postId as string },
          ":ap": { BOOL: true },
        },
        FilterExpression: "isApproved = :ap",
      })
    );
    const items = result.Items?.map((item) => unmarshall(item));
    res.status(200).json(items);
  } else if (req.method === "POST") {
    const { postId, content, type } = req.body;
    await client.send(
      new PutItemCommand({
        TableName: "Comments",
        Item: {
          commentId: { S: uuidv4() },
          postId: { S: postId },
          content: { S: content },
          type: { S: type },
          isApproved: { BOOL: false },
          createdAt: { S: new Date().toISOString() },
        },
      })
    );
    res.status(200).json({ ok: true });
  } else if (req.method === "PUT") {
    const { commentId } = req.body;
    await client.send(
      new UpdateItemCommand({
        TableName: "Comments",
        Key: { commentId: { S: commentId } },
        UpdateExpression: "SET isApproved = :val",
        ExpressionAttributeValues: {
          ":val": { BOOL: true },
        },
      })
    );
    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
