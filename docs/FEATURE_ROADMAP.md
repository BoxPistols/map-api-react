# GGMap 機能ロードマップ・設計ドキュメント

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [現在の実装状況](#現在の実装状況)
3. [Phase 1: 詳細情報表示機能](#phase-1-詳細情報表示機能)
4. [Phase 2: 行きたいところリスト機能](#phase-2-行きたいところリスト機能)
5. [Phase 3: Firebase連携基盤構築](#phase-3-firebase連携基盤構築)
6. [Phase 4: 経路・カレンダー連携](#phase-4-経路カレンダー連携)
7. [データモデル定義](#データモデル定義)
8. [技術スタック](#技術スタック)
9. [セキュリティとプライバシー](#セキュリティとプライバシー)
10. [実装スケジュール](#実装スケジュール)

---

## プロジェクト概要

### ビジョン
GGMapを**単なる地図検索アプリ**から**総合旅行・外出プランニングプラットフォーム**へと進化させる。

### 目標
- ユーザーが行きたい場所を発見・保存・管理できる
- 詳細な場所情報（営業時間、口コミ、写真）を提供
- 最適な経路を提案し、スケジュールを作成できる
- デバイス間でデータを同期し、いつでもアクセス可能
- Googleエコシステムとシームレスに連携

### ターゲットユーザー
- 旅行好き、外出好きの個人ユーザー
- 週末のお出かけを計画する家族
- 出張が多いビジネスパーソン
- 観光地を探索する訪日外国人

---

## 現在の実装状況

### ✅ 実装済み機能

#### 基本機能
- Google Maps統合
- 住所検索（Geocoding API）
- 場所検索（Places API Text Search）
- ピンモード（地図クリックでピン追加）
- レスポンシブデザイン（デスクトップ・モバイル対応）

#### データ管理
- localStorage自動保存・復元
- ピン一覧表示（右サイドバー）
- 検索結果一覧（左サイドバー）
- JSON/CSV エクスポート
- JSON インポート
- 全データバックアップ機能

#### 履歴管理
- ピン履歴（最大50件）
- 検索履歴（最大50件）
- 設定モーダルでCRUD操作
- 日付グループ化表示
- 履歴から復元機能

#### UI/UX
- Glassmorphismデザイン
- スムーズなアニメーション
- ピンカードクリックでズーム（zoom level 18）
- 全画面表示モード（Fキー）
- 折りたたみ可能なサイドバー

---

## Phase 1: 詳細情報表示機能

### 目的
Google Places API Details を活用して、各場所の詳細情報を表示し、ユーザーの意思決定をサポート。

### 機能要件

#### 1.1 詳細情報パネル

**表示する情報**
- ✅ 基本情報
  - 名前
  - カテゴリ（レストラン、カフェ、観光地など）
  - 住所
  - 電話番号
  - Webサイト URL
  - Google Maps URL

- ✅ 評価・レビュー
  - 星評価（0-5）
  - 総レビュー数
  - 価格帯（¥〜¥¥¥¥）
  - ユーザーレビュー（最新5件）
  - 写真ギャラリー

- ✅ 営業情報
  - 営業時間（曜日別）
  - 現在営業中かどうか（リアルタイム）
  - 定休日
  - 混雑状況（あれば）

- ✅ アクセシビリティ
  - 車椅子対応
  - 駐車場の有無
  - Wi-Fi の有無

#### 1.2 UI設計

```
┌─────────────────────────────────────┐
│  [×]  場所名                    [★] │  ← ヘッダー
├─────────────────────────────────────┤
│  📷 [写真ギャラリー - スワイプ可能]   │
├─────────────────────────────────────┤
│  ⭐ 4.5 (1,234 reviews)  ¥¥¥      │
│  🟢 営業中 · 18:00に閉店            │
├─────────────────────────────────────┤
│  📍 住所: 東京都...                 │
│  📞 電話: 03-1234-5678              │
│  🌐 Webサイト                       │
│  🔗 Google Mapsで開く               │
├─────────────────────────────────────┤
│  📅 営業時間                        │
│     月-金: 10:00-18:00              │
│     土日: 11:00-20:00               │
│     定休日: なし                     │
├─────────────────────────────────────┤
│  💬 レビュー                        │
│  ┌───────────────────────────────┐  │
│  │ ⭐⭐⭐⭐⭐ 太郎さん              │  │
│  │ "とても良かったです..."          │  │
│  │ 📷📷                           │  │
│  └───────────────────────────────┘  │
│  [もっと見る]                       │
├─────────────────────────────────────┤
│  ♿ 車椅子対応 🅿️ 駐車場あり        │
│  📶 Wi-Fiあり                      │
├─────────────────────────────────────┤
│  [💾 保存]  [📍 ピン追加]  [🚗 経路]│  ← アクション
└─────────────────────────────────────┘
```

#### 1.3 表示トリガー

- 検索結果カードをクリック → サイドパネルで詳細表示
- ピンをクリック → 詳細情報ポップアップ
- 地図マーカーをクリック → インフォウィンドウ表示

### 技術仕様

#### 1.4 API統合

**Google Places API - Place Details**

```javascript
// リクエスト例
const request = {
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  fields: [
    'name',
    'rating',
    'formatted_phone_number',
    'formatted_address',
    'opening_hours',
    'website',
    'price_level',
    'photos',
    'reviews',
    'geometry',
    'wheelchair_accessible_entrance',
    'url'
  ],
  language: 'ja'
}

service.getDetails(request, (place, status) => {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    // 詳細情報を表示
  }
})
```

#### 1.5 データフロー

```
検索結果カードクリック
  ↓
place_id を取得
  ↓
Places API Details リクエスト
  ↓
レスポンス受信
  ↓
詳細情報を state に保存
  ↓
DetailPanel コンポーネントを表示
```

#### 1.6 コンポーネント構造

```
src/components/
├── PlaceDetail/
│   ├── PlaceDetail.jsx          # メインコンポーネント
│   ├── PlaceDetail.module.scss
│   ├── PhotoGallery.jsx         # 写真ギャラリー
│   ├── ReviewList.jsx           # レビュー一覧
│   ├── OpeningHours.jsx         # 営業時間
│   └── PlaceActions.jsx         # アクションボタン
```

#### 1.7 状態管理

```javascript
// App.js に追加
const [selectedPlace, setSelectedPlace] = useState(null)
const [placeDetails, setPlaceDetails] = useState(null)
const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

// 詳細情報取得関数
const fetchPlaceDetails = useCallback((placeId) => {
  if (!window.google?.maps?.places) return

  const service = new window.google.maps.places.PlacesService(
    document.createElement('div')
  )

  const request = {
    placeId: placeId,
    fields: [...], // 必要なフィールド
    language: 'ja'
  }

  service.getDetails(request, (place, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      setPlaceDetails(place)
      setIsDetailPanelOpen(true)
    }
  })
}, [])
```

### 実装ステップ

1. **Step 1.1**: PlaceDetail コンポーネント作成
2. **Step 1.2**: Places API Details 統合
3. **Step 1.3**: 写真ギャラリー実装（スワイプ対応）
4. **Step 1.4**: レビュー表示機能
5. **Step 1.5**: 営業時間・営業状況表示
6. **Step 1.6**: レスポンシブデザイン調整
7. **Step 1.7**: エラーハンドリング・ローディング状態

### パフォーマンス考慮事項

- **キャッシュ戦略**: 一度取得した詳細情報はメモリにキャッシュ
- **遅延読み込み**: 写真は必要になるまで読み込まない
- **API クォータ管理**: 必要最小限のフィールドのみリクエスト

---

## Phase 2: 行きたいところリスト機能

### 目的
ユーザーが訪問予定の場所を「行きたいところリスト（ウィッシュリスト）」として保存・管理できるようにする。

### 機能要件

#### 2.1 ウィッシュリスト基本機能

**CRUD操作**
- ✅ Create: 場所をウィッシュリストに追加
- ✅ Read: ウィッシュリスト一覧表示
- ✅ Update: メモ・タグ・優先度の編集
- ✅ Delete: ウィッシュリストから削除

**追加情報**
- カスタムメモ（行きたい理由、予算、誰と行くかなど）
- タグ付け（複数選択可）
  - レストラン
  - カフェ
  - 観光地
  - ショッピング
  - 美術館・博物館
  - 公園
  - その他（カスタムタグ）
- 優先度（高・中・低）
- 追加日時
- 訪問予定日（オプション）

#### 2.2 フィルタリング・ソート

**フィルタ**
- タグでフィルタ
- 優先度でフィルタ
- 評価（星）でフィルタ
- 価格帯でフィルタ

**ソート**
- 追加日時（新しい順・古い順）
- 優先度（高→低、低→高）
- 評価（高→低、低→高）
- 名前（あいうえお順）
- 距離（現在地から近い順）

#### 2.3 UI設計

**ウィッシュリストパネル**

```
┌─────────────────────────────────────┐
│  行きたいところリスト (12)           │
│  [+ 新規追加]  [🔍 検索]  [⚙️ 設定] │
├─────────────────────────────────────┤
│  [タグ: すべて ▼]  [並び替え: 新しい順 ▼] │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 🏷️ レストラン | 🔴 優先度: 高   │  │
│  │ カフェ○○                       │  │
│  │ ⭐ 4.5  ¥¥  📍 渋谷            │  │
│  │ 💬 "友達と行きたい。パスタが..."│  │
│  │ 📅 予定: 2025/12/15            │  │
│  │ [👁️ 詳細]  [📍 地図]  [✏️]  [🗑️] │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 🏷️ 観光地 | 🟡 優先度: 中      │  │
│  │ 東京スカイツリー                │  │
│  │ ...                           │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [< 前へ]  1/3ページ  [次へ >]      │
└─────────────────────────────────────┘
```

**追加・編集モーダル**

```
┌─────────────────────────────────────┐
│  ウィッシュリストに追加              │
│                                [×]  │
├─────────────────────────────────────┤
│  カフェ○○                          │
│  📍 渋谷区...                       │
│  ⭐ 4.5  ¥¥                       │
├─────────────────────────────────────┤
│  🏷️ タグ (複数選択可)              │
│  [✓] レストラン  [ ] カフェ         │
│  [ ] 観光地      [✓] ショッピング   │
│  [+ カスタムタグを追加]              │
├─────────────────────────────────────┤
│  🎯 優先度                          │
│  ( ) 高  (•) 中  ( ) 低            │
├─────────────────────────────────────┤
│  📅 訪問予定日 (オプション)          │
│  [2025-12-15を選択]                │
├─────────────────────────────────────┤
│  💬 メモ                            │
│  ┌───────────────────────────────┐  │
│  │ 友達と行きたい。               │  │
│  │ パスタがおすすめらしい。        │  │
│  │ 予算: 3000円                  │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│        [キャンセル]  [保存]          │
└─────────────────────────────────────┘
```

### データ構造

#### 2.4 WishlistItem データモデル

```typescript
interface WishlistItem {
  id: string                    // ユニークID
  placeId: string              // Google Places API place_id
  name: string                 // 場所名
  address: string              // 住所
  lat: number                  // 緯度
  lng: number                  // 経度
  rating?: number              // 評価 (0-5)
  priceLevel?: number          // 価格帯 (0-4)
  photoUrl?: string            // 代表写真URL

  // ユーザーが追加する情報
  tags: string[]               // タグ配列
  priority: 'high' | 'medium' | 'low'  // 優先度
  memo: string                 // メモ
  visitDate?: string           // 訪問予定日 (ISO 8601)

  // メタデータ
  createdAt: number            // 追加日時 (timestamp)
  updatedAt: number            // 更新日時 (timestamp)
  visited: boolean             // 訪問済みフラグ
  visitedAt?: number           // 訪問日時 (timestamp)
}
```

#### 2.5 localStorage スキーマ

```javascript
// LocalStorage Key
const WISHLIST_KEY = 'ggmap_wishlist'

// データ例
{
  "wishlist": [
    {
      "id": "wl_1234567890",
      "placeId": "ChIJ...",
      "name": "カフェ○○",
      "address": "東京都渋谷区...",
      "lat": 35.6585805,
      "lng": 139.7454329,
      "rating": 4.5,
      "priceLevel": 2,
      "photoUrl": "https://...",
      "tags": ["カフェ", "デート"],
      "priority": "high",
      "memo": "友達と行きたい。パスタがおすすめ。",
      "visitDate": "2025-12-15",
      "createdAt": 1700000000000,
      "updatedAt": 1700000000000,
      "visited": false
    }
  ]
}
```

### 技術仕様

#### 2.6 コンポーネント構造

```
src/components/
├── Wishlist/
│   ├── Wishlist.jsx              # メインコンポーネント
│   ├── Wishlist.module.scss
│   ├── WishlistItem.jsx          # リストアイテム
│   ├── WishlistFilter.jsx        # フィルタUI
│   ├── WishlistSort.jsx          # ソートUI
│   ├── AddToWishlistModal.jsx    # 追加モーダル
│   └── EditWishlistModal.jsx     # 編集モーダル
```

#### 2.7 状態管理

```javascript
// App.js に追加
const [wishlist, setWishlist] = useState(() => loadWishlist())
const [wishlistFilter, setWishlistFilter] = useState({
  tags: [],
  priority: null,
  rating: null
})
const [wishlistSort, setWishlistSort] = useState('createdAt_desc')
```

#### 2.8 ユーティリティ関数

```javascript
// src/utils/wishlist.js

export const addToWishlist = (item) => { /*...*/ }
export const removeFromWishlist = (id) => { /*...*/ }
export const updateWishlistItem = (id, updates) => { /*...*/ }
export const getWishlist = () => { /*...*/ }
export const filterWishlist = (items, filters) => { /*...*/ }
export const sortWishlist = (items, sortBy) => { /*...*/ }
export const markAsVisited = (id) => { /*...*/ }
```

### 実装ステップ

1. **Step 2.1**: データモデル・ユーティリティ作成
2. **Step 2.2**: Wishlist コンポーネント作成
3. **Step 2.3**: 追加・編集モーダル実装
4. **Step 2.4**: フィルタ・ソート機能
5. **Step 2.5**: タグ管理機能
6. **Step 2.6**: 訪問済みマーク機能
7. **Step 2.7**: localStorage 永続化
8. **Step 2.8**: UI/UX 調整・レスポンシブ対応

---

## Phase 3: Firebase連携基盤構築

### 目的
ローカルストレージからクラウドベースのデータ管理に移行し、デバイス間同期・ユーザー認証を実現。

### 機能要件

#### 3.1 Firebase Authentication

**認証方法**
- Google ログイン（OAuth 2.0）
- メールアドレス＋パスワード（オプション）
- 匿名認証（ゲストモード）

**ユーザー管理**
- プロフィール情報（名前、写真、メールアドレス）
- アカウント作成・削除
- パスワードリセット
- セッション管理

#### 3.2 Cloud Firestore

**データ構造**

```
users/
  └── {userId}/
      ├── profile/
      │   ├── displayName: string
      │   ├── email: string
      │   ├── photoURL: string
      │   └── createdAt: timestamp
      │
      ├── pins/
      │   └── {pinId}/
      │       ├── lat: number
      │       ├── lng: number
      │       ├── address: string
      │       └── createdAt: timestamp
      │
      ├── wishlist/
      │   └── {wishlistId}/
      │       ├── placeId: string
      │       ├── name: string
      │       ├── tags: array
      │       ├── priority: string
      │       ├── memo: string
      │       └── createdAt: timestamp
      │
      ├── history/
      │   ├── pins/
      │   │   └── {historyId}/ {...}
      │   └── searches/
      │       └── {historyId}/ {...}
      │
      └── settings/
          ├── theme: string
          ├── defaultZoom: number
          └── notifications: boolean
```

**セキュリティルール**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // 公開データ（将来的な共有機能用）
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 3.3 データ移行戦略

**localStorage → Firestore**

```javascript
// 初回ログイン時の移行フロー
async function migrateLocalDataToFirestore(userId) {
  try {
    // ローカルデータを読み込み
    const localPins = loadPins()
    const localWishlist = loadWishlist()
    const localPinHistory = loadPinHistory()
    const localSearchHistory = loadSearchHistory()

    // Firestoreに保存
    const batch = firestore.batch()

    // Pins
    localPins.forEach(pin => {
      const docRef = firestore
        .collection('users')
        .doc(userId)
        .collection('pins')
        .doc()
      batch.set(docRef, pin)
    })

    // Wishlist
    localWishlist.forEach(item => {
      const docRef = firestore
        .collection('users')
        .doc(userId)
        .collection('wishlist')
        .doc()
      batch.set(docRef, item)
    })

    await batch.commit()

    // 移行完了後、ローカルデータにフラグを立てる
    localStorage.setItem('ggmap_migrated', 'true')

    console.log('データ移行完了')
  } catch (error) {
    console.error('データ移行エラー:', error)
  }
}
```

#### 3.4 リアルタイム同期

```javascript
// Firestoreリアルタイムリスナー
useEffect(() => {
  if (!user) return

  // Pinsのリアルタイム同期
  const unsubscribePins = firestore
    .collection('users')
    .doc(user.uid)
    .collection('pins')
    .onSnapshot((snapshot) => {
      const pins = []
      snapshot.forEach((doc) => {
        pins.push({ id: doc.id, ...doc.data() })
      })
      setPins(pins)
    })

  // Wishlistのリアルタイム同期
  const unsubscribeWishlist = firestore
    .collection('users')
    .doc(user.uid)
    .collection('wishlist')
    .onSnapshot((snapshot) => {
      const wishlist = []
      snapshot.forEach((doc) => {
        wishlist.push({ id: doc.id, ...doc.data() })
      })
      setWishlist(wishlist)
    })

  return () => {
    unsubscribePins()
    unsubscribeWishlist()
  }
}, [user])
```

### 技術仕様

#### 3.5 Firebase設定

**パッケージインストール**

```bash
npm install firebase
```

**firebase.js 設定ファイル**

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const analytics = getAnalytics(app)
export const googleProvider = new GoogleAuthProvider()
```

#### 3.6 認証コンポーネント

```javascript
// src/components/Auth/LoginModal.jsx
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase/config'

const LoginModal = ({ isOpen, onClose }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // データ移行チェック
      const migrated = localStorage.getItem('ggmap_migrated')
      if (!migrated) {
        await migrateLocalDataToFirestore(user.uid)
      }

      onClose()
    } catch (error) {
      console.error('ログインエラー:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // ローカルストレージもクリア（オプション）
      // localStorage.clear()
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <div className={styles.modal}>
      <h2>ログイン</h2>
      <button onClick={handleGoogleLogin}>
        <img src="/google-icon.svg" alt="Google" />
        Googleでログイン
      </button>
    </div>
  )
}
```

#### 3.7 認証状態管理

```javascript
// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading }
}
```

### 実装ステップ

1. **Step 3.1**: Firebase プロジェクト作成・設定
2. **Step 3.2**: Firebase SDK 統合
3. **Step 3.3**: 認証UI実装（ログイン・ログアウト）
4. **Step 3.4**: Firestore データ構造設計
5. **Step 3.5**: セキュリティルール設定
6. **Step 3.6**: データ移行機能実装
7. **Step 3.7**: リアルタイム同期実装
8. **Step 3.8**: オフライン対応（Firestore Persistence）
9. **Step 3.9**: エラーハンドリング・ローディング状態
10. **Step 3.10**: テスト・デバッグ

### セキュリティ考慮事項

- **環境変数管理**: Firebase設定を.envファイルで管理
- **HTTPS通信**: 本番環境は必ずHTTPS
- **セキュリティルール**: 厳格なアクセス制御
- **APIキー制限**: Firebase Consoleでドメイン制限
- **認証トークン**: 適切な有効期限設定

---

## Phase 4: 経路・カレンダー連携

### 目的
最適な経路を提案し、スケジュールをGoogleカレンダーに同期できるようにする。

### 機能要件

#### 4.1 経路検索機能

**Google Directions API 統合**

**対応する交通手段**
- 🚗 車
- 🚇 電車
- 🚶 徒歩
- 🚴 自転車
- 🚌 バス（Transit）

**表示する情報**
- 所要時間
- 距離
- 経路の詳細（ステップバイステップ）
- 乗換情報（電車・バスの場合）
- 料金（Transit の場合）
- リアルタイム交通情報
- 複数ルート比較

**UI設計**

```
┌─────────────────────────────────────┐
│  経路を検索                          │
├─────────────────────────────────────┤
│  出発地: [現在地 ▼]                 │
│  目的地: カフェ○○                   │
├─────────────────────────────────────┤
│  [🚗] [🚇] [🚶] [🚴]               │
├─────────────────────────────────────┤
│  ルート1 (推奨)                     │
│  ⏱️ 25分  📏 3.5km  💴 ¥280       │
│  🚇 電車: 渋谷 → 表参道 (10分)      │
│  🚶 徒歩: 800m (10分)              │
│  [詳細を見る]  [📅 スケジュールに追加]│
├─────────────────────────────────────┤
│  ルート2                            │
│  ⏱️ 30分  📏 4.2km  💴 ¥200       │
│  ...                               │
└─────────────────────────────────────┘
```

#### 4.2 スケジュール作成機能

**タイムライン型UI**

```
┌─────────────────────────────────────┐
│  お出かけスケジュール                │
│  📅 2025年12月15日 (土)            │
├─────────────────────────────────────┤
│  10:00  自宅出発                    │
│    ↓ 🚇 電車 25分                  │
│  10:25  カフェ○○ 到着               │
│         滞在時間: 1時間              │
│    ↓ 🚶 徒歩 10分                  │
│  11:35  美術館 到着                 │
│         滞在時間: 2時間              │
│    ↓ 🚗 車 20分                    │
│  14:00  レストラン 到着              │
│         滞在時間: 1.5時間            │
│    ↓ 🚇 電車 30分                  │
│  16:00  自宅到着                    │
├─────────────────────────────────────┤
│  合計所要時間: 6時間                │
│  合計移動時間: 1時間25分            │
│  合計移動距離: 15.3km               │
│  交通費: ¥850                      │
├─────────────────────────────────────┤
│  [📥 エクスポート]  [📆 カレンダーに追加]│
└─────────────────────────────────────┘
```

**機能**
- ドラッグ&ドロップで順序変更
- 各スポットの滞在時間設定
- 移動時間の自動計算
- 出発時刻の自動調整
- 名前を付けて保存
- テンプレート機能

#### 4.3 Googleカレンダー連携

**Google Calendar API 統合**

**機能**
- スケジュールをカレンダーイベントとして作成
- イベント詳細に場所・メモを含める
- 移動時間も別イベントとして追加
- リマインダー設定
- カレンダーから編集・削除

**イベントデータ例**

```javascript
{
  summary: 'カフェ○○',
  location: '東京都渋谷区...',
  description: 'お気に入りのカフェ。パスタがおすすめ。',
  start: {
    dateTime: '2025-12-15T10:25:00+09:00',
    timeZone: 'Asia/Tokyo'
  },
  end: {
    dateTime: '2025-12-15T11:25:00+09:00',
    timeZone: 'Asia/Tokyo'
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'popup', minutes: 30 }
    ]
  }
}
```

### 技術仕様

#### 4.4 Google Directions API

```javascript
// src/services/directions.js
export const getDirections = async (origin, destination, mode = 'DRIVING') => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('Google Maps not loaded'))
      return
    }

    const directionsService = new window.google.maps.DirectionsService()

    const request = {
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode[mode],
      language: 'ja',
      region: 'JP',
      // Transitの場合
      ...(mode === 'TRANSIT' && {
        transitOptions: {
          departureTime: new Date(),
          modes: ['BUS', 'RAIL', 'SUBWAY', 'TRAIN'],
          routingPreference: 'FEWER_TRANSFERS'
        }
      })
    }

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        resolve(result)
      } else {
        reject(new Error(`Directions request failed: ${status}`))
      }
    })
  })
}
```

#### 4.5 Google Calendar API

**OAuth 2.0 スコープ**

```javascript
const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events'
]
```

**イベント作成**

```javascript
// src/services/calendar.js
import { gapi } from 'gapi-script'

