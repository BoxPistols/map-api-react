import React from 'react'
import PropTypes from 'prop-types'
import Style from './MockMap.module.scss'

const CENTER_OFFSET = 0.5 // Normalize click position around map center (0.0-1.0)
const CLICK_RANGE_FACTOR = 0.08 // Simulated viewport span in degrees for mock map clicks

const MockMap = ({ lat, lng, zoom, pins, onMapClick }) => {
  const emitMapClick = (relativeX, relativeY) => {
    const clickedLat = Number(
      (lat + (CENTER_OFFSET - relativeY) * CLICK_RANGE_FACTOR).toFixed(6)
    )
    const clickedLng = Number(
      (lng + (relativeX - CENTER_OFFSET) * CLICK_RANGE_FACTOR).toFixed(6)
    )

    onMapClick?.({
      latLng: {
        lat: () => clickedLat,
        lng: () => clickedLng,
      },
    })
  }

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - rect.left) / rect.width
    const relativeY = (event.clientY - rect.top) / rect.height
    emitMapClick(relativeX, relativeY)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      emitMapClick(CENTER_OFFSET, CENTER_OFFSET)
    }
  }

  return (
    <div
      className={Style.mockMap}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={Style.badge}>TEST MAP (Mock)</div>
      <div className={Style.centerInfo}>
        <div>中心座標: {lat.toFixed(6)}, {lng.toFixed(6)}</div>
        <div>ズーム: {zoom}</div>
        <div>クリックで逆ジオコーディングをモック実行</div>
      </div>
      <div className={Style.pinInfo}>ピン数: {pins.length}</div>
    </div>
  )
}

MockMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  pins: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      lat: PropTypes.number,
      lng: PropTypes.number,
      address: PropTypes.string,
    })
  ),
  onMapClick: PropTypes.func,
}

MockMap.defaultProps = {
  pins: [],
}

export default MockMap
