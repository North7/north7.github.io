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
| 07 | [Signal Tower](https://north7.github.io/signals/) | BTC 策略帳戶的紙上交易：S1 突破 × D 趨勢 | 已上線 · 每 4 小時更新 |

## 頁面

設計是「色場」：向 Josef Albers《向方形致敬》致意。每個作品一整片平面色場，內外三層方形，內層往下偏；不用陰影、光暈或玻璃。每個作品的四個色階都由 `data/lab.js` 的 `color` 算出來。

| # | 章節 | 內容 |
|---|---|---|
| — | 首屏 | 先放台北現在這個時間該看的作品（照各作品排程：Morningbell 晨刊 07:00／午後刊 16:00、Tidemark 08:15、Daybreak 08:30、Signal Tower 4 小時 K 線、其餘時間 Market Ticker；排程在 `assets/app.js` 的 `SLOTS`），接著每 4.2 秒換下一個作品的配色；右下角顯示那個作品的即時數據（Tidemark 訊號、Daybreak BTC 收盤、Morningbell S&P／加權、Market Ticker 版本）；底部是作品數、每天自動更新數、入口數 |
| 01 | 作品 | 每個作品一整片色場：方形裡是領域符號（加密＝圓、股市＝方、運動＝三角、健康＝半圓），滑過顯示畫面；旁邊是簡介、即時數據、所有版面／分頁色塊、按鈕與「全部 N 個入口」 |
| 02 | 分頁索引 | 所有入口（首頁、分頁、作品集章節、語言版本、資料、工具、原始碼、本機、舊版、封存主題），預設每個作品只露出第一列、其餘折疊（搜尋或只看單一作品時全部攤開）；可搜尋、依作品或類型篩選；按 `/` 直接搜尋 |
| 03 | 作品集 | 案例研究：Tidemark 作品集、Daybreak 與 OneStroke 產品案例，以及個人主頁 |
| 04 | 宣傳素材 | 有 `promo` 的作品會出現在這裡：影片（捲到畫面裡自動無聲播放）、海報、說明圖橫向捲動，點圖放大（← → 切換、Esc 關閉），附下載 |
| 05 | 時間軸 | 每個作品從開工到今天的甘特圖，加上里程碑紀錄 |

配色：自動（跟系統）／淺／深，右上角切換並記住；深色時色場改用深色色階。

語言：中文／English，右上角切換並記住（手機上只顯示另一種語言，按一下就切）。第一次來看網址的 `?lang=en|zh`，沒有就看瀏覽器語言：有中文就用中文，其他都用英文。英文版的作品連結會直接連到各作品的英文版（Tidemark 的 `en/`、Daybreak 產品案例的 `en/`），只有中文的頁面標「(Chinese)」。404 頁跟著同一個設定。

小細節：
- 左上角 7 個小方塊對應 7 個作品，正在看哪一個，其他就變空心
- 點作品名稱旁的小色塊、或頁尾色票，複製那個作品的色碼；頁尾最後的空方塊點一下，幫下一個作品隨機挑顏色
- 鍵盤：`/` 搜尋、`1`–`7` 跳到作品、`t` 切換深淺色、`?` 看說明
- 彩蛋：點首屏的「Josef Albers」或在頁面上打 `albers`，看《色彩互動》的同色錯覺；開發者主控台也有一段話
- `404.html`：打錯網址時的頁面，猜你要找哪個作品；搜尋框會帶 `?q=` 回首頁的索引

## 加一個新作品

全部內容都在 `data/lab.js`，頁面、索引、時間軸、頂欄標記、頁尾都會自動長出來，不用改 HTML。

1. 在 `products` 最後加一筆，`no` 接著編（`'07'`）
2. 有封面就放 `assets/covers/<名稱>.jpg`（1200×750，16:10）；線上網站可以把網址加進 `tools/covers.sh` 再執行
3. 想記錄里程碑就加到 `milestones`
4. 英文版：每一筆都加 `en`（見下面的例子），沒加的地方英文版會直接顯示中文
5. 改 `updated` 日期，推上 main

```js
{
  id: 'newthing', no: '07', name: 'New Thing', zh: '中文名',
  color: '#7A4BD6',            // 作品色：整片色場的四個色階都從這個顏色算
  domains: ['crypto'],         // 對應上方 domains 的 key；第一個決定方形裡的符號（要新領域就在 domains 加一個，再到 assets/app.js 的 GLYPH 加圖形）
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
  sectionsLabel: '頁面',
  sections: [{ n: '01', t: '總覽', u: '#overview' }],   // u 相對於 site；不寫 u 就只顯示、不連結
  links: [{ t: 'English', u: 'en/', type: 'lang' }],     // type：case lang tool data social repo local legacy archive
  promo: null,  // 宣傳素材，格式見 OneStroke：dir 底下放 slide-01.jpg（1080 寬）＋slide-01-s.jpg（640 寬）…、poster、pdf、video
  live: null,   // 要在頁面上顯示即時數據，到 assets/app.js 的 FEEDS 加一個讀取器，這裡填它的 key
  // 英文版：en 是物件就換掉裡面列出的欄位；zh 在英文版當成副標（例如 'Cycle Signals'）
  // open：英文版的「Open」連到哪裡（相對於 site）；ui: 'zh' 代表網站只有中文，按鈕會標 (Chinese)；cover 可以換成英文版的封面
  en: { zh: 'English subtitle', kind: 'Dashboard', cadence: 'Updates daily', tagline: '…', desc: '…', facts: ['…'], sectionsLabel: 'Page' },
  // sections、links、milestones 每一筆也可以帶 en：字串＝英文標題；物件＝{ t, u } 連英文版網址
}
```

## 檔案

- `index.html`：頁面骨架
- `data/lab.js`：所有內容（作品、作品集、里程碑）
- `404.html`：找不到頁面時的頁面（獨立的 HTML，路徑都從根目錄寫）。同一份也放在 daybreak、tidemark/docs、morningbell、market-ticker/public、signals/paper/web、portfolio，改這裡要一起更新
- `assets/app.js`：從資料產生頁面；讀各作品的公開 JSON 顯示即時數據（GitHub Pages 允許跨來源讀取）
- `assets/app.css`：樣式。色場版：Jost ＋ Noto Sans TC，作品色階用 `color-mix()` 從 `--pc` 算，深色模式只換底色
- `assets/covers/`：作品與作品集封面
- `assets/media/<作品>/`：宣傳素材的網頁版（圖片轉 JPEG、影片轉成 720×1280 H.264，原始檔留在各作品的 release）
- `tools/covers.sh`：用 Chrome 無頭模式重拍線上作品的封面（一律淺色；名稱結尾 `-en` 的用英文瀏覽器語言拍，給英文版用）

本機預覽：`python3 -m http.server 8765` 後開 <http://127.0.0.1:8765/>。

舊版（暖灰報紙風）在 git 歷史裡：`git show 26b3600:index.html`。

## 隱私

Baseline 是私人健康資料，這裡只放產品說明，不放截圖或任何數據。OneStroke 的封面取自已公開的產品案例頁（人臉已模糊）。
