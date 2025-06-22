import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { postId } = req.query;

    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ error: "postIdが必要です" });
    }

    try {
      const result = await client.send(
        new QueryCommand({
          TableName: "Comments",
          IndexName: "postId-index",
          KeyConditionExpression: "postId = :pid",
          ExpressionAttributeValues: {
            ":pid": { S: postId },
          },
        })
      );

      const items = result.Items?.map((item) => unmarshall(item));
      return res.status(200).json(items);
    } catch (err) {
      console.error("コメント取得エラー:", err);
      return res.status(500).json({ error: "取得失敗" });
    }
  }

  if (req.method === "POST") {
    const { postId, content, type } = req.body;

    if (!postId || !content || !type) {
      return res.status(400).json({ error: "必要な情報が足りません" });
    }

    const session = await getServerSession(req, res, authOptions);

    // 🔍 session.user.userId に修正
    const authorId = session?.user?.userId || "anonymous";

    try {
      await client.send(
        new PutItemCommand({
          TableName: "Comments",
          Item: {
            commentId: { S: uuidv4() },
            postId: { S: postId },
            content: { S: content },
            type: { S: type },
            authorId: { S: authorId }, // ← 🔁 userId → authorId に統一
            createdAt: { S: new Date().toISOString() },
          },
        })
      );
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("コメント保存エラー:", err);
      return res.status(500).json({ error: "保存失敗" });
    }
  }

  return res.status(405).end(); // それ以外のメソッド
}
