import React from 'react'
import PropTypes from 'prop-types'

// functional Component
const GeoCodeResult = ({ address, lat, lng }) => (
  <div>
    <ul>
      <li>住所：{address}</li>
      <li>緯度：{lat}</li>
      <li>軽度：{lng}</li>
    </ul>
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
