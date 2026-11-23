#!/bin/zsh
# 重拍作品封面：用 Chrome 無頭模式截各作品的線上首頁，存成 assets/covers/<名稱>.jpg（1200×750）。
# 用法：tools/covers.sh            全部重拍
#       tools/covers.sh daybreak   只拍一個
# Baseline 是私人資料，不截圖；OneStroke 的封面取自產品案例頁的圖。
set -e
cd "${0:A:h}/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
typeset -A SHOTS
SHOTS=(
  tidemark       "https://tidemark.aronlab.dev/"
  tidemark-en    "https://tidemark.aronlab.dev/en/"
  daybreak       "https://daybreak.aronlab.dev/"
  daybreak-en    "https://daybreak.aronlab.dev/"
  morningbell    "https://morningbell.aronlab.dev/?lang=zh#overview"
  morningbell-en "https://morningbell.aronlab.dev/?lang=en#overview"
  ticker         "https://ticker.aronlab.dev/#signal"
  signals        "https://signals.aronlab.dev/"
  tidemark-case  "https://tidemark.aronlab.dev/case-study/?lang=zh"
  tidemark-case-en "https://tidemark.aronlab.dev/case-study/en/?lang=en"
  daybreak-case  "https://daybreak.aronlab.dev/case-study/"
  daybreak-case-en "https://daybreak.aronlab.dev/case-study/en/"
  onestroke-case "https://aronlab.dev/onestroke/case-study/?lang=zh"
  onestroke-case-en "https://aronlab.dev/onestroke/case-study/en/?lang=en"
  everkeep-case  "https://aronlab.dev/everkeep/case-study/?lang=zh"
  everkeep-case-en "https://aronlab.dev/everkeep/case-study/en/?lang=en"
  peelback       "https://peelback.aronlab.dev/"
  paypulse       "https://paypulse.aronlab.dev/?lang=zh"
  paypulse-en    "https://paypulse.aronlab.dev/?lang=en"
)
# PayPulse 第一次打開會先跳出薪資設定，畫面也跟著現在幾點走：
# 拿它的頁面塞進示範設定和固定時間（平日週四 15:42），再拍。
# 中文版：新台幣月薪 50,000、09:00–18:00、午休一小時不計薪；英文版（-en）：美元月薪 5,000、09:00–17:30、午休半小時不計薪。
# 語言直接寫進 paypulse.lang，不靠瀏覽器語言判斷
typeset -A PREP
PREP=(
  paypulse "<base href=\"https://paypulse.aronlab.dev/\"><script>localStorage.setItem('paypulse.lang','zh');localStorage.setItem('paypulse.settings.v1',JSON.stringify({mode:'monthly',salary:50000,currency:'TWD',start:'09:00',end:'18:00',lunch:true,lunchStart:'12:00',lunchEnd:'13:00',lunchPaid:false,workdays:[1,2,3,4,5]}));(function(R){var off=new R('2026-11-05T15:42:00+08:00')-R.now();function D(){return arguments.length?new (Function.prototype.bind.apply(R,[null].concat([].slice.call(arguments))))():new R(R.now()+off)}D.prototype=R.prototype;D.now=function(){return R.now()+off};D.UTC=R.UTC;D.parse=R.parse;window.Date=D})(Date);</script>"
  paypulse-en "<base href=\"https://paypulse.aronlab.dev/\"><script>localStorage.setItem('paypulse.lang','en');localStorage.setItem('paypulse.settings.v1',JSON.stringify({mode:'monthly',salary:5000,currency:'USD',start:'09:00',end:'17:30',lunch:true,lunchStart:'12:00',lunchEnd:'12:30',lunchPaid:false,workdays:[1,2,3,4,5]}));(function(R){var off=new R('2026-11-05T15:42:00+08:00')-R.now();function D(){return arguments.length?new (Function.prototype.bind.apply(R,[null].concat([].slice.call(arguments))))():new R(R.now()+off)}D.prototype=R.prototype;D.now=function(){return R.now()+off};D.UTC=R.UTC;D.parse=R.parse;window.Date=D})(Date);</script>"
)
TMP=$(mktemp -d)
for name in ${@:-${(k)SHOTS}}; do
  url=${SHOTS[$name]}
  [[ -z $url ]] && { echo "沒有這個封面：$name"; continue; }
  if [[ -n ${PREP[$name]} ]]; then
    # 從旁邊的本機 checkout 讀（要先 git pull 到最新）；這台電腦的 curl／Python 連 github.io 常被重置，Chrome 不會
    src="../${name%-en}/index.html"   # paypulse-en 也讀 ../paypulse/
    [[ -f $src ]] || { echo "找不到 $src"; continue; }
    python3 -c 'import sys; h = open(sys.argv[1], encoding="utf-8").read(); assert "<head>" in h; print(h.replace("<head>", "<head>" + sys.argv[2], 1))' "$src" "${PREP[$name]}" > "$TMP/$name.html"
    url="file://$TMP/$name.html"
  fi
  # 減少動態效果，讓有進場動畫的標題直接顯示完成狀態；一律用淺色模式拍（不受這台電腦當下的深淺色影響）
  # 名稱結尾是 -en 的是英文版封面：瀏覽器語言設成英文，免得網站看到這台電腦的中文設定又切回中文
  lang=(); [[ $name == *-en ]] && lang=(--lang=en-US --accept-lang=en-US)
  # 2026-11-15：Chrome 有時截好圖、關閉時才逾時（結束碼 2），set -e 會讓整支腳本無聲停下；改成看有沒有截到圖。
  # 用自己的暫存設定檔，不跟其他對話開著的 Chrome 搶同一個設定檔
  TZ=Asia/Taipei "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --blink-settings=preferredColorScheme=1 $lang \
    --user-data-dir="$TMP/profile" --window-size=1440,900 --virtual-time-budget=15000 --screenshot="$TMP/$name.png" "$url" >/dev/null 2>&1 || true
  [[ -s "$TMP/$name.png" ]] || { echo "✗ $name：沒有截到圖"; continue; }
  sips -s format jpeg -s formatOptions 78 --resampleWidth 1200 "$TMP/$name.png" --out "assets/covers/$name.jpg" >/dev/null
  echo "✓ $name"
done
rm -rf "$TMP"
