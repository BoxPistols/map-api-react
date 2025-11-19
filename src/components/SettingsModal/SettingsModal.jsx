import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Style from './SettingsModal.module.scss'
import {
  loadPinHistory,
  loadSearchHistory,
  clearAllData,
} from '../../utils/storage'

const SettingsModal = ({ isOpen, onClose, onRestorePin }) => {
  const [activeTab, setActiveTab] = useState('pins') // 'pins' or 'searches'
  const [pinHistory, setPinHistory] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [groupBy, setGroupBy] = useState('date') // 'date' or 'none'

  // 履歴データを読み込み
  useEffect(() => {
    if (isOpen) {
      setPinHistory(loadPinHistory())
      setSearchHistory(loadSearchHistory())
    }
  }, [isOpen])

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // 日付でグループ化
  const groupByDate = (items) => {
    const groups = {}
    items.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
    })
    return groups
  }

  // ピン履歴から削除
  const handleDeletePinHistory = (timestamp) => {
    const updated = pinHistory.filter((item) => item.timestamp !== timestamp)
    setPinHistory(updated)
    saveHistoryToStorage('pins', updated)
  }

  // 検索履歴から削除
  const handleDeleteSearchHistory = (timestamp) => {
    const updated = searchHistory.filter((item) => item.timestamp !== timestamp)
    setSearchHistory(updated)
    saveHistoryToStorage('searches', updated)
  }

  // ピン履歴から復元（現在のピンリストに追加）
  const handleRestorePin = (historyItem) => {
    onRestorePin({
      lat: historyItem.lat,
      lng: historyItem.lng,
      address: historyItem.address,
    })
    alert('ピンを復元しました！')
  }

  // 履歴をlocalStorageに保存
  const saveHistoryToStorage = (type, data) => {
    if (type === 'pins') {
      localStorage.setItem('ggmap_pin_history', JSON.stringify(data))
    } else {
      localStorage.setItem('ggmap_search_history', JSON.stringify(data))
    }
  }

  // 全履歴クリア
  const handleClearAllHistory = () => {
    if (
      window.confirm(
        'すべての履歴データを削除しますか？\n（現在のピンは削除されません）'
      )
    ) {
      setPinHistory([])
      setSearchHistory([])
      localStorage.removeItem('ggmap_pin_history')
      localStorage.removeItem('ggmap_search_history')
      alert('履歴をクリアしました')
    }
  }

  // 全データクリア（ピン含む）
  const handleClearAllData = () => {
    if (
      window.confirm(
        '⚠️ すべてのデータ（現在のピン、履歴）を削除しますか？\nこの操作は取り消せません！'
      )
    ) {
      clearAllData()
      setPinHistory([])
      setSearchHistory([])
      alert('すべてのデータをクリアしました。ページをリロードしてください。')
      onClose()
    }
  }

  if (!isOpen) return null

  const renderPinHistory = () => {
    if (pinHistory.length === 0) {
      return <div className={Style.emptyState}>ピン履歴はありません</div>
    }

    if (groupBy === 'date') {
      const groups = groupByDate(pinHistory)
      return Object.entries(groups).map(([date, items]) => (
        <div key={date} className={Style.historyGroup}>
          <h4 className={Style.groupTitle}>{date}</h4>
          {items.map((item) => (
            <div key={item.timestamp} className={Style.historyItem}>
              <div className={Style.historyInfo}>
                <div className={Style.historyAddress}>{item.address}</div>
                <div className={Style.historyCoords}>
                  {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                </div>
                <div className={Style.historyTime}>
                  {new Date(item.timestamp).toLocaleTimeString('ja-JP')}
                </div>
              </div>
              <div className={Style.historyActions}>
                <button
                  onClick={() => handleRestorePin(item)}
                  className={Style.restoreBtn}
                  title="このピンを復元"
                >
                  復元
                </button>
                <button
                  onClick={() => handleDeletePinHistory(item.timestamp)}
                  className={Style.deleteBtn}
                  title="履歴から削除"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      ))
    }

    return pinHistory.map((item) => (
      <div key={item.timestamp} className={Style.historyItem}>
        <div className={Style.historyInfo}>
          <div className={Style.historyAddress}>{item.address}</div>
          <div className={Style.historyCoords}>
            {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
          </div>
          <div className={Style.historyTime}>
            {new Date(item.timestamp).toLocaleString('ja-JP')}
          </div>
        </div>
        <div className={Style.historyActions}>
          <button
            onClick={() => handleRestorePin(item)}
            className={Style.restoreBtn}
          >
            復元
          </button>
          <button
            onClick={() => handleDeletePinHistory(item.timestamp)}
            className={Style.deleteBtn}
          >
            削除
          </button>
        </div>
      </div>
    ))
  }

  const renderSearchHistory = () => {
    if (searchHistory.length === 0) {
      return <div className={Style.emptyState}>検索履歴はありません</div>
    }

    if (groupBy === 'date') {
      const groups = groupByDate(searchHistory)
      return Object.entries(groups).map(([date, items]) => (
        <div key={date} className={Style.historyGroup}>
          <h4 className={Style.groupTitle}>{date}</h4>
          {items.map((item) => (
            <div key={item.timestamp} className={Style.historyItem}>
              <div className={Style.historyInfo}>
                <div className={Style.searchQuery}>
                  <strong>検索:</strong> {item.query}
                </div>
                <div className={Style.searchMeta}>
                  タイプ: {item.type === 'places' ? '場所検索' : '住所検索'} |
                  結果: {item.results}件
                </div>
                {item.firstResult && (
                  <div className={Style.searchResult}>
                    → {item.firstResult.name || item.firstResult.address}
                  </div>
                )}
                <div className={Style.historyTime}>
                  {new Date(item.timestamp).toLocaleTimeString('ja-JP')}
                </div>
              </div>
              <div className={Style.historyActions}>
                <button
                  onClick={() => handleDeleteSearchHistory(item.timestamp)}
                  className={Style.deleteBtn}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      ))
    }

    return searchHistory.map((item) => (
      <div key={item.timestamp} className={Style.historyItem}>
        <div className={Style.historyInfo}>
          <div className={Style.searchQuery}>
            <strong>検索:</strong> {item.query}
          </div>
          <div className={Style.searchMeta}>
            タイプ: {item.type === 'places' ? '場所検索' : '住所検索'} | 結果:{' '}
            {item.results}件
          </div>
          {item.firstResult && (
            <div className={Style.searchResult}>
              → {item.firstResult.name || item.firstResult.address}
            </div>
          )}
          <div className={Style.historyTime}>
            {new Date(item.timestamp).toLocaleString('ja-JP')}
          </div>
        </div>
        <div className={Style.historyActions}>
          <button
            onClick={() => handleDeleteSearchHistory(item.timestamp)}
            className={Style.deleteBtn}
          >
            削除
          </button>
        </div>
      </div>
    ))
  }

  return (
    <div className={Style.modalOverlay} onClick={onClose}>
      <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={Style.modalHeader}>
          <h2>設定と履歴</h2>
          <button onClick={onClose} className={Style.closeBtn}>
            ×
          </button>
        </div>

        <div className={Style.tabs}>
          <button
            className={`${Style.tab} ${activeTab === 'pins' ? Style.active : ''}`}
            onClick={() => setActiveTab('pins')}
          >
            ピン履歴 ({pinHistory.length})
          </button>
          <button
            className={`${Style.tab} ${activeTab === 'searches' ? Style.active : ''}`}
            onClick={() => setActiveTab('searches')}
          >
            検索履歴 ({searchHistory.length})
          </button>
        </div>

        <div className={Style.controls}>
          <div className={Style.groupControl}>
            <label>
              <input
                type="checkbox"
                checked={groupBy === 'date'}
                onChange={(e) => setGroupBy(e.target.checked ? 'date' : 'none')}
              />
              日付でグループ化
            </label>
          </div>
          <div className={Style.actions}>
            <button onClick={handleClearAllHistory} className={Style.clearHistoryBtn}>
              履歴をクリア
            </button>
            <button onClick={handleClearAllData} className={Style.dangerBtn}>
              全データ削除
            </button>
          </div>
        </div>

        <div className={Style.historyList}>
          {activeTab === 'pins' ? renderPinHistory() : renderSearchHistory()}
        </div>

        <div className={Style.modalFooter}>
          <div className={Style.info}>
            最大50件の履歴を保存しています
          </div>
        </div>
      </div>
    </div>
  )
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRestorePin: PropTypes.func.isRequired,
}

export default SettingsModal
