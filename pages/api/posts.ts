// pages/api/posts.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await client.send(new ScanCommand({ TableName: "Posts" }));
    if (!result.Items) {
      return res.status(200).json([]);
    }
    const posts = result.Items.map((item) => unmarshall(item));

    // 各投稿のコメント数を取得
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentResult = await client.send(
          new QueryCommand({
            TableName: "Comments",
            IndexName: "postId-index",
            KeyConditionExpression: "postId = :pid",
            ExpressionAttributeValues: {
              ":pid": { S: post.postId },
            },
            Select: "COUNT",
          })
        );
        return { ...post, commentCount: commentResult.Count || 0 };
      })
    );
    const now = Math.floor(Date.now() / 1000);
    const filtered = postsWithCommentCount?.filter((item) => !item.expiresAt || item.expiresAt > now);
    res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "取得に失敗しました" });
  }
}
