import React, { useState, useCallback, useEffect } from 'react'
import './App.scss'
import SearchForm from './components/SearchForm/SearchForm'
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult'
import Map from './components/Map/Map'
import MockMap from './components/Map/MockMap'
import PinList from './components/PinList/PinList'
import PlacesResults from './components/PlacesResults/PlacesResults'
import SettingsModal from './components/SettingsModal/SettingsModal'
import PlaceDetail from './components/PlaceDetail/PlaceDetail'
import RouteSearch from './components/Route/RouteSearch'
import RouteDetails from './components/Route/RouteDetails'
import {
  savePins,
  loadPins,
  savePinHistory,
  saveSearchHistory,
  loadTestMode,
  saveTestMode,
} from './utils/storage'
import { getMultipleDirections, compareRoutes } from './services/directions'
import {
  extractLatLng,
  geocodeAddress,
  reverseGeocode,
  searchPlacesByText,
  fetchPlaceDetails,
} from './services/mapApiGateway'
const PIN_CLICK_ZOOM_LEVEL = 18 // ピンクリック時のズームレベル

// 通知表示時間（ミリ秒）
const SEARCH_NOTIFICATION_DURATION = 2700
const PIN_NOTIFICATION_DURATION = 2200
const FADE_OUT_ANIMATION_DURATION = 300

