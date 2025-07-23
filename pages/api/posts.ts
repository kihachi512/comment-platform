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
      posts.map(async (post: any) => {
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
    
    // 一般投稿表示では1時間制限を適用（プライバシー保護）
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 60 * 60; // 1時間前
    
    let filtered = postsWithCommentCount;
    if (!req.query.all) {
      // 1時間以内の投稿のみ表示
      filtered = postsWithCommentCount?.filter((item) => {
        const createdAtTimestamp = Math.floor(new Date(item.createdAt).getTime() / 1000);
        return createdAtTimestamp > oneHourAgo;
      });
    }
    res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "取得に失敗しました" });
  }
}
