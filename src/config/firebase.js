// Firebase設定
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase設定オブジェクト
// 本番環境では環境変数から読み込む
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// Firebaseアプリの初期化
let app
let auth
let db
let googleProvider

// Firebase設定がすべて揃っている場合のみ初期化
// 環境変数が未設定の場合、undefined または文字列 'undefined' になる可能性がある
const isFirebaseConfigured = Object.values(firebaseConfig).every(
  value => value && value !== 'undefined' && typeof value === 'string' && value.trim() !== ''
)

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
} else {
  console.warn(
    'Firebase configuration is incomplete. Firebase features will be disabled.'
  )
}

export { auth, db, googleProvider, isFirebaseConfigured }
