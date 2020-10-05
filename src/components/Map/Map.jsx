import React, { Component } from 'react'
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'

const API = process.env.REACT_APP_API_KEY

class GoogleMap extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        center={{ lat: 35.681236, lng: 139.767125 }}
        initialCenter={{ lat: 35.681236, lng: 139.767125 }}
      >
        <Marker
          title={'現在地'}
          position={{ lat: 35.681236, lng: 139.767125 }}
        />
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: API,
})(GoogleMap)
