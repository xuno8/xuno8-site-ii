## 1. SVG Favicon Assets

- [x] 1.1 Design developer mode SVG icon (code bracket `</>`) and encode as a data URI constant
- [x] 1.2 Design photographer mode SVG icon (camera aperture) and encode as a data URI constant

## 2. Layout & Pre-hydration (Astro-side)

- [x] 2.1 Add a `<link rel="icon" type="image/svg+xml">` element to `<head>` in `src/layouts/Layout.astro`
- [x] 2.2 Extend the existing pre-hydration `<script is:inline>` in `Layout.astro` to set the favicon href and `document.title` based on the persisted mode before first paint

## 3. Runtime Mode Switching (Vue/Store-side)

- [x] 3.1 Add a `currentMode.listen()` callback in `src/stores/mode.ts` that updates the favicon `<link>` href when the mode changes
- [x] 3.2 Add a `currentMode.listen()` callback in `src/stores/mode.ts` that updates `document.title` when the mode changes

## 4. Verification

- [x] 4.1 Verify favicon and title are correct on cold load in developer mode (default)
- [x] 4.2 Verify favicon and title are correct on cold load with `localStorage` set to photographer mode
- [x] 4.3 Verify favicon and title switch immediately when toggling modes at runtime
