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
        </section>
      </div>
      <section className="section result-area">
        <GeoCodeResult
          address={state.address}
          lat={state.lat}
          lng={state.lng}
        />
      </section>
      <section className="section last">
        <Map lat={state.lat} lng={state.lng} />
      </section>
    </div>
  )
}

export default App
