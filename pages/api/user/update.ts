import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "emailとusernameが必要です" });
  }

  try {
    const command = new UpdateItemCommand({
      TableName: "Users",
      Key: {
        email: { S: email },
      },
      UpdateExpression: "SET username = :username",
      ExpressionAttributeValues: {
        ":username": { S: username },
      },
    });

    await client.send(command);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("更新エラー:", error);
    res.status(500).json({ error: "ユーザー名の更新に失敗しました" });
  }
}
