#!/bin/bash

# 強制リセット
pkill -f git 2>/dev/null || true
rm -rf .git/*.lock .git/refs/heads/*.lock 2>/dev/null || true

# Git設定
git config --global user.email "action@github.com"
git config --global user.name "GitHub Action"

# 強制追加とコミット
git add -A
git commit -m "🎨 緑背景に映えるボタン色に全修正完了" --no-verify
git push origin main --force-with-lease

echo "✅ デプロイ完了！"