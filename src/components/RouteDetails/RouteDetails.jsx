import React from 'react'
import PropTypes from 'prop-types'
import Style from './RouteDetails.module.scss'

const RouteDetails = ({ routeData, onExport, onClear }) => {
  if (!routeData) {
    return null
  }

  const { totalDistance, totalDuration, legs, travelMode } = routeData

  const getTravelModeText = (mode) => {
    const modeMap = {
      DRIVING: '車',
      WALKING: '徒歩',
      BICYCLING: '自転車',
      TRANSIT: '公共交通機関',
    }
    return modeMap[mode] || mode
  }

  return (
    <section className={Style.routeDetails}>
      <div className={Style.header}>
        <h3 className={Style.title}>ルート情報</h3>
        <button onClick={onClear} className={Style.clearButton}>
          クリア
        </button>
      </div>

      <div className={Style.summary}>
        <div className={Style.summaryItem}>
          <span className={Style.label}>移動手段:</span>
          <span className={Style.value}>{getTravelModeText(travelMode)}</span>
        </div>
        <div className={Style.summaryItem}>
          <span className={Style.label}>総距離:</span>
          <span className={Style.value}>{totalDistance}</span>
        </div>
        <div className={Style.summaryItem}>
          <span className={Style.label}>所要時間:</span>
          <span className={Style.value}>{totalDuration}</span>
        </div>
      </div>

      <div className={Style.legsContainer}>
        <h4 className={Style.subtitle}>詳細ルート</h4>
        <div className={Style.legs}>
          {legs.map((leg, index) => (
            <div key={index} className={Style.leg}>
              <div className={Style.legHeader}>
                <span className={Style.legNumber}>{index + 1}</span>
                <div className={Style.legRoute}>
                  <span className={Style.legStart}>{leg.startAddress}</span>
                  <span className={Style.arrow}>→</span>
                  <span className={Style.legEnd}>{leg.endAddress}</span>
                </div>
              </div>
              <div className={Style.legInfo}>
                <span className={Style.legDistance}>距離: {leg.distance}</span>
                <span className={Style.legDuration}>時間: {leg.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.actions}>
        <button onClick={onExport} className={Style.exportButton}>
          ルート情報をエクスポート
        </button>
      </div>
    </section>
  )
}

RouteDetails.propTypes = {
  routeData: PropTypes.shape({
    totalDistance: PropTypes.string.isRequired,
    totalDuration: PropTypes.string.isRequired,
    travelMode: PropTypes.string.isRequired,
    legs: PropTypes.arrayOf(
      PropTypes.shape({
        startAddress: PropTypes.string.isRequired,
        endAddress: PropTypes.string.isRequired,
        distance: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  onExport: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
}

export default RouteDetails