export const initGoogleCalendar = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
      ],
      scope: 'https://www.googleapis.com/auth/calendar.events'
    })
  })
}

export const createCalendarEvent = async (event) => {
  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    })
    return response.result
  } catch (error) {
    console.error('Calendar event creation error:', error)
    throw error
  }
}

export const createScheduleEvents = async (schedule) => {
  const events = []

  // 各スポットをイベントとして作成
  for (const item of schedule.items) {
    const event = {
      summary: item.name,
      location: item.address,
      description: item.memo || '',
      start: {
        dateTime: item.startTime,
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: item.endTime,
        timeZone: 'Asia/Tokyo'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 }
        ]
      }
    }

    const result = await createCalendarEvent(event)
    events.push(result)
  }

  return events
}
```

#### 4.6 コンポーネント構造

```
src/components/
├── Route/
│   ├── RouteSearch.jsx          # 経路検索
│   ├── RouteDetails.jsx         # 経路詳細
│   ├── RouteComparison.jsx      # ルート比較
│   └── RouteMap.jsx             # 経路表示地図
│
├── Schedule/
│   ├── ScheduleBuilder.jsx      # スケジュール作成
│   ├── ScheduleTimeline.jsx     # タイムライン表示
│   ├── ScheduleItem.jsx         # スケジュールアイテム
│   ├── DurationPicker.jsx       # 滞在時間選択
│   └── ScheduleExport.jsx       # エクスポート機能
│
└── Calendar/
    ├── CalendarSync.jsx         # カレンダー同期
    └── CalendarAuth.jsx         # Calendar API認証