function App() {
  const [state, setState] = useState({
    address: '東京タワー',
    lat: 35.6585805,
    lng: 139.7454329,
    zoom: 12,
  })
  const [pins, setPins] = useState(() => {
    // 初期化時にlocalStorageからピンを読み込み
    return loadPins()
  })
  const [pinMode, setPinMode] = useState(false)
  const [placesResults, setPlacesResults] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isResultsCollapsed, setIsResultsCollapsed] = useState(false)
  const [isPinDrawerOpen, setIsPinDrawerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [placeDetails, setPlaceDetails] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isRouteSearchOpen, setIsRouteSearchOpen] = useState(false)
  const [routeResults, setRouteResults] = useState(null)
  const [isRouteDetailsOpen, setIsRouteDetailsOpen] = useState(false)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [isControlAreaOpen, setIsControlAreaOpen] = useState(true) // モバイル用control-areaトグル
  const [searchNotification, setSearchNotification] = useState(null) // 検索結果通知
  const [pinNotification, setPinNotification] = useState(null) // ピン追加通知
  const [pendingPinLocation, setPendingPinLocation] = useState(null) // 確認待ちピン位置
  const [isTestMode, setIsTestMode] = useState(() => loadTestMode())

  const setErrorMessage = (message) => {
    setState({
      address: message,
      lat: 0,
      lng: 0,
      zoom: 12,
    })
  }

  const showTimedNotification = useCallback((setNotification, payload, duration) => {
    setNotification({ ...payload, fadeOut: false })
    setTimeout(() => {
      setNotification((prev) => {
        if (!prev) return null
        return { ...prev, fadeOut: true }
      })
      setTimeout(() => setNotification(null), FADE_OUT_ANIMATION_DURATION)
    }, duration)
  }, [])

  const handlePlaceSubmit = async (place, searchType = 'geocode') => {
    if (searchType === 'places') {
      try {
        const results = await searchPlacesByText(place, isTestMode)
        if (results && results.length > 0) {
          setPlacesResults(results)
          setIsDrawerOpen(true) // モバイルでドロワーを自動的に開く
          // モバイルで通知を表示（フェードアウトクラス追加後に削除）
          showTimedNotification(
            setSearchNotification,
            { text: `${results.length}件の検索結果` },
            SEARCH_NOTIFICATION_DURATION
          )
          // 検索履歴を保存
          saveSearchHistory(place, 'places', results)
          // 最初の結果を地図の中心に設定
          const firstResult = results[0]
          const location = extractLatLng(firstResult.geometry.location)
          setState({
            address: firstResult.formatted_address || firstResult.name,
            lat: location.lat,
            lng: location.lng,
            zoom: 16,
          })
        } else {
          setPlacesResults([])
          setErrorMessage('見つかりませんでした、再度検索してください')
        }
      } catch (error) {
        setPlacesResults([])
        setErrorMessage('エラーが発生しました')
      }
    } else {
      // Geocoding API（通常の住所検索）
      try {
        const data = await geocodeAddress(place, isTestMode)
        const result = data.results[0]
        switch (data.status) {
          case 'OK': {
            const location = extractLatLng(result.geometry.location)
            setState({
              address: result.formatted_address,
              lat: location.lat,
              lng: location.lng,
              zoom: 16,
            })
            setPlacesResults([]) // 通常検索時は結果をクリア
            break
          }
          case 'ZERO_RESULTS': {
            setErrorMessage('見つかりませんでした、再度検索してください')
            break
          }
          default: {
            setErrorMessage('エラーが発生しました')
          }
        }
      } catch (error) {
        setErrorMessage('通信に失敗しました')
      }
    }
  }

  // バイブレーションフィードバック
  const vibrate = useCallback((pattern = [50]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  // ピン追加ヘルパー関数
  const addPin = useCallback((pinDetails) => {
    const newPin = {
      id: crypto.randomUUID(), // より安全な一意ID
      ...pinDetails,
    }
    setPins((prevPins) => [...prevPins, newPin])
    savePinHistory(newPin)
    // バイブレーションとフィードバック
    vibrate([50, 30, 50])
    const shortAddress = newPin.address.length > 20
      ? `${newPin.address.substring(0, 20)}...`
      : newPin.address
    showTimedNotification(
      setPinNotification,
      { text: `ピン ${shortAddress} を追加` },
      PIN_NOTIFICATION_DURATION
    )
    return newPin
  }, [vibrate, showTimedNotification])

  // モバイル判定（window.innerWidthに依存するためuseCallbackを使わない）
  const isMobile = () => {
    return window.innerWidth <= 768 || 'ontouchstart' in window
  }

  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      // 逆ジオコーディングで住所を取得
      reverseGeocode(lat, lng, isTestMode)
        .then((results) => {
          const data = results
          const address =
            data.status === 'OK' && data.results[0]
              ? data.results[0].formatted_address
              : `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`

          if (pinMode) {
            // ピンモード
            if (isMobile()) {
              // モバイル：確認ダイアログを表示
              vibrate([30])
              setPendingPinLocation({ lat, lng, address })
            } else {
              // デスクトップ：直接追加
              addPin({ lat, lng, address })
            }
          } else {
            // 通常モード：stateを更新
            setState({
              address,
              lat,
              lng,
              zoom: state.zoom,
            })
          }
        })
        .catch((err) => {
          // エラーの場合も座標のみ表示
          const address = `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`
          if (pinMode) {
            if (isMobile()) {
              vibrate([30])
              setPendingPinLocation({ lat, lng, address })
            } else {
              addPin({ lat, lng, address })
            }
          } else {
            setState({
              address,
              lat,
              lng,
              zoom: state.zoom,
            })
          }
        })
    },
    [pinMode, state.zoom, addPin, vibrate, isTestMode]
  )

  // 確認ダイアログでピン追加を確定
  const confirmAddPin = useCallback(() => {
    if (pendingPinLocation) {
      addPin(pendingPinLocation)
      setPendingPinLocation(null)
    }
  }, [pendingPinLocation, addPin])

  // 確認ダイアログをキャンセル
  const cancelAddPin = useCallback(() => {
    setPendingPinLocation(null)
  }, [])

  const removePin = useCallback((id) => {
    setPins((prevPins) => prevPins.filter((pin) => pin.id !== id))
  }, [])

  const clearAllPins = useCallback(() => {
    setPins([])
  }, [])

  const handleImportPins = useCallback((importedPins) => {
    setPins(importedPins)
  }, [])

  const handleRestorePinFromHistory = useCallback((pin) => {
    // 履歴から復元する場合は新しい履歴を作らない
    const newPin = {
      id: crypto.randomUUID(),
      lat: pin.lat,
      lng: pin.lng,
      address: pin.address,
    }
    setPins((prevPins) => [...prevPins, newPin])
  }, [])

  // 詳細情報を取得して表示
  const handleShowPlaceDetails = useCallback(async (placeId) => {
    if (!placeId) return

    setIsLoadingDetails(true)
    setIsDetailPanelOpen(true)

    try {
      const details = await fetchPlaceDetails(placeId, isTestMode)
      setPlaceDetails(details)
    } catch (error) {
      console.error('Place details fetch error:', error)
      alert('詳細情報の取得に失敗しました')
      setIsDetailPanelOpen(false)
    } finally {
      setIsLoadingDetails(false)
    }
  }, [isTestMode])

  // 詳細パネルを閉じる
  const handleClosePlaceDetails = useCallback(() => {
    setIsDetailPanelOpen(false)
    setPlaceDetails(null)
  }, [])

  // 詳細パネルからピンを追加
  const handleAddPinFromDetails = useCallback((pinData) => {
    const newPin = {
      id: Date.now(),
      lat: pinData.lat,
      lng: pinData.lng,
      address: pinData.address,
    }
    setPins((prevPins) => [...prevPins, newPin])
    savePinHistory(newPin)
    alert('ピンを追加しました！')
  }, [])

  const togglePinMode = useCallback(() => {
    setPinMode((prev) => !prev)
  }, [])

  const handleAddPinFromPlace = useCallback((pin) => {
    addPin({
      lat: pin.lat,
      lng: pin.lng,
      address: pin.address,
    })
  }, [addPin])

  const handleFocusPlace = useCallback((pin) => {
    setState({
      address: pin.address,
      lat: pin.lat,
      lng: pin.lng,
      zoom: 16,
    })
  }, [])

  const handlePinClick = useCallback((pin) => {
    setState({
      address: pin.address,
      lat: pin.lat,
      lng: pin.lng,
      zoom: PIN_CLICK_ZOOM_LEVEL,
    })
  }, [])

  const handleClosePlacesResults = useCallback(() => {
    setPlacesResults([])
  }, [])

  // 経路検索
  const handleRouteSearch = useCallback(async (origin, destination, modes) => {
    setIsLoadingRoute(true)

    try {
      const results = await getMultipleDirections(origin, destination, modes)
      const comparison = compareRoutes(results)

      if (comparison.length === 0) {
        // すべての経路検索が失敗した場合
        let errorMessage = '経路が見つかりませんでした。\n\n'

        // TRANSITモードが含まれていた場合
        if (modes.includes('TRANSIT')) {
          errorMessage += '※ 公共交通機関の経路検索は、以下の理由で失敗する場合があります：\n'
          errorMessage += '• この地域で公共交通データが利用できない\n'
          errorMessage += '• Google Maps Platform で Transit 層が有効になっていない\n'
          errorMessage += '• 出発地または目的地が公共交通機関の近くにない\n\n'
          errorMessage += '他の移動手段（車、徒歩、自転車）をお試しください。'
        } else {
          errorMessage += '出発地と目的地を確認してください。'
        }

        alert(errorMessage)
        return
      }

      // 一部のモードが失敗した場合の通知
      const failedModes = modes.filter(mode => !results[mode])
      if (failedModes.length > 0 && failedModes.length < modes.length) {
        const failedModeNames = failedModes.map(mode => {
          const labels = { TRANSIT: '公共交通機関', DRIVING: '車', WALKING: '徒歩', BICYCLING: '自転車' }
          return labels[mode] || mode
        }).join('、')

        let warningMessage = `${failedModeNames}の経路が見つかりませんでした。\n`

        if (failedModes.includes('TRANSIT')) {
          warningMessage += '\n※ 公共交通機関は、この地域でデータが利用できない可能性があります。'
        }

        console.warn(warningMessage)
      }

      setRouteResults(comparison)
      setIsRouteDetailsOpen(true)
      setIsRouteSearchOpen(false)
    } catch (error) {
      console.error('Route search error:', error)
      alert(`経路検索に失敗しました\n\n${error.message || 'エラーが発生しました'}`)
    } finally {
      setIsLoadingRoute(false)
    }
  }, [])

  // 経路検索パネルを開く
  const handleOpenRouteSearch = useCallback((destination = '') => {
    setIsRouteSearchOpen(true)
  }, [])

  // 経路検索パネルを閉じる
  const handleCloseRouteSearch = useCallback(() => {
    setIsRouteSearchOpen(false)
  }, [])

  // 経路詳細を閉じる
  const handleCloseRouteDetails = useCallback(() => {
    setIsRouteDetailsOpen(false)
    setRouteResults(null)
  }, [])

  // 検索結果エリアをクリア（初期状態に戻す）
  const handleClearResult = useCallback(() => {
    setState({
      address: '東京タワー',
      lat: 35.6585805,
      lng: 139.7454329,
      zoom: 12,
    })
  }, [])

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])
  const toggleResultsCollapse = useCallback(() => {
    setIsResultsCollapsed((prev) => !prev)
  }, [])
  const togglePinDrawer = useCallback(() => {
    setIsPinDrawerOpen((prev) => !prev)
  }, [])
  const toggleControlArea = useCallback(() => {
    setIsControlAreaOpen((prev) => !prev)
  }, [])

  // ピンが変更されたらlocalStorageに保存
  useEffect(() => {
    savePins(pins)
  }, [pins])

  useEffect(() => {
    saveTestMode(isTestMode)
  }, [isTestMode])

  const toggleTestMode = useCallback(() => {
    setIsTestMode((prev) => !prev)
  }, [])

  return (
    <div className="App">
      {/* モバイル用control-areaトグルボタン */}
      <button
        className="control-area-toggle-btn"
        onClick={toggleControlArea}
        aria-label={isControlAreaOpen ? '検索エリアを閉じる' : '検索エリアを開く'}
      >
        {isControlAreaOpen ? '▲' : '▼'}
      </button>
      <div className={`control-area ${!isControlAreaOpen ? 'collapsed' : ''}`}>
        <section className="section header-section">
          <a href="/">
            <h1>
              <ruby>
                <span className="logo">GGMap</span>
                <rp>(</rp>
                <rt>ジージーマップ</rt>
                <rp>)</rp>
              </ruby>
              <span className="text">緯度経度検索</span>
            </h1>
          </a>
          <div className="header-actions">
            <span className={`mode-badge ${isTestMode ? 'test' : 'live'}`}>
              {isTestMode ? 'TEST' : 'LIVE'}
            </span>
            <button
              onClick={handleOpenRouteSearch}
              className="route-btn"
              title="経路検索"
            >
              経路検索
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="settings-btn"
              title="設定と履歴"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
              </svg>
            </button>
          </div>
        </section>
        <section className="section form-area">
          <SearchForm onSubmit={handlePlaceSubmit} />
          {isTestMode && (
            <span className="mock-mode-note">
              テストモード中: Geocoding / Places / Details / 逆ジオコーディングはモック応答
            </span>
          )}
          <button
            onClick={togglePinMode}
            className={`pin-mode-btn ${pinMode ? 'active' : ''}`}
          >
            {pinMode ? 'ピンモード: ON' : 'ピンモード: OFF'}
          </button>
        </section>
      </div>
      <section className="section result-area">
        <GeoCodeResult
          address={state.address}
          lat={state.lat}
          lng={state.lng}
        />
        <button
          className="result-clear-btn"
          onClick={handleClearResult}
          title="検索結果をクリア"
          aria-label="検索結果をクリア"
        >
          ×
        </button>
      </section>
      {/* モバイル用検索結果通知 */}
      {searchNotification && (
        <div className={`search-notification ${searchNotification.fadeOut ? 'fade-out' : ''}`} role="alert">
          <span className="notification-icon">📍</span>
          {searchNotification.text}
          <span className="notification-hint">↓ ボタンをタップ</span>
        </div>
      )}
      {/* モバイル用ドロワートグルボタン */}
      {placesResults.length > 0 && (
        <button
          className={`drawer-toggle-btn ${searchNotification ? 'pulse' : ''}`}
          onClick={toggleDrawer}
        >
          {isDrawerOpen ? '閉じる' : `検索結果 (${placesResults.length})`}
        </button>
      )}
      {/* モバイル用ピンドロワートグルボタン - ピンモードONの時のみ表示 */}
      {pinMode && (
        <button
          className={`pin-drawer-toggle-btn ${pinNotification ? 'pulse' : ''}`}
          onClick={togglePinDrawer}
        >
          {isPinDrawerOpen ? '閉じる' : `ピン (${pins.length})`}
        </button>
      )}
      {/* モバイル用検索結果ドロワー */}
      {placesResults.length > 0 && (
        <div className={`mobile-places-drawer ${isDrawerOpen ? 'drawer-open' : ''}`}>
          <PlacesResults
            places={placesResults}
            onAddPin={handleAddPinFromPlace}
            onClose={handleClosePlacesResults}
            onCloseDrawer={toggleDrawer}
            isDrawerOpen={isDrawerOpen}
            onFocusPlace={handleFocusPlace}
            isCollapsed={isResultsCollapsed}
            onToggleCollapse={toggleResultsCollapse}
            onShowDetails={handleShowPlaceDetails}
          />
        </div>
      )}
      <div
        className={`content-layout holy ${
          placesResults.length === 0 ? 'left-closed' : isResultsCollapsed ? 'left-collapsed' : ''
        } ${!pinMode ? 'right-closed' : ''}`}
      >
        {isResultsCollapsed && placesResults.length > 0 && (
          <button
            type="button"
            className="sidebar-left-tab"
            aria-label="検索結果を開く"
            title="検索結果を開く"
            onClick={toggleResultsCollapse}
          >
            ▶
          </button>
        )}
        {/* 左サイドバー: 検索結果 */}
        <aside className="sidebar-left" aria-hidden={placesResults.length === 0}>
          <div className="sidebar-inner" role="region" aria-label="検索結果">
            <PlacesResults
              places={placesResults}
              onAddPin={handleAddPinFromPlace}
              onClose={handleClosePlacesResults}
              isDrawerOpen={isDrawerOpen}
              onFocusPlace={handleFocusPlace}
              isCollapsed={isResultsCollapsed}
              onToggleCollapse={toggleResultsCollapse}
              onShowDetails={handleShowPlaceDetails}
            />
          </div>
        </aside>

        {/* 中央: マップ */}
        <main className="main-center">
          <section className="section last map-container">
            {isTestMode ? (
              <MockMap
                lat={state.lat}
                lng={state.lng}
                zoom={state.zoom}
                pins={pins}
                onMapClick={handleMapClick}
              />
            ) : (
              <Map
                lat={state.lat}
                lng={state.lng}
                zoom={state.zoom}
                pins={pins}
                onMapClick={handleMapClick}
              />
            )}
          </section>
        </main>

        {/* 右サイドバー: ピン一覧 */}
        <aside className="sidebar-right" aria-hidden={!pinMode}>
          <div className="sidebar-inner" role="complementary" aria-label="ピン一覧">
            <PinList
              pins={pins}
              onRemovePin={removePin}
              onClearAllPins={clearAllPins}
              onPinClick={handlePinClick}
              onImportPins={handleImportPins}
              isDrawerOpen={isPinDrawerOpen}
            />
          </div>
        </aside>
      </div>

      {/* モバイル用ピン一覧ドロワー */}
      {pinMode && (
        <div className={`mobile-pins-drawer ${isPinDrawerOpen ? 'drawer-open' : ''}`}>
          <PinList
            pins={pins}
            onRemovePin={removePin}
            onClearAllPins={clearAllPins}
            onPinClick={handlePinClick}
            onImportPins={handleImportPins}
            isDrawerOpen={isPinDrawerOpen}
            onCloseDrawer={togglePinDrawer}
          />
        </div>
      )}

      {/* 設定モーダル */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRestorePin={handleRestorePinFromHistory}
        isTestMode={isTestMode}
        onToggleTestMode={toggleTestMode}
      />

      {/* 詳細情報モーダル */}
      {isDetailPanelOpen && (
        <div className="modal-overlay" onClick={handleClosePlaceDetails}>
          <div className="modal-content place-detail-modal" onClick={(e) => e.stopPropagation()}>
            {isLoadingDetails ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>詳細情報を読み込んでいます...</p>
              </div>
            ) : (
              placeDetails && (
                <PlaceDetail
                  place={placeDetails}
                  onClose={handleClosePlaceDetails}
                  onAddPin={handleAddPinFromDetails}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* 経路検索モーダル */}
      {isRouteSearchOpen && (
        <div className="modal-overlay" onClick={handleCloseRouteSearch}>
          <div className="modal-content route-search-modal" onClick={(e) => e.stopPropagation()}>
            <RouteSearch
              onSearch={handleRouteSearch}
              onClose={handleCloseRouteSearch}
              isLoading={isLoadingRoute}
              currentLocation={state.address}
            />
          </div>
        </div>
      )}

      {/* 経路詳細モーダル */}
      {isRouteDetailsOpen && routeResults && (
        <div className="modal-overlay" onClick={handleCloseRouteDetails}>
          <div className="modal-content route-details-modal" onClick={(e) => e.stopPropagation()}>
            <RouteDetails
              routes={routeResults}
              onClose={handleCloseRouteDetails}
            />
          </div>
        </div>
      )}

      {/* モバイル用ピン追加確認ダイアログ */}
      {pendingPinLocation && (
        <div className="pin-confirm-dialog" role="dialog" aria-modal="true">
          <div className="pin-confirm-content">
            <div className="pin-confirm-icon">📍</div>
            <p className="pin-confirm-text">ここにピンを追加しますか？</p>
            <p className="pin-confirm-address">{pendingPinLocation.address}</p>
            <div className="pin-confirm-actions">
              <button className="pin-confirm-cancel" onClick={cancelAddPin}>
                キャンセル
              </button>
              <button className="pin-confirm-ok" onClick={confirmAddPin}>
                追加する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ピン追加通知 */}
      {pinNotification && (
        <div className={`pin-notification ${pinNotification.fadeOut ? 'fade-out' : ''}`} role="alert">
          <span className="notification-icon">✓</span>
          {pinNotification.text}
        </div>
      )}
    </div>
  )
}

export default App
