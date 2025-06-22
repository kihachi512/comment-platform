import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { postId, body, authorId, authorName } = req.body;

  if (!postId || !body || !authorId) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  try {
    await client.send(
      new PutItemCommand({
        TableName: "Posts",
        Item: {
          postId: { S: postId },
          body: { S: body },
          authorId: { S: authorId },
          authorName: { S: authorName || "匿名ユーザー" },
          createdAt: { S: new Date().toISOString() },
          expiresAt: {
            N: `${Math.floor(Date.now() / 1000) + 60 * 60}`, // 現在時刻+5分（UNIX秒）
          },
        },
      })
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("投稿の保存に失敗:", err);
    return res.status(500).json({ error: "保存エラー" });
  }
}
