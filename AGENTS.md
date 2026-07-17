# AGENTS.md

## Repository overview

This repository contains a static website for generators. The main pages are
`index.html` and `index-en.html`; shared styling lives in `styles.css`, and
browser interactions live in `script.js`. Images and logos are stored in
`images/`. There is no package manager, build system, or automated test suite.

## Making changes

- Keep the site dependency-free and use plain HTML, CSS, and browser JavaScript.
- Keep the Greek and English pages structurally aligned when changing shared
  sections, navigation, forms, or product content.
- Reuse the existing class names, responsive layout patterns, and accessibility
  attributes before introducing new ones.
- Preserve existing image filenames and paths, including filenames containing
  Greek characters. Update references in both HTML pages when replacing assets.
- Keep generated image variants in `images/` consistent with the source image.

## Images

`optimize-images.sh` uses ImageMagick to generate WebP variants and favicons.
Run it from the repository root only when ImageMagick is installed and the
source assets are present:

```sh
./optimize-images.sh
```

Review the generated file sizes and visual quality before committing generated
assets.

## Validation

There is no configured automated test command. Before handing off a change:

1. Open the affected HTML page(s) in a browser or serve the repository with a
   local static server.
2. Check desktop and mobile layouts, navigation behavior, anchor scrolling,
   product tabs, and contact-form validation when relevant.
3. Inspect the browser console for JavaScript errors and verify that referenced
   assets load successfully.
4. Run `git diff --check` to catch whitespace errors.

## Version-control hygiene

Do not commit editor metadata such as `.DS_Store`. Include optimized image
outputs only when they are part of the intended website change.
