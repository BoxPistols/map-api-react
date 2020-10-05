import React, {Component} from 'react';
import axios from 'axios';
import './App.sass';
//import Box from './components/Box/Box';
// import ActionGreet from './components/ActionGreet/ActionGreet'
import SearchForm from './components/SearchForm/SearchForm';
import GeoCodeResult from './components/GeoCodeResult/GeoCodeResult';
import Map from './components/Map/Map';

const API_KEY = process.env.REACT_APP_API_KEY;

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

class App extends Component {
  constructor (props) {
    super (props);
    this.state = {};
  }

  setErrorMessage (mesasge) {
    this.setState ({
      address: mesasge,
      lat: 0,
      lng: 0,
    });
  }

  handlePlaceSubmit (place) {
    axios
      .get (GEOCODE_ENDPOINT, {
        params: {
          address: place,
          key: API_KEY,
        },
      })
      .then (results => {
        console.log (results);
        const data = results.data;
        const result = results.data.results[0];
        switch (data.status) {
          case 'OK': {
            const location = result.geometry.location;
            this.setState ({
              address: result.formatted_address,
              lat: location.lat,
              lng: location.lng,
            });
            break;
          }
          case 'ZERO_RESULTS': {
            this.setErrorMessage ('見つかりませんでした、再度検索してください');
            break;
          }
          default: {
            this.setErrorMessage ('エラーが発生しました');
          }
        }
      })
      .catch (err => {
        this.setErrorMessage ('通信に失敗しました');
      });
  }
  render () {
    return (
      <div className="App">
        <section className="section">{/* <Box >*/}</section>
        {/*<ActionGreet />*/}
        <section className="section">
          <h1>緯度軽度検索</h1>
        </section>
        <section className="section">
          <SearchForm onSubmit={place => this.handlePlaceSubmit (place)} />
        </section>
        <section className="section">
          <GeoCodeResult
            address={this.state.address}
            lat={this.state.lat}
            lng={this.state.lng}
          />
        </section>
        <section className="section">
          <Map />
        </section>
      </div>
    );
  }
}
export default App;
