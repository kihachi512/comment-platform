// pages/api/post/delete.ts
import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { postId } = req.body;

  if (!postId) return res.status(400).json({ error: "postIdが必要です" });

  try {
    await client.send(
      new DeleteItemCommand({
        TableName: "Posts",
        Key: {
          postId: { S: postId },
        },
      })
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "削除に失敗しました" });
  }
}
