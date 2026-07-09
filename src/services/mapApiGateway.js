import axios from 'axios'
import { getPlaceDetails, textSearch } from './places'
import {
  mockGeocodeByAddress,
  mockPlacesTextSearch,
  mockPlaceDetails,
  mockReverseGeocode,
} from '../mocks/googleApiMocks'

const API_KEY = process.env.REACT_APP_API_KEY
const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json'

export const extractLatLng = (location) => {
  if (!location) {
    throw new Error('Location data is missing')
  }

  return {
    lat: typeof location.lat === 'function' ? location.lat() : location.lat,
    lng: typeof location.lng === 'function' ? location.lng() : location.lng,
  }
}

export const geocodeAddress = async (address, isTestMode) => {
  if (isTestMode) {
    return mockGeocodeByAddress(address)
  }

  const results = await axios.get(GEOCODE_ENDPOINT, {
    params: {
      address,
      key: API_KEY,
    },
  })

  return results.data
}

export const reverseGeocode = async (lat, lng, isTestMode) => {
  if (isTestMode) {
    return mockReverseGeocode(lat, lng)
  }

  const results = await axios.get(GEOCODE_ENDPOINT, {
    params: {
      latlng: `${lat},${lng}`,
      key: API_KEY,
    },
  })

  return results.data
}

export const searchPlacesByText = async (query, isTestMode) => {
  if (isTestMode) {
    return mockPlacesTextSearch(query)
  }

  return textSearch(query)
}

export const fetchPlaceDetails = async (placeId, isTestMode) => {
  if (isTestMode) {
    return mockPlaceDetails(placeId)
  }

  return getPlaceDetails(placeId)
}
