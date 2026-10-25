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
  tidemark       "https://north7.github.io/tidemark/"
  tidemark-en    "https://north7.github.io/tidemark/en/"
  daybreak       "https://north7.github.io/daybreak/#overview"
  morningbell    "https://north7.github.io/morningbell/#overview"
  ticker         "https://north7.github.io/market-ticker/#signal"
  signals        "https://north7.github.io/signals/"
  tidemark-case  "https://north7.github.io/tidemark/case-study/"
  daybreak-case  "https://north7.github.io/daybreak/case-study/"
  daybreak-case-en "https://north7.github.io/daybreak/case-study/en/"
  onestroke-case "https://north7.github.io/portfolio/onestroke/"
  portfolio      "https://north7.github.io/portfolio/"
)
TMP=$(mktemp -d)
for name in ${@:-${(k)SHOTS}}; do
  url=${SHOTS[$name]}
  [[ -z $url ]] && { echo "沒有這個封面：$name"; continue; }
  # 減少動態效果，讓有進場動畫的標題直接顯示完成狀態；一律用淺色模式拍（不受這台電腦當下的深淺色影響）
  # 名稱結尾是 -en 的是英文版封面：瀏覽器語言設成英文，免得網站看到這台電腦的中文設定又切回中文
  lang=(); [[ $name == *-en ]] && lang=(--lang=en-US --accept-lang=en-US)
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --blink-settings=preferredColorScheme=1 $lang \
    --window-size=1440,900 --virtual-time-budget=15000 --screenshot="$TMP/$name.png" "$url" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 78 --resampleWidth 1200 "$TMP/$name.png" --out "assets/covers/$name.jpg" >/dev/null
  echo "✓ $name"
done
rm -rf "$TMP"
