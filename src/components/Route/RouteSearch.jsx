import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './RouteSearch.module.scss'

const RouteSearch = ({ onSearch, onClose, currentLocation, destination, isLoading }) => {
  const [origin, setOrigin] = useState(currentLocation || '')
  const [dest, setDest] = useState(destination || '')
  const [selectedModes, setSelectedModes] = useState(['TRANSIT'])

  const travelModes = [
    { value: 'TRANSIT', label: '公共交通', icon: '交' },
    { value: 'DRIVING', label: '車', icon: '車' },
    { value: 'WALKING', label: '徒歩', icon: '歩' },
    { value: 'BICYCLING', label: '自転車', icon: '輪' },
  ]

  const handleModeToggle = (mode) => {
    setSelectedModes(prev => {
      if (prev.includes(mode)) {
        return prev.filter(m => m !== mode)
      } else {
        return [...prev, mode]
      }
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!origin || !dest) {
      alert('出発地と目的地を入力してください')
      return
    }
    if (selectedModes.length === 0) {
      alert('移動手段を選択してください')
      return
    }
    onSearch(origin, dest, selectedModes)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`
          setOrigin(location)
        },
        (error) => {
          console.error('Current location error:', error)
          alert('現在地の取得に失敗しました')
        }
      )
    } else {
      alert('このブラウザは位置情報に対応していません')
    }
  }

  return (
    <div className={Style.container}>
      <div className={Style.header}>
        <h3 className={Style.title}>経路検索</h3>
        <button onClick={onClose} className={Style.closeBtn}>
          ×
        </button>
      </div>

      <form onSubmit={handleSearch} className={Style.form}>
        {/* 出発地 */}
        <div className={Style.inputGroup}>
          <label htmlFor="origin" className={Style.label}>
            出発地
          </label>
          <div className={Style.inputWithButton}>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="住所または緯度,経度"
              className={Style.input}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className={Style.currentLocationBtn}
              title="現在地を使用"
              disabled={isLoading}
            >
              現在地
            </button>
          </div>
        </div>

        {/* 目的地 */}
        <div className={Style.inputGroup}>
          <label htmlFor="destination" className={Style.label}>
            目的地
          </label>
          <input
            id="destination"
            type="text"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="住所または緯度,経度"
            className={Style.input}
            disabled={isLoading}
          />
        </div>

        {/* 移動手段選択 */}
        <div className={Style.modesGroup}>
          <label className={Style.label}>移動手段</label>
          <div className={Style.modeButtons}>
            {travelModes.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() => handleModeToggle(mode.value)}
                className={`${Style.modeBtn} ${
                  selectedModes.includes(mode.value) ? Style.active : ''
                }`}
                disabled={isLoading}
              >
                <span className={Style.modeIcon}>{mode.icon}</span>
                <span className={Style.modeLabel}>{mode.label}</span>
              </button>
            ))}
          </div>
          {selectedModes.includes('TRANSIT') && (
            <p className={Style.transitNote}>
              ※ 公共交通機関は地域によってデータが利用できない場合があります
            </p>
          )}
        </div>

        {/* 検索ボタン */}
        <button
          type="submit"
          className={Style.searchBtn}
          disabled={isLoading || !origin || !dest || selectedModes.length === 0}
        >
          {isLoading ? '検索中...' : '経路を検索'}
        </button>
      </form>
    </div>
  )
}

RouteSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  currentLocation: PropTypes.string,
  destination: PropTypes.string,
  isLoading: PropTypes.bool,
}

export default RouteSearch
