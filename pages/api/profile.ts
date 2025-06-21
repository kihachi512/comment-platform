import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TABLE_NAME = "Users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, username } = req.method === "POST" ? req.body : req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "無効なemailです" });
  }

  if (req.method === "POST") {
    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "無効なusernameです" });
    }

    try {
      const existing = await client.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { email: { S: email } },
        })
      );

      const userId =
        existing.Item?.userId?.S ||
        uuidv4().replace(/-/g, "").slice(0, 12); // 12桁の一意ID

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
      return res.status(500).json({ error: "保存に失敗しました" });
    }
  }

  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: { email: { S: email } },
      })
    );

    if (!result.Item) {
      return res.status(200).json({ username: "", userId: "" });
    }

    const data = unmarshall(result.Item);
    return res.status(200).json({
      username: data.username || "",
      userId: data.userId || "",
    });
  } catch (err) {
    console.error("取得エラー:", err);
    return res.status(500).json({ error: "取得に失敗しました" });
  }
}
