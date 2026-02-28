## 1. Data Flow — 新增 fullSrc 欄位

- [x] 1.1 修改 `src/components/photographer/MasonryGallery.vue` 的 `GalleryImage` interface，新增 `fullSrc: string` 欄位
- [x] 1.2 修改 `src/pages/index.astro`，在組 gallery images 時新增 `fullSrc: \`${R2_BASE}/${photo.src}\`` 欄位（R2 原始 URL，不經 cdn-cgi resizing）

## 2. Composable — useFullscreenZoom

- [x] 2.1 建立 `src/composables/useFullscreenZoom.ts`，封裝以下功能：
  - Fullscreen API 進入/退出（含 iOS Safari fallback 為 CSS fixed 模式）
  - `isFullscreen` reactive ref
  - `fullscreenElement` ref 指向需要全螢幕化的 DOM 元素
  - `enterFullscreen()` / `exitFullscreen()` 方法
  - 監聽 `fullscreenchange` 事件同步狀態
  - 在 `onMounted` 建立、`onUnmounted` 清理事件監聯
- [x] 2.2 在 composable 中實作 zoom/pan 狀態管理：
  - `scale` ref（1x–3x）、`translateX`/`translateY` ref
  - `handleWheel(e: WheelEvent)` — 以游標位置為錨點的 scroll zoom
  - `handlePointerDown/Move/Up` — 拖曳 pan（scale > 1 時）
  - `handlePinch` — 雙指 pinch zoom（觸控環境）
  - `handleDoubleClick` — 在 1x ↔ 2x 之間切換
  - `resetTransform()` — 重設為 1x 無偏移
  - pan boundary 限制邏輯
- [x] 2.3 在 composable 中實作原圖載入邏輯：
  - `fullImageSrc` ref（當前正在載入的 fullSrc）
  - `isFullImageLoaded` ref
  - `loadFullImage(url: string)` — 建立 Image 物件背景載入，完成後設定 flag
  - 切換圖片時釋放前一張 Image 物件引用
- [x] 2.4 在 composable 中實作控制項自動隱藏：
  - `controlsVisible` ref
  - 無操作 3 秒後淡出，pointer move / touch 時重新顯示
  - 清理 timer

## 3. Lightbox UI — 全螢幕按鈕與覆蓋層

- [x] 3.1 在 `src/components/photographer/Lightbox.vue` 新增全螢幕按鈕（expand icon），位置在 top-right 區域（close 按鈕左側），使用與現有 `.lightbox-control` 一致的樣式
- [x] 3.2 在 `Lightbox.vue` 中建立全螢幕覆蓋層模板：
  - 黑色全屏背景
  - 圖片容器（套用 `transform: scale() translate()` 的 CSS）
  - 底層顯示 lightboxSrc（佔位圖），上層顯示 fullSrc（原圖載入後替換）
  - 環形載入進度指示器（原圖載入中時顯示）
  - 退出全螢幕按鈕
  - 前/後導覽按鈕
  - zoom 層級指示文字（如 "2.0x"）
- [x] 3.3 整合 `useFullscreenZoom` composable 到 Lightbox.vue：
  - 綁定 wheel / pointer / touch 事件到全螢幕容器
  - 雙擊切換 zoom
  - 方向鍵/按鈕導覽（切換時 resetTransform + 載入新圖片的 fullSrc）
  - Escape 鍵在全螢幕中退出全螢幕（不關閉 Lightbox）

## 4. 樣式與動畫

- [x] 4.1 在 Lightbox.vue 的 `<style scoped>` 中新增全螢幕相關樣式：
  - 全螢幕容器 `background: #000`、`touch-action: none`
  - 控制項使用 `--color-accent-subtle` / `--color-accent` 主題色
  - 控制項 hover/active 動態與現有 `.lightbox-control` 一致
  - 控制項淡出/淡入 transition
  - 環形進度指示器 CSS 動畫
  - 圖片 zoom/pan 的 `transform` 過渡（雙擊切換時平滑、拖曳時無 transition）
  - 全螢幕 fallback 模式（iOS）的 CSS fixed 樣式
- [x] 4.2 確保 `cursor` 樣式正確：zoom-in（可放大時）、zoom-out（已放大時雙擊可縮小）、grab/grabbing（拖曳 pan 時）

## 5. 鍵盤與無障礙

- [x] 5.1 更新 Lightbox.vue 的 `onKeydown` 處理：
  - 全螢幕模式中 Escape 退出全螢幕（不關閉 Lightbox）
  - 全螢幕模式中方向鍵切換圖片（重設 zoom）
  - 新增 `f` 鍵快捷鍵進入全螢幕
- [x] 5.2 為全螢幕按鈕和控制項新增適當的 `aria-label`
