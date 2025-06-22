import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TABLE_NAME = "Users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, userId } = req.method === "POST" ? req.body : req.query;

  // POST（ユーザー名保存）
  if (req.method === "POST") {
    if (!email || typeof email !== "string" || typeof username !== "string") {
      return res.status(400).json({ error: "無効なデータです" });
    }

    try {
      const existing = await client.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { email: { S: email } },
        })
      );
      const existingData = existing.Item ? unmarshall(existing.Item) : {};
      const userId = existingData.userId || nanoid(12);

      await client.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          Item: {
            email: { S: email },
            username: { S: username },
            userId: { S: userId },
          },
        })
      );
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("保存エラー:", err);
      return res.status(500).json({ error: "保存失敗" });
    }
  }

  // GET（email か userId で検索）
  try {
    if (email && typeof email === "string") {
      const result = await client.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { email: { S: email } },
        })
      );
      const data = result.Item ? unmarshall(result.Item) : {};
      return res.status(200).json({
        username: data.username || "",
        userId: data.userId || "",
      });
    }

    if (userId && typeof userId === "string") {
      const result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "userId-index", // 🔸 この GSI が必要！
          KeyConditionExpression: "userId = :uid",
          ExpressionAttributeValues: {
            ":uid": { S: userId },
          },
        })
      );
      const items = result.Items ?? [];
      const data = items.length > 0 ? unmarshall(items[0]) : {};
      return res.status(200).json({
        username: data.username || "",
        userId: data.userId || "",
      });
    }

    return res.status(400).json({ error: "email または userId を指定してください" });
  } catch (err) {
    console.error("取得エラー:", err);
    return res.status(500).json({ error: "取得失敗" });
  }
}
