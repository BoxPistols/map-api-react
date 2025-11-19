import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Style from './RouteDetails.module.scss'
import { getStepIcon } from '../../services/directions'

const RouteDetails = ({ routes, onClose }) => {
  const [selectedRoute, setSelectedRoute] = useState(0)

  if (!routes || routes.length === 0) {
    return null
  }

  const currentRoute = routes[selectedRoute]

  return (
    <div className={Style.container}>
      {/* ヘッダー */}
      <div className={Style.header}>
        <h3 className={Style.title}>経路詳細</h3>
        <button onClick={onClose} className={Style.closeBtn}>
          ×
        </button>
      </div>

      {/* ルート選択タブ */}
      {routes.length > 1 && (
        <div className={Style.tabs}>
          {routes.map((route, index) => (
            <button
              key={index}
              onClick={() => setSelectedRoute(index)}
              className={`${Style.tab} ${selectedRoute === index ? Style.active : ''}`}
            >
              <span className={Style.tabIcon}>{route.modeIcon}</span>
              <span className={Style.tabLabel}>{route.modeLabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* 経路サマリー */}
      <div className={Style.summary}>
        <div className={Style.summaryItem}>
          <div className={Style.summaryIcon}>⏱️</div>
          <div className={Style.summaryContent}>
            <div className={Style.summaryLabel}>所要時間</div>
            <div className={Style.summaryValue}>{currentRoute.duration.text}</div>
          </div>
        </div>

        <div className={Style.summaryItem}>
          <div className={Style.summaryIcon}>📏</div>
          <div className={Style.summaryContent}>
            <div className={Style.summaryLabel}>距離</div>
            <div className={Style.summaryValue}>{currentRoute.distance.text}</div>
          </div>
        </div>

        {currentRoute.fare && (
          <div className={Style.summaryItem}>
            <div className={Style.summaryIcon}>💴</div>
            <div className={Style.summaryContent}>
              <div className={Style.summaryLabel}>運賃</div>
              <div className={Style.summaryValue}>{currentRoute.fare.text}</div>
            </div>
          </div>
        )}
      </div>

      {/* 詳細ステップ */}
      <div className={Style.steps}>
        <h4 className={Style.stepsTitle}>経路の詳細</h4>
        {currentRoute.steps.map((step, index) => (
          <div key={index} className={Style.step}>
            <div className={Style.stepIcon}>{getStepIcon(step)}</div>
            <div className={Style.stepContent}>
              <div
                className={Style.stepInstruction}
                dangerouslySetInnerHTML={{ __html: step.instruction }}
              />
              <div className={Style.stepMeta}>
                {step.distance} · {step.duration}
              </div>

              {/* 乗車情報 */}
              {step.transitDetails && (
                <div className={Style.transitInfo}>
                  <div className={Style.transitLine}>
                    <span className={Style.lineLabel}>{step.transitDetails.line}</span>
                    {step.transitDetails.headsign && (
                      <span className={Style.headsign}>
                        {step.transitDetails.headsign}方面
                      </span>
                    )}
                  </div>
                  <div className={Style.transitStops}>
                    <div className={Style.stopInfo}>
                      <span className={Style.stopLabel}>乗車:</span>
                      <span className={Style.stopName}>
                        {step.transitDetails.departureStop}
                      </span>
                      <span className={Style.stopTime}>
                        {step.transitDetails.departureTime}
                      </span>
                    </div>
                    <div className={Style.stopsCount}>
                      {step.transitDetails.numStops}駅
                    </div>
                    <div className={Style.stopInfo}>
                      <span className={Style.stopLabel}>降車:</span>
                      <span className={Style.stopName}>
                        {step.transitDetails.arrivalStop}
                      </span>
                      <span className={Style.stopTime}>
                        {step.transitDetails.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className={Style.footer}>
        <div className={Style.totalInfo}>
          <span>合計:</span>
          <span className={Style.totalTime}>{currentRoute.duration.text}</span>
          <span className={Style.totalDistance}>{currentRoute.distance.text}</span>
          {currentRoute.fare && (
            <span className={Style.totalFare}>{currentRoute.fare.text}</span>
          )}
        </div>
      </div>
    </div>
  )
}

RouteDetails.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      mode: PropTypes.string.isRequired,
      modeLabel: PropTypes.string.isRequired,
      modeIcon: PropTypes.string.isRequired,
      distance: PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      }).isRequired,
      duration: PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      }).isRequired,
      fare: PropTypes.shape({
        text: PropTypes.string,
        value: PropTypes.number,
        currency: PropTypes.string,
      }),
      steps: PropTypes.arrayOf(
        PropTypes.shape({
          instruction: PropTypes.string.isRequired,
          distance: PropTypes.string.isRequired,
          duration: PropTypes.string.isRequired,
          travelMode: PropTypes.string.isRequired,
          transitDetails: PropTypes.object,
        })
      ).isRequired,
    })
  ),
  onClose: PropTypes.func.isRequired,
}

export default RouteDetails
