---
name: dev-server
description: 開発サーバーの起動・停止・状態確認を行うスキル。React開発サーバー(npm start)を管理します。
tags: [development, server, react]
---

# 開発サーバー管理スキル

このスキルは React 開発サーバーの起動・停止・状態確認を行います。

## 使用可能なコマンド

### 開発サーバーの起動
```bash
npm start
```
- ポート3000で開発サーバーが起動します
- ホットリロードが有効になります
- ブラウザが自動的に開きます

### 開発サーバーの状態確認
```bash
lsof -i :3000 || echo "ポート3000は使用されていません"
```

### 開発サーバーの停止
プロセスIDを確認してから停止：
```bash
lsof -ti :3000 | xargs kill -9
```

## 環境変数の確認
Google Maps APIキーが設定されているか確認：
```bash
[ -f .env ] && grep REACT_APP_API_KEY .env || echo ".envファイルが見つかりません"
```

## トラブルシューティング
- ポートが使用中の場合は、既存のプロセスを停止してから起動
- .envファイルにREACT_APP_API_KEYが設定されているか確認
