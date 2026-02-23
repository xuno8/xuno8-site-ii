## Why

The site currently has no favicon and uses a static title regardless of which mode (developer/photographer) is active. Adding mode-aware favicons and titles reinforces the dual-identity concept and provides clearer browser-tab context when users switch modes.

## What Changes

- Add two inline SVG favicons: a code bracket (`</>`) icon for developer mode and a camera aperture icon for photographer mode.
- Dynamically switch the favicon when the user toggles between developer and photographer modes.
- Dynamically update `document.title` to reflect the active mode (`Tim Lin — Software Engineer` vs `Tim Lin — Photographer`).
- Initialize both favicon and title in the pre-hydration script so they are correct on first paint.

## Non-goals

- Generating `.ico` or `.png` fallback favicons for legacy browsers.
- Adding Apple Touch icons or PWA manifest icons.
- Changing the site's Open Graph or SEO meta tags dynamically (these remain static for crawlers).

## Capabilities

### New Capabilities
- `mode-favicon`: SVG favicon that switches between developer and photographer variants based on current mode.
- `mode-title`: Dynamic document title that updates when the user switches mode.

### Modified Capabilities

_(none — no existing spec-level behavior is changing)_

## Impact

- `src/layouts/Layout.astro` — add `<link rel="icon">` and extend the pre-hydration script.
- `src/stores/mode.ts` — add a listener to update favicon and title on mode change.
- No new dependencies required.