```

### 実装ステップ

1. **Step 4.1**: Directions API 統合
2. **Step 4.2**: RouteSearch コンポーネント実装
3. **Step 4.3**: 複数ルート比較機能
4. **Step 4.4**: 経路を地図上に表示
5. **Step 4.5**: スケジュールビルダー実装
6. **Step 4.6**: タイムライン UI 実装
7. **Step 4.7**: ドラッグ&ドロップ機能
8. **Step 4.8**: Google Calendar API 統合
9. **Step 4.9**: カレンダーイベント作成機能
10. **Step 4.10**: スケジュール保存・読み込み

---

## データモデル定義

### 総合データモデル

```typescript
// User Profile
interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string
  createdAt: number
  settings: UserSettings
}

interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  defaultZoom: number
  defaultCenter: { lat: number; lng: number }
  defaultTransportMode: 'DRIVING' | 'TRANSIT' | 'WALKING' | 'BICYCLING'
  notifications: boolean
  language: 'ja' | 'en'
}

// Pin
interface Pin {
  id: string
  lat: number
  lng: number
  address: string
  createdAt: number
  userId?: string  // Firebase使用時
}

// Wishlist Item (詳細版)
interface WishlistItem {
  id: string
  placeId: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  priceLevel?: number
  photoUrl?: string
  tags: string[]
  priority: 'high' | 'medium' | 'low'
  memo: string
  visitDate?: string
  createdAt: number
  updatedAt: number
  visited: boolean
  visitedAt?: number
  userId?: string
}

