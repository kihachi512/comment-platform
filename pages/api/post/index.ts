import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { postId, body, authorId, authorName } = req.body;

  if (!postId || !body) {
    return res.status(400).json({ error: "postIdとbodyは必須です" });
  }

  try {
    const item: any = {
      postId: { S: postId },
      body: { S: body },
      authorName: { S: authorName || "匿名ユーザー" },
      createdAt: { S: new Date().toISOString() },
      expiresAt: {
        N: `${Math.floor(Date.now() / 1000) + 60 * 60}`, // 60分後
      },
    };

    // ログインユーザーなら authorId を追加
    if (authorId) {
      item.authorId = { S: authorId };
    }

    await client.send(
      new PutItemCommand({
        TableName: "Posts",
        Item: item,
      })
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("投稿の保存に失敗:", err);
    return res.status(500).json({ error: "保存エラー" });
  }
}
