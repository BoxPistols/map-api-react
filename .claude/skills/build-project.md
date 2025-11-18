---
name: build-project
description: プロジェクトのビルドを実行し、エラーをチェックするスキル。本番用ビルドの作成と検証を行います。
tags: [build, production, deployment]
---

# プロジェクトビルドスキル

このスキルは React アプリケーションの本番ビルドを実行します。

## ビルドコマンド

### 本番ビルドの実行
```bash
npm run build
```

NODE_OPTIONS=--openssl-legacy-provider が設定されているため、古いNode.jsバージョンでもビルドが可能です。

## ビルド成果物の確認
```bash
ls -lah build/
```

ビルドされたファイルは `build/` ディレクトリに出力されます。

## ビルドサイズの確認
```bash
du -sh build/
du -sh build/static/js/
du -sh build/static/css/
```

## ビルド前のクリーンアップ
```bash
rm -rf build/
npm run build
```

## エラーチェック
ビルド実行後、以下を確認：
- ビルドが成功したか（終了コード0）
- build/index.htmlが存在するか
- 静的アセット（JS, CSS）が生成されているか

## 最適化の確認
- JavaScript のバンドルサイズ
- CSS のファイルサイズ
- 画像アセットの最適化状況
