import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import './App.scss'
import SearchForm from './components/SearchForm/SearchForm'
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult'
import Map from './components/Map/Map'
import PinList from './components/PinList/PinList'
import PlacesResults from './components/PlacesResults/PlacesResults'

const API_KEY = process.env.REACT_APP_API_KEY
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

function App() {
  const [state, setState] = useState({
    address: '東京タワー',
    lat: 35.6585805,
    lng: 139.7454329,
  })
  const [pins, setPins] = useState([])
  const [pinMode, setPinMode] = useState(false)
  const [placesResults, setPlacesResults] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const setErrorMessage = (message) => {
    setState({
      address: message,
      lat: 0,
      lng: 0,
    })
  }

  const handlePlaceSubmit = (place, searchType = 'geocode') => {
    if (searchType === 'places') {
      // Places API Text Search（自然言語検索）
      // google.maps.places.PlacesServiceを使用（CORS回避）
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )

        const request = {
          query: place,
          language: 'ja',
        }

        service.textSearch(request, (results, status) => {
          console.log('Places API Results:', results, status)
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            setPlacesResults(results)
            setIsDrawerOpen(true) // モバイルでドロワーを自動的に開く
            // 最初の結果を地図の中心に設定
            const firstResult = results[0]
            setState({
              address: firstResult.formatted_address || firstResult.name,
              lat: firstResult.geometry.location.lat(),
              lng: firstResult.geometry.location.lng(),
            })
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPlacesResults([])
            setErrorMessage('見つかりませんでした、再度検索してください')
          } else {
            setPlacesResults([])
            setErrorMessage('エラーが発生しました')
          }
        })
      } else {
        setPlacesResults([])
        setErrorMessage('Places APIの読み込みに失敗しました')
      }
    } else {
      // Geocoding API（通常の住所検索）
      axios
        .get(GEOCODE_ENDPOINT, {
          params: {
            address: place,
            key: API_KEY,
          },
        })
        .then((results) => {
          console.log(results)
          const data = results.data
          const result = results.data.results[0]
          switch (data.status) {
            case 'OK': {
              const location = result.geometry.location
              setState({
                address: result.formatted_address,
                lat: location.lat,
                lng: location.lng,
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
        })
        .catch((err) => {
          setErrorMessage('通信に失敗しました')
        })
    }
  }

  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      // 逆ジオコーディングで住所を取得
      axios
        .get(GEOCODE_ENDPOINT, {
          params: {
            latlng: `${lat},${lng}`,
            key: API_KEY,
          },
        })
        .then((results) => {
          const data = results.data
          const address =
            data.status === 'OK' && data.results[0]
              ? data.results[0].formatted_address
              : `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`

          if (pinMode) {
            // ピンモード：新しいピンを追加
            const newPin = {
              id: Date.now(),
              lat,
              lng,
              address,
            }
            setPins((prevPins) => [...prevPins, newPin])
          } else {
            // 通常モード：stateを更新
            setState({
              address,
              lat,
              lng,
            })
          }
        })
        .catch((err) => {
          // エラーの場合も座標のみ表示
          const address = `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`
          if (pinMode) {
            const newPin = {
              id: Date.now(),
              lat,
              lng,
              address,
            }
            setPins((prevPins) => [...prevPins, newPin])
          } else {
            setState({
              address,
              lat,
              lng,
            })
          }
        })
    },
    [pinMode]
  )

  const removePin = useCallback((id) => {
    setPins((prevPins) => prevPins.filter((pin) => pin.id !== id))
  }, [])

  const clearAllPins = useCallback(() => {
    setPins([])
  }, [])

  const togglePinMode = useCallback(() => {
    setPinMode((prev) => !prev)
  }, [])

  const handleAddPinFromPlace = useCallback((pin) => {
    const newPin = {
      id: Date.now(),
      lat: pin.lat,
      lng: pin.lng,
      address: pin.address,
    }
    setPins((prevPins) => [...prevPins, newPin])
  }, [])

  const handleClosePlacesResults = useCallback(() => {
    setPlacesResults([])
  }, [])

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev)
  }, [])

  // Fキーで全画面表示切り替え、ESCで全画面解除
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setIsFullscreen((prev) => !prev)
      } else if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  return (
    <div className="App">
      <div className={`control-area ${isFullscreen ? 'hidden' : ''}`}>
        <section className="section">
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
        </section>
        <section className="section form-area">
          <SearchForm onSubmit={handlePlaceSubmit} />
          <button
            onClick={togglePinMode}
            className={`pin-mode-btn ${pinMode ? 'active' : ''}`}
          >
            {pinMode ? 'ピンモード: ON' : 'ピンモード: OFF'}
          </button>
        </section>
      </div>
      <section className={`section result-area ${isFullscreen ? 'hidden' : ''}`}>
        <GeoCodeResult
          address={state.address}
          lat={state.lat}
          lng={state.lng}
        />
      </section>
      {/* モバイル用ドロワートグルボタン */}
      {placesResults.length > 0 && !isFullscreen && (
        <button className="drawer-toggle-btn" onClick={toggleDrawer}>
          {isDrawerOpen ? '閉じる' : `検索結果 (${placesResults.length})`}
        </button>
      )}
      <div className={isFullscreen ? 'hidden' : ''}>
        <PlacesResults
          places={placesResults}
          onAddPin={handleAddPinFromPlace}
          onClose={handleClosePlacesResults}
          isDrawerOpen={isDrawerOpen}
        />
        <PinList
          pins={pins}
          onRemovePin={removePin}
          onClearAllPins={clearAllPins}
        />
      </div>
      <section className={`section last map-container ${isFullscreen ? 'fullscreen' : ''}`}>
        <Map
          lat={state.lat}
          lng={state.lng}
          pins={pins}
          onMapClick={handleMapClick}
        />
      </section>
    </div>
  )
}

export default App
