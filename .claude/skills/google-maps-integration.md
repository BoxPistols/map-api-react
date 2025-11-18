---
name: google-maps-integration
description: Google Maps API の統合と管理を支援するスキル。APIキーの設定、マップ機能の実装をサポートします。
tags: [google-maps, api, integration, geolocation]
---

# Google Maps 統合スキル

このスキルは Google Maps API を使用した機能の実装と管理を支援します。

## 環境変数の設定

### .env ファイルの確認
```bash
cat .env 2>/dev/null || echo ".envファイルが見つかりません"
```

### .env ファイルの作成（APIキーが未設定の場合）
```bash
echo "REACT_APP_API_KEY=your_google_maps_api_key_here" > .env
```

**注意**: `.env` ファイルは `.gitignore` に含まれているため、Git にコミットされません。

## 使用中の Google Maps API

このプロジェクトは以下の Google Maps API を使用しています：

### 1. Geocoding API
- 住所から座標への変換
- 座標から住所への逆ジオコーディング
- エンドポイント: `https://maps.googleapis.com/maps/api/geocode/json`

### 2. Places API (Text Search)
- 自然言語検索（例: "横浜の馬車道近辺のクレープ屋"）
- `google.maps.places.PlacesService.textSearch()`

### 3. Maps JavaScript API
- 地図の表示
- マーカーの配置
- イベントハンドリング

## API キーの権限確認

Google Cloud Console で以下の API が有効になっているか確認：
- Maps JavaScript API
- Geocoding API
- Places API

## API 使用状況の確認

### リクエスト数の確認
Google Cloud Console > APIs & Services > Dashboard で確認

### 課金アラートの設定
無料枠を超えないように、課金アラートを設定することを推奨

## 地図機能の実装パターン

### 基本的なマップの表示
```jsx
<Map
  lat={35.6585805}
  lng={139.7454329}
  pins={pins}
  onMapClick={handleMapClick}
/>
```

### ピンの追加
```javascript
const newPin = {
  id: Date.now(),
  lat: 35.6585805,
  lng: 139.7454329,
  address: '東京タワー',
}
setPins((prevPins) => [...prevPins, newPin])
```

### ジオコーディング
```javascript
axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
  params: {
    address: '東京タワー',
    key: API_KEY,
  },
})
```

## トラブルシューティング

### API キーが無効な場合
- Google Cloud Console でキーが有効か確認
- API の制限設定を確認（HTTPリファラー、IPアドレス）

### CORS エラーの場合
- Places API は `google.maps.places.PlacesService` を使用（CORS回避）
- Geocoding API は直接 HTTP リクエスト可能

### 地図が表示されない場合
1. ブラウザのコンソールでエラーを確認
2. APIキーが正しく読み込まれているか確認
3. 必要なライブラリがインストールされているか確認
   - `react-google-maps`
   - `google-maps-react`

## パフォーマンス最適化

- マーカーが多数ある場合は、クラスタリングを検討
- 地図の中心位置を適切に管理（不要な再レンダリングを防ぐ）
- `React.memo()` でコンポーネントを最適化
