# JoshYouWut GitHub Pages Package

This folder is the deploy-safe static package for GitHub Pages.

## Deploy Contents

- `index.html`
- `css/site.css`
- `js/site.js`
- `assets/jyw-logo.svg`
- `assets/audio/previews/*.m4a`
- `.nojekyll`

## Public Audio Rule

Only compressed preview audio belongs in this package.

Full WAV, AIFF, FLAC, ZIP, or delivery files must stay out of the public repo unless Josh explicitly approves public release.

## GitHub Pages Compatibility

The site uses relative asset paths, so it can run from either:

- a root domain such as `https://joshyouwut.com/`
- a project page such as `https://venticlaw.github.io/joshyouwut-site/`

## Current Commerce Status

Checkout and automatic delivery are disabled. Licensing links are inquiry-only through email until pricing, license terms, file delivery, and refund policy are approved.

## Catalog Workflow

The player reads `assets/data/beats.json`; adding a beat no longer requires editing JavaScript.

1. Add an approved, tagged 60-second AAC preview under `assets/audio/previews/`. Keep masters and trackouts private.
2. Add its catalog row with a stable unique `id`, `title`, `bpm` (number or null), `key`, `lane`, `use`, `genres`, `tags`, `description`, `file`, `published`, and `featured_order` (positive integer or null). Missing metadata must stay unspecified rather than guessed.
3. Use `featured_order` only for Josh's selected standouts. Featured beats sort first in that order; the rest sort by title. All published rows remain searchable and playable.
4. Run `node tools/validate-beats.mjs` and `node --check js/site.js`. Use `--expected=121` for the complete November catalog.
5. Verify preview duration/codec, desktop/mobile playback, filtering, and inquiry selection before deployment.

Only verified live Starter links may be enabled in `assets/commerce/checkout-config.json`. Each beat needs its own checkout URL and the Starter product must have `live: true` and `verified: true`. Premium and Exclusive stay inquiry-only. Manual fulfillment must be stated clearly; do not promise instant downloads.
