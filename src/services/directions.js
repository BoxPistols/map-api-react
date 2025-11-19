// Directions API サービス層
// Google Directions API とのやり取りを管理

/**
 * 経路を取得する
 * @param {Object} origin - 出発地 { lat, lng } または住所文字列
 * @param {Object} destination - 目的地 { lat, lng } または住所文字列
 * @param {string} travelMode - 移動手段 ('DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT')
 * @param {Object} options - 追加オプション
 * @returns {Promise<Object>} - Directions結果オブジェクト
 */
export const getDirections = (origin, destination, travelMode = 'TRANSIT', options = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps?.DirectionsService) {
      reject(new Error('Google Maps Directions API が読み込まれていません'))
      return
    }

    const directionsService = new window.google.maps.DirectionsService()

    const request = {
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode[travelMode],
      language: 'ja',
      region: 'JP',
      ...options,
    }

    // Transitの場合は追加オプション
    if (travelMode === 'TRANSIT') {
      request.transitOptions = {
        departureTime: options.departureTime || new Date(),
        modes: options.transitModes || ['BUS', 'RAIL', 'SUBWAY', 'TRAIN'],
        routingPreference: options.routingPreference || 'FEWER_TRANSFERS',
      }
    }

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        resolve(result)
      } else {
        reject(new Error(`Directions request failed: ${status}`))
      }
    })
  })
}

/**
 * 複数の移動手段で経路を取得（比較用）
 * @param {Object} origin - 出発地
 * @param {Object} destination - 目的地
 * @param {Array<string>} modes - 移動手段の配列
 * @returns {Promise<Object>} - モードごとの経路結果
 */
export const getMultipleDirections = async (origin, destination, modes = ['DRIVING', 'TRANSIT', 'WALKING']) => {
  const results = {}

  for (const mode of modes) {
    try {
      const result = await getDirections(origin, destination, mode)
      results[mode] = result
    } catch (error) {
      console.error(`Failed to get directions for ${mode}:`, error)
      results[mode] = null
    }
  }

  return results
}

/**
 * 経路の概要情報を抽出
 * @param {Object} directionsResult - Directions API の結果
 * @returns {Object} - 整形された経路情報
 */
export const extractRouteInfo = (directionsResult) => {
  if (!directionsResult?.routes?.[0]) return null

  const route = directionsResult.routes[0]
  const leg = route.legs[0]

  return {
    distance: {
      text: leg.distance.text,
      value: leg.distance.value, // メートル
    },
    duration: {
      text: leg.duration.text,
      value: leg.duration.value, // 秒
    },
    startAddress: leg.start_address,
    endAddress: leg.end_address,
    steps: leg.steps.map(step => ({
      instruction: step.instructions,
      distance: step.distance.text,
      duration: step.duration.text,
      travelMode: step.travel_mode,
      transitDetails: step.transit ? {
        line: step.transit.line.short_name || step.transit.line.name,
        departureStop: step.transit.departure_stop.name,
        arrivalStop: step.transit.arrival_stop.name,
        departureTime: step.transit.departure_time.text,
        arrivalTime: step.transit.arrival_time.text,
        numStops: step.transit.num_stops,
        headsign: step.transit.headsign,
      } : null,
    })),
    fare: leg.fare ? {
      text: leg.fare.text,
      value: leg.fare.value,
      currency: leg.fare.currency,
    } : null,
    warnings: route.warnings,
    copyrights: route.copyrights,
  }
}

/**
 * 複数ルートの比較情報を生成
 * @param {Object} directionsResults - モードごとの経路結果
 * @returns {Array} - 比較可能な形式の配列
 */
export const compareRoutes = (directionsResults) => {
  const comparison = []

  Object.entries(directionsResults).forEach(([mode, result]) => {
    if (!result) return

    const routeInfo = extractRouteInfo(result)
    if (!routeInfo) return

    comparison.push({
      mode: mode,
      modeLabel: getTravelModeLabel(mode),
      modeIcon: getTravelModeIcon(mode),
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      fare: routeInfo.fare,
      steps: routeInfo.steps,
      // 比較用の数値
      durationMinutes: Math.round(routeInfo.duration.value / 60),
      distanceKm: (routeInfo.distance.value / 1000).toFixed(1),
      costYen: routeInfo.fare?.value || 0,
    })
  })

  return comparison
}

/**
 * 移動手段のラベルを取得
 * @param {string} mode - 移動手段
 * @returns {string} - 日本語ラベル
 */
export const getTravelModeLabel = (mode) => {
  const labels = {
    DRIVING: '車',
    TRANSIT: '公共交通機関',
    WALKING: '徒歩',
    BICYCLING: '自転車',
  }
  return labels[mode] || mode
}

/**
 * 移動手段のアイコンを取得
 * @param {string} mode - 移動手段
 * @returns {string} - 絵文字アイコン
 */
export const getTravelModeIcon = (mode) => {
  const icons = {
    DRIVING: '🚗',
    TRANSIT: '🚇',
    WALKING: '🚶',
    BICYCLING: '🚴',
  }
  return icons[mode] || '📍'
}

/**
 * ステップの種類に応じたアイコンを取得
 * @param {Object} step - 経路ステップ
 * @returns {string} - アイコン
 */
export const getStepIcon = (step) => {
  if (step.transitDetails) {
    const line = step.transitDetails.line.toLowerCase()
    if (line.includes('jr') || line.includes('電車')) return '🚃'
    if (line.includes('地下鉄') || line.includes('metro')) return '🚇'
    if (line.includes('バス')) return '🚌'
    return '🚉'
  }

  switch (step.travelMode) {
    case 'WALKING':
      return '🚶'
    case 'DRIVING':
      return '🚗'
    case 'BICYCLING':
      return '🚴'
    default:
      return '➡️'
  }
}

/**
 * HTMLタグを除去してプレーンテキストにする
 * @param {string} html - HTML文字列
 * @returns {string} - プレーンテキスト
 */
export const stripHtmlTags = (html) => {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Directions APIエラーメッセージ
 * @param {string} status - APIステータス
 * @returns {string} - エラーメッセージ
 */
export const getDirectionsErrorMessage = (status) => {
  const messages = {
    NOT_FOUND: '指定された場所が見つかりませんでした',
    ZERO_RESULTS: '経路が見つかりませんでした',
    MAX_WAYPOINTS_EXCEEDED: '経由地の数が多すぎます',
    MAX_ROUTE_LENGTH_EXCEEDED: '経路が長すぎます',
    INVALID_REQUEST: '無効なリクエストです',
    OVER_QUERY_LIMIT: 'APIのリクエスト制限を超えました',
    REQUEST_DENIED: 'リクエストが拒否されました',
    UNKNOWN_ERROR: '不明なエラーが発生しました',
  }
  return messages[status] || 'エラーが発生しました'
}