// Schedule
interface Schedule {
  id: string
  name: string
  date: string
  items: ScheduleItem[]
  totalDuration: number  // 分単位
  totalDistance: number  // メートル単位
  totalCost: number      // 円
  createdAt: number
  updatedAt: number
  userId?: string
  exported: boolean
  calendarEventIds?: string[]  // Google Calendar イベントID
}

interface ScheduleItem {
  id: string
  order: number
  place: WishlistItem | Pin
  arrivalTime: string     // ISO 8601
  departureTime: string   // ISO 8601
  duration: number        // 滞在時間（分）
  route?: RouteInfo       // 次の場所への経路
}

interface RouteInfo {
  distance: number        // メートル
  duration: number        // 分
  mode: 'DRIVING' | 'TRANSIT' | 'WALKING' | 'BICYCLING'
  steps: RouteStep[]
  polyline: string       // エンコードされたポリライン
  fare?: {
    value: number        // 円
    currency: string
  }
}

interface RouteStep {
  instruction: string
  distance: number
  duration: number
  mode: string
  transitDetails?: {
    line: string
    departure: string
    arrival: string
  }
}

// Place Details (from Google Places API)
interface PlaceDetails {
  placeId: string
  name: string
  formattedAddress: string
  formattedPhoneNumber?: string
  website?: string
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number
  openingHours?: OpeningHours
  photos?: Photo[]
  reviews?: Review[]
  geometry: {
    location: { lat: number; lng: number }
  }
  types: string[]
  wheelchairAccessibleEntrance?: boolean
  url: string
}

