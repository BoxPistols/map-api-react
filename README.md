# GGMap - 緯度経度検索アプリ

Google Maps API を使って、**住所検索**・**場所検索**・**地図表示**・**詳細情報表示**を行う Web アプリケーションです。

この README では、**初めて Google Places API / Geocoding API を触る人**でも、
「どの機能がどの API に対応しているのか」「コードのどこを見ればよいのか」が分かるように説明します。

---

## まず全体像

このリポジトリでは、検索の種類によって API を使い分けています。

| やりたいこと | 使う API | このリポジトリでの該当箇所 |
|---|---|---|
| 住所を入力して座標を出したい | Geocoding API | `src/App.js` の住所検索処理 |
| 地図上の場所名や POI を探したい | Places API (Text Search) | `src/App.js` の場所検索処理 |
| 地図を表示したい | Maps JavaScript API | `src/components/Map/` と `src/App.js` |
| 場所の詳細情報を見たい | Places API Details | `src/App.js` と `docs/FEATURE_ROADMAP.md` |
| 地図をクリックして住所を知りたい | Geocoding API（逆ジオコーディング） | `src/App.js` の `handleMapClick` |

---

## アーキテクチャの考え方

このアプリは、ざっくり言うと次の流れで動きます。

```text
ユーザー入力
   ↓
SearchForm
   ↓
App.js で検索種別を判定
   ├─ 住所検索 → Geocoding API
   └─ 場所検索 → Places API (Text Search)
   ↓
検索結果を state に保存
   ↓
Map / PlacesResults / GeoCodeResult に反映
```

さらに、地図クリック時は次の流れです。

```text
地図をクリック
   ↓
緯度・経度を取得
   ↓
Geocoding API で住所を取得
   ↓
state 更新
   ↓
画面に住所・座標を表示
```

つまり、**API 呼び出しの中心は `src/App.js`** にあり、各コンポーネントはその結果を表示する役割です。

---

## 1. 住所検索: Geocoding API

### どこを見る？
- `src/App.js`

### 該当箇所
- `handlePlaceSubmit(place, searchType = 'geocode')`
- `searchType !== 'places'` の分岐
- `axios.get(GEOCODE_ENDPOINT, { params: { address, key }})`

### 何をしている？
ユーザーが「東京タワー」や「渋谷区○○」のような**住所文字列**を入力すると、Geocoding API を使って緯度・経度に変換します。

### この repo での役割
- 入力された住所を地図の中心に反映
- 緯度・経度を画面に表示
- 検索結果があれば住所表示を更新

---

## 2. 場所検索: Places API (Text Search)

### どこを見る？
- `src/App.js`
- `README.md`
- `docs/FEATURE_ROADMAP.md`
- `docs/ARCHITECTURE.md`

### 該当箇所
- `handlePlaceSubmit(place, searchType = 'places')`
- `window.google.maps.places.PlacesService`
- `service.textSearch(request, callback)`

### 何をしている？
ユーザーが「札内川 中島新橋」「渋谷 カフェ」のように、**場所名・POI 名・自然文っぽい検索語**を入力したときに使います。

この repo では、Places API の Text Search を使って検索結果を取得し、
その結果を一覧表示します。

### この repo での役割
- 検索結果を `placesResults` に保存
- 左サイドバー / モバイルドロワーに一覧表示
- 最初の結果を地図の中心に移動
- 検索履歴を保存

---

## 3. 地図表示: Maps JavaScript API

### どこを見る？
- `src/components/Map/`
- `src/App.js`
- `docs/ARCHITECTURE.md`

### 該当箇所
- `<Map lat={...} lng={...} zoom={...} pins={pins} onMapClick={handleMapClick} />`
- `docs/ARCHITECTURE.md` の Frontend → External APIs の図

### 何をしている？
地図の描画、マーカー表示、クリックイベントの処理を行います。

### この repo での役割
- 現在地や検索結果の座標を地図中央に表示
- ピンを表示
- 地図クリックで逆ジオコーディングを実行

---

## 4. 地図クリック → 逆ジオコーディング

### どこを見る？
- `src/App.js`

### 該当箇所
- `handleMapClick`
- `axios.get(GEOCODE_ENDPOINT, { params: { latlng, key }})`

### 何をしている？
地図上の任意の地点をクリックすると、緯度・経度から住所を取得します。

### この repo での役割
- クリック地点の住所を表示
- ピンモード ON のときはピン追加にも使う

---

## 5. 場所の詳細表示: Places API Details

### どこを見る？
- `src/App.js`
- `docs/FEATURE_ROADMAP.md`
- `README.md`

### 該当箇所
- `handleShowPlaceDetails(placeId)`
- `getPlaceDetails(placeId)`
- `PlaceDetail` コンポーネント
- `docs/FEATURE_ROADMAP.md` の Phase 1

### 何をしている？
検索結果から 1 件を選んで、より詳しい情報を表示します。

### この repo での役割
- 詳細パネルを開く
- Place Details を取得する
- 写真・レビュー・営業時間などの表示に備える

---

## ファイルごとの役割

### `src/App.js`
このアプリの**中心**です。

- 住所検索
- 場所検索
- 地図クリック処理
- ピン管理
- 詳細表示
- 経路検索

などの主要ロジックが集まっています。

