# DynamoDB TTL 設定手順

コメントが24時間で自動削除されるようにするために、以下の設定を行いました：

## 1. コードの修正

### pages/api/comments.ts の修正
コメント作成時に `expiresAt` フィールドを追加しました：

```javascript
expiresAt: {
  N: `${Math.floor(Date.now() / 1000) + 60 * 60 * 24}`, // 24時間後
},
```

### serverless.yml の修正
CommentsテーブルにTTL設定を追加しました。

## 2. 手動でTTL設定を有効にする方法

既存のCommentsテーブルがある場合、AWS マネジメントコンソールまたはAWS CLIでTTL設定を有効にしてください：

### AWS マネジメントコンソールの場合：
1. DynamoDBコンソールを開く
2. 「Comments」テーブルを選択
3. 「追加設定」タブを開く
4. 「Time to Live」セクションで「編集」をクリック
5. TTLを有効にして、属性名を「expiresAt」に設定
6. 変更を保存

### AWS CLIの場合：
```bash
aws dynamodb update-time-to-live \
    --table-name Comments \
    --time-to-live-specification 'Enabled=true,AttributeName=expiresAt' \
    --region ap-northeast-1
```

## 3. 新規デプロイの場合

`serverless deploy` を実行すると、自動的にTTL設定が有効になります。

## 設定の確認

コメントが正しく24時間後に削除されるかどうかは、以下の方法で確認できます：

1. 新しいコメントを投稿する
2. DynamoDBコンソールでCommentsテーブルを確認し、`expiresAt` フィールドがUnixタイムスタンプ形式で設定されていることを確認
3. 24時間後にコメントが自動的に削除されることを確認

## 注意事項

- TTL設定の有効化には最大1時間かかる場合があります
- 削除は正確な時刻ではなく、数分〜数時間の遅延が発生する可能性があります
- 既存のコメント（expiresAtフィールドがない）は削除されません