# ルート計算機能 実装計画書

## 1. 機能概要

打ったピンをウェイポイントとして使用し、最適なルートを計算・表示する機能。

### 主な機能
- 複数のピンを経由地点としてルートを自動計算
- 地図上にルートを可視化（青線で表示）
- ルート詳細情報の表示（総距離、所要時間、各区間の情報）
- ルート計算結果のエクスポート（JSON形式）

## 2. 使用API

### Google Maps Directions API
- **エンドポイント**: `https://maps.googleapis.com/maps/api/directions/json`
- **用途**: 複数地点間の最適ルートを計算
- **制限**:
  - 1日あたり無料枠: 2,500リクエスト
  - ウェイポイント: 最大23地点（起点・終点を除く）

### パラメータ
```javascript
{
  origin: '起点の緯度経度',
  destination: '終点の緯度経度',
  waypoints: '経由地点の緯度経度（パイプ区切り）',
  optimize: true, // ウェイポイントの順序を最適化
  mode: 'driving', // 移動手段（driving/walking/bicycling/transit）
  language: 'ja',
  key: API_KEY
}
```

## 3. UI/UX設計

### 3.1 ルート計算パネル
**配置場所**: ピンリストの下部

**含まれる要素**:
- ルート計算ボタン
- 移動手段セレクター（車/徒歩/自転車/公共交通機関）
- ルート最適化トグル（ウェイポイントの順序を自動最適化）

### 3.2 ルート情報表示エリア
**表示内容**:
```
📍 ルート概要
・総距離: 15.3 km
・所要時間: 約25分
・経由地点: 5か所

📍 詳細ルート
1. 東京タワー → 2. 増上寺
   距離: 0.8 km | 時間: 3分

2. 増上寺 → 3. 浜離宮恩賜庭園
   距離: 2.1 km | 時間: 6分

...
```

### 3.3 地図表示
- ルートを青い線で表示（`DirectionsRenderer`を使用）
- 各ピンは番号付きマーカーのまま維持
- ルート上の方向矢印を表示

## 4. 技術実装

### 4.1 新規コンポーネント

#### `RoutePanel.jsx`
ルート計算のコントロールパネル

```javascript
const RoutePanel = ({ pins, onCalculateRoute }) => {
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [optimizeRoute, setOptimizeRoute] = useState(true)

  return (
    <div className={Style.routePanel}>
      <select onChange={(e) => setTravelMode(e.target.value)}>
        <option value="DRIVING">車</option>
        <option value="WALKING">徒歩</option>
        <option value="BICYCLING">自転車</option>
        <option value="TRANSIT">公共交通機関</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={optimizeRoute}
          onChange={(e) => setOptimizeRoute(e.target.checked)}
        />
        ルートを最適化
      </label>

      <button onClick={() => onCalculateRoute(travelMode, optimizeRoute)}>
        ルート計算
      </button>
    </div>
  )
}
```

#### `RouteDetails.jsx`
計算されたルート情報を表示

```javascript
const RouteDetails = ({ routeData, onExport, onClear }) => {
  return (
    <section className={Style.routeDetails}>
      <div className={Style.summary}>
        <h3>ルート概要</h3>
        <p>総距離: {routeData.totalDistance}</p>
        <p>所要時間: {routeData.totalDuration}</p>
      </div>

      <div className={Style.steps}>
        <h3>詳細ルート</h3>
        {routeData.legs.map((leg, index) => (
          <div key={index} className={Style.leg}>
            <p>{index + 1}. {leg.startAddress} → {leg.endAddress}</p>
            <p>距離: {leg.distance} | 時間: {leg.duration}</p>
          </div>
        ))}
      </div>

      <div className={Style.actions}>
        <button onClick={onExport}>ルート情報をエクスポート</button>
        <button onClick={onClear}>ルートをクリア</button>
      </div>
    </section>
  )
}
```

### 4.2 App.js への統合

#### 新しいstate
```javascript
const [routeData, setRouteData] = useState(null)
const [directionsRenderer, setDirectionsRenderer] = useState(null)
```

#### ルート計算関数
```javascript
const calculateRoute = useCallback((travelMode, optimizeRoute) => {
  if (pins.length < 2) {
    alert('ルート計算には最低2つのピンが必要です')
    return
  }

  if (pins.length > 25) {
    alert('ウェイポイントは最大25地点までです')
    return
  }

  // DirectionsServiceを使用
  if (window.google && window.google.maps) {
    const directionsService = new window.google.maps.DirectionsService()

    const origin = { lat: pins[0].lat, lng: pins[0].lng }
    const destination = {
      lat: pins[pins.length - 1].lat,
      lng: pins[pins.length - 1].lng
    }

    const waypoints = pins.slice(1, -1).map(pin => ({
      location: { lat: pin.lat, lng: pin.lng },
      stopover: true
    }))

    const request = {
      origin,
      destination,
      waypoints,
      optimizeWaypoints: optimizeRoute,
      travelMode: window.google.maps.TravelMode[travelMode],
      language: 'ja'
    }

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        // ルート情報を整形
        const formattedData = formatRouteData(result)
        setRouteData(formattedData)

        // DirectionsRendererで地図に描画
        if (directionsRenderer) {
          directionsRenderer.setDirections(result)
        }
      } else {
        console.error('Directions request failed:', status)
        alert('ルート計算に失敗しました')
      }
    })
  }
}, [pins, directionsRenderer])
```

