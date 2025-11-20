// Storage utility functions for pin and search history management
// Supports both localStorage and Firebase Firestore

import {
  savePinsToFirestore,
  loadPinsFromFirestore,
  savePinHistoryToFirestore,
  saveSearchHistoryToFirestore,
  checkFirebaseConfigured,
} from '../services/firebase'

const STORAGE_KEYS = {
  PINS: 'ggmap_pins',
  SEARCH_HISTORY: 'ggmap_search_history',
  PIN_HISTORY: 'ggmap_pin_history',
  USER_ID: 'ggmap_user_id',
}

const MAX_HISTORY_ITEMS = 50 // 履歴の最大保存件数

// 現在ログイン中のユーザーID
let currentUserId = null

/**
 * ユーザーIDを設定
 */
export const setCurrentUserId = (userId) => {
  currentUserId = userId
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId)
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER_ID)
  }
}

/**
 * ユーザーIDを取得
 */
export const getCurrentUserId = () => {
  if (!currentUserId) {
    currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID)
  }
  return currentUserId
}

/**
 * ピンを保存 (localStorage + Firebase)
 */
export const savePins = async (pins) => {
  try {
    // localStorageに保存
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins))

    // Firebaseにも保存（ログイン中の場合）
    const userId = getCurrentUserId()
    if (userId && checkFirebaseConfigured()) {
      try {
        await savePinsToFirestore(userId, pins)
      } catch (firebaseError) {
        console.warn('Firebase save failed, but localStorage succeeded:', firebaseError)
      }
    }

    return true
  } catch (error) {
    console.error('Failed to save pins:', error)
    return false
  }
}

/**
 * ピンを読み込み (Firebase優先、フォールバックでlocalStorage)
 */
export const loadPins = async () => {
  try {
    const userId = getCurrentUserId()

    // Firebaseから読み込み（ログイン中の場合）
    if (userId && checkFirebaseConfigured()) {
      try {
        const firebasePins = await loadPinsFromFirestore(userId)
        if (firebasePins && firebasePins.length > 0) {
          // FirebaseのデータをlocalStorageにも同期
          localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(firebasePins))
          return firebasePins
        }
      } catch (firebaseError) {
        console.warn('Firebase load failed, falling back to localStorage:', firebaseError)
      }
    }

    // localStorageから読み込み
    const data = localStorage.getItem(STORAGE_KEYS.PINS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load pins:', error)
    return []
  }
}

/**
 * ピン履歴を保存（時系列で保存）(localStorage + Firebase)
 */
export const savePinHistory = async (pin) => {
  try {
    const history = loadPinHistorySync()
    const newHistoryItem = {
      ...pin,
      timestamp: Date.now(),
    }

    // 新しい履歴を先頭に追加し、最大件数を超えたら古いものを削除
    const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(STORAGE_KEYS.PIN_HISTORY, JSON.stringify(updatedHistory))

    // Firebaseにも保存（ログイン中の場合）
    const userId = getCurrentUserId()
    if (userId && checkFirebaseConfigured()) {
      try {
        await savePinHistoryToFirestore(userId, newHistoryItem)
      } catch (firebaseError) {
        console.warn('Firebase pin history save failed:', firebaseError)
      }
    }

    return true
  } catch (error) {
    console.error('Failed to save pin history:', error)
    return false
  }
}

/**
 * ピン履歴を読み込み (同期版 - localStorage のみ)
 */
export const loadPinHistorySync = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PIN_HISTORY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load pin history from localStorage:', error)
    return []
  }
}

/**
 * ピン履歴を読み込み (互換性のため - 同期版へのエイリアス)
 */
export const loadPinHistory = loadPinHistorySync

/**
 * 検索履歴を保存 (localStorage + Firebase)
 */
export const saveSearchHistory = async (searchQuery, searchType, results) => {
  try {
    const history = loadSearchHistorySync()
    const newHistoryItem = {
      query: searchQuery,
      type: searchType,
      results: results.length,
      timestamp: Date.now(),
      // 最初の結果のみ保存（全体を保存すると大きくなりすぎる）
      firstResult: results.length > 0 ? {
        name: results[0].name,
        address: results[0].formatted_address || results[0].vicinity,
        lat: typeof results[0].geometry.location.lat === 'function' ? results[0].geometry.location.lat() : results[0].geometry.location.lat,
        lng: typeof results[0].geometry.location.lng === 'function' ? results[0].geometry.location.lng() : results[0].geometry.location.lng,
      } : null,
    }

    // 新しい履歴を先頭に追加し、最大件数を超えたら古いものを削除
    const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory))

    // Firebaseにも保存（ログイン中の場合）
    const userId = getCurrentUserId()
    if (userId && checkFirebaseConfigured()) {
      try {
        await saveSearchHistoryToFirestore(userId, searchQuery, searchType, results)
      } catch (firebaseError) {
        console.warn('Firebase search history save failed:', firebaseError)
      }
    }

    return true
  } catch (error) {
    console.error('Failed to save search history:', error)
    return false
  }
}

/**
 * 検索履歴を読み込み (同期版 - localStorage のみ)
 */
export const loadSearchHistorySync = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load search history from localStorage:', error)
    return []
  }
}

/**
 * 検索履歴を読み込み (互換性のため - 同期版へのエイリアス)
 */
export const loadSearchHistory = loadSearchHistorySync

/**
 * 全てのデータをJSON形式でエクスポート
 */
export const exportAllData = () => {
  return {
    pins: loadPins(),
    pinHistory: loadPinHistory(),
    searchHistory: loadSearchHistory(),
    exportedAt: new Date().toISOString(),
  }
}

/**
 * JSONデータをインポート
 */
export const importData = (data) => {
  try {
    if (data.pins && Array.isArray(data.pins)) {
      localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(data.pins))
    }
    if (data.pinHistory && Array.isArray(data.pinHistory)) {
      localStorage.setItem(STORAGE_KEYS.PIN_HISTORY, JSON.stringify(data.pinHistory))
    }
    if (data.searchHistory && Array.isArray(data.searchHistory)) {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(data.searchHistory))
    }
    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}

/**
 * 全てのデータをクリア
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PINS)
    localStorage.removeItem(STORAGE_KEYS.PIN_HISTORY)
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY)
    return true
  } catch (error) {
    console.error('Failed to clear data:', error)
    return false
  }
}
