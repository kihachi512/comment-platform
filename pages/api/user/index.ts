// pages/api/user/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { userId, name } = req.body;

  await client.send(
    new PutItemCommand({
      TableName: "Users",
      Item: {
        userId: { S: userId },
        name: { S: name },
      },
    })
  );

  res.status(200).json({ ok: true });
}