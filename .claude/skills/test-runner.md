---
name: test-runner
description: テストを実行し、テストカバレッジを確認するスキル。Jestベースのテストランナーを使用します。
tags: [testing, jest, quality]
---

# テスト実行スキル

このスキルは React Testing Library と Jest を使用したテストを実行します。

## テストコマンド

### すべてのテストを実行（監視モード）
```bash
npm test
```

### すべてのテストを1回実行（CI用）
```bash
CI=true npm test
```

### カバレッジ付きでテスト実行
```bash
CI=true npm test -- --coverage
```

## テストファイルの検索
```bash
find src -name "*.test.js" -o -name "*.test.jsx" -o -name "*.spec.js"
```

## カバレッジレポートの確認
カバレッジ実行後：
```bash
cat coverage/coverage-summary.json
```

または、HTMLレポートを確認：
```bash
open coverage/lcov-report/index.html
```

## 特定のテストファイルのみ実行
```bash
npm test -- ComponentName.test.js
```

## テストの監視モードで特定パターンのみ
```bash
npm test -- --testNamePattern="should render"
```

## トラブルシューティング
- テストがハングする場合は `CI=true` を設定
- スナップショットを更新する場合は `npm test -- -u`
- テストキャッシュをクリア: `npm test -- --clearCache`
