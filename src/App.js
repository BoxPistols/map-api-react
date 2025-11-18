import React, { useState, useCallback } from 'react'
import axios from 'axios'
import './App.scss'
import SearchForm from './components/SearchForm/SearchForm'
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult'
import Map from './components/Map/Map'
import PinList from './components/PinList/PinList'
import PlacesResults from './components/PlacesResults/PlacesResults'
import RoutePanel from './components/RoutePanel/RoutePanel'
import RouteDetails from './components/RouteDetails/RouteDetails'

const API_KEY = process.env.REACT_APP_API_KEY
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

function App() {
  const [state, setState] = useState({})
  const [pins, setPins] = useState([])
  const [pinMode, setPinMode] = useState(false)
  const [placesResults, setPlacesResults] = useState([])
  const [routeData, setRouteData] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)

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

  const formatRouteData = useCallback((directionsResult, travelMode) => {
    const route = directionsResult.routes[0]

    let totalDistance = 0
    let totalDuration = 0

    const legs = route.legs.map((leg) => {
      totalDistance += leg.distance.value
      totalDuration += leg.duration.value

      return {
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        distance: leg.distance.text,
        duration: leg.duration.text,
      }
    })

    return {
      totalDistance: (totalDistance / 1000).toFixed(1) + ' km',
      totalDuration: Math.round(totalDuration / 60) + '分',
      travelMode,
      legs,
    }
  }, [])

  const calculateRoute = useCallback(
    (travelMode, optimizeRoute) => {
      if (pins.length < 2) {
        alert('ルート計算には最低2つのピンが必要です')
        return
      }

      if (pins.length > 25) {
        alert('ウェイポイントは最大25地点までです')
        return
      }

      setIsCalculatingRoute(true)

      if (window.google && window.google.maps) {
        const directionsService = new window.google.maps.DirectionsService()

        const origin = { lat: pins[0].lat, lng: pins[0].lng }
        const destination = {
          lat: pins[pins.length - 1].lat,
          lng: pins[pins.length - 1].lng,
        }

        const waypoints = pins.slice(1, -1).map((pin) => ({
          location: { lat: pin.lat, lng: pin.lng },
          stopover: true,
        }))

        const request = {
          origin,
          destination,
          waypoints,
          optimizeWaypoints: optimizeRoute,
          travelMode: window.google.maps.TravelMode[travelMode],
          language: 'ja',
        }

        directionsService.route(request, (result, status) => {
          setIsCalculatingRoute(false)

          if (status === window.google.maps.DirectionsStatus.OK) {
            const formattedData = formatRouteData(result, travelMode)
            setRouteData(formattedData)
            setDirectionsResponse(result)
          } else {
            console.error('Directions request failed:', status)
            alert('ルート計算に失敗しました: ' + status)
          }
        })
      } else {
        setIsCalculatingRoute(false)
        alert('Google Maps APIの読み込みに失敗しました')
      }
    },
    [pins, formatRouteData]
  )

  const handleExportRoute = useCallback(() => {
    if (!routeData) return

    const exportData = {
      route: {
        ...routeData,
        waypoints: pins.map((pin, index) => ({
          order: index + 1,
          address: pin.address,
          lat: pin.lat,
          lng: pin.lng,
        })),
      },
      exportedAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `route_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [routeData, pins])

  const handleClearRoute = useCallback(() => {
    setRouteData(null)
    setDirectionsResponse(null)
  }, [])

  return (
    <div className="App">
      <div className="control-area">
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
      <section className="section result-area">
        <GeoCodeResult
          address={state.address}
          lat={state.lat}
          lng={state.lng}
        />
      </section>
      <PlacesResults
        places={placesResults}
        onAddPin={handleAddPinFromPlace}
        onClose={handleClosePlacesResults}
      />
      <PinList
        pins={pins}
        onRemovePin={removePin}
        onClearAllPins={clearAllPins}
      />
      {pins.length >= 2 && (
        <RoutePanel
          pins={pins}
          onCalculateRoute={calculateRoute}
          isCalculating={isCalculatingRoute}
        />
      )}
      {routeData && (
        <RouteDetails
          routeData={routeData}
          onExport={handleExportRoute}
          onClear={handleClearRoute}
        />
      )}
      <section className="section last">
        <Map
          lat={state.lat}
          lng={state.lng}
          pins={pins}
          onMapClick={handleMapClick}
          directionsResponse={directionsResponse}
        />
      </section>
    </div>
  )
}

export default App