#### データ整形関数
```javascript
const formatRouteData = (directionsResult) => {
  const route = directionsResult.routes[0]

  let totalDistance = 0
  let totalDuration = 0

  const legs = route.legs.map(leg => {
    totalDistance += leg.distance.value
    totalDuration += leg.duration.value

    return {
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map(step => ({
        instruction: step.instructions,
        distance: step.distance.text,
        duration: step.duration.text
      }))
    }
  })

  return {
    totalDistance: (totalDistance / 1000).toFixed(1) + ' km',
    totalDuration: Math.round(totalDuration / 60) + '分',
    legs
  }
}
```

### 4.3 Map.jsx への統合

DirectionsRendererを初期化・表示

```javascript
import { DirectionsRenderer } from '@react-google-maps/api'

function Map(props) {
  return (
    <GoogleMap {...mapOptions}>
      {/* 既存のマーカー表示 */}

      {/* ルート表示 */}
      {props.directionsRenderer && (
        <DirectionsRenderer
          directions={props.directionsRenderer}
          options={{
            suppressMarkers: true, // デフォルトマーカーを非表示
            polylineOptions: {
              strokeColor: '#4285F4',
              strokeWeight: 5,
              strokeOpacity: 0.8
            }
          }}
        />
      )}
    </GoogleMap>
  )
}
```

## 5. データ構造

### ルートデータ（routeData state）
```javascript
{
  totalDistance: "15.3 km",
  totalDuration: "25分",
  legs: [
    {
      startAddress: "東京都港区芝公園4-2-8",
      endAddress: "東京都港区芝公園4-7-35",
      distance: "0.8 km",
      duration: "3分",
      steps: [
        {
          instruction: "北西に進む",
          distance: "150 m",
          duration: "1分"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

### エクスポート形式（JSON）
```json
{
  "route": {
    "totalDistance": "15.3 km",
    "totalDuration": "25分",
    "travelMode": "DRIVING",
    "optimized": true,
    "waypoints": [
      {
        "order": 1,
        "name": "東京タワー",
        "lat": 35.6585805,
        "lng": 139.7454329
      },
      // ...
    ],
    "legs": [...]
  },
  "exportedAt": "2025-11-17T19:45:00.000Z"
}
```

## 6. 実装ステップ

### Phase 1: 基本ルート計算
1. RoutePanel コンポーネント作成
2. App.js に calculateRoute 関数実装
3. DirectionsService による基本的なルート計算
4. 地図上へのルート表示（DirectionsRenderer）

### Phase 2: ルート情報表示
1. RouteDetails コンポーネント作成
2. formatRouteData 関数実装
3. 総距離・所要時間の表示
4. 各区間の詳細情報表示

### Phase 3: 最適化とオプション
1. 移動手段の切り替え（車/徒歩/自転車/公共交通機関）
2. ルート最適化オプション
3. エラーハンドリング（ピン数チェック、API エラー処理）

### Phase 4: エクスポート機能
1. ルート情報の JSON エクスポート
2. ルートクリア機能
3. ルート再計算機能

## 7. 注意事項

### API使用量
- Directions API は比較的高コスト
- 開発中はリクエスト数に注意
- 本番環境では API キーの制限設定を推奨

### ウェイポイント制限
- 最大25地点（起点・終点含む）
- 超過する場合はユーザーに警告

### パフォーマンス
- ルート計算は非同期処理
- 計算中のローディング表示を実装
- キャッシュの検討（同じピン構成の場合）

### UI/UX
- ルート表示中はピンの編集を制限するか警告
- ピン追加/削除時に自動的にルート再計算するかオプション化
- モバイル対応（ルート詳細のスクロール表示）

## 8. 将来的な拡張案

### 代替ルート表示
- 複数のルートオプションを提示
- 最短距離 vs 最短時間の比較

### ルート保存機能
- localStorage への保存
- ルートテンプレート機能

### リアルタイム交通情報
- 現在の交通状況を反映
- 到着予定時刻の計算

### ルート共有
- URL パラメータでルート共有
- QRコード生成

## 9. 参考リンク

- [Google Maps Directions API Documentation](https://developers.google.com/maps/documentation/directions/overview)
- [react-google-maps/api - DirectionsService](https://react-google-maps-api-docs.netlify.app/)
- [Directions API Usage and Billing](https://developers.google.com/maps/documentation/directions/usage-and-billing)
