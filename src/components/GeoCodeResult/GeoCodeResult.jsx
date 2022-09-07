import React from 'react'
import PropTypes from 'prop-types'

// functional Component
const GeoCodeResult = ({ address, lat, lng }) => (
  <div>
    <span>住所：{address}</span>
    <br />
    <div style={{ color: 'gray' }}>
      <span>緯度：{lat}</span> / <span>経度：{lng}</span>
    </div>
  </div>
)

GeoCodeResult.propTypes = {
  address: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
}

GeoCodeResult.defaultProps = {
  address: '',
  lat: 0,
  lng: 0,
}

export default GeoCodeResult
