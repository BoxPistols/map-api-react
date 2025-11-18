---
name: ui-testing
description: Puppeteer MCPを使用してUIの自動テストとスクリーンショット取得を行うスキル。マップ表示、検索機能、レスポンシブデザインをテストします。
tags: [ui, testing, puppeteer, e2e, screenshot]
---

# UI テストスキル

このスキルは Puppeteer MCP を使用して UI の自動テストとスクリーンショット取得を行います。

## 開発サーバーの起動確認

### 基本的なページ読み込みテスト
```javascript
// ページにアクセス
await page.goto('http://localhost:3000')

// タイトルを確認
const title = await page.title()
console.log('Page title:', title)

// ページが正しく読み込まれているか確認
await page.waitForSelector('.App')
```

### ヘッダーの表示確認
```javascript
// ロゴが表示されているか
const logo = await page.$('.logo')
assert(logo !== null, 'ロゴが見つかりません')

// 検索フォームが表示されているか
const searchForm = await page.$('form[name="searchForm"]')
assert(searchForm !== null, '検索フォームが見つかりません')

// ピンモードボタンが表示されているか
const pinModeBtn = await page.$('.pin-mode-btn')
assert(pinModeBtn !== null, 'ピンモードボタンが見つかりません')
```

## 検索機能のテスト

### 住所検索のテスト
```javascript
// 住所検索ラジオボタンを選択
await page.click('input[value="geocode"]')

// 検索ボックスに入力
await page.type('input[name="searchBox"]', '東京タワー')

// 検索ボタンをクリック
await page.click('button[type="submit"]')

// 結果が表示されるまで待機
await page.waitForTimeout(2000)

// 結果エリアに住所が表示されているか確認
const resultArea = await page.$('.result-area')
const resultText = await page.evaluate(el => el.textContent, resultArea)
console.log('検索結果:', resultText)
```

### 場所検索のテスト
```javascript
// 場所検索ラジオボタンを選択
await page.click('input[value="places"]')

// 検索ボックスをクリア
await page.$eval('input[name="searchBox"]', el => el.value = '')

// 検索クエリを入力
await page.type('input[name="searchBox"]', '横浜の馬車道近辺のカフェ')

// 検索ボタンをクリック
await page.click('button[type="submit"]')

// PlacesResults（サイドバー）が表示されるまで待機
await page.waitForSelector('.placesArea', { timeout: 5000 })

// 検索結果の件数を確認
const resultsCount = await page.$$eval('.placeItem', items => items.length)
console.log(`検索結果: ${resultsCount}件`)
```

## マップ機能のテスト

### マップが表示されているか確認
```javascript
// マップ要素が存在するか
await page.waitForSelector('.map', { timeout: 10000 })

// Google Mapsが読み込まれているか確認
const mapLoaded = await page.evaluate(() => {
  return window.google && window.google.maps
})
console.log('Google Maps loaded:', mapLoaded)
```

### ピンモードのテスト
```javascript
// ピンモードを有効化
await page.click('.pin-mode-btn')

// ボタンが active 状態になっているか確認
const isActive = await page.$eval('.pin-mode-btn',
  btn => btn.classList.contains('active')
)
console.log('ピンモード:', isActive ? 'ON' : 'OFF')

// マップをクリック（座標を指定）
await page.click('.map', { offset: { x: 100, y: 100 } })

// ピンが追加されたか確認（PinListに表示されるか）
await page.waitForTimeout(1000)
const pinCount = await page.$$eval('.pin-item', items => items.length)
console.log(`ピン数: ${pinCount}`)
```

## スクリーンショットの取得

### 全画面スクリーンショット
```javascript
await page.screenshot({
  path: 'screenshots/full-page.png',
  fullPage: true
})
```

### 特定要素のスクリーンショット
```javascript
// マップエリアのスクリーンショット
const mapElement = await page.$('.map')
await mapElement.screenshot({
  path: 'screenshots/map-area.png'
})

// ヘッダーのスクリーンショット
const header = await page.$('.control-area')
await header.screenshot({
  path: 'screenshots/header.png'
})

// サイドバー（PlacesResults）のスクリーンショット
const sidebar = await page.$('.placesArea')
if (sidebar) {
  await sidebar.screenshot({
    path: 'screenshots/sidebar.png'
  })
}
```

## レスポンシブデザインのテスト

