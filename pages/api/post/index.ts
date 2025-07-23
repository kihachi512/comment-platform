import { NextApiRequest, NextApiResponse } from "next";
import {
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { createPostSchema, sanitizeHtml, validateSafeText } from "../../../lib/validations";
import { validateMethod, checkRateLimit, sendErrorResponse, sendSuccessResponse } from "../../../lib/auth-helpers";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // HTTPメソッド検証
  if (!validateMethod(req, res, ['POST'])) return;

  // レート制限チェック
  if (!checkRateLimit(req, res, 20, 60 * 1000)) return; // 1分間に20投稿まで

  // 入力検証
  try {
    const validatedData = createPostSchema.parse(req.body);
    const { postId, body, authorId, authorName } = validatedData;

    // XSS攻撃チェック
    if (!validateSafeText(body) || (authorName && !validateSafeText(authorName))) {
      return sendErrorResponse(res, 400, "不正な文字が含まれています", "INVALID_INPUT");
    }

    try {
      // 入力データのサニタイゼーション
      const sanitizedBody = sanitizeHtml(body);
      const sanitizedAuthorName = authorName ? sanitizeHtml(authorName) : "匿名ユーザー";

      const item: any = {
      postId: { S: postId },
      body: { S: sanitizedBody },
      authorName: { S: sanitizedAuthorName },
      createdAt: { S: new Date().toISOString() },
      expiresAt: {
        // DynamoDBからの物理削除: 24時間後（ストレージ節約）
        // 表示制限: 一般ユーザー1時間、作者24時間（各APIで制御）
        N: `${Math.floor(Date.now() / 1000) + 24 * 60 * 60}`, // 24時間後
      },
    };

    // ログインユーザーなら authorId を追加
    if (authorId) {
      item.authorId = { S: authorId };
    }

    await client.send(
      new PutItemCommand({
        TableName: "Posts",
        Item: item,
      })
    );
    
      return sendSuccessResponse(res, { postId }, "投稿が作成されました", 201);
      
    } catch (err) {
      console.error("投稿の保存に失敗:", err);
      return sendErrorResponse(res, 500, "投稿の保存に失敗しました", "SAVE_ERROR");
    }
    
  } catch (validationError) {
    if (validationError instanceof Error && 'errors' in validationError) {
      return sendErrorResponse(res, 400, "入力データが無効です", "VALIDATION_ERROR", (validationError as any).errors);
    }
    return sendErrorResponse(res, 400, "不正なリクエストです", "BAD_REQUEST");
  }
}
