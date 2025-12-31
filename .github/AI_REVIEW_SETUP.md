# AI レビュー設定ガイド

このリポジトリでは **GitHub Copilot** と **Google Gemini** のハイブリッド構成でAIコードレビューを行います。

## 構成概要

```
┌─────────────────────────────────────────────────────────────┐
│                     PR が作成される                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  GitHub Copilot (自動)    │    │  Gemini (オンデマンド)    │
│  ✅ 自動コードレビュー     │    │  /review → 詳細レビュー   │
│  ✅ セキュリティスキャン   │    │  /summary → 変更サマリー  │
│  ✅ PR作成時に自動実行    │    │  PRコメントで起動        │
└──────────────────────────┘    └──────────────────────────┘
```

---

## 1. GitHub Copilot Code Review 設定

### 必要条件
- GitHub Copilot Enterprise または Copilot for Business ライセンス

### 設定手順

1. **リポジトリ設定を開く**
   - リポジトリ → Settings → Code review → Copilot

2. **Copilot Code Review を有効化**
   - "Enable Copilot code review" をオンにする

3. **自動レビューの設定（オプション）**
   - "Automatically request review" を有効にすると、PR作成時に自動レビュー

### 使い方

| 方法 | 説明 |
|------|------|
| 自動 | PR作成時に自動でレビューリクエスト |
| 手動 | PRの "Reviewers" から Copilot を選択 |
| コメント | PR内で `@github-copilot` をメンション |

---

## 2. Gemini レビュー設定

### 必要条件
- Google AI Studio の API キー（無料枠あり）

### API キー取得手順

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. 「Get API key」をクリック
3. 新しいAPIキーを作成

### GitHub Secrets 設定

1. リポジトリ → Settings → Secrets and variables → Actions
2. 「New repository secret」をクリック
3. 以下を設定:
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: 取得したAPIキー

### 使い方

PRのコメント欄で以下のコマンドを入力：

| コマンド | 説明 |
|----------|------|
| `/review` | 詳細なコードレビューを実行 |
| `/summary` | 変更内容のサマリーを生成 |

### レビュー観点（/review）

- コード品質（可読性、保守性、DRY原則）
- バグ・問題点（エッジケース、エラーハンドリング）
- セキュリティ（XSS、インジェクション）
- パフォーマンス（非効率なコード、N+1問題）
- ベストプラクティス（React/TypeScript）

### サマリー内容（/summary）

- 変更の概要
- ファイル別変更内容
- 影響範囲
- テスト観点

---

## 3. 使い分けガイド

| シナリオ | 推奨ツール |
|----------|-----------|
| PR作成時の初回レビュー | GitHub Copilot（自動） |
| 詳細なコードレビューが欲しい | `/review`（Gemini） |
| PRの変更内容を把握したい | `/summary`（Gemini） |
| 特定のコードについて質問 | `@github-copilot`（コメント） |

---

## 4. コスト

| サービス | コスト |
|----------|--------|
| GitHub Copilot | GitHub契約に含む |
| Gemini API | 無料枠: 15 RPM, 100万トークン/月 |

※ 小〜中規模リポジトリであれば Gemini 無料枠で十分対応可能

---

## 5. トラブルシューティング

### Gemini レビューが動作しない

1. `GEMINI_API_KEY` が正しく設定されているか確認
2. Actions タブでワークフローのログを確認
3. API レート制限に達していないか確認

### Copilot レビューが表示されない

1. Copilot ライセンスが有効か確認
2. リポジトリ設定で Copilot Code Review が有効か確認
3. Organization 設定で Copilot が許可されているか確認

---

## 6. 関連ファイル

- `.github/workflows/gemini-review.yml` - Gemini レビューワークフロー
