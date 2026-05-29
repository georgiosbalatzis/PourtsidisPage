#!/usr/bin/env bash
set -euo pipefail

# Requires: imagemagick (brew install imagemagick)
# Run from the project root.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR/images"

shopt -s nullglob

for f in *.jpg *.jpeg *.png; do
  base="${f%.*}"
  magick "$f" -auto-orient -strip -quality 78 -define webp:method=6 "${base}.webp"
done

for f in 1.jpg 2.jpg 3.jpg 4.jpg 6.png 8.jpg 9.jpg AboutUs.jpg; do
  base="${f%.*}"

  magick "$f" -auto-orient -resize 960x -strip -quality 76 -define webp:method=6 "${base}-medium.webp"
  magick "$f" -auto-orient -resize 480x -strip -quality 60 -define webp:method=6 "${base}-small.webp"
done

magick banner.jpg -auto-orient -strip -quality 78 -define webp:method=6 banner.webp
magick banner.jpg -auto-orient -resize 768x -strip -quality 74 -define webp:method=6 banner-mobile.webp

cd "$ROOT_DIR"
magick images/pslogo.png -auto-orient -resize 256x256 -background transparent -gravity center -extent 256x256 -strip -quality 90 -define webp:method=6 favicon.webp
magick images/pslogo.png -auto-orient -resize 256x256 -background transparent -gravity center -extent 256x256 -define icon:auto-resize=64,48,32,16 favicon.ico

echo "Done. Check image sizes:"
du -sh images/*.webp favicon.ico favicon.webp 2>/dev/null | sort -h