### `src/components/SearchForm/`
検索入力 UI を担当します。

### `src/components/Map/`
Google Map の表示を担当します。

### `src/components/PlacesResults/`
Places API の検索結果一覧を表示します。

### `src/components/GeoCodeResult/`
住所・緯度・経度の表示を担当します。

### `src/components/PlaceDetail/`
Places Details の詳細表示を担当します。

### `src/services/places.js`
Places API 関連の処理をまとめるためのサービス層です。

### `src/services/directions.js`
経路検索処理をまとめるサービス層です。

### `src/utils/storage.js`
localStorage への保存・読み込みを扱います。

---

## 初めて Google Places API を触る人向けの読み方

この repo を読むときは、次の順番がおすすめです。

### 1. まず `README.md`
プロダクト全体で何をしているかを確認します。

### 2. 次に `src/App.js`
どの API をどこで呼んでいるかを見ます。

### 3. `docs/ARCHITECTURE.md`
アプリの構造を図で把握します。

### 4. `docs/FEATURE_ROADMAP.md`
Places API Details など、今後の拡張方針を見ます。

### 5. `src/components/PlacesResults/` と `src/components/PlaceDetail/`
結果表示・詳細表示の UI を確認します。

---

## どの機能がどの API に対応しているか

### 住所検索
- API: Geocoding API
- 該当: `src/App.js`
- 用途: 住所文字列を緯度・経度に変換

### 場所検索
- API: Places API (Text Search)
- 該当: `src/App.js`
- 用途: POI 名や自然言語検索

### 地図表示
- API: Maps JavaScript API
- 該当: `src/components/Map/`
- 用途: 地図描画とマーカー表示

### 詳細表示
- API: Places API Details
- 該当: `src/App.js` / `docs/FEATURE_ROADMAP.md`
- 用途: 営業時間、レビュー、写真などの表示

### 地図クリック時の住所取得
- API: Geocoding API（逆ジオコーディング）
- 該当: `src/App.js`
- 用途: クリック地点の住所を表示

---

## このアーキテクチャのポイント

このアプリのポイントは、**検索の種類ごとに API を分けている**ことです。

- 住所なら Geocoding API
- 場所名なら Places API
- 地図表示は Maps JavaScript API
- 詳細は Places Details

このように役割を分けることで、コードが分かりやすくなり、将来 `locationBias` や `includedType` のような検索条件を追加しやすくなります。

---

## セットアップ時に必要な API

Google Cloud Console で以下を有効にしてください。

- Maps JavaScript API
- Geocoding API
- Places API
- Directions API（経路検索を使う場合）

---

## 補足

このリポジトリは、現時点では主に**フロントエンド中心の構成**です。将来的にバックエンドを追加する場合は、以下のように責務を分けると分かりやすくなります。

- フロントエンド: 入力 UI、地図表示、結果表示
- バックエンド: API 呼び分け、検索条件の正規化、型マッピング、キャッシュ

---

## テストモード（Mock/Test mode）

Google API の無料枠や課金を消費せずに、主要 UI と API 連携方針を確認できるように **TEST モード** を追加しています。

### 使い方

1. 画面右上のモード表示（`LIVE` / `TEST`）を確認
2. 歯車ボタンから設定モーダルを開く
3. `テストモード ON / OFF` で切り替え

設定は `localStorage` に保存されるため、再読み込み後も維持されます。

### TEST モードでモック化される機能

- 住所検索（Geocoding API 相当）
- 場所検索（Places Text Search 相当）
- 場所詳細（Places Details 相当）
- 地図クリック時の住所取得（逆ジオコーディング相当）

また TEST モードでは Google Maps を使わず、`MockMap` コンポーネントで地図領域を表示します。

### 実装ファイル（対応箇所）

- `src/App.js`
  - モード状態管理 (`isTestMode`)
  - LIVE/TEST バッジ表示
  - API 呼び出しの切り替え
- `src/services/mapApiGateway.js`
  - 実 API / モック API の統合切り替え窓口
- `src/mocks/googleApiMocks.js`
  - 住所検索、場所検索、詳細、逆ジオコーディングのモックレスポンス
- `src/components/Map/MockMap.jsx`
  - TEST モード用のモック地図 UI
- `src/components/SettingsModal/SettingsModal.jsx`
  - テストモード切り替え UI
- `src/utils/storage.js`
  - テストモード設定の保存・読込

### 開発チーム向け確認ポイント

- `TEST` で検索・詳細・逆ジオコードが Google API なしで動くか
- `LIVE` に戻した際に既存動作へ復帰するか
- モード切り替え後に再読み込みしても設定が保持されるか

---

## 関連ドキュメント

- `docs/ARCHITECTURE.md`
- `docs/FEATURE_ROADMAP.md`
- `README.md`
- `.claude/skills/google-maps-integration.md`
- `.claude/skills/api-testing.md`

---

## まとめ

このアプリは、**検索したい内容に応じて API を使い分ける**構成です。

- 住所検索 → Geocoding API
- 場所検索 → Places API (Text Search)
- 地図表示 → Maps JavaScript API
- 詳細表示 → Places API Details
- クリック地点の住所取得 → Geocoding API

まずは `src/App.js` を見ると、どの機能がどの API に対応しているかを理解しやすいです。
