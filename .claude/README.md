# Claude Code 設定とスキル

このディレクトリには、Claude Code で使用する MCP サーバーとスキルの設定が含まれています。

## MCP サーバー

### 設定ファイル: `mcp.json`

このプロジェクトでは以下の MCP サーバーが設定されています：

#### 1. **Filesystem MCP**
- ファイルシステム操作のためのサーバー
- プロジェクトディレクトリ全体へのアクセスを提供
- ファイルの読み取り、書き込み、検索などをサポート

#### 2. **Git MCP**
- Git 操作のためのサーバー
- バージョン管理、ブランチ管理、コミット履歴の確認などをサポート
- Git コマンドを効率的に実行

#### 3. **Brave Search MCP** (オプション)
- Web 検索機能を提供
- Google Maps API のドキュメント検索などに活用
- 環境変数 `BRAVE_API_KEY` が必要（オプション）

#### 4. **Fetch MCP** ⭐ Google Maps API 連携に最適
- HTTP リクエストを実行
- **Google Maps Geocoding API、Places API のテスト**に活用
- APIレスポンスの確認とデバッグ
- CORS の問題を回避してAPIをテスト可能

#### 5. **Memory MCP**
- セッション間でコンテキストを永続化
- 重要な情報（API設定、プロジェクト構造など）を記憶
- 開発中の ToDo や注意事項を保持

#### 6. **Puppeteer MCP** ⭐ フロントエンド開発に最適
- ブラウザ自動化
- **開発サーバーの動作確認**
- **マップUIのスクリーンショット取得**
- E2Eテストのシナリオ作成
- レスポンシブデザインのテスト

#### 7. **Sequential Thinking MCP**
- 複雑な問題解決を段階的に実行
- アーキテクチャ設計の支援
- 複雑なバグの原因究明

### MCP サーバーの使用方法

MCP サーバーは Claude Code によって自動的に起動・管理されます。特別な操作は不要です。

環境変数が必要な場合（Brave Search など）：
```bash
export BRAVE_API_KEY="your_api_key_here"
```

## スキル（Skills）

### 利用可能なスキル

#### 1. **dev-server** - 開発サーバー管理
```
/dev-server
```
- React 開発サーバーの起動・停止・状態確認
- ポート3000の管理
- 環境変数の確認

#### 2. **build-project** - プロジェクトビルド
```
/build-project
```
- 本番用ビルドの実行
- ビルドサイズの確認
- エラーチェック

#### 3. **test-runner** - テスト実行
```
/test-runner
```
- Jest テストの実行
- カバレッジレポートの生成
- テストの監視モード

#### 4. **component-generator** - コンポーネント生成
```
/component-generator
```
- 新しい React コンポーネントの作成
- 適切なディレクトリ構造の生成
- SCSS モジュールの自動作成

#### 5. **google-maps-integration** - Google Maps API 統合
```
/google-maps-integration
```
- Google Maps API の設定と管理
- 環境変数の確認
- API 使用パターンとベストプラクティス

#### 6. **git-workflow** - Git ワークフロー
```
/git-workflow
```
- Git コマンドのベストプラクティス
- ブランチ管理
- コミットメッセージの規約

#### 7. **api-testing** - API テスト ⭐ NEW
```
/api-testing
```
- Fetch MCP を使用した Google Maps API のテスト
- Geocoding API、Places API のリクエスト・レスポンス確認
- API エラーのデバッグ
- CORS 問題の回避

#### 8. **ui-testing** - UI テスト ⭐ NEW
```
/ui-testing
```
- Puppeteer MCP を使用した UI 自動テスト
- スクリーンショット取得（マップ、ヘッダー、サイドバー）
- レスポンシブデザインのテスト（モバイル、タブレット、デスクトップ）
- E2E テストシナリオの実行

### スキルの使い方

Claude Code のチャットで、スキル名を `/` から始めて入力するだけです：

```
/dev-server で開発サーバーを起動してください
```

または、自然言語で質問することもできます：

```
新しいコンポーネントを作成したいのですが、どうすればいいですか？
```

## ディレクトリ構造

```
.claude/
├── README.md              # このファイル
├── mcp.json              # MCP サーバー設定
└── skills/               # スキル定義
    ├── dev-server.md
    ├── build-project.md
    ├── test-runner.md
    ├── component-generator.md
    ├── google-maps-integration.md
    ├── git-workflow.md
    ├── api-testing.md     # ⭐ NEW - Fetch MCP を使用したAPI テスト
    └── ui-testing.md      # ⭐ NEW - Puppeteer MCP を使用したUI テスト
```

## カスタマイズ

### 新しいスキルの追加

1. `.claude/skills/` ディレクトリに新しい `.md` ファイルを作成
2. フロントマターで `name`, `description`, `tags` を定義
3. スキルの内容を Markdown で記述

例：
```markdown
---
name: my-custom-skill
description: カスタムスキルの説明
tags: [custom, example]
---

# カスタムスキル

スキルの内容をここに記述...
```

### MCP サーバーの追加

`mcp.json` に新しいサーバーを追加：

```json
{
  "mcpServers": {
    "new-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"]
    }
  }
}
```

## トラブルシューティング

### MCP サーバーが起動しない
1. `npx` が利用可能か確認
2. インターネット接続を確認
3. MCP サーバーパッケージが最新か確認

### スキルが表示されない
1. スキルファイルが `.claude/skills/` にあるか確認
2. フロントマターが正しく記述されているか確認
3. Claude Code を再起動

## 参考リンク

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server Repository](https://github.com/modelcontextprotocol/servers)
