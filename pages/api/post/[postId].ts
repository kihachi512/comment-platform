import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawId = req.query.postId;
  const postId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { viewerUserId } = req.query; // クエリパラメータで閲覧者のuserIdを受け取る

  if (!postId) {
    return res.status(400).json({ error: "無効なpostId" });
  }

  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: "Posts",
        Key: {
          postId: { S: postId },
        },
      })
    );

    if (!result.Item) {
      return res.status(404).json({ error: "投稿が見つかりません" });
    }

    const post = unmarshall(result.Item);
    
    // 一般ユーザーには1時間制限、投稿者本人には24時間制限を適用
    const now = Math.floor(Date.now() / 1000);
    const isAuthor = viewerUserId && post.authorId === viewerUserId;
    const createdAtTimestamp = Math.floor(new Date(post.createdAt).getTime() / 1000);
    const oneHourAgo = now - 60 * 60;
    
    // 作者以外は1時間以内の投稿のみ閲覧可能
    if (!isAuthor && createdAtTimestamp <= oneHourAgo) {
      return res.status(404).json({ error: "投稿が見つかりません" });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
}
