# Aron Lab

**自己每天要用的，就自己做成產品。** 我所有作品的入口、分頁索引與作品集。

網站：<https://north7.github.io/>

| # | 作品 | 是什麼 | 狀態 |
|---|---|---|---|
| 01 | [Tidemark](https://north7.github.io/tidemark/) | BTC 週期頂部／底部訊號儀表板 | 已上線 · 每日更新 |
| 02 | [Daybreak 破曉](https://north7.github.io/daybreak/) | 每天清晨的比特幣簡報 | 已上線 · 每日出刊 |
| 03 | [Morningbell 晨鐘](https://north7.github.io/morningbell/) | 給長期投資人的美股、台股日報 | 已上線 · 每天兩刊 |
| 04 | [Market Ticker](https://north7.github.io/market-ticker/) | 副螢幕行情看板，7 個主題 | 已上線 · 即時 |
| 05 | OneStroke 一拍 | 網球揮拍分析（[產品案例](https://north7.github.io/portfolio/onestroke/)） | 自用 · 本機 |
| 06 | Baseline 身體日報 | 私人健康日報 | 只在本機，不公開 |

## 頁面

| # | 章節 | 內容 |
|---|---|---|
| — | 跑馬燈 | 各作品的即時狀態（Tidemark 訊號、Daybreak BTC 收盤、Morningbell S&P／加權、Market Ticker 版本） |
| — | 首屏 | 作品數、公開上線數、入口數、開工天數 |
| 01 | 作品 | 每個作品一列：封面、狀態、簡介、即時數據、所有版面／分頁的直達連結；可依領域篩選 |
| 02 | 分頁索引 | 所有入口（首頁、分頁、作品集章節、語言版本、資料、工具、原始碼、本機、舊版、封存主題），可搜尋、依作品或類型篩選；按 `/` 直接搜尋 |
| 03 | 作品集 | 案例研究：Tidemark 作品集、OneStroke 產品案例、個人作品集 |
| 04 | 時間軸 | 每個作品從開工到今天的甘特圖，加上里程碑紀錄 |

配色：自動（跟系統）／淺／深，右上角切換並記住。

## 加一個新作品

全部內容都在 `data/lab.js`，頁面、索引、時間軸、頂欄標記、頁尾都會自動長出來，不用改 HTML。

1. 在 `products` 最後加一筆，`no` 接著編（`'07'`）
2. 有封面就放 `assets/covers/<名稱>.jpg`（1200×750，16:10）；線上網站可以把網址加進 `tools/covers.sh` 再執行
3. 想記錄里程碑就加到 `milestones`
4. 改 `updated` 日期，推上 main

```js
{
  id: 'newthing', no: '07', name: 'New Thing', zh: '中文名',
  color: '#7A4BD6',            // 作品色；color2 可做漸層（例如 Tidemark）；ink 是淺底上的文字色（太亮的顏色才需要）
  domains: ['crypto'],         // 對應上方 domains 的 key，可多個；要新領域就在 domains 加一個
  kind: '儀表板',
  status: 'live',              // live 已上線／local 本機／private 私人
  cadence: '每日自動更新',
  started: '2026-11-01',
  tagline: '一句話。',
  desc: '兩三句說明。',
  facts: ['重點一', '重點二'],
  site: 'https://north7.github.io/newthing/',   // 沒有線上版就寫 null
  repo: 'https://github.com/North7/newthing',
  cover: 'assets/covers/newthing.jpg',          // 沒有就寫 null（會顯示「私人」封面）
  logo: '<svg viewBox="0 0 64 64">…</svg>',
  sectionsLabel: '頁面',
  sections: [{ n: '01', t: '總覽', u: '#overview' }],   // u 相對於 site；不寫 u 就只顯示、不連結
  links: [{ t: 'English', u: 'en/', type: 'lang' }],     // type：case lang tool data social repo local legacy archive
  live: null,   // 要在頁面上顯示即時數據，到 assets/app.js 的 FEEDS 加一個讀取器，這裡填它的 key
}
```

## 檔案

- `index.html`：頁面骨架
- `data/lab.js`：所有內容（作品、作品集、里程碑）
- `assets/app.js`：從資料產生頁面；讀各作品的公開 JSON 顯示即時數據（GitHub Pages 允許跨來源讀取）
- `assets/app.css`：樣式。暖灰紙面、墨黑、每個作品一個顏色，沿用 Daybreak／Morningbell 的版面語言（Archivo、JetBrains Mono、Noto Sans TC）
- `assets/covers/`：作品與作品集封面
- `tools/covers.sh`：用 Chrome 無頭模式重拍線上作品的封面

本機預覽：`python3 -m http.server 8765` 後開 <http://127.0.0.1:8765/>（直接雙擊 `index.html` 也能看）。

## 隱私

Baseline 是私人健康資料，這裡只放產品說明，不放截圖或任何數據。OneStroke 的封面取自已公開的產品案例頁（人臉已模糊）。
