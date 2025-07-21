import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "全ての項目を入力してください" });
  }
  // メール重複チェック
  const result = await client.send(
    new GetItemCommand({
      TableName: "Users",
      Key: { email: { S: email } },
    })
  );
  if (result.Item) {
    return res.status(400).json({ error: "このメールアドレスは既に登録されています" });
  }
  // パスワードハッシュ化
  const hashed = await bcrypt.hash(password, 10);
  // userId生成
  const userId = Math.random().toString(36).slice(2, 12);
  await client.send(
    new PutItemCommand({
      TableName: "Users",
      Item: {
        email: { S: email },
        password: { S: hashed },
        username: { S: username },
        userId: { S: userId },
      },
    })
  );
  return res.status(200).json({ ok: true });
}