import axios from 'axios'
import { textSearch, getPlaceDetails } from '../services/places'
import {
  geocodeAddress,
  reverseGeocode,
  searchPlacesByText,
  fetchPlaceDetails,
  extractLatLng,
} from '../services/mapApiGateway'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

jest.mock('../services/places', () => ({
  textSearch: jest.fn(),
  getPlaceDetails: jest.fn(),
}))

describe('mapApiGateway test mode', () => {
  test('geocodeAddress uses mock response in test mode', async () => {
    const result = await geocodeAddress('東京タワー', true)
    expect(result.status).toBe('OK')
    expect(result.results[0].geometry.location.lat).toBeTruthy()
    expect(axios.get).not.toHaveBeenCalled()
  })

  test('reverseGeocode uses mock response in test mode', async () => {
    const result = await reverseGeocode(35.65858, 139.745433, true)
    expect(result.status).toBe('OK')
    expect(result.results[0].formatted_address).toContain('モック住所')
    expect(axios.get).not.toHaveBeenCalled()
  })

  test('places search and details use mock response in test mode', async () => {
    const places = await searchPlacesByText('東京', true)
    expect(places.length).toBeGreaterThan(1)

    const details = await fetchPlaceDetails(places[0].place_id, true)
    expect(details.place_id).toBe(places[0].place_id)
    expect(textSearch).not.toHaveBeenCalled()
    expect(getPlaceDetails).not.toHaveBeenCalled()
  })

  test('extractLatLng supports function and numeric location', () => {
    const numeric = extractLatLng({ lat: 35.6, lng: 139.7 })
    expect(numeric).toEqual({ lat: 35.6, lng: 139.7 })

    const callable = extractLatLng({ lat: () => 10, lng: () => 20 })
    expect(callable).toEqual({ lat: 10, lng: 20 })
  })
})
