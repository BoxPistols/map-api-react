import React from 'react'
import PropTypes from 'prop-types'
import Style from './PlaceActions.module.scss'

const PlaceActions = ({ place, onAddPin, onSaveToWishlist }) => {
  const handleAddPin = () => {
    if (onAddPin && place.geometry?.location) {
      const lat = typeof place.geometry.location.lat === 'function'
        ? place.geometry.location.lat()
        : place.geometry.location.lat

      const lng = typeof place.geometry.location.lng === 'function'
        ? place.geometry.location.lng()
        : place.geometry.location.lng

      onAddPin({
        lat,
        lng,
        address: place.formatted_address || place.name,
      })
    }
  }

  const handleSaveToWishlist = () => {
    if (onSaveToWishlist) {
      onSaveToWishlist(place)
    }
  }

  const handleGetDirections = () => {
    if (place.url) {
      window.open(place.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={Style.container}>
      {onSaveToWishlist && (
        <button
          onClick={handleSaveToWishlist}
          className={`${Style.btn} ${Style.saveBtn}`}
          title="行きたいところリストに保存"
        >
          💾 保存
        </button>
      )}

      {onAddPin && place.geometry?.location && (
        <button
          onClick={handleAddPin}
          className={`${Style.btn} ${Style.pinBtn}`}
          title="ピンを追加"
        >
          📍 ピン追加
        </button>
      )}

      {place.url && (
        <button
          onClick={handleGetDirections}
          className={`${Style.btn} ${Style.directionsBtn}`}
          title="経路を調べる"
        >
          🚗 経路
        </button>
      )}
    </div>
  )
}

PlaceActions.propTypes = {
  place: PropTypes.shape({
    place_id: PropTypes.string,
    name: PropTypes.string.isRequired,
    formatted_address: PropTypes.string,
    url: PropTypes.string,
    geometry: PropTypes.shape({
      location: PropTypes.object,
    }),
  }).isRequired,
  onAddPin: PropTypes.func,
  onSaveToWishlist: PropTypes.func,
}

export default PlaceActions
