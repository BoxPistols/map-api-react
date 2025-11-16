# GGMap - 緯度経度検索アプリ

Google Maps APIを使用した地図検索・ピン打ち機能を持つWebアプリケーションです。

## 📋 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [デプロイ](#デプロイ)
- [トラブルシューティング](#トラブルシューティング)
- [ユーザーガイド](#ユーザーガイド)

## ✨ 機能

### 1. 住所検索
- テキスト入力で住所を検索
- Google Maps Geocoding APIで緯度経度を取得
- 地図上にマーカーを表示

### 2. 地図クリック機能
- 地図上の任意の場所をクリックして緯度経度を取得
- 逆ジオコーディングで住所を自動取得
- クロスヘアカーソルで視認性向上

### 3. ピンモード
- 複数のピンを地図上に配置可能
- 各ピンの緯度経度と住所を一覧表示
- ピンの個別削除・全削除機能
- 番号付きマーカーで識別

## 🛠 技術スタック

- **フロントエンド**: React 16.13.1
- **地図ライブラリ**:
  - react-google-maps 9.4.5
  - google-maps-react 2.0.6
- **スタイリング**: SASS/SCSS
- **HTTP通信**: Axios 0.20.0
- **ビルドツール**: Create React App (react-scripts 3.4.3)
- **デプロイ**: Netlify

## 🚀 セットアップ

### 前提条件

- Node.js 14.x 以上（推奨: v16-v22）
- npm 6.x 以上
- Google Maps API キー

### Google Maps API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 以下のAPIを有効化:
   - Maps JavaScript API
   - Geocoding API
4. APIキーを作成
5. 必要に応じてキーの制限を設定

### インストール手順

1. リポジトリをクローン:
```bash
git clone https://github.com/BoxPistols/map-api-react.git
cd map-api-react
```

2. 依存パッケージをインストール:
```bash
npm install
```

3. 環境変数の設定:

プロジェクトルートに `.env` ファイルを作成:
```bash
REACT_APP_API_KEY=your_google_maps_api_key_here
```

**重要**: `.env` ファイルは `.gitignore` に含まれているため、Git管理されません。

## 💻 開発

### 開発サーバーの起動

```bash
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。
ファイルを編集すると自動的にリロードされます。

### プロジェクト構造

```
map-api-react/
├── public/              # 静的ファイル
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── Map/        # 地図コンポーネント
│   │   ├── SearchForm/ # 検索フォーム
│   │   └── GeoCodeResult/ # 検索結果表示
│   ├── App.js          # メインアプリケーション
│   ├── App.scss        # メインスタイル
│   └── index.js        # エントリーポイント
├── .env                # 環境変数（要作成）
├── package.json
└── README.md
```

### ビルド

本番用ビルドを作成:
```bash
npm run build
```

ビルド成果物は `build/` フォルダに生成されます。

### テスト

```bash
npm test
```

## 🌐 デプロイ

### Netlifyへのデプロイ

1. **Netlifyアカウントの作成**
   - [Netlify](https://www.netlify.com/)でアカウント作成

2. **GitHubリポジトリと連携**
   - Netlifyダッシュボードから「New site from Git」を選択
   - GitHubリポジトリを選択

3. **ビルド設定**
   - Build command: `npm run build`
   - Publish directory: `build`

4. **環境変数の設定**
   - Site settings → Build & deploy → Environment
   - `REACT_APP_API_KEY` を追加

5. **デプロイ**
   - 自動デプロイが開始されます
   - main/masterブランチへのプッシュで自動的に再デプロイ

### 手動デプロイ

```bash
npm run build
# build/ フォルダの内容をホスティングサービスにアップロード
```

## 🐛 トラブルシューティング

### Node.js 17以降でビルドエラーが発生する

**症状**: `error:0308010C:digital envelope routines::unsupported`

**原因**: OpenSSLのレガシーアルゴリズムがデフォルトで無効化されている

**解決策**: すでに `package.json` に修正済み
```json
"build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build"
```

### 地図が表示されない

**原因1**: APIキーが設定されていない
- `.env` ファイルに `REACT_APP_API_KEY` が設定されているか確認

**原因2**: APIが有効化されていない
- Google Cloud ConsoleでMaps JavaScript APIとGeocoding APIが有効か確認

**原因3**: APIキーの制限
- APIキーの制限設定を確認（必要に応じてHTTPリファラーを追加）

### yarn.lock と package-lock.json の競合

本プロジェクトは **npm** を使用します。`yarn.lock` は削除されています。

## 📖 ユーザーガイド

詳しい使い方は [USER_GUIDE.md](./USER_GUIDE.md) を参照してください。

## 📝 主な変更履歴

### v1.6 (最新)
- ピンモード機能を追加
- 複数ピンの配置と管理機能
- ピン一覧表示UI

### v1.5
- 地図クリックで緯度経度取得機能を追加
- 逆ジオコーディング対応
- マウスカーソルをcrosshairに変更

### v1.4
- Netlifyデプロイエラー修正
- Node.js 17+対応

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 リンク

- [Google Maps JavaScript API ドキュメント](https://developers.google.com/maps/documentation/javascript)
- [React ドキュメント](https://reactjs.org/)
- [Create React App ドキュメント](https://create-react-app.dev/)

## 📧 お問い合わせ

プロジェクトに関する質問や提案がある場合は、GitHubのIssuesでお知らせください。
