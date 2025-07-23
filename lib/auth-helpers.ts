import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

// セッション取得ヘルパー
export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    return await getServerSession(req, res, authOptions);
  } catch (error) {
    console.error("セッション取得エラー:", error);
    return null;
  }
}

// 認証必須チェック
export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  
  if (!session || !session.user) {
    res.status(401).json({ 
      error: "認証が必要です",
      code: "UNAUTHORIZED" 
    });
    return null;
  }
  
  return session;
}

// 特定ユーザーの認可チェック
export async function requireUserAccess(
  req: NextApiRequest, 
  res: NextApiResponse, 
  targetUserId: string
) {
  const session = await requireAuth(req, res);
  
  if (!session) {
    return null; // すでにエラーレスポンスが送信済み
  }
  
  if (session.user.userId !== targetUserId) {
    res.status(403).json({ 
      error: "アクセス権限がありません",
      code: "FORBIDDEN" 
    });
    return null;
  }
  
  return session;
}

// 投稿作者の認可チェック
export async function requirePostAuthor(
  req: NextApiRequest, 
  res: NextApiResponse, 
  postAuthorId?: string
) {
  const session = await requireAuth(req, res);
  
  if (!session) {
    return null;
  }
  
  if (postAuthorId && session.user.userId !== postAuthorId) {
    res.status(403).json({ 
      error: "この投稿を編集する権限がありません",
      code: "FORBIDDEN" 
    });
    return null;
  }
  
  return session;
}

// HTTPメソッド検証
export function validateMethod(
  req: NextApiRequest, 
  res: NextApiResponse, 
  allowedMethods: string[]
) {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods.join(', '));
    res.status(405).json({ 
      error: `Method ${req.method} Not Allowed`,
      code: "METHOD_NOT_ALLOWED",
      allowed: allowedMethods 
    });
    return false;
  }
  
  return true;
}

// IPアドレス取得
export function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
    
  return ip;
}

// レート制限チェック（簡易版）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  req: NextApiRequest, 
  res: NextApiResponse,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15分
): boolean {
  const ip = getClientIP(req);
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const current = rateLimitMap.get(ip);
  
  if (!current || current.resetTime < windowStart) {
    // 新しいウィンドウまたは期限切れ
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    res.status(429).json({
      error: "レート制限に達しました",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    });
    return false;
  }
  
  current.count++;
  return true;
}

// エラーレスポンス統一
export function sendErrorResponse(
  res: NextApiResponse,
  status: number,
  message: string,
  code?: string,
  details?: any
) {
  res.status(status).json({
    error: message,
    code: code || 'UNKNOWN_ERROR',
    ...(details && { details })
  });
}

// 成功レスポンス統一
export function sendSuccessResponse(
  res: NextApiResponse,
  data: any,
  message?: string,
  status: number = 200
) {
  res.status(status).json({
    success: true,
    data,
    ...(message && { message })
  });
}