import React from 'react'
import PropTypes from 'prop-types'
import Style from './GeoCodeResult.module.scss'

function GeoCodeResult({ address, lat, lng }) {
  return (
    <div className={Style.result}>
      <p>住所：{address}</p>
      <p className={Style.result}>
        緯度：{lat} / 経度：{lng}
      </p>
    </div>
  )
}

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
