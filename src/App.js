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
      <section className="section">
        <h1>GG Map 緯度軽度検索</h1>
      </section>
      <section className="section">
        <SearchForm onSubmit={handlePlaceSubmit} />
      </section>
      <section className="section">
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
