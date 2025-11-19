# GGMap アーキテクチャドキュメント

## システムアーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Components                                        │  │
│  │  - Map (Google Maps)                              │  │
│  │  - SearchForm                                     │  │
│  │  - PinList                                        │  │
│  │  - PlacesResults                                  │  │
│  │  - SettingsModal                                  │  │
│  │  - [Future] PlaceDetail, Wishlist, Route, etc.   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State Management                                  │  │
│  │  - React Hooks (useState, useCallback, useEffect) │  │
│  │  - [Future] Context API for global state         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services & Utilities                             │  │
│  │  - storage.js (localStorage management)           │  │
│  │  - [Future] firebase.js, directions.js, etc.     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              External APIs & Services                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Google Maps  │  │   Firebase   │  │Google Calendar│ │
│  │              │  │              │  │              │  │
│  │ - Maps API   │  │ - Auth       │  │ - Events API │  │
│  │ - Places API │  │ - Firestore  │  │              │  │
│  │ - Geocoding  │  │ - Storage    │  │              │  │
│  │ - Directions │  │ - Functions  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Data Storage (Current & Future)             │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ localStorage │  │  Firestore   │                     │
│  │ (Current)    │  │  (Future)    │                     │
│  │              │  │              │                     │
│  │ - pins       │  │ - users/     │                     │
│  │ - pin_hist   │  │   - {uid}/   │                     │
│  │ - search_hist│  │     - pins   │                     │
│  │              │  │     - wishlist│                    │
│  │              │  │     - history │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

---

## フォルダ構造

### 現在の構造

```
map-api-react/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── GeoCodeResult/
│   │   │   ├── GeoCodeResult.jsx
│   │   │   └── GeoCodeResult.module.scss
│   │   ├── Map/
│   │   │   ├── Map.jsx
│   │   │   └── Map.module.scss
│   │   ├── PinList/
│   │   │   ├── PinList.jsx
│   │   │   └── PinList.module.scss
│   │   ├── PlacesResults/
│   │   │   ├── PlacesResults.jsx
│   │   │   └── PlacesResults.module.scss
│   │   ├── SearchForm/
│   │   │   ├── SearchForm.jsx
│   │   │   └── SearchForm.module.scss
│   │   └── SettingsModal/
│   │       ├── SettingsModal.jsx
│   │       └── SettingsModal.module.scss
│   ├── utils/
│   │   └── storage.js
│   ├── App.js
│   ├── App.scss
│   └── index.js
├── docs/
│   ├── FEATURE_ROADMAP.md
│   └── ARCHITECTURE.md
├── .env
├── .env.example
├── package.json
└── README.md
```

### Phase 3 (Firebase連携) 後の構造

```
map-api-react/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginModal.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── AuthButton.jsx
│   │   ├── PlaceDetail/         # Phase 1
│   │   │   ├── PlaceDetail.jsx
│   │   │   ├── PhotoGallery.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   ├── OpeningHours.jsx
│   │   │   └── PlaceActions.jsx
│   │   ├── Wishlist/            # Phase 2
│   │   │   ├── Wishlist.jsx
│   │   │   ├── WishlistItem.jsx
│   │   │   ├── WishlistFilter.jsx
│   │   │   ├── AddToWishlistModal.jsx
│   │   │   └── EditWishlistModal.jsx
│   │   ├── Route/               # Phase 4
│   │   │   ├── RouteSearch.jsx
│   │   │   ├── RouteDetails.jsx
│   │   │   └── RouteComparison.jsx
│   │   ├── Schedule/            # Phase 4
│   │   │   ├── ScheduleBuilder.jsx
│   │   │   ├── ScheduleTimeline.jsx
│   │   │   └── ScheduleItem.jsx
│   │   └── Calendar/            # Phase 4
│   │       ├── CalendarSync.jsx
│   │       └── CalendarAuth.jsx
│   ├── services/
│   │   ├── places.js            # Places API ラッパー
│   │   ├── directions.js        # Directions API ラッパー
│   │   └── calendar.js          # Calendar API ラッパー
│   ├── firebase/
│   │   ├── config.js            # Firebase設定
│   │   ├── auth.js              # 認証関連
│   │   └── firestore.js         # Firestore操作
│   ├── hooks/
│   │   ├── useAuth.js           # 認証フック
│   │   ├── useFirestore.js      # Firestoreフック
│   │   └── usePlaces.js         # Places APIフック
│   ├── context/
│   │   ├── AuthContext.jsx      # 認証コンテキスト
│   │   └── DataContext.jsx      # データコンテキスト
│   └── utils/
│       ├── storage.js           # localStorage管理
│       ├── wishlist.js          # ウィッシュリスト操作
│       ├── schedule.js          # スケジュール操作
│       └── migration.js         # データ移行
```

