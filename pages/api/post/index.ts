// pages/api/post/index.ts
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

  const { postId, title, body, authorId } = req.body;

  if (!postId || !title || !body || !authorId) {
    return res.status(400).json({ error: "必要な情報が不足しています" });
  }

  // Usersテーブルからユーザー名を取得
  let authorName = "匿名ユーザー";
  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: "Users",
        Key: { email: { S: authorId } },
      })
    );
    if (result.Item) {
      const user = unmarshall(result.Item);
      if (user.username) authorName = user.username;
    }
  } catch (err) {
    console.error("ユーザー名の取得に失敗:", err);
  }

  // 投稿保存
  try {
    await client.send(
      new PutItemCommand({
        TableName: "Posts",
        Item: {
          postId: { S: postId },
          title: { S: title },
          body: { S: body },
          authorId: { S: authorId },
          authorName: { S: authorName },
          createdAt: { S: new Date().toISOString() },
        },
      })
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("投稿の保存に失敗:", err);
    return res.status(500).json({ error: "保存エラー" });
  }
}
