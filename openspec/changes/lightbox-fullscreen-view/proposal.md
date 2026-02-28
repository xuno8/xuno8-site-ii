## Why

Lightbox 目前顯示的是經 Cloudflare Image Resizing 縮至 2048px 的圖片，使用者無法以原始解析度（最大 6192×4128）細看照片。攝影作品的細節與質感是核心價值，需要提供全螢幕原圖瀏覽能力，同時維持流暢的使用體驗。

## What Changes

- 在 Lightbox 控制列新增「全螢幕」按鈕，進入瀏覽器 Fullscreen API 全螢幕模式
- 全螢幕模式載入並顯示原始尺寸圖片（R2 原始 URL，無 cdn-cgi resizing）
- 原圖以原始比例呈現，支援平移（pan）與縮放（pinch-zoom / scroll-zoom）以探索細節
- 提供退出全螢幕的按鈕與鍵盤快捷鍵（Escape）
- 全螢幕中保留前/後切換能力
- 大圖載入時顯示進度指示器，避免使用者看到空白畫面

## Non-goals

- 不修改現有 gallery grid 或 lightbox 的基本瀏覽流程
- 不增加圖片編輯或下載功能
- 不改變現有 lightbox 的 resized image 顯示邏輯

## Capabilities

### New Capabilities
- `fullscreen-zoom`: 全螢幕原圖瀏覽功能，包含進入/退出全螢幕、原圖載入、平移與縮放互動

### Modified Capabilities
- `immersive-lightbox`: 新增全螢幕入口按鈕，整合全螢幕狀態與既有 lightbox 控制項的互動

## Impact

- **Components**: `Lightbox.vue` — 新增全螢幕按鈕、全螢幕覆蓋層
- **Composables**: 新增 `useFullscreenZoom.ts` — 封裝 Fullscreen API、zoom/pan 狀態邏輯
- **Data flow**: 需要將原始圖片 URL（`${R2_BASE}/${photo.src}`）傳入 Lightbox，目前僅傳 `thumbSrc` 與 `lightboxSrc`
- **Types**: `GalleryImage` interface 需新增 `fullSrc` 欄位
- **Pages**: `index.astro` 需組出原始圖片 URL 並傳入 props
- **Performance**: 原圖檔案較大（最大約 6000×4000），需注意載入體驗
- **Browser API**: 依賴 Fullscreen API（主流瀏覽器皆支援）
