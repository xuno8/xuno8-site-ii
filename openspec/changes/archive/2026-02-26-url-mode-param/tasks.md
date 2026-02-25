## 1. Pre-hydration Script (Astro-side)

- [x] 1.1 修改 `src/layouts/Layout.astro` 的 `is:inline` pre-hydration script：解析 `URLSearchParams` 取得 `m` 參數，映射 `p` → `photographer`、`d` → `developer`，其餘值及未帶參數 fallback 為 `developer`，將結果存入 `window.__INITIAL_MODE__`
- [x] 1.2 修改 pre-hydration script：用 `window.__INITIAL_MODE__` 設定 `document.documentElement.dataset.theme`（取代寫死的 `developer`），並移除 `<html>` 上寫死的 `data-theme="developer"` 屬性
- [x] 1.3 修改 pre-hydration script：用 `window.__INITIAL_MODE__` 決定初始 favicon 和 document.title（取代寫死的 `favicons.developer` / `titles.developer`）

## 2. Content Display 切換 (Astro-side)

- [x] 2.1 在 `src/pages/index.astro` 的 `</main>` 後新增 `is:inline` script，讀取 `window.__INITIAL_MODE__` 切換 `#developer-content` / `#photographer-content` 的 display

## 3. Hydration Mismatch 修復 (Astro-side)

- [x] 3.1 將 `src/pages/index.astro` 中 `ModeToggle` 從 `client:load` 改為 `client:only="vue"`，避免 SSR DOM 與 client state 不一致
- [x] 3.2 將 `src/pages/index.astro` 中 `ModeTransitionController` 從 `client:load` 改為 `client:only="vue"`

## 4. Nanostores Atom (Vue-side)

- [x] 4.1 修改 `src/stores/mode.ts`：atom 初始值保持 `developer`，client 端讀取 `window.__INITIAL_MODE__` 後呼叫 `currentMode.set()` 同步狀態
