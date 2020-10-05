import React, { Component } from 'react'
import axios from 'axios'
import './App.sass'
//import Box from './components/Box/Box';
// import ActionGreet from './components/ActionGreet/ActionGreet'
import SearchForm from './components/SearchForm/SearchForm'
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult'

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handlePlaceSubmit(place) {
    axios
      .get(GEOCODE_ENDPOINT, {
        params: {
          address: place,
          key: 'AIzaSyDI2ZzkEd-EBZ3suudoCaprv_vy4nk8JFk',
        },
      })
      .then((results) => {
        console.log(results)
        const result = results.data.results[0]
        const location = result.geometry.location
        this.setState({
          address: result.formatted_address,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }
  render() {
    return (
      <div className="App">
        <section className="section">{/* <Box >*/}</section>
        {/*<ActionGreet />*/}
        <section className="section">
          <h1>緯度軽度検索</h1>
        </section>
        <section className="section">
          <SearchForm onSubmit={(place) => this.handlePlaceSubmit(place)} />
        </section>
        <section className="section">
          <GeoCodeResult address={this.state.address} />
        </section>
      </div>
    )
  }
}
export default App
