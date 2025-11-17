import React from 'react'
import PropTypes from 'prop-types'
import Style from './PinList.module.scss'

const PinList = React.memo(({ pins, onRemovePin, onClearAllPins }) => {
  // JSONエクスポート
  const exportToJSON = () => {
    const data = pins.map((pin, index) => ({
      number: index + 1,
      latitude: pin.lat,
      longitude: pin.lng,
      address: pin.address,
    }))

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pins_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // CSVエクスポート
  const exportToCSV = () => {
    const headers = ['番号', '緯度', '経度', '住所']
    const rows = pins.map((pin, index) => [
      index + 1,
      pin.lat.toFixed(6),
      pin.lng.toFixed(6),
      `"${pin.address.replace(/"/g, '""')}"`, // CSV用にエスケープ
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const bom = '\uFEFF' // UTF-8 BOM (Excel対応)
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pins_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // クリップボードにコピー
  const copyToClipboard = () => {
    const data = pins.map((pin, index) => ({
      number: index + 1,
      latitude: pin.lat,
      longitude: pin.lng,
      address: pin.address,
    }))

    const jsonString = JSON.stringify(data, null, 2)

    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        alert('ピン情報をクリップボードにコピーしました！')
      })
      .catch((err) => {
        console.error('コピーに失敗しました:', err)
        alert('クリップボードへのコピーに失敗しました')
      })
  }

  if (pins.length === 0) {
    return null
  }

  return (
    <section className={`section ${Style.pinsArea}`}>
      <div className={Style.container}>
        <div className={Style.header}>
          <h3 className={Style.title}>ピン一覧 ({pins.length})</h3>
          <div className={Style.actions}>
            <button
              onClick={exportToJSON}
              className={Style.exportButton}
              title="JSON形式でダウンロード"
            >
              JSON
            </button>
            <button
              onClick={exportToCSV}
              className={Style.exportButton}
              title="CSV形式でダウンロード"
            >
              CSV
            </button>
            <button
              onClick={copyToClipboard}
              className={Style.exportButton}
              title="クリップボードにコピー"
            >
              コピー
            </button>
            <button onClick={onClearAllPins} className={Style.clearButton}>
              全削除
            </button>
          </div>
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
