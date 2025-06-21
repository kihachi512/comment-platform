// pages/api/users/[email].ts
import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawEmail = req.query.email;
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: "Users",
        Key: {
          email: { S: email },
        },
      })
    );

    if (!result.Item) {
      return res.status(200).json({ username: "" }); // ユーザーが未登録でもエラーにしない
    }

    const user = unmarshall(result.Item);
    return res.status(200).json({ username: user.username || "" });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "サーバーエラー" });
  }
}
