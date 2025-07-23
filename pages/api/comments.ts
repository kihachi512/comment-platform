import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { createCommentSchema, sanitizeHtml, validateSafeText } from "../../lib/validations";
import { checkRateLimit, sendErrorResponse, sendSuccessResponse } from "../../lib/auth-helpers";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // レート制限チェック（読み取りは緩い制限）
    if (!checkRateLimit(req, res, 200, 60 * 1000)) return;

    const { postId } = req.query;

    if (!postId || typeof postId !== "string") {
      return sendErrorResponse(res, 400, "postIdが必要です", "MISSING_POST_ID");
    }

    try {
      const result = await client.send(
        new QueryCommand({
          TableName: "Comments",
          IndexName: "postId-index",
          KeyConditionExpression: "postId = :pid",
          ExpressionAttributeValues: {
            ":pid": { S: postId },
          },
        })
      );

      const items = result.Items?.map((item) => unmarshall(item));
      return res.status(200).json(items);
    } catch (err) {
      console.error("コメント取得エラー:", err);
      return res.status(500).json({ error: "取得失敗" });
    }
  }

  if (req.method === "POST") {
    // レート制限チェック（コメント作成は厳しい制限）
    if (!checkRateLimit(req, res, 30, 60 * 1000)) return;

    // 入力検証
    try {
      const validatedData = createCommentSchema.parse(req.body);
      const { postId, content, type } = validatedData;

      // XSS攻撃チェック
      if (!validateSafeText(content)) {
        return sendErrorResponse(res, 400, "不正な文字が含まれています", "INVALID_INPUT");
      }

      const session = await getServerSession(req, res, authOptions);

      // セッション取得ヘルパーを使用
      const authorId = session?.user?.userId || "anonymous";

      try {
        // 入力データのサニタイゼーション
        const sanitizedContent = sanitizeHtml(content);

        await client.send(
        new PutItemCommand({
          TableName: "Comments",
          Item: {
            commentId: { S: uuidv4() },
            postId: { S: postId },
            content: { S: sanitizedContent },
            type: { S: type },
            authorId: { S: authorId },
            createdAt: { S: new Date().toISOString() },
            expiresAt: {
              N: `${Math.floor(Date.now() / 1000) + 60 * 60 * 24}`, // 24時間後
            },
          },
        })
      );
      
        return sendSuccessResponse(res, { success: true }, "コメントが作成されました", 201);
        
      } catch (err) {
        console.error("コメント保存エラー:", err);
        return sendErrorResponse(res, 500, "コメントの保存に失敗しました", "SAVE_ERROR");
      }
      
    } catch (validationError) {
      if (validationError instanceof Error && 'errors' in validationError) {
        return sendErrorResponse(res, 400, "入力データが無効です", "VALIDATION_ERROR", (validationError as any).errors);
      }
      return sendErrorResponse(res, 400, "不正なリクエストです", "BAD_REQUEST");
    }
  }

  return res.status(405).end(); // それ以外のメソッド
}
