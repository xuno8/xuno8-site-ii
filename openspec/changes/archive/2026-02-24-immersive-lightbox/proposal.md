## Why

Photographer 模式的 Lightbox 體驗生硬且不夠沈浸。具體問題：Lightbox 被困在 `main` 的 stacking context 裡導致 Footer/ModeToggle 不會被遮蓋、開啟/關閉完全無動畫（瞬間 mount/unmount）、圖片佔比過小（max-w-5xl + px-16 + max-h-75vh 的多重限制）。

## What Changes

- **Teleport Lightbox**：使用 Vue `<Teleport to="body">` 將 Lightbox 移出 `main` 的 stacking context，徹底解決 z-index 層疊問題
- **隱藏外部 UI**：新增 `lightboxOpen` nanostore atom，Lightbox 開啟時隱藏 `#toggle-wrapper`（ModeToggle）和 `<footer>`
- **GSAP 進場/退場動畫**：使用 GSAP timeline 編排 backdrop 淡入 → image scale+fade → caption 滑入的動畫序列，關閉時反向播放
- **圖片最大化**：移除 max-w-5xl 限制、縮小 padding、提高 max-h 到 ~95vh，讓圖片盡可能佔滿視窗
- **Caption 浮動覆蓋**：Caption/metadata 改為浮動疊加在圖片底部（半透明背景），不再佔用垂直空間

## Non-goals

- 不做 FLIP 動畫（從縮略圖展開到全屏的位置過渡動畫）
- 不改變 MasonryGallery 的排版或進場動畫
- 不新增圖片載入的 skeleton/placeholder

## Capabilities

### New Capabilities
- `immersive-lightbox`: 沈浸式全屏 Lightbox 體驗，涵蓋動畫、UI 隱藏、圖片最大化、caption 浮動覆蓋

### Modified Capabilities

_(none — no existing spec-level requirements are changing)_

## Impact

- `src/stores/lightbox.ts` (新檔案) — lightboxOpen atom
- `src/composables/useLightbox.ts` — 整合 lightboxOpen store
- `src/components/photographer/Lightbox.vue` — 重寫佈局與動畫
- `src/components/photographer/MasonryGallery.vue` — 加 Teleport wrapper
- `src/pages/index.astro` — 監聽 lightboxOpen，隱藏 footer/toggle-wrapper
- 無新依賴（GSAP、Nanostores 已存在）