### モバイルビューポート
```javascript
// iPhone X サイズに設定
await page.setViewport({
  width: 375,
  height: 812,
  isMobile: true,
  hasTouch: true
})

await page.screenshot({
  path: 'screenshots/mobile-iphone-x.png',
  fullPage: true
})
```

### タブレットビューポート
```javascript
// iPad サイズに設定
await page.setViewport({
  width: 768,
  height: 1024,
  isMobile: true,
  hasTouch: true
})

await page.screenshot({
  path: 'screenshots/tablet-ipad.png',
  fullPage: true
})
```

### デスクトップビューポート
```javascript
// デスクトップサイズに設定
await page.setViewport({
  width: 1920,
  height: 1080
})

await page.screenshot({
  path: 'screenshots/desktop-1920.png',
  fullPage: true
})
```

## パフォーマンステスト

### ページ読み込み時間の計測
```javascript
const startTime = Date.now()

await page.goto('http://localhost:3000', {
  waitUntil: 'networkidle2'
})

const loadTime = Date.now() - startTime
console.log(`ページ読み込み時間: ${loadTime}ms`)
```

### Lighthouseスコアの確認
```javascript
// Lighthouse を実行（Puppeteer統合）
const { lhr } = await page.lighthouse('http://localhost:3000')

console.log('Performance Score:', lhr.categories.performance.score * 100)
console.log('Accessibility Score:', lhr.categories.accessibility.score * 100)
console.log('Best Practices Score:', lhr.categories['best-practices'].score * 100)
```

## フルスクリーンモード（Fキー）のテスト

### Fキーで全画面表示をトグル
```javascript
// 通常表示の状態を確認
let headerVisible = await page.$eval('.control-area',
  el => !el.classList.contains('hidden')
)
console.log('ヘッダー表示:', headerVisible)

// Fキーを押す
await page.keyboard.press('f')
await page.waitForTimeout(500)

// 全画面表示になっているか確認
headerVisible = await page.$eval('.control-area',
  el => !el.classList.contains('hidden')
)
console.log('全画面後のヘッダー表示:', headerVisible)

// マップコンテナがfullscreenクラスを持っているか
const isFullscreen = await page.$eval('.map-container',
  el => el.classList.contains('fullscreen')
)
console.log('全画面モード:', isFullscreen)

// ESCキーで解除
await page.keyboard.press('Escape')
await page.waitForTimeout(500)
```

## E2Eテストシナリオ例

### 完全なワークフローテスト
```javascript
// 1. ページにアクセス
await page.goto('http://localhost:3000')

// 2. 住所検索
await page.click('input[value="geocode"]')
await page.type('input[name="searchBox"]', '東京タワー')
await page.click('button[type="submit"]')
await page.waitForTimeout(2000)

// 3. ピンモードを有効化
await page.click('.pin-mode-btn')

// 4. マップをクリックしてピンを追加
await page.click('.map', { offset: { x: 200, y: 200 } })
await page.waitForTimeout(1000)

// 5. 場所検索に切り替え
await page.click('input[value="places"]')
await page.$eval('input[name="searchBox"]', el => el.value = '')
await page.type('input[name="searchBox"]', '渋谷のカフェ')
await page.click('button[type="submit"]')
await page.waitForTimeout(3000)

// 6. 検索結果からピンを追加
const addButton = await page.$('.addButton')
if (addButton) {
  await addButton.click()
  await page.waitForTimeout(500)
}

// 7. 全画面表示
await page.keyboard.press('f')
await page.waitForTimeout(500)

// 8. スクリーンショット
await page.screenshot({
  path: 'screenshots/e2e-test-fullscreen.png',
  fullPage: true
})

// 9. 全画面解除
await page.keyboard.press('Escape')

// 10. 最終スクリーンショット
await page.screenshot({
  path: 'screenshots/e2e-test-final.png',
  fullPage: true
})

console.log('E2Eテスト完了')
```

## トラブルシューティング

### タイムアウトエラー
要素が見つからない場合、待機時間を増やす：
```javascript
await page.waitForSelector('.map', { timeout: 15000 })
```

### Google Maps の読み込み待機
Google Maps API の読み込みを待つ：
```javascript
await page.waitForFunction(() => {
  return window.google && window.google.maps
}, { timeout: 10000 })
```

### スクリーンショットディレクトリの作成
```bash
mkdir -p screenshots
```