---

## データフロー

### 現在のデータフロー（localStorage）

```
User Action (検索、ピン追加)
    ↓
App.js (state更新)
    ↓
localStorage (自動保存)
    ↓
Component Re-render
    ↓
UI Update
```

### Phase 3 後のデータフロー（Firebase）

```
User Action
    ↓
App.js / Component
    ↓
Firebase API Call
    ↓
Firestore (Cloud Database)
    ↓
Real-time Listener
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update

[別デバイス]
    ↑
Real-time Sync
    ↑
Firestore
```

---

## 状態管理戦略

### Current: React Hooks

**App.js での状態管理**

```javascript
// 地図状態
const [state, setState] = useState({
  address: '東京タワー',
  lat: 35.6585805,
  lng: 139.7454329,
  zoom: 12,
})

// ピン管理
const [pins, setPins] = useState(() => loadPins())

// UI状態
const [pinMode, setPinMode] = useState(false)
const [isFullscreen, setIsFullscreen] = useState(false)
const [isDrawerOpen, setIsDrawerOpen] = useState(false)
const [isSettingsOpen, setIsSettingsOpen] = useState(false)

// 検索結果
const [placesResults, setPlacesResults] = useState([])
```

**利点**
- シンプルで学習コストが低い
- 小〜中規模アプリに最適
- パフォーマンスが良い

**制限**
- プロップドリリングが発生しやすい
- グローバル状態の共有が難しい

### Future: Context API

**Phase 3で導入予定**

```javascript
// src/context/AuthContext.jsx
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

```javascript
// src/context/DataContext.jsx
const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [pins, setPins] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Firestoreリアルタイム同期
  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(
      collection(firestore, 'users', user.uid, 'pins'),
      (snapshot) => {
        const pins = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPins(pins)
      }
    )

    return unsubscribe
  }, [user])

  return (
    <DataContext.Provider value={{ pins, setPins, wishlist, setWishlist }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
```

---

## API統合パターン

### Google Maps API

**初期化（index.html）**

```html
<script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&language=ja"
  async
  defer
></script>
```

**使用例（Map.jsx）**

```javascript
const { GoogleMap, Marker, withGoogleMap } = require('react-google-maps')

const MapComponent = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
    onClick={props.onMapClick}
  >
    {/* Center Marker */}
    <Marker position={{ lat: props.lat, lng: props.lng }} />

    {/* Pin Markers */}
    {props.pins.map((pin, index) => (
      <Marker
        key={pin.id}
        position={{ lat: pin.lat, lng: pin.lng }}
        label={`${index + 1}`}
      />
    ))}
  </GoogleMap>
))
```

### Places API

**Text Search**

```javascript
const service = new window.google.maps.places.PlacesService(
  document.createElement('div')
)

const request = {
  query: '渋谷 カフェ',
  language: 'ja',
}

service.textSearch(request, (results, status) => {
  if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    setPlacesResults(results)
  }
})
```

**Place Details (Phase 1)**

```javascript
const request = {
  placeId: 'ChIJ...',
  fields: [
    'name',
    'rating',
    'formatted_phone_number',
    'opening_hours',
    'photos',
    'reviews',
  ],
  language: 'ja',
}

service.getDetails(request, (place, status) => {
  if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    setPlaceDetails(place)
  }
})
```

### Firebase Firestore (Phase 3)

**データ追加**

```javascript
import { collection, addDoc } from 'firebase/firestore'

