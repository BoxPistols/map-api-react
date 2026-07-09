const mockPlaces = [
  {
    place_id: 'mock_tokyo_tower',
    name: '東京タワー',
    formatted_address: '東京都港区芝公園4-2-8',
    geometry: {
      location: { lat: 35.65858, lng: 139.745433 },
    },
    rating: 4.4,
    types: ['point_of_interest', 'tourist_attraction'],
  },
  {
    place_id: 'mock_ueno_park',
    name: '上野恩賜公園',
    formatted_address: '東京都台東区上野公園',
    geometry: {
      location: { lat: 35.715298, lng: 139.773037 },
    },
    rating: 4.3,
    types: ['park', 'point_of_interest'],
  },
  {
    place_id: 'mock_skytree',
    name: '東京スカイツリー',
    formatted_address: '東京都墨田区押上1-1-2',
    geometry: {
      location: { lat: 35.710063, lng: 139.8107 },
    },
    rating: 4.4,
    types: ['point_of_interest', 'tourist_attraction'],
  },
]

const COORDINATE_PRECISION = 6

const mockPlaceDetailsMap = {
  mock_tokyo_tower: {
    place_id: 'mock_tokyo_tower',
    name: '東京タワー',
    formatted_address: '東京都港区芝公園4-2-8',
    formatted_phone_number: '03-3433-5111',
    website: 'https://www.tokyotower.co.jp/',
    url: 'https://maps.google.com/?cid=mock_tokyo_tower',
    rating: 4.4,
    user_ratings_total: 78000,
    price_level: 2,
    opening_hours: {
      open_now: true,
      weekday_text: ['月曜日: 9:00～23:00', '火曜日: 9:00～23:00'],
    },
    reviews: [
      {
        author_name: 'Mock User',
        rating: 5,
        text: 'テストモード用のモックレビューです。',
      },
    ],
    wheelchair_accessible_entrance: true,
    geometry: {
      location: { lat: 35.65858, lng: 139.745433 },
    },
  },
  mock_ueno_park: {
    place_id: 'mock_ueno_park',
    name: '上野恩賜公園',
    formatted_address: '東京都台東区上野公園',
    rating: 4.3,
    opening_hours: {
      open_now: true,
      weekday_text: ['毎日: 5:00～23:00'],
    },
    geometry: {
      location: { lat: 35.715298, lng: 139.773037 },
    },
  },
  mock_skytree: {
    place_id: 'mock_skytree',
    name: '東京スカイツリー',
    formatted_address: '東京都墨田区押上1-1-2',
    rating: 4.4,
    user_ratings_total: 112000,
    geometry: {
      location: { lat: 35.710063, lng: 139.8107 },
    },
  },
}

const mockAddressResults = {
  東京タワー: {
    formatted_address: '東京都港区芝公園4-2-8 東京タワー',
    geometry: { location: { lat: 35.65858, lng: 139.745433 } },
  },
  東京駅: {
    formatted_address: '東京都千代田区丸の内1丁目 東京駅',
    geometry: { location: { lat: 35.681236, lng: 139.767125 } },
  },
  渋谷駅: {
    formatted_address: '東京都渋谷区道玄坂1丁目 渋谷駅',
    geometry: { location: { lat: 35.658034, lng: 139.701636 } },
  },
}

const normalizeQuery = (query = '') => query.trim().toLowerCase()

export const mockGeocodeByAddress = (query) => {
  const normalized = normalizeQuery(query)

  if (!normalized || normalized.includes('notfound')) {
    return { status: 'ZERO_RESULTS', results: [] }
  }

  const directMatch = Object.entries(mockAddressResults).find(([key]) =>
    normalized.includes(key.toLowerCase())
  )

  if (directMatch) {
    return { status: 'OK', results: [directMatch[1]] }
  }

  return {
    status: 'OK',
    results: [mockAddressResults.東京タワー],
  }
}

export const mockPlacesTextSearch = (query) => {
  const normalized = normalizeQuery(query)
  if (!normalized || normalized.includes('notfound')) {
    return []
  }

  const filtered = mockPlaces.filter((place) => {
    const placeText = `${place.name} ${place.formatted_address}`.toLowerCase()
    return placeText.includes(normalized)
  })

  return filtered.length > 0 ? filtered : mockPlaces
}

export const mockPlaceDetails = (placeId) => {
  return (
    mockPlaceDetailsMap[placeId] || {
      place_id: placeId,
      name: 'モック施設',
      formatted_address: '東京都千代田区千代田1-1',
      rating: 4.0,
      geometry: {
        location: { lat: 35.685175, lng: 139.7528 },
      },
    }
  )
}

export const mockReverseGeocode = (lat, lng) => {
  return {
    status: 'OK',
    results: [
      {
        formatted_address: `モック住所: 東京都千代田区（${lat.toFixed(COORDINATE_PRECISION)}, ${lng.toFixed(COORDINATE_PRECISION)}）`,
      },
    ],
  }
}
