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
  morningbell    "https://morningbell.aronlab.dev/#overview"
  ticker         "https://ticker.aronlab.dev/#signal"
  signals        "https://signals.aronlab.dev/"
  tidemark-case  "https://tidemark.aronlab.dev/case-study/"
  daybreak-case  "https://daybreak.aronlab.dev/case-study/"
  daybreak-case-en "https://daybreak.aronlab.dev/case-study/en/"
  onestroke-case "https://aronlab.dev/onestroke/case-study/"
  everkeep-case  "https://aronlab.dev/everkeep/case-study/"
  paypulse       "https://paypulse.aronlab.dev/"
)
# PayPulse 第一次打開會先跳出薪資設定，畫面也跟著現在幾點走：
# 拿它的頁面塞進示範設定（月薪 50,000、09:00–18:00、午休不計薪）和固定時間（平日週四 15:42），再拍
typeset -A PREP
PREP=(
  paypulse "<base href=\"https://paypulse.aronlab.dev/\"><script>localStorage.setItem('paypulse.settings.v1',JSON.stringify({mode:'monthly',salary:50000,currency:'TWD',start:'09:00',end:'18:00',lunch:true,lunchStart:'12:00',lunchEnd:'13:00',lunchPaid:false,workdays:[1,2,3,4,5]}));(function(R){var off=new R('2026-11-05T15:42:00+08:00')-R.now();function D(){return arguments.length?new (Function.prototype.bind.apply(R,[null].concat([].slice.call(arguments))))():new R(R.now()+off)}D.prototype=R.prototype;D.now=function(){return R.now()+off};D.UTC=R.UTC;D.parse=R.parse;window.Date=D})(Date);</script>"
)
TMP=$(mktemp -d)
for name in ${@:-${(k)SHOTS}}; do
  url=${SHOTS[$name]}
  [[ -z $url ]] && { echo "沒有這個封面：$name"; continue; }
  if [[ -n ${PREP[$name]} ]]; then
    # 從旁邊的本機 checkout 讀（要先 git pull 到最新）；這台電腦的 curl／Python 連 github.io 常被重置，Chrome 不會
    src="../$name/index.html"
    [[ -f $src ]] || { echo "找不到 $src"; continue; }
    python3 -c 'import sys; h = open(sys.argv[1], encoding="utf-8").read(); assert "<head>" in h; print(h.replace("<head>", "<head>" + sys.argv[2], 1))' "$src" "${PREP[$name]}" > "$TMP/$name.html"
    url="file://$TMP/$name.html"
  fi
  # 減少動態效果，讓有進場動畫的標題直接顯示完成狀態；一律用淺色模式拍（不受這台電腦當下的深淺色影響）
  # 名稱結尾是 -en 的是英文版封面：瀏覽器語言設成英文，免得網站看到這台電腦的中文設定又切回中文
  lang=(); [[ $name == *-en ]] && lang=(--lang=en-US --accept-lang=en-US)
  TZ=Asia/Taipei "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --blink-settings=preferredColorScheme=1 $lang \
    --window-size=1440,900 --virtual-time-budget=15000 --screenshot="$TMP/$name.png" "$url" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 78 --resampleWidth 1200 "$TMP/$name.png" --out "assets/covers/$name.jpg" >/dev/null
  echo "✓ $name"
done
rm -rf "$TMP"
