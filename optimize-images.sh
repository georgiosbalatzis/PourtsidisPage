#!/usr/bin/env bash
set -euo pipefail

# Requires: imagemagick (brew install imagemagick) and cwebp (brew install webp)
# Run from the project root.

cd "$(dirname "$0")/images"

for f in 1.jpg 2.jpg 3.jpg 4.jpg 6.png 8.jpg 9.jpg AboutUs.jpg; do
  base="${f%.*}"

  convert "$f" -resize 960x -quality 80 "${base}-medium.jpg"
  convert "$f" -resize 480x -quality 75 "${base}-small.jpg"
  cwebp -q 80 "$f" -o "${base}.webp"
done

convert banner.jpg -resize 768x -quality 80 banner-mobile.jpg

echo "Done. Check image sizes:"
du -sh ./*.jpg ./*.png ./*.webp 2>/dev/null | sort -h
