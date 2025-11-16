import React from 'react'
import PropTypes from 'prop-types'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import Style from './Map.module.scss'
import { GoogleApiWrapper } from 'google-maps-react'

const API = process.env.REACT_APP_API_KEY

const InnerMap = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={12}
    defaultCenter={props.position}
    center={props.position}
    onClick={props.onMapClick}
  >
    {/* 通常のマーカー（検索結果） */}
    {props.marker && props.marker.position && props.marker.position.lat && (
      <Marker {...props.marker} />
    )}
    {/* ピンモードで追加されたマーカー */}
    {props.pins &&
      props.pins.map((pin) => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          label={{
            text: String(props.pins.indexOf(pin) + 1),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          }}
        />
      ))}
  </GoogleMap>
))

const Map = ({ lat, lng, pins, onMapClick }) => {
  const position = { lat, lng }
  return (
    <InnerMap
      containerElement={<div />}
      mapElement={
        <div
          className={Style.map}
          style={{
            display: 'block',
            height: '100%',
            width: '100%',
          }}
        />
      }
      position={position}
      marker={{ position }}
      pins={pins}
      onMapClick={onMapClick}
    />
  )
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  pins: PropTypes.array,
  onMapClick: PropTypes.func,
}

Map.defaultProps = {
  lat: 35.6585805,
  lng: 139.7454329,
  pins: [],
}
export default GoogleApiWrapper({
  apiKey: API,
})(Map)
