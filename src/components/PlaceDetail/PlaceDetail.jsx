import React from 'react'
import PropTypes from 'prop-types'
import Style from './PlaceDetail.module.scss'
import PhotoGallery from './PhotoGallery'
import ReviewList from './ReviewList'
import OpeningHours from './OpeningHours'
import PlaceActions from './PlaceActions'

const PlaceDetail = ({ place, onClose, onAddPin, onSaveToWishlist }) => {
  if (!place) return null

  // 営業中かどうか
  const isOpenNow = place.opening_hours?.open_now

  // 価格帯表示
  const getPriceLevelDisplay = (level) => {
    if (!level) return null
    return '¥'.repeat(level)
  }

  return (
    <div className={Style.container}>
      {/* ヘッダー */}
      <div className={Style.header}>
        <h2 className={Style.title}>{place.name}</h2>
        <button onClick={onClose} className={Style.closeBtn} aria-label="閉じる">
          ×
        </button>
      </div>

      {/* 写真ギャラリー */}
      {place.photos && place.photos.length > 0 && (
        <PhotoGallery photos={place.photos} placeName={place.name} />
      )}

      {/* 評価・価格 */}
      <div className={Style.ratingSection}>
        {place.rating && (
          <div className={Style.rating}>
            <span className={Style.stars}>⭐ {place.rating.toFixed(1)}</span>
            {place.user_ratings_total && (
              <span className={Style.reviewCount}>
                ({place.user_ratings_total.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}
        {place.price_level && (
          <div className={Style.priceLevel}>
            {getPriceLevelDisplay(place.price_level)}
          </div>
        )}
      </div>

      {/* 営業状況 */}
      {place.opening_hours && (
        <div className={Style.statusSection}>
          <span className={`${Style.status} ${isOpenNow ? Style.open : Style.closed}`}>
            {isOpenNow ? '🟢 営業中' : '🔴 営業時間外'}
          </span>
          {isOpenNow && place.opening_hours.periods && (
            <span className={Style.closingTime}>
              {/* 今日の閉店時刻を表示 */}
            </span>
          )}
        </div>
      )}

      {/* 基本情報 */}
      <div className={Style.infoSection}>
        {place.formatted_address && (
          <div className={Style.infoItem}>
            <span className={Style.icon}>📍</span>
            <span className={Style.text}>{place.formatted_address}</span>
          </div>
        )}

        {place.formatted_phone_number && (
          <div className={Style.infoItem}>
            <span className={Style.icon}>📞</span>
            <a href={`tel:${place.formatted_phone_number}`} className={Style.link}>
              {place.formatted_phone_number}
            </a>
          </div>
        )}

        {place.website && (
          <div className={Style.infoItem}>
            <span className={Style.icon}>🌐</span>
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className={Style.link}
            >
              Webサイト
            </a>
          </div>
        )}

        {place.url && (
          <div className={Style.infoItem}>
            <span className={Style.icon}>🔗</span>
            <a
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className={Style.link}
            >
              Google Mapsで開く
            </a>
          </div>
        )}
      </div>

      {/* 営業時間 */}
      {place.opening_hours && (
        <OpeningHours openingHours={place.opening_hours} />
      )}

      {/* レビュー */}
      {place.reviews && place.reviews.length > 0 && (
        <ReviewList reviews={place.reviews} />
      )}

      {/* アクセシビリティ情報 */}
      {(place.wheelchair_accessible_entrance !== undefined ||
        place.parking !== undefined ||
        place.wifi !== undefined) && (
        <div className={Style.accessibilitySection}>
          <h3 className={Style.sectionTitle}>アクセシビリティ</h3>
          <div className={Style.accessibilityList}>
            {place.wheelchair_accessible_entrance && (
              <div className={Style.accessibilityItem}>♿ 車椅子対応</div>
            )}
            {place.parking && (
              <div className={Style.accessibilityItem}>🅿️ 駐車場あり</div>
            )}
            {place.wifi && (
              <div className={Style.accessibilityItem}>📶 Wi-Fiあり</div>
            )}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <PlaceActions
        place={place}
        onAddPin={onAddPin}
        onSaveToWishlist={onSaveToWishlist}
      />
    </div>
  )
}

PlaceDetail.propTypes = {
  place: PropTypes.shape({
    place_id: PropTypes.string,
    name: PropTypes.string.isRequired,
    formatted_address: PropTypes.string,
    formatted_phone_number: PropTypes.string,
    website: PropTypes.string,
    url: PropTypes.string,
    rating: PropTypes.number,
    user_ratings_total: PropTypes.number,
    price_level: PropTypes.number,
    photos: PropTypes.array,
    reviews: PropTypes.array,
    opening_hours: PropTypes.object,
    wheelchair_accessible_entrance: PropTypes.bool,
    parking: PropTypes.bool,
    wifi: PropTypes.bool,
    geometry: PropTypes.shape({
      location: PropTypes.object,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onAddPin: PropTypes.func,
  onSaveToWishlist: PropTypes.func,
}

export default PlaceDetail
