import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { postId, title, body, authorId } = req.body;
  await client.send(
    new PutItemCommand({
      TableName: "Posts",
      Item: {
        postId: { S: postId },
        title: { S: title },
        body: { S: body },
        authorId: { S: authorId },
        createdAt: { S: new Date().toISOString() },
      },
    })
  );
  res.status(200).json({ ok: true });
}