import React from 'react'
import PropTypes from 'prop-types'
import Style from './PlacesResults.module.scss'

const PlacesResults = React.memo(({ places, onAddPin, onClose }) => {
  if (!places || places.length === 0) {
    return null
  }

  const handleAddPin = (place) => {
    const pin = {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.formatted_address || place.name,
      name: place.name,
    }
    onAddPin(pin)
  }

  return (
    <section className={`section ${Style.placesArea}`}>
      <div className={Style.container}>
        <div className={Style.header}>
          <h3 className={Style.title}>検索結果 ({places.length}件)</h3>
          <button onClick={onClose} className={Style.closeButton}>
            閉じる
          </button>
        </div>
        <ul className={Style.placesList}>
          {places.map((place, index) => (
            <li key={place.place_id} className={Style.placeItem}>
              <div className={Style.placeInfo}>
                <div className={Style.placeName}>
                  <strong>{index + 1}. {place.name}</strong>
                  {place.rating && (
                    <span className={Style.rating}>
                      <span role="img" aria-label="評価">
                        ⭐
                      </span>{' '}
                      {place.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className={Style.placeAddress}>
                  {place.formatted_address || place.vicinity}
                </div>
                {place.types && place.types.length > 0 && (
                  <div className={Style.placeTypes}>
                    {place.types.slice(0, 3).map((type) => (
                      <span key={type} className={Style.typeTag}>
                        {translateType(type)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAddPin(place)}
                className={Style.addButton}
                title="このピンを追加"
              >
                ピン追加
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
})

// Google Placesのtypeを日本語に翻訳
const translateType = (type) => {
  const typeMap = {
    restaurant: 'レストラン',
    cafe: 'カフェ',
    bar: 'バー',
    store: '店舗',
    shopping_mall: 'ショッピングモール',
    convenience_store: 'コンビニ',
    supermarket: 'スーパー',
    park: '公園',
    museum: '博物館',
    library: '図書館',
    hospital: '病院',
    pharmacy: '薬局',
    bank: '銀行',
    atm: 'ATM',
    gas_station: 'ガソリンスタンド',
    parking: '駐車場',
    subway_station: '地下鉄駅',
    train_station: '駅',
    bus_station: 'バス停',
    airport: '空港',
    lodging: '宿泊施設',
    hotel: 'ホテル',
    gym: 'ジム',
    school: '学校',
    university: '大学',
    church: '教会',
    mosque: 'モスク',
    temple: '寺院',
    shrine: '神社',
    point_of_interest: '観光地',
  }
  return typeMap[type] || type
}

PlacesResults.displayName = 'PlacesResults'

PlacesResults.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      place_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      formatted_address: PropTypes.string,
      vicinity: PropTypes.string,
      geometry: PropTypes.shape({
        location: PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      rating: PropTypes.number,
      types: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onAddPin: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default PlacesResults
