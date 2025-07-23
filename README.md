# 📝 Textories - 1時間で消えるメッセージサービス

投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。

## ✨ 特徴

- **⏰ 1時間で自動削除**: 投稿は1時間後に自動的に見えなくなります
- **👤 匿名投稿可能**: ログインなしでも気軽に投稿できます
- **💬 気軽にコメント**: 投稿に対してコメントで反応できます
- **🌙 ダークモード**: 見やすいダークテーマで統一
- **🔐 Google認証**: セキュアなGoogle アカウント連携

## 🚀 デプロイ

### Vercel (推奨)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/textories)

1. **環境変数の設定** (Vercel Dashboard で設定)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secure_secret

# AWS DynamoDB
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
```

2. **AWS DynamoDB テーブル作成**
   - `Users` テーブル (Primary Key: email)
   - `Posts` テーブル (Primary Key: postId)
   - `Comments` テーブル (Primary Key: commentId, GSI: postId-index)

3. **Google OAuth 設定**
   - [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
   - OAuth 2.0 認証情報を作成
   - 認証済みリダイレクト URI: `https://your-domain.vercel.app/api/auth/callback/google`

## 🛠️ 開発

### 必要な環境

- Node.js 18.x 以上
- npm または yarn

### セットアップ

1. **リポジトリのクローン**
```bash
git clone https://github.com/yourusername/textories.git
cd textories
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
```bash
cp .env.local.example .env.local
# .env.local を編集して必要な値を設定
```

4. **開発サーバーの起動**
```bash
npm run dev
```

### 利用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLint実行
npm run agent:check  # エージェント設定チェック
```

## 📚 技術スタック

- **Frontend**: Next.js 15.3.4 + TypeScript + React 19
- **Styling**: CSS Modules + Custom CSS
- **Backend**: Next.js API Routes
- **Database**: AWS DynamoDB
- **Authentication**: NextAuth.js (Google Provider)
- **Deployment**: Vercel
- **Security**: CSP, HTTPS headers

## 🔒 セキュリティ

- Content Security Policy (CSP) 設定済み
- セキュリティヘッダーの実装
- HTTPS強制
- 入力値のバリデーション
- XSS対策

## 📁 プロジェクト構造

```
textories/
├── pages/           # ページコンポーネント
│   ├── api/        # API エンドポイント
│   ├── index.tsx   # ホームページ
│   ├── new.tsx     # 新規投稿
│   └── profile.tsx # プロフィール
├── components/     # 再利用可能コンポーネント
├── styles/         # CSS ファイル
├── public/         # 静的ファイル
└── types/          # TypeScript 型定義
```

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [Vercel](https://vercel.com/)

---

**桃缶党** で開発 🍑