const addPin = async (pin) => {
  try {
    const docRef = await addDoc(
      collection(firestore, 'users', user.uid, 'pins'),
      {
        ...pin,
        createdAt: serverTimestamp(),
      }
    )
    console.log('Document written with ID: ', docRef.id)
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}
```

**リアルタイム購読**

```javascript
import { collection, onSnapshot } from 'firebase/firestore'

useEffect(() => {
  if (!user) return

  const unsubscribe = onSnapshot(
    collection(firestore, 'users', user.uid, 'pins'),
    (snapshot) => {
      const pins = []
      snapshot.forEach((doc) => {
        pins.push({ id: doc.id, ...doc.data() })
      })
      setPins(pins)
    },
    (error) => {
      console.error('Snapshot error:', error)
    }
  )

  return () => unsubscribe()
}, [user])
```

---

## パフォーマンス最適化

### 現在の最適化

1. **React.memo**
   ```javascript
   const PinList = React.memo(({ pins, onRemovePin, ... }) => {
     // Component logic
   })
   ```

2. **useCallback**
   ```javascript
   const handleMapClick = useCallback((event) => {
     // Event handler logic
   }, [pinMode, state.zoom])
   ```

3. **Lazy Loading**
   - 画像の遅延読み込み
   - コンポーネントの遅延インポート（Phase 1以降）

### Phase 1以降の最適化

1. **Code Splitting**
   ```javascript
   const PlaceDetail = React.lazy(() => import('./components/PlaceDetail/PlaceDetail'))
   const Wishlist = React.lazy(() => import('./components/Wishlist/Wishlist'))

   <Suspense fallback={<Loading />}>
     <PlaceDetail place={selectedPlace} />
   </Suspense>
   ```

2. **API レスポンスキャッシュ**
   ```javascript
   const placeDetailsCache = new Map()

   const fetchPlaceDetails = async (placeId) => {
     if (placeDetailsCache.has(placeId)) {
       return placeDetailsCache.get(placeId)
     }

     const details = await getPlaceDetails(placeId)
     placeDetailsCache.set(placeId, details)
     return details
   }
   ```

3. **Firestore クエリ最適化**
   ```javascript
   // インデックス作成
   // Firestore Consoleでインデックス設定

   // 必要なフィールドのみ取得
   const q = query(
     collection(firestore, 'users', userId, 'wishlist'),
     where('visited', '==', false),
     orderBy('priority', 'desc'),
     limit(20)
   )
   ```

4. **画像最適化**
   - WebP形式の使用
   - レスポンシブ画像
   - Progressive loading

---

## セキュリティ実装

### API キー保護

**環境変数の使用**

```javascript
// .env
REACT_APP_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key

// App.js
const API_KEY = process.env.REACT_APP_API_KEY
```

**Firebase Console での制限**
- HTTPリファラー制限（特定ドメインのみ許可）
- IPアドレス制限
- APIごとのクォータ設定

### Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ヘルパー関数
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isValidPin(pin) {
      return pin.keys().hasAll(['lat', 'lng', 'address'])
        && pin.lat is number
        && pin.lng is number
        && pin.address is string
        && pin.address.size() < 500;
    }

    // ユーザーデータ
    match /users/{userId} {
      // プロフィールは本人のみ読み書き可能
      allow read, write: if isSignedIn() && isOwner(userId);

      // Pins
      match /pins/{pinId} {
        allow read, write: if isSignedIn() && isOwner(userId);
        allow create: if isSignedIn()
                      && isOwner(userId)
                      && isValidPin(request.resource.data);
      }

      // Wishlist
      match /wishlist/{wishlistId} {
        allow read, write: if isSignedIn() && isOwner(userId);
        allow create: if isSignedIn()
                      && isOwner(userId)
                      && request.resource.data.memo.size() < 1000;
      }
    }
  }
}
```

### XSS対策

```javascript
// ユーザー入力のサニタイズ
import DOMPurify from 'dompurify'

const sanitizedMemo = DOMPurify.sanitize(userInput)
```

---

## テスト戦略

### Unit Testing

```javascript
// src/utils/__tests__/storage.test.js
import { savePins, loadPins } from '../storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('savePins should save pins to localStorage', () => {
    const pins = [
      { id: 1, lat: 35.6585805, lng: 139.7454329, address: '東京タワー' }
    ]
    savePins(pins)
    expect(localStorage.getItem('ggmap_pins')).toBeTruthy()
  })

  test('loadPins should load pins from localStorage', () => {
    const pins = [
      { id: 1, lat: 35.6585805, lng: 139.7454329, address: '東京タワー' }
    ]
    localStorage.setItem('ggmap_pins', JSON.stringify(pins))
    expect(loadPins()).toEqual(pins)
  })
})
```

### Integration Testing

```javascript
// src/components/__tests__/PinList.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import PinList from '../PinList/PinList'

describe('PinList Component', () => {
  test('renders pin list with pins', () => {
    const pins = [
      { id: 1, lat: 35.6585805, lng: 139.7454329, address: '東京タワー' }
    ]
    render(<PinList pins={pins} onRemovePin={jest.fn()} />)
    expect(screen.getByText(/東京タワー/i)).toBeInTheDocument()
  })

  test('calls onPinClick when pin is clicked', () => {
    const mockOnPinClick = jest.fn()
    const pins = [
      { id: 1, lat: 35.6585805, lng: 139.7454329, address: '東京タワー' }
    ]
    render(<PinList pins={pins} onPinClick={mockOnPinClick} />)
    fireEvent.click(screen.getByText(/東京タワー/i))
    expect(mockOnPinClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Testing (Phase 3以降)

```javascript
// cypress/e2e/pin_workflow.cy.js
describe('Pin Workflow', () => {
  it('should add a pin to the map', () => {
    cy.visit('/')
    cy.get('[data-testid="pin-mode-toggle"]').click()
    cy.get('.map-container').click(100, 100)
    cy.get('[data-testid="pin-list"]').should('contain', 'ピン 1')
  })

  it('should restore pin from history', () => {
    cy.visit('/')
    cy.get('[data-testid="settings-btn"]').click()
    cy.get('[data-testid="pin-history-tab"]').click()
    cy.get('[data-testid="restore-btn"]').first().click()
    cy.get('[data-testid="pin-list"]').should('have.length.gt', 0)
  })
})
```

---

## デプロイメント

### 現在: 開発環境

```bash
npm start  # http://localhost:3000
```

### Phase 3以降: Firebase Hosting

**ビルド & デプロイ**

```bash
# ビルド
npm run build

# Firebase初期化（初回のみ）
firebase init hosting

# デプロイ
firebase deploy --only hosting
```

**firebase.json**

```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### CI/CD (Phase 3以降)

**GitHub Actions ワークフロー**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          REACT_APP_API_KEY: ${{ secrets.REACT_APP_API_KEY }}
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## モニタリング & ロギング

### Firebase Analytics (Phase 3)

```javascript
import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase/config'

// カスタムイベントログ
const trackPinAdded = (pin) => {
  logEvent(analytics, 'pin_added', {
    lat: pin.lat,
    lng: pin.lng,
    address: pin.address,
  })
}

const trackSearchPerformed = (query, resultsCount) => {
  logEvent(analytics, 'search', {
    search_term: query,
    results_count: resultsCount,
  })
}
```

### Error Tracking

```javascript
// src/utils/errorTracking.js
export const logError = (error, context) => {
  console.error('Error:', error, 'Context:', context)

  // Phase 3: Firestoreにエラーログを保存
  if (firestore && user) {
    addDoc(collection(firestore, 'errors'), {
      message: error.message,
      stack: error.stack,
      context: context,
      userId: user.uid,
      timestamp: serverTimestamp(),
    })
  }
}
```

---

## ドキュメントバージョン管理

- **v1.0** (2025-11-19): 初版作成
- 各フェーズ完了時にアップデート予定

---

## 参考資料

- [React Documentation](https://react.dev/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Firebase Documentation](https://firebase.google.com/docs)
- [SASS Documentation](https://sass-lang.com/documentation)
