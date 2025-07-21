// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await client.send(new ScanCommand({ TableName: "Posts" }));
    const items = result.Items?.map((item) => unmarshall(item));
    // 1時間経過した投稿を除外
    const now = Math.floor(Date.now() / 1000);
    const filtered = items?.filter((item) => !item.expiresAt || item.expiresAt > now);
    res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "取得に失敗しました" });
  }
}
