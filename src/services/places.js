// Places API サービス層
// Google Places API とのやり取りを管理

/**
 * Place Details を取得する
 * @param {string} placeId - Google Places API の place_id
 * @param {Array<string>} fields - 取得するフィールドのリスト
 * @returns {Promise<Object>} - Place details オブジェクト
 */
export const getPlaceDetails = (placeId, fields = null) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.places) {
      reject(new Error('Google Maps Places API が読み込まれていません'))
      return
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    const defaultFields = [
      'place_id',
      'name',
      'formatted_address',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'url',
      'rating',
      'user_ratings_total',
      'price_level',
      'opening_hours',
      'photos',
      'reviews',
      'geometry',
      'types',
      'wheelchair_accessible_entrance',
      'business_status',
    ]

    const request = {
      placeId: placeId,
      fields: fields || defaultFields,
      language: 'ja',
    }

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(place)
      } else {
        reject(new Error(`Place Details リクエスト失敗: ${status}`))
      }
    })
  })
}

/**
 * Text Search を実行する（既存機能の補完）
 * @param {string} query - 検索クエリ
 * @param {Object} options - 追加オプション
 * @returns {Promise<Array>} - 検索結果の配列
 */
export const textSearch = (query, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.places) {
      reject(new Error('Google Maps Places API が読み込まれていません'))
      return
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    const request = {
      query: query,
      language: 'ja',
      ...options,
    }

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results)
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        resolve([])
      } else {
        reject(new Error(`Text Search リクエスト失敗: ${status}`))
      }
    })
  })
}

/**
 * Place の写真URLを取得する
 * @param {Object} photo - Google Places API の photo オブジェクト
 * @param {Object} options - サイズオプション { maxWidth, maxHeight }
 * @returns {string|null} - 写真のURL
 */
export const getPhotoUrl = (photo, options = { maxWidth: 400 }) => {
  if (!photo || !photo.getUrl) return null
  return photo.getUrl(options)
}

/**
 * 複数の写真URLを一括取得
 * @param {Array} photos - Google Places API の photos 配列
 * @param {Object} options - サイズオプション
 * @returns {Array<string>} - 写真URLの配列
 */
export const getPhotoUrls = (photos, options = { maxWidth: 400 }) => {
  if (!photos || !Array.isArray(photos)) return []
  return photos.map(photo => getPhotoUrl(photo, options)).filter(Boolean)
}

/**
 * 営業時間を整形して取得
 * @param {Object} openingHours - opening_hours オブジェクト
 * @returns {Object} - 整形された営業時間データ
 */
export const formatOpeningHours = (openingHours) => {
  if (!openingHours) return null

  return {
    isOpenNow: openingHours.open_now,
    weekdayText: openingHours.weekday_text || [],
    periods: openingHours.periods || [],
  }
}

/**
 * レビューを整形して取得（最新順でソート）
 * @param {Array} reviews - reviews 配列
 * @param {number} limit - 取得する件数（デフォルト: 5）
 * @returns {Array} - 整形されたレビュー配列
 */
export const formatReviews = (reviews, limit = 5) => {
  if (!reviews || !Array.isArray(reviews)) return []

  return reviews
    .sort((a, b) => (b.time || 0) - (a.time || 0)) // 新しい順
    .slice(0, limit)
    .map(review => ({
      authorName: review.author_name,
      authorUrl: review.author_url,
      profilePhotoUrl: review.profile_photo_url,
      rating: review.rating,
      relativeTimeDescription: review.relative_time_description,
      text: review.text,
      time: review.time,
    }))
}

/**
 * Place オブジェクトから必要な情報を抽出
 * @param {Object} place - Google Places API の place オブジェクト
 * @returns {Object} - 整形された place データ
 */
export const extractPlaceData = (place) => {
  if (!place) return null

  return {
    placeId: place.place_id,
    name: place.name,
    formattedAddress: place.formatted_address,
    formattedPhoneNumber: place.formatted_phone_number,
    website: place.website,
    url: place.url,
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    openingHours: formatOpeningHours(place.opening_hours),
    photos: place.photos || [],
    reviews: formatReviews(place.reviews),
    geometry: place.geometry,
    types: place.types || [],
    wheelchairAccessibleEntrance: place.wheelchair_accessible_entrance,
    businessStatus: place.business_status,
  }
}

/**
 * Places API エラーハンドリング
 * @param {string} status - API ステータス
 * @returns {string} - ユーザーフレンドリーなエラーメッセージ
 */
export const getPlacesErrorMessage = (status) => {
  const errorMessages = {
    ZERO_RESULTS: '結果が見つかりませんでした',
    OVER_QUERY_LIMIT: 'APIのリクエスト制限を超えました。しばらくしてからお試しください',
    REQUEST_DENIED: 'リクエストが拒否されました',
    INVALID_REQUEST: '無効なリクエストです',
    UNKNOWN_ERROR: '不明なエラーが発生しました',
    NOT_FOUND: '指定された場所が見つかりませんでした',
  }

  return errorMessages[status] || 'エラーが発生しました'
}
