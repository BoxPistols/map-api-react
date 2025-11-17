import React from 'react'
import PropTypes from 'prop-types'
import Style from './PinList.module.scss'

const PinList = React.memo(({ pins, onRemovePin, onClearAllPins }) => {
  if (pins.length === 0) {
    return null
  }

  return (
    <section className={`section ${Style.pinsArea}`}>
      <div className={Style.container}>
        <div className={Style.header}>
          <h3 className={Style.title}>ピン一覧 ({pins.length})</h3>
          <button onClick={onClearAllPins} className={Style.clearButton}>
            全削除
          </button>
        </div>
        <ul className={Style.pinList}>
          {pins.map((pin, index) => (
            <li key={pin.id} className={Style.pinItem}>
              <div className={Style.pinInfo}>
                <div className={Style.pinAddress}>
                  <strong>ピン {index + 1}:</strong> {pin.address}
                </div>
                <div className={Style.pinCoordinates}>
                  緯度: {pin.lat.toFixed(6)}, 経度: {pin.lng.toFixed(6)}
                </div>
              </div>
              <button
                onClick={() => onRemovePin(pin.id)}
                className={Style.removeButton}
                aria-label={`ピン ${index + 1} を削除`}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
})

PinList.displayName = 'PinList'

PinList.propTypes = {
  pins: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRemovePin: PropTypes.func.isRequired,
  onClearAllPins: PropTypes.func.isRequired,
}

export default PinList
