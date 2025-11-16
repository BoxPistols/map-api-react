import React, { useState } from 'react'
import axios from 'axios'
import './App.scss'
import SearchForm from './components/SearchForm/SearchForm'
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult'
import Map from './components/Map/Map'

const API_KEY = process.env.REACT_APP_API_KEY
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

function App() {
  const [state, setState] = useState({})
  const [pins, setPins] = useState([])
  const [pinMode, setPinMode] = useState(false)

  const setErrorMessage = (message) => {
    setState({
      address: message,
      lat: 0,
      lng: 0,
    })
  }

  const handlePlaceSubmit = (place) => {
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

  const handleMapClick = (event) => {
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
          setPins([...pins, newPin])
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
          setPins([...pins, newPin])
        } else {
          setState({
            address,
            lat,
            lng,
          })
        }
      })
  }

  const removePin = (id) => {
    setPins(pins.filter((pin) => pin.id !== id))
  }

  const clearAllPins = () => {
    setPins([])
  }

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
            onClick={() => setPinMode(!pinMode)}
            className={pinMode ? 'pin-mode-btn active' : 'pin-mode-btn'}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              cursor: 'pointer',
              backgroundColor: pinMode ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
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
      {pins.length > 0 && (
        <section className="section pins-area">
          <div
            style={{
              backgroundColor: '#123',
              color: '#f9f9f9dd',
              padding: '0.8rem 1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <h3 style={{ margin: 0 }}>ピン一覧 ({pins.length})</h3>
              <button
                onClick={clearAllPins}
                style={{
                  padding: '4px 12px',
                  cursor: 'pointer',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                }}
              >
                全削除
              </button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {pins.map((pin, index) => (
                <li
                  key={pin.id}
                  style={{
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: '#234',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                      <strong>ピン {index + 1}:</strong> {pin.address}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#ccc' }}>
                      緯度: {pin.lat.toFixed(6)}, 経度: {pin.lng.toFixed(6)}
                    </div>
                  </div>
                  <button
                    onClick={() => removePin(pin.id)}
                    style={{
                      padding: '4px 8px',
                      cursor: 'pointer',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      marginLeft: '10px',
                    }}
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="section last">
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
