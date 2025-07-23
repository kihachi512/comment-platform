import { z } from 'zod';

// 投稿作成バリデーション
export const createPostSchema = z.object({
  postId: z.string().min(1, "投稿IDは必須です").max(100, "投稿IDが長すぎます"),
  body: z.string().min(1, "本文は必須です").max(50, "本文は50文字以内で入力してください"),
  authorId: z.string().optional(),
  authorName: z.string().max(100, "ユーザー名が長すぎます").optional()
});

// コメント作成バリデーション
export const createCommentSchema = z.object({
  postId: z.string().min(1, "投稿IDは必須です"),
  content: z.string().min(1, "コメント内容は必須です").max(200, "コメントは200文字以内で入力してください"),
  type: z.enum(['positive', 'negative'], {
    errorMap: () => ({ message: "リアクションタイプが無効です" })
  })
});

// ユーザー更新バリデーション
export const updateUserSchema = z.object({
  email: z.string().email("無効なメールアドレスです"),
  username: z.string()
    .min(2, "ユーザー名は2文字以上で入力してください")
    .max(50, "ユーザー名は50文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_-]+$/, "ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます")
});

// ページネーションバリデーション
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/, "ページ番号は数字である必要があります").transform(Number).optional(),
  limit: z.string().regex(/^\d+$/, "制限数は数字である必要があります").transform(Number).optional()
});

// ユーザーIDバリデーション
export const userIdSchema = z.object({
  userId: z.string().min(1, "ユーザーIDは必須です").max(100, "ユーザーIDが無効です")
});

// 汎用的なIDバリデーション
export const idSchema = z.string().min(1, "IDは必須です").max(100, "IDが無効です");

// HTMLサニタイゼーション関数
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// XSS攻撃を防ぐためのテキスト検証
export function validateSafeText(text: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<applet/i,
    /<meta/i,
    /<link/i
  ];
  
  return !xssPatterns.some(pattern => pattern.test(text));
}

// レート制限検証
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 100, // 最大100リクエスト
  message: "リクエストが多すぎます。15分後にお試しください。"
};