#!/usr/bin/env bash
# Render a worksheet HTML to PDF via headless Chrome, report page count + per-page fill,
# and rasterize pages so you can eyeball them. Flags near-empty (orphan) pages.
# Usage: bash scripts/render_check.sh <worksheet.html>

set -u
HTML="${1:-}"
if [ -z "$HTML" ] || [ ! -f "$HTML" ]; then
  echo "usage: bash render_check.sh <worksheet.html>" >&2
  exit 2
fi

CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
  [ -x "$c" ] && CHROME="$c" && break
done
if [ -z "$CHROME" ]; then
  echo "No Chromium-family browser found. Open the HTML manually to review." >&2
  exit 3
fi

base="${HTML%.html}"
pdf="${base}.pdf"
dir="$(cd "$(dirname "$HTML")" && pwd)"
file="$(basename "$HTML")"

# unique-name copy busts Chrome's URL cache (it can serve a stale render)
stamp="$(date +%s 2>/dev/null || echo r)"
tmp="${dir}/.rc-${stamp}.html"
cp "$HTML" "$tmp"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$pdf" "file://$tmp" 2>/dev/null
rm -f "$tmp"

if [ ! -f "$pdf" ]; then
  echo "render failed" >&2
  exit 4
fi

pages="$(pdfinfo "$pdf" 2>/dev/null | awk '/Pages/{print $2}')"
echo "PDF: $pdf"
echo "Pages: ${pages:-unknown}"

if command -v pdftoppm >/dev/null 2>&1; then
  rm -f "${base}"-pg-*.png
  pdftoppm -png -r 70 "$pdf" "${base}-pg"
  if command -v magick >/dev/null 2>&1; then
    echo "Per-page fill (1.000 = blank; ~0.98+ = near-empty orphan to fix):"
    for p in "${base}"-pg-*.png; do
      [ -f "$p" ] || continue
      m="$(magick "$p" -format '%[fx:mean]' info: 2>/dev/null)"
      echo "  $(basename "$p")  $m"
    done
  fi
  echo "Rasterized pages: ${base}-pg-*.png  (read these to verify the design)"
else
  echo "pdftoppm not found; open $pdf to review." >&2
fi
