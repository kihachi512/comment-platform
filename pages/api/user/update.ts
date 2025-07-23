import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { updateUserSchema, sanitizeHtml, validateSafeText } from "../../../lib/validations";
import { requireAuth, validateMethod, checkRateLimit, sendErrorResponse, sendSuccessResponse } from "../../../lib/auth-helpers";

const client = new DynamoDBClient({ region: "ap-northeast-1" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // HTTPメソッド検証
  if (!validateMethod(req, res, ['POST'])) return;

  // レート制限チェック
  if (!checkRateLimit(req, res, 10, 60 * 1000)) return; // 1分間に10回まで

  // 認証チェック
  const session = await requireAuth(req, res);
  if (!session) return;

  // 入力検証
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const { email, username } = validatedData;

    // セッションのメールアドレスと一致チェック
    if (session.user.email !== email) {
      return sendErrorResponse(res, 403, "他のユーザーの情報は更新できません", "FORBIDDEN");
    }

    // XSS攻撃チェック
    if (!validateSafeText(username)) {
      return sendErrorResponse(res, 400, "ユーザー名に不正な文字が含まれています", "INVALID_INPUT");
    }

    try {
      // 入力データのサニタイゼーション
      const sanitizedUsername = sanitizeHtml(username);

      const command = new UpdateItemCommand({
        TableName: "Users",
        Key: {
          email: { S: email },
        },
        UpdateExpression: "SET username = :username",
        ExpressionAttributeValues: {
          ":username": { S: sanitizedUsername },
        },
      });

      await client.send(command);
      
      return sendSuccessResponse(res, { username: sanitizedUsername }, "ユーザー名を更新しました");
      
    } catch (error) {
      console.error("更新エラー:", error);
      return sendErrorResponse(res, 500, "ユーザー名の更新に失敗しました", "UPDATE_ERROR");
    }
    
  } catch (validationError) {
    if (validationError instanceof Error && 'errors' in validationError) {
      return sendErrorResponse(res, 400, "入力データが無効です", "VALIDATION_ERROR", (validationError as any).errors);
    }
    return sendErrorResponse(res, 400, "不正なリクエストです", "BAD_REQUEST");
  }
}
