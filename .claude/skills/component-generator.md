---
name: component-generator
description: 新しいReactコンポーネントを作成するスキル。適切なディレクトリ構造とファイルを自動生成します。
tags: [react, component, generator, scaffold]
---

# React コンポーネント生成スキル

このスキルは新しい React コンポーネントを適切な構造で作成します。

## コンポーネント作成の標準構造

このプロジェクトでは、以下の構造でコンポーネントを作成します：

```
src/components/
├── ComponentName/
│   ├── ComponentName.jsx
│   └── ComponentName.module.scss
```

## 新しいコンポーネントの作成手順

### 1. コンポーネント用ディレクトリの作成
```bash
mkdir -p src/components/ComponentName
```

### 2. JSXファイルの作成
`src/components/ComponentName/ComponentName.jsx`:

```jsx
import React from 'react'
import PropTypes from 'prop-types'
import Style from './ComponentName.module.scss'

function ComponentName({ prop1, prop2 }) {
  return (
    <div className={Style.container}>
      <h2>ComponentName</h2>
      {/* コンポーネントの内容 */}
    </div>
  )
}

ComponentName.propTypes = {
  prop1: PropTypes.string,
  prop2: PropTypes.func,
}

ComponentName.defaultProps = {
  prop1: 'default value',
}

export default ComponentName
```

### 3. SCSSモジュールファイルの作成
`src/components/ComponentName/ComponentName.module.scss`:

```scss
.container {
  padding: 1rem;
  background-color: #234;
  color: #f9f9f9dd;
  border-radius: 4px;
}

.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
```

## 既存のコンポーネントパターン

このプロジェクトには以下のコンポーネントパターンがあります：

### 地図関連コンポーネント
- `Map` - Google Maps の表示
- `PinList` - ピンのリスト管理

### 検索関連コンポーネント
- `SearchForm` - 検索フォーム
- `PlacesResults` - 検索結果の表示

### 結果表示コンポーネント
- `GeoCodeResult` - ジオコーディング結果

## コンポーネント作成のベストプラクティス

1. **PropTypes を必ず定義**
2. **SCSS Modules を使用してスタイルをスコープ化**
3. **コンポーネントは単一責任の原則に従う**
4. **React.memo() を使用してパフォーマンス最適化を検討**
5. **useCallback や useMemo を適切に使用**

## コンポーネントのインポート例
```jsx
import ComponentName from './components/ComponentName/ComponentName'
```
