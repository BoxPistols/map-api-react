import React from 'react'
import PropTypes from 'prop-types'
import Style from './PlacesResults.module.scss'

// SVGアイコンコンポーネント
const LocationIcon = () => (
  <svg className={Style.locationIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

// 住所から国名と郵便番号を除外する関数
const formatAddress = (address) => {
  if (!address) return ''

  // "日本、" を除去
  let formatted = address.replace(/^日本、?\s*/g, '')

  // 郵便番号（〒XXX-XXXX）を除去
  formatted = formatted.replace(/〒\d{3}-?\d{4}\s*/g, '')

  return formatted.trim()
}

const PlacesResults = React.memo(({ places, onAddPin, onClose, isDrawerOpen, onFocusPlace, isCollapsed, onToggleCollapse, onShowDetails }) => {
  if (!places || places.length === 0) {
    return null
  }

  const handleAddPin = (place) => {
    const location = place.geometry.location
    // LatLngオブジェクトの場合はメソッドを呼び出す、そうでなければプロパティにアクセス
    const lat = typeof location.lat === 'function' ? location.lat() : location.lat
    const lng = typeof location.lng === 'function' ? location.lng() : location.lng

    const pin = {
      lat,
      lng,
      address: place.formatted_address || place.name,
      name: place.name,
    }
    onAddPin(pin)
  }

  const handleFocus = (place) => {
    const location = place.geometry.location
    const lat = typeof location.lat === 'function' ? location.lat() : location.lat
    const lng = typeof location.lng === 'function' ? location.lng() : location.lng
    const payload = {
      lat,
      lng,
      address: place.formatted_address || place.name,
      name: place.name,
    }
    onFocusPlace && onFocusPlace(payload)
  }

  return (
    <section className={`section ${Style.placesArea} ${isDrawerOpen ? Style.open : ''} ${isCollapsed ? Style.collapsed : ''}`}>
      <div className={Style.container}>
        <div className={Style.header}>
          <h3 className={Style.title}>検索結果 ({places.length}件)</h3>
          <button onClick={onToggleCollapse} className={Style.closeButton} aria-expanded={!isCollapsed}>
            {isCollapsed ? '開く' : '閉じる'}
          </button>
          <button onClick={onClose} className={Style.closeButton}>クリア</button>
        </div>
        <ul className={Style.placesList}>
          {places.map((place, index) => (
            <li
              key={place.place_id}
              className={Style.placeItem}
              onClick={() => handleFocus(place)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleFocus(place)
                }
              }}
            >
              <LocationIcon />
              <div className={Style.placeInfo}>
                <div className={Style.placeName}>
                  <strong>{index + 1}. {place.name}</strong>
                  {place.rating && (
                    <span className={Style.rating}>{place.rating.toFixed(1)}</span>
                  )}
                </div>
                <div className={Style.placeAddress}>
                  {formatAddress(place.formatted_address || place.vicinity)}
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
              <div className={Style.actions}>
                {onShowDetails && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowDetails(place.place_id)
                    }}
                    className={Style.detailsButton}
                    title="詳細を見る"
                  >
                    詳細
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddPin(place)
                  }}
                  className={Style.addButton}
                  title="このピンを追加"
                >
                  ピン追加
                </button>
              </div>
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
        location: PropTypes.oneOfType([
          PropTypes.shape({
            lat: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
            lng: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
          }),
          PropTypes.object, // google.maps.LatLng object
        ]).isRequired,
      }).isRequired,
      rating: PropTypes.number,
      types: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onAddPin: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool,
  onFocusPlace: PropTypes.func,
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  onShowDetails: PropTypes.func,
}

export default PlacesResults
