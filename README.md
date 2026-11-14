# Aron Lab

**自己每天要用的，就自己做成產品。** 我所有作品的入口、分頁索引與作品集。

網站：<https://aronlab.dev/>

| # | 作品 | 是什麼 | 狀態 |
|---|---|---|---|
| 01 | [Tidemark](https://tidemark.aronlab.dev/) | BTC 週期頂部／底部訊號儀表板 | 已上線 · 每日更新 |
| 02 | [Daybreak](https://daybreak.aronlab.dev/) | 每天清晨的比特幣簡報 | 已上線 · 每日出刊 |
| 03 | [Morningbell 晨鐘](https://morningbell.aronlab.dev/) | 給長期投資人的美股、台股日報 | 已上線 · 每天兩刊 |
| 04 | [Market Ticker](https://ticker.aronlab.dev/) | 副螢幕行情看板，7 個主題 | 已上線 · 即時 |
| 05 | OneStroke 一拍 | 網球揮拍分析（[產品案例](https://aronlab.dev/onestroke/case-study/)） | 自用 · 本機 |
| 06 | Baseline 身體日報 | 私人健康日報 | 只在本機，不公開 |
| 07 | [Signal Tower](https://signals.aronlab.dev/) | BTC 策略帳戶的紙上交易：S1 突破 × D 趨勢 | 已上線 · 每 4 小時更新 |
| 08 | [PayPulse 薪跳](https://paypulse.aronlab.dev/) | 上班鼓勵器：即時顯示今天已經賺了多少 | 已上線 · 每秒跳動 |
| 09 | [Everkeep](https://everkeep.aronlab.dev/) | Ethan 的作品照照片重建成 3D：小島和展覽室（[產品案例](https://aronlab.dev/everkeep/case-study/)） | 已上線 · 有新作品就加 |

## 頁面

設計是「色場」：向 Josef Albers《向方形致敬》致意。每個作品一整片平面色場，內外三層方形，內層往下偏；不用陰影、光暈或玻璃。每個作品的四個色階都由 `data/lab.js` 的 `color` 算出來。

| # | 章節 | 內容 |
|---|---|---|
| — | 首屏 | 開場是 ARON LAB 大標誌（品牌橘），下一張跳到台北現在這個時間該看的作品（照各作品排程：Morningbell 晨刊 07:00／午後刊 16:00、Tidemark 08:15、Daybreak 08:30、Signal Tower 4 小時 K 線、平日 17:00 PayPulse 倒數下班、其餘時間 Market Ticker；排程在 `assets/app.js` 的 `SLOTS`），之後每 4.2 秒換下一個作品，每一輪回到開場那張。換場（參考燈箱海報換張的節奏）：三層方形由內往外換色，整片背景和頂欄最後；中間換成那個作品的幾何符號（平塗的小圖形＋一個動作，寫在 `assets/app.js` 的 `MARKS`），ARON LAB 移到最外圈上緣；作品名用切換語言那套方塊碎字拼出來。滑鼠停在方形或右下角說明上時先不換，「減少動態」時不輪播；右下角顯示那個作品的即時數據（Tidemark 訊號、Daybreak BTC 收盤、Morningbell S&P／加權、Market Ticker 版本）；底部是作品數、已上線數、入口數 |
| 01 | 作品 | 每個作品一整片色場：方形裡是領域符號（加密＝圓、股市＝方、運動＝三角、健康＝半圓、職場＝菱形），滑過（手機是捲到畫面中間）顯示畫面，沒有畫面的作品留著符號；旁邊是簡介、即時數據、所有版面／分頁色塊、按鈕與「全部 N 個入口」（只有 1 個入口的不顯示） |
| 02 | 分頁索引 | 所有入口（首頁、分頁、作品集章節、語言版本、資料、工具、原始碼、本機、舊版、封存主題），預設每個作品只露出第一列、其餘折疊（搜尋或只看單一作品時全部攤開）；可搜尋、依作品或類型篩選（沒有結果時有一鍵清除）；按 `/` 直接搜尋 |
| 03 | 作品集 | 案例研究：Tidemark 作品集、Daybreak、OneStroke 與 Everkeep 產品案例；封面平常是混色，滑過（手機是捲到畫面中間）變回原色 |
| 04 | 宣傳素材 | 有 `promo` 的作品會出現在這裡：影片（捲到畫面裡自動靜音播放，減少動態或省流量模式就不自動播；有配樂的右上角可以開聲音；橫式影片比直式素材大一號）、海報、說明圖橫向捲動，點圖放大（← → 切換、Esc 關閉），附下載。目前有 Daybreak 新版首頁展示影片、Everkeep 介紹影片、OneStroke 影片／海報／說明圖 |
| 05 | 時間軸 | 每個作品從開工到今天的甘特圖，加上里程碑紀錄（先列最近 10 筆，其餘按「顯示全部」展開） |

配色：自動（跟系統）／淺／深，右上角切換並記住；深色時色場改用深色色階。切換時參考 Daybreak 的日夜開關：Daybreak 是一圈晨昏光從開關擴散，這裡換成 Albers 的方形——新配色從按下的按鈕長成一個方形蓋過整頁，中間露出兩圈平面色帶（外圈是正在看的作品顏色、內圈往新配色調深或調淺）。用 View Transitions，不支援的瀏覽器或「減少動態」時直接換。

語言：中文／English。第一次來依 IP 地區決定（台灣、香港、澳門、中國用中文，其他用英文；由 `functions/index.js` 在 Cloudflare 判斷，north7.github.io 那邊看瀏覽器語言），右上角切換並記住（手機上只顯示另一種語言，按一下就切）。切換時也參考 Daybreak：畫面上的字先從左到右碎成小方塊（中文換全形方塊、英文換半格方塊），換頁回到原本的位置後，再從左到右拼回另一種語言；`index.html` 的 `rel="expect"` 讓新頁第一個畫面就是方塊，不會先閃出原文。第一次來看網址的 `?lang=en|zh`，沒有就看瀏覽器語言：有中文就用中文，其他都用英文。英文版的作品連結會直接連到各作品的英文版（Tidemark 的 `en/`、Daybreak 產品案例的 `en/`），只有中文的頁面標「(Chinese)」。404 頁跟著同一個設定。

Logo：Aron 的「A_」（黑色 A＋橘色橫槓，`assets/logo.svg`）。頂欄、首屏、頁尾、404 頁、網站圖示都用它；頁面裡用 `<use href="#logo">` 重複使用，顏色由 `--logo-a`、`--logo-bar` 決定。品牌色：墨 #0B0B0C、橘 #F5801C（`--brand`）、紙 #F2F0EA。

小細節：
- 頂欄 logo 的橫槓像游標：看到哪個作品就換成那個作品的顏色，其他地方是品牌橘
- 點作品名稱旁的小色塊、或頁尾色票，複製那個作品的色碼；頁尾最後的空方塊點一下，幫下一個作品隨機挑顏色
- 鍵盤：`/` 搜尋、`1`–`8` 跳到作品（有幾個作品就到幾）、`t` 切換深淺色、`?` 看說明
- 彩蛋：點首屏的「Josef Albers」或在頁面上打 `albers`，看《色彩互動》的同色錯覺；開發者主控台也有一段話
- `404.html`：打錯網址時的頁面，猜你要找哪個作品；搜尋框會帶 `?q=` 回首頁的索引

## 加一個新作品

全部內容都在 `data/lab.js`，頁面、索引、時間軸、頂欄標記、頁尾都會自動長出來，不用改 HTML。

1. 在 `products` 最後加一筆，`no` 接著編（`'07'`）
2. 有封面就放 `assets/covers/<名稱>.jpg`（1200×750，16:10）；線上網站可以把網址加進 `tools/covers.sh` 再執行
3. 想記錄里程碑就加到 `milestones`
4. 英文版：每一筆都加 `en`（見下面的例子），沒加的地方英文版會直接顯示中文
5. 首屏中間的幾何符號：到 `assets/app.js` 的 `MARKS` 加一個（100×100 的平塗小圖形＋一個動作）；沒加就用它第一個領域的形狀，慢慢呼吸
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
  site: 'https://aronlab.dev/newthing/',   // 沒有線上版就寫 null
  repo: 'https://github.com/North7/newthing',
  cover: 'assets/covers/newthing.jpg',          // 沒有就寫 null（會顯示「私人」封面）
  sectionsLabel: '頁面',
  sections: [{ n: '01', t: '總覽', u: '#overview' }],   // u 相對於 site；不寫 u 就只顯示、不連結
  links: [{ t: 'English', u: 'en/', type: 'lang' }],     // type：case lang tool data social repo local legacy archive
  promo: null,  // 宣傳素材，格式見 OneStroke：dir 底下放 slide-01.jpg（1080 寬）＋slide-01-s.jpg（640 寬）…、poster、pdf、video；
                // 都可以省略。video 預設直式，橫式加 ar: '16 / 9'，有配樂加 sound: true（見 Daybreak）
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
- `404.html`：找不到頁面時的頁面（獨立的 HTML，路徑都從根目錄寫）。同一份也放在 daybreak、tidemark/docs、morningbell、market-ticker/public、signals/paper/web、portfolio、paypulse，改這裡要一起更新
- `assets/app.js`：從資料產生頁面；讀各作品的公開 JSON 顯示即時數據（GitHub Pages 允許跨來源讀取）
- `assets/app.css`：樣式。色場版：Jost ＋ Noto Sans TC，作品色階用 `color-mix()` 從 `--pc` 算，深色模式只換底色
- `assets/logo.svg`：Aron 的 logo（向量，照原圖量出來的）；`assets/favicon.svg`、`assets/apple-touch-icon.png`：網站圖示
- `assets/covers/`：作品與作品集封面
- `assets/media/<作品>/`：宣傳素材的網頁版（圖片轉 JPEG、影片用 H.264；原始檔留在各作品那邊：OneStroke 在 release，Daybreak 在 daybreak-ops 的 ops/video/out/，目前用 v4；Everkeep 在 everkeep 的 docs/everkeep-intro.mp4，網頁用的是手機版）
- `tools/covers.sh`：用 Chrome 無頭模式重拍線上作品的封面（一律淺色；名稱結尾 `-en` 的用英文瀏覽器語言拍，給英文版用；需要先準備的頁面寫在 `PREP`：PayPulse 從旁邊的本機 checkout 讀，塞進示範薪資設定和固定時間「平日 15:42」再拍）

本機預覽：`python3 -m http.server 8765` 後開 <http://127.0.0.1:8765/>。

舊版（暖灰報紙風）在 git 歷史裡：`git show 26b3600:index.html`。

## 隱私

Baseline 是私人健康資料，這裡只放產品說明，不放截圖或任何數據。OneStroke 的封面取自已公開的產品案例頁（人臉已模糊）。
