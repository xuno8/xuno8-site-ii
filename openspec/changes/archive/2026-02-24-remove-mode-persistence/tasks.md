## 1. Simplify mode store

- [x] 1.1 Remove `getInitialMode()` function and replace `atom<Mode>(getInitialMode())` with `atom<Mode>('developer')` in `src/stores/mode.ts`
- [x] 1.2 Remove `localStorage.setItem('portfolio-mode', mode)` call from `currentMode.listen()` in `src/stores/mode.ts`
- [x] 1.3 Remove `window.__INITIAL_MODE__` read from `src/stores/mode.ts`

## 2. Simplify pre-hydration script (Astro-side)

- [x] 2.1 Remove `localStorage.getItem('portfolio-mode')` from the inline script in `src/layouts/Layout.astro`
- [x] 2.2 Remove `window.__INITIAL_MODE__` assignment from the inline script in `src/layouts/Layout.astro`
- [x] 2.3 Hardcode `mode = 'developer'` and simplify the script to only set favicon and title for developer mode (keep `window.__FAVICONS__` and `window.__TITLES__` for runtime toggle)

## 3. Update specs

- [x] 3.1 Update `openspec/specs/mode-favicon/spec.md` — remove "Photographer mode favicon from persisted mode" scenario, simplify "SVG favicon rendered on page load" to always use developer icon

## 4. Verify

- [x] 4.1 Run `npm run build` — confirm no build errors
- [x] 4.2 Manual test: open the site, confirm developer mode loads by default
- [x] 4.3 Manual test: toggle to photographer, close tab, reopen — confirm developer mode loads (not photographer)
- [x] 4.4 Manual test: toggle modes at runtime — confirm favicon and title still switch correctly
