import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "ユーザーIDが必要です" });
  }

  try {
    // 過去24時間の基準時刻を計算（ISO形式）
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twentyFourHoursAgoISO = twentyFourHoursAgo.toISOString();

    // DynamoDBで２つの条件でフィルタリング:
    // 1. authorId = 指定されたユーザーID
    // 2. createdAt >= 過去24時間以内
    const result = await client.send(new ScanCommand({ 
      TableName: "Posts",
      FilterExpression: "authorId = :authorId AND createdAt >= :timeThreshold",
      ExpressionAttributeValues: {
        ":authorId": { S: userId },
        ":timeThreshold": { S: twentyFourHoursAgoISO }
      }
    }));

    if (!result.Items) {
      return res.status(200).json([]);
    }

    const posts = result.Items.map((item) => unmarshall(item));

    // 各投稿のコメント数を取得
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post: Record<string, unknown>) => {
        try {
          const commentResult = await client.send(
            new QueryCommand({
              TableName: "Comments",
              IndexName: "postId-index",
              KeyConditionExpression: "postId = :pid",
              ExpressionAttributeValues: {
                ":pid": { S: post.postId as string },
              },
              Select: "COUNT",
            })
          );
          return { ...post, commentCount: commentResult.Count || 0 };
        } catch (error) {
          console.error(`コメント数取得エラー for postId ${post.postId as string}:`, error);
          return { ...post, commentCount: 0 };
        }
      })
    );

    // TTLチェック: 有効期限が過ぎた投稿は除外
    // 過去24時間 + 有効期限内の投稿のみ表示
    const now = Math.floor(Date.now() / 1000);
    const validPosts = postsWithCommentCount.filter((post: any) => 
      !post.expiresAt || (post.expiresAt as number) > now
    );

    // 作成日時の降順でソート（新しい投稿が上に）
    const sortedPosts = validPosts.sort((a: any, b: any) => 
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error("過去24時間の投稿取得エラー:", error);
    res.status(500).json({ error: "投稿の取得に失敗しました" });
  }
}