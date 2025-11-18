import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './RoutePanel.module.scss'

const RoutePanel = ({ pins, onCalculateRoute, isCalculating }) => {
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [optimizeRoute, setOptimizeRoute] = useState(true)

  const handleCalculate = () => {
    onCalculateRoute(travelMode, optimizeRoute)
  }

  const canCalculate = pins.length >= 2 && !isCalculating

  return (
    <div className={Style.routePanel}>
      <h3 className={Style.title}>ルート計算</h3>

      <div className={Style.controls}>
        <div className={Style.formGroup}>
          <label htmlFor="travelMode">移動手段</label>
          <select
            id="travelMode"
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className={Style.select}
          >
            <option value="DRIVING">車</option>
            <option value="WALKING">徒歩</option>
            <option value="BICYCLING">自転車</option>
            <option value="TRANSIT">公共交通機関</option>
          </select>
        </div>

        <div className={Style.formGroup}>
          <label className={Style.checkboxLabel}>
            <input
              type="checkbox"
              checked={optimizeRoute}
              onChange={(e) => setOptimizeRoute(e.target.checked)}
            />
            <span>ルートを最適化</span>
          </label>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className={Style.calculateButton}
        >
          {isCalculating ? '計算中...' : 'ルート計算'}
        </button>

        {pins.length < 2 && (
          <p className={Style.warning}>
            ルート計算には最低2つのピンが必要です
          </p>
        )}

        {pins.length > 25 && (
          <p className={Style.error}>
            ウェイポイントは最大25地点までです
          </p>
        )}
      </div>
    </div>
  )
}

RoutePanel.propTypes = {
  pins: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCalculateRoute: PropTypes.func.isRequired,
  isCalculating: PropTypes.bool,
}

RoutePanel.defaultProps = {
  isCalculating: false,
}

export default RoutePanel
