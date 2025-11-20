// LocalStorage utility functions for pin and search history management

const STORAGE_KEYS = {
  PINS: 'ggmap_pins',
  SEARCH_HISTORY: 'ggmap_search_history',
  PIN_HISTORY: 'ggmap_pin_history',
}

const MAX_HISTORY_ITEMS = 50 // 履歴の最大保存件数

/**
 * ピンをlocalStorageに保存
 */
export const savePins = (pins) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins))
    return true
  } catch (error) {
    console.error('Failed to save pins to localStorage:', error)
    return false
  }
}

/**
 * ピンをlocalStorageから読み込み
 */
export const loadPins = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PINS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load pins from localStorage:', error)
    return []
  }
}

/**
 * ピン履歴を保存（時系列で保存）
 */
export const savePinHistory = (pin) => {
  try {
    const history = loadPinHistory()
    const newHistoryItem = {
      ...pin,
      timestamp: Date.now(),
    }

    // 新しい履歴を先頭に追加し、最大件数を超えたら古いものを削除
    const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(STORAGE_KEYS.PIN_HISTORY, JSON.stringify(updatedHistory))
    return true
  } catch (error) {
    console.error('Failed to save pin history to localStorage:', error)
    return false
  }
}

/**
 * ピン履歴を読み込み
 */
export const loadPinHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PIN_HISTORY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load pin history from localStorage:', error)
    return []
  }
}

/**
 * 検索履歴を保存
 */
export const saveSearchHistory = (searchQuery, searchType, results) => {
  try {
    const history = loadSearchHistory()
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
    return true
  } catch (error) {
    console.error('Failed to save search history to localStorage:', error)
    return false
  }
}

/**
 * 検索履歴を読み込み
 */
export const loadSearchHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load search history from localStorage:', error)
    return []
  }
}

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
