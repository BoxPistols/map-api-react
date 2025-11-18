---
name: git-workflow
description: Gitワークフローを管理するスキル。ブランチ作成、コミット、プッシュ、PR作成を支援します。
tags: [git, version-control, workflow]
---

# Git ワークフロースキル

このスキルは Git を使用したバージョン管理のワークフローを支援します。

## 基本的な Git コマンド

### 現在の状態を確認
```bash
git status
```

### 変更されたファイルの差分を確認
```bash
git diff
```

### ステージングされた変更の差分
```bash
git diff --staged
```

## ブランチ管理

### ブランチ一覧の確認
```bash
git branch -a
```

### 新しいブランチの作成と切り替え
```bash
git checkout -b feature/new-feature
```

### ブランチの削除
```bash
git branch -d branch-name
```

## コミットのベストプラクティス

### ステージングとコミット
```bash
git add src/components/NewComponent/
git commit -m "コンポーネントを追加: NewComponent"
```

### コミットメッセージの規約
このプロジェクトでは以下の形式を使用：

```
[タイプ] 簡潔な説明

詳細な説明（必要に応じて）

- 変更点1
- 変更点2
```

**タイプの例**:
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `style`: スタイルの修正（コードの動作に影響しない）
- `docs`: ドキュメントの更新
- `test`: テストの追加・修正
- `chore`: ビルドプロセスや補助ツールの変更

### コミット履歴の確認
```bash
git log --oneline --graph --all -10
```

## リモートとの同期

### リモートブランチの最新を取得
```bash
git fetch origin
```

### 現在のブランチをリモートにプッシュ
```bash
git push -u origin feature/new-feature
```

### リモートブランチとマージ
```bash
git pull origin main
```

## 変更の取り消し

### ステージングを取り消す
```bash
git restore --staged <file>
```

### ファイルの変更を取り消す（注意: 変更が失われます）
```bash
git restore <file>
```

### 直前のコミットを修正
```bash
git commit --amend -m "修正されたコミットメッセージ"
```

## マージとコンフリクト解決

### ブランチをマージ
```bash
git checkout main
git merge feature/new-feature
```

### コンフリクトの確認
```bash
git status
```

### コンフリクトを解決した後
```bash
git add <resolved-files>
git commit
```

## 便利な Git エイリアス

以下を `~/.gitconfig` に追加すると便利：

```ini
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  lg = log --oneline --graph --all -10
  unstage = restore --staged
```

## プロジェクト固有の注意事項

### .gitignore の確認
```bash
cat .gitignore
```

重要なファイル：
- `.env` - APIキーを含むため、必ず除外
- `node_modules/` - 依存関係
- `build/` - ビルド成果物

### プッシュ前のチェックリスト
1. ✅ テストが通ることを確認
2. ✅ ビルドが成功することを確認
3. ✅ `.env` が除外されていることを確認
4. ✅ コミットメッセージが明確か確認
5. ✅ 不要なファイルが含まれていないか確認