interface OpeningHours {
  openNow: boolean
  weekdayText: string[]
  periods: Period[]
}

interface Period {
  open: { day: number; time: string }
  close: { day: number; time: string }
}

interface Photo {
  photoReference: string
  height: number
  width: number
  htmlAttributions: string[]
}

interface Review {
  authorName: string
  authorUrl?: string
  profilePhotoUrl?: string
  rating: number
  relativeTimeDescription: string
  text: string
  time: number
}

// History
interface PinHistory {
  id: string
  lat: number
  lng: number
  address: string
  timestamp: number
  userId?: string
}

interface SearchHistory {
  id: string
  query: string
  type: 'places' | 'geocode'
  results: number
  firstResult?: {
    name: string
    address: string
    lat: number
    lng: number
  }
  timestamp: number
  userId?: string
}
```

---

## 技術スタック

### フロントエンド

**現在**
- React 18.2.0
- SASS/SCSS
- Axios

**Phase 1-2で追加**
- React DnD（ドラッグ&ドロップ）
- date-fns（日付処理）
- React Swipeable（写真ギャラリー）

**Phase 3で追加**
- Firebase SDK 10.x
  - Authentication
  - Firestore
  - Analytics
- React Context API（グローバル状態管理強化）

**Phase 4で追加**
- gapi-script（Google API Client）
- @react-google-maps/api（Directions表示）

### バックエンド（Firebase）

- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Cloud Functions（将来的な拡張用）
- Cloud Storage（画像保存用）

### Google APIs

- Google Maps JavaScript API
- Google Places API (Text Search, Details, Photos)
- Google Geocoding API
- Google Directions API
- Google Calendar API
- Google Drive API（バックアップ用、将来）

### 開発ツール

- ESLint
- Prettier
- Git / GitHub
- VS Code
- Chrome DevTools
- Firebase Emulator Suite（開発環境）

---

## セキュリティとプライバシー

### 認証・認可

- Firebase Authentication による多要素認証対応
- OAuth 2.0 による Google ログイン
- JWT トークンによるセッション管理
- 適切な有効期限設定

### データ保護

- **通信の暗号化**: HTTPS通信必須
- **データベース暗号化**: Firestore はデフォルトで暗号化
- **アクセス制御**: Firestore Security Rules で厳格な制御
- **API キー制限**: Firebase Console でドメイン・IP制限

### プライバシー

- **データ分離**: ユーザーごとにデータを完全分離
- **データ削除**: アカウント削除時に全データ削除
- **匿名化**: アナリティクスデータは匿名化
- **GDPR対応**: EU圏ユーザーのプライバシー保護

### セキュリティベストプラクティス

```javascript
// Firestore Security Rules 例
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証されたユーザーのみアクセス可能
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // データサイズ制限
    match /users/{userId}/wishlist/{wishlistId} {
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.memo.size() < 1000;
    }

    // レート制限（Cloud Functions で実装）
    // allow write: if request.time > resource.data.lastUpdate + duration.value(1, 's');
  }
}
```

### 環境変数管理

```bash
# .env.example
REACT_APP_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
REACT_APP_GOOGLE_CLIENT_ID=your_oauth_client_id
```

---

## 実装スケジュール

### Phase 1: 詳細情報表示機能（2週間）

**Week 1**
- Day 1-2: PlaceDetail コンポーネント設計・実装
- Day 3-4: Places API Details 統合
- Day 5-7: 写真ギャラリー・レビュー表示

**Week 2**
- Day 8-10: 営業時間・営業状況表示
- Day 11-12: レスポンシブデザイン調整
- Day 13-14: テスト・バグ修正・リリース

### Phase 2: 行きたいところリスト機能（3週間）

**Week 1**
- Day 1-2: データモデル・ユーティリティ実装
- Day 3-5: Wishlist コンポーネント実装
- Day 6-7: 追加・編集モーダル実装

**Week 2**
- Day 8-10: フィルタ・ソート機能
- Day 11-12: タグ管理機能
- Day 13-14: 訪問済みマーク機能

**Week 3**
- Day 15-17: localStorage 永続化
- Day 18-19: UI/UX 調整
- Day 20-21: テスト・バグ修正・リリース

### Phase 3: Firebase連携基盤構築（4週間）

**Week 1**
- Day 1-2: Firebase プロジェクト設定
- Day 3-5: Authentication 実装
- Day 6-7: ログインUI実装

**Week 2**
- Day 8-10: Firestore データ構造実装
- Day 11-12: セキュリティルール設定
- Day 13-14: データ移行機能実装

**Week 3**
- Day 15-17: リアルタイム同期実装
- Day 18-19: オフライン対応
- Day 20-21: エラーハンドリング

**Week 4**
- Day 22-24: 包括的テスト
- Day 25-26: パフォーマンス最適化
- Day 27-28: デプロイ・リリース

### Phase 4: 経路・カレンダー連携（3週間）

**Week 1**
- Day 1-3: Directions API 統合
- Day 4-5: RouteSearch コンポーネント
- Day 6-7: 複数ルート比較機能

**Week 2**
- Day 8-10: スケジュールビルダー実装
- Day 11-12: タイムライン UI 実装
- Day 13-14: ドラッグ&ドロップ機能

**Week 3**
- Day 15-17: Google Calendar API 統合
- Day 18-19: カレンダーイベント作成
- Day 20-21: テスト・リリース

### 総合実装期間: 約3ヶ月

---

## マイルストーン

### Milestone 1: 情報充実化（Phase 1完了）
- ユーザーは場所の詳細情報を確認できる
- 営業時間・口コミを見て訪問を判断できる
- 写真で場所の雰囲気を把握できる

### Milestone 2: 計画管理（Phase 2完了）
- ユーザーは行きたい場所をリスト管理できる
- タグ・メモで情報を整理できる
- 優先度をつけて計画を立てられる

### Milestone 3: クラウド化（Phase 3完了）
- データがクラウドに保存される
- デバイス間でデータが同期される
- アカウント管理が可能になる

### Milestone 4: 総合プランニングツール（Phase 4完了）
- 最適な経路が提案される
- スケジュールを作成できる
- Googleカレンダーと連携できる

### 最終ゴール
**GGMapが旅行・外出の総合プランニングプラットフォームとして確立される**

---

## 次のステップ

1. **Phase 1から順次着手**
2. **各フェーズ完了後にユーザーフィードバック収集**
3. **必要に応じて仕様調整**
4. **段階的にリリース（アジャイル開発）**

---

## 付録: 参考リンク

### Google APIs ドキュメント
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API](https://developers.google.com/maps/documentation/directions)
- [Calendar API](https://developers.google.com/calendar/api)

### Firebase ドキュメント
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### React ライブラリ
- [React DnD](https://react-dnd.github.io/react-dnd/)
- [date-fns](https://date-fns.org/)
- [React Swipeable](https://github.com/FormidableLabs/react-swipeable)

---

**ドキュメントバージョン**: 1.0
**最終更新日**: 2025-11-19
**作成者**: Claude (Anthropic)
