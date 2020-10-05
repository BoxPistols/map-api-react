// import React, { Component } from 'react'
// import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'

// const API = process.env.REACT_APP_API_KEY

// class GoogleMap extends Component {
//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         zoom={14}
//         center={{ lat: 35.681236, lng: 139.767125 }}
//         initialCenter={{ lat: 35.681236, lng: 139.767125 }}
//       >
//         <Marker
//           title={'現在地'}
//           position={{ lat: 35.681236, lng: 139.767125 }}
//         />
//       </Map>
//     )
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: API,
// })(GoogleMap)

import React from 'react'
import PropTypes from 'prop-types'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import Style from './Map.module.sass'
import { GoogleApiWrapper } from 'google-maps-react'

const API = process.env.REACT_APP_API_KEY

const InnerMap = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={12}
    defaultCenter={props.position}
    center={props.position}
  >
    <Marker {...props.marker} />
  </GoogleMap>
))

const Map = ({ lat, lng }) => {
  const position = { lat, lng }
  return (
    <InnerMap
      containerElement={<div />}
      mapElement={<div className={Style.map} />}
      position={{ lat, lng }}
      marker={{ position }}
    />
  )
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
}
Map.defaultProps = {
  lat: 35.6585805,
  lng: 139.7454329,
}
// export default Map
export default GoogleApiWrapper({
  apiKey: API,
})(Map)
