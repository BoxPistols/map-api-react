---
name: api-testing
description: Fetch MCPを使用してGoogle Maps APIをテストするスキル。Geocoding API、Places APIのリクエストとレスポンスを確認できます。
tags: [api, testing, google-maps, fetch, debugging]
---

# API テストスキル

このスキルは Fetch MCP を使用して Google Maps API をテストします。

## Google Maps Geocoding API のテスト

### 住所から座標を取得
```javascript
// Fetch MCP を使用してリクエスト
GET https://maps.googleapis.com/maps/api/geocode/json?address=東京タワー&key=YOUR_API_KEY
```

**確認ポイント**：
- `status` が `"OK"` であること
- `results[0].geometry.location` に `lat` と `lng` が含まれること
- `formatted_address` が正しいこと

### 座標から住所を取得（逆ジオコーディング）
```javascript
GET https://maps.googleapis.com/maps/api/geocode/json?latlng=35.6585805,139.7454329&key=YOUR_API_KEY
```

**確認ポイント**：
- 複数の結果が返されること
- 各結果に `formatted_address` が含まれること
- `address_components` が詳細な住所情報を含むこと

## Google Maps Places API のテスト

### テキスト検索
Places API の Text Search は、ブラウザの `google.maps.places.PlacesService` を使用する必要があります（CORS回避のため）。

直接APIエンドポイントをテストする場合：
```javascript
GET https://maps.googleapis.com/maps/api/place/textsearch/json?query=横浜の馬車道近辺のクレープ屋&key=YOUR_API_KEY&language=ja
```

**確認ポイント**：
- `status` が `"OK"` または `"ZERO_RESULTS"` であること
- `results` 配列に検索結果が含まれること
- 各結果に `name`, `formatted_address`, `geometry.location` が含まれること

### 場所の詳細情報を取得
```javascript
GET https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&key=YOUR_API_KEY&language=ja
```

## API レスポンスのデバッグ

### エラーの確認

#### 1. API キーが無効
```json
{
  "error_message": "The provided API key is invalid.",
  "status": "REQUEST_DENIED"
}
```
**対処法**: Google Cloud Console でAPIキーを確認

#### 2. API が有効化されていない
```json
{
  "error_message": "This API project is not authorized to use this API.",
  "status": "REQUEST_DENIED"
}
```
**対処法**: Google Cloud Console で該当 API を有効化

#### 3. 結果が見つからない
```json
{
  "results": [],
  "status": "ZERO_RESULTS"
}
```
**対処法**: 検索クエリを変更

#### 4. クォータ超過
```json
{
  "error_message": "You have exceeded your daily request quota for this API.",
  "status": "OVER_QUERY_LIMIT"
}
```
**対処法**: 課金を有効にするか、翌日まで待つ

## 環境変数の確認

APIキーが正しく設定されているか確認：
```bash
cat .env | grep REACT_APP_API_KEY
```

## API リクエストのベストプラクティス

### 1. リクエストパラメータのエンコード
住所や検索クエリは URL エンコードする：
```javascript
const address = encodeURIComponent('東京タワー')
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
```

### 2. 言語設定
日本語の結果を得るには `language=ja` を追加：
```
?address=東京タワー&language=ja&key=YOUR_API_KEY
```

### 3. リージョン設定
日本の結果を優先するには `region=jp` を追加：
```
?address=東京タワー&region=jp&key=YOUR_API_KEY
```

## APIレスポンスの活用

### Geocoding API のレスポンス例
```json
{
  "results": [
    {
      "formatted_address": "日本、〒105-0011 東京都港区芝公園４丁目２−８",
      "geometry": {
        "location": {
          "lat": 35.6585805,
          "lng": 139.7454329
        }
      },
      "place_id": "ChIJCewJkL2LGGARX0RQI2sK8rw"
    }
  ],
  "status": "OK"
}
```

このレスポンスから以下の情報を取得：
- `lat`: 35.6585805
- `lng`: 139.7454329
- `formatted_address`: "日本、〒105-0011 東京都港区芝公園４丁目２−８"
- `place_id`: 場所の一意識別子

## トラブルシューティング

### CORS エラーが発生する場合
Places API の Text Search など、一部の API は CORS 制限があります。
解決方法：
1. **推奨**: `google.maps.places.PlacesService` を使用（フロントエンドから）
2. Fetch MCP: CORS を回避してテスト可能

### API キーの制限
Google Cloud Console で API キーに以下の制限を設定できます：
- **アプリケーションの制限**: HTTP リファラー
- **API の制限**: 特定の API のみ許可

開発時は制限を緩和し、本番環境では厳格な制限を設定することを推奨。
