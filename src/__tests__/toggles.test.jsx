import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import PlacesResults from '../components/PlacesResults/PlacesResults'

describe('UI toggles', () => {
  test('PlacesResults collapse toggle calls handler and hides list', () => {
    const places = [
      {
        place_id: '1',
        name: '東京タワー',
        formatted_address: '東京都港区',
        geometry: { location: { lat: 35.0, lng: 139.0 } },
        types: [],
      },
    ]
    const onAddPin = jest.fn()
    const onClose = jest.fn()
    const onFocusPlace = jest.fn()
    const onToggleCollapse = jest.fn()

    const { rerender } = render(
      <PlacesResults
        places={places}
        onAddPin={onAddPin}
        onClose={onClose}
        isDrawerOpen={false}
        onFocusPlace={onFocusPlace}
        isCollapsed={false}
        onToggleCollapse={onToggleCollapse}
      />
    )

    // 折りたたみトグルを押す
    const toggleBtn = screen.getByRole('button', { name: /閉じる|開く/ })
    fireEvent.click(toggleBtn)
    expect(onToggleCollapse).toHaveBeenCalled()

    // 折りたたみ状態を true にしてリレンダー
    rerender(
      <PlacesResults
        places={places}
        onAddPin={onAddPin}
        onClose={onClose}
        isDrawerOpen={false}
        onFocusPlace={onFocusPlace}
        isCollapsed={true}
        onToggleCollapse={onToggleCollapse}
      />
    )

    // リストが非表示になる（place name が見えない想定）
    expect(screen.queryByText('東京タワー')).not.toBeInTheDocument()
  })
})


