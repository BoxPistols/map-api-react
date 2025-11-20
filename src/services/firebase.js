// Firebase サービス層
// Firestore とのやり取りを管理

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase'

/**
 * Googleサインイン
 * @returns {Promise<Object>} ユーザー情報
 */
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    }
  } catch (error) {
    console.error('Google sign-in error:', error)
    throw error
  }
}

/**
 * サインアウト
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * 認証状態の監視
 * @param {Function} callback - ユーザー情報が変更された時に呼ばれるコールバック
 * @returns {Function} unsubscribe関数
 */
export const onAuthStateChange = (callback) => {
  if (!isFirebaseConfigured) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
    } else {
      callback(null)
    }
  })
}

/**
 * ピンをFirestoreに保存
 * @param {string} userId - ユーザーID
 * @param {Array} pins - ピンの配列
 * @returns {Promise<void>}
 */
export const savePinsToFirestore = async (userId, pins) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const pinsRef = doc(db, 'users', userId, 'data', 'pins')
    await setDoc(pinsRef, {
      pins: pins,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Save pins error:', error)
    throw error
  }
}

/**
 * Firestoreからピンを取得
 * @param {string} userId - ユーザーID
 * @returns {Promise<Array>} ピンの配列
 */
export const loadPinsFromFirestore = async (userId) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const pinsRef = doc(db, 'users', userId, 'data', 'pins')
    const docSnap = await getDoc(pinsRef)

    if (docSnap.exists()) {
      return docSnap.data().pins || []
    }
    return []
  } catch (error) {
    console.error('Load pins error:', error)
    throw error
  }
}

/**
 * ピン履歴をFirestoreに保存
 * @param {string} userId - ユーザーID
 * @param {Object} pin - ピンオブジェクト
 * @returns {Promise<void>}
 */
export const savePinHistoryToFirestore = async (userId, pin) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const historyRef = doc(db, 'users', userId, 'pinHistory', pin.id)
    await setDoc(historyRef, {
      ...pin,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Save pin history error:', error)
    throw error
  }
}

/**
 * Firestoreからピン履歴を取得
 * @param {string} userId - ユーザーID
 * @param {number} maxResults - 取得する最大件数
 * @returns {Promise<Array>} ピン履歴の配列
 */
export const loadPinHistoryFromFirestore = async (userId, maxResults = 50) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const historyRef = collection(db, 'users', userId, 'pinHistory')
    const q = query(historyRef, orderBy('createdAt', 'desc'), limit(maxResults))
    const querySnapshot = await getDocs(q)

    const history = []
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return history
  } catch (error) {
    console.error('Load pin history error:', error)
    throw error
  }
}

/**
 * 検索履歴をFirestoreに保存
 * @param {string} userId - ユーザーID
 * @param {string} query - 検索クエリ
 * @param {string} type - 検索タイプ
 * @param {Array} results - 検索結果
 * @returns {Promise<void>}
 */
export const saveSearchHistoryToFirestore = async (userId, query, type, results) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const historyRef = doc(collection(db, 'users', userId, 'searchHistory'))
    await setDoc(historyRef, {
      query: query,
      type: type,
      resultsCount: results.length,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Save search history error:', error)
    throw error
  }
}

/**
 * Firestoreから検索履歴を取得
 * @param {string} userId - ユーザーID
 * @param {number} maxResults - 取得する最大件数
 * @returns {Promise<Array>} 検索履歴の配列
 */
export const loadSearchHistoryFromFirestore = async (userId, maxResults = 50) => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured')
  }

  try {
    const historyRef = collection(db, 'users', userId, 'searchHistory')
    const q = query(historyRef, orderBy('createdAt', 'desc'), limit(maxResults))
    const querySnapshot = await getDocs(q)

    const history = []
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return history
  } catch (error) {
    console.error('Load search history error:', error)
    throw error
  }
}

/**
 * Firebaseが設定されているかチェック
 * @returns {boolean}
 */
export const checkFirebaseConfigured = () => {
  return isFirebaseConfigured
}
