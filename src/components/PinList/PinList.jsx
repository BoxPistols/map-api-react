import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Style from './PinList.module.scss'
import { exportAllData, importData } from '../../utils/storage'

const PinList = React.memo(({ pins, onRemovePin, onClearAllPins, onPinClick, onImportPins, isDrawerOpen }) => {
  const fileInputRef = useRef(null)
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

  // 全データをエクスポート（ピン、ピン履歴、検索履歴）
  const exportAllDataToFile = () => {
    const data = exportAllData()
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ggmap_backup_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // JSONファイルをインポート
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)

        // 全データのバックアップファイルの場合
        if (data.pins || data.pinHistory || data.searchHistory) {
          if (window.confirm('全てのデータ（ピン、履歴）をインポートしますか？既存のデータは上書きされます。')) {
            importData(data)
            // ピンを再読み込み
            if (data.pins && onImportPins) {
              onImportPins(data.pins)
            }
            alert('データをインポートしました！ページをリロードして反映してください。')
          }
        }
        // 古い形式のピンのみのエクスポートファイルの場合
        else if (Array.isArray(data)) {
          if (window.confirm(`${data.length}件のピンをインポートしますか？`)) {
            const importedPins = data.map((item) => ({
              id: crypto.randomUUID(), // ユニークなIDを生成
              lat: item.latitude,
              lng: item.longitude,
              address: item.address,
            }))
            if (onImportPins) {
              onImportPins(importedPins)
            }
            alert(`${data.length}件のピンをインポートしました！`)
          }
        } else {
          alert('無効なファイル形式です')
        }
      } catch (error) {
        console.error('Import error:', error)
        alert('ファイルの読み込みに失敗しました')
      }
    }
    reader.readAsText(file)
    // ファイル選択をリセット（同じファイルを再度選択できるように）
    event.target.value = ''
  }

  if (pins.length === 0) {
    return null
  }

  return (
    <section className={`section ${Style.pinsArea} ${isDrawerOpen ? Style.open : ''}`}>
      <div className={Style.container}>
        <div className={Style.header}>
          <h3 className={Style.title}>ピン一覧 ({pins.length})</h3>
          <div className={Style.actions}>
            <button
              onClick={exportToJSON}
              className={Style.exportButton}
              title="ピンのみをJSON形式でダウンロード"
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
              onClick={exportAllDataToFile}
              className={Style.exportButton}
              title="全データ（ピン+履歴）をバックアップ"
            >
              全保存
            </button>
            <button
              onClick={handleImportClick}
              className={Style.importButton}
              title="JSONファイルからインポート"
            >
              読込
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
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
              <div
                className={`${Style.pinInfo} ${Style.pinInfoClickable}`}
                onClick={() => onPinClick(pin)}
                title="クリックして地図を移動"
              >
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
  onPinClick: PropTypes.func.isRequired,
  onImportPins: PropTypes.func,
  isDrawerOpen: PropTypes.bool,
}

export default PinList
