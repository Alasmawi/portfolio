#!/usr/bin/env bash
# Regenerate the hero sky variants from a source photo.
#
#   scripts/make-hero.sh ~/Downloads/clouds.jpg
#
# Writes hero-700 / hero-1200 / hero-2000 / hero-2800.webp into src/assets/hero/.
# The component picks between them by srcset, so a phone never pays for the
# desktop file. Quality is tuned per size: the small variants are only ever
# displayed small, and spending bytes on them buys nothing visible.
set -euo pipefail

SRC="${1:-}"
if [[ -z "$SRC" || ! -f "$SRC" ]]; then
    echo "usage: $0 <source-image>" >&2
    exit 1
fi

cd "$(dirname "$0")/.."
OUT="src/assets/hero"
mkdir -p "$OUT"

# cwebp comes from the webp package; ffmpeg is the fallback since it is already
# on this machine for the demo recordings.
if command -v cwebp > /dev/null 2>&1; then
    encode() { # width quality target
        cwebp -quiet -resize "$1" 0 -q "$2" -m 6 "$SRC" -o "$3"
    }
elif command -v ffmpeg > /dev/null 2>&1; then
    encode() {
        ffmpeg -y -loglevel error -i "$SRC" \
            -vf "scale=$1:-2:flags=lanczos" -c:v libwebp -quality "$2" -compression_level 6 "$3"
    }
else
    echo "need cwebp or ffmpeg" >&2
    exit 1
fi

encode 700 78 "$OUT/hero-700.webp"
encode 1200 80 "$OUT/hero-1200.webp"
encode 2000 82 "$OUT/hero-2000.webp"
encode 2800 84 "$OUT/hero-2800.webp"

echo
ls -lh "$OUT"/hero-*.webp | awk '{print $9, $5}'
