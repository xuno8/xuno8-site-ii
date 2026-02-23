## 1. State 層（Nanostore）

- [x] 1.1 建立 `src/stores/lightbox.ts`，匯出 `lightboxOpen` atom（`atom<boolean>`，預設 `false`）

## 2. Composable 整合

- [x] 2.1 修改 `src/composables/useLightbox.ts`：`open()` 時設 `lightboxOpen.set(true)`，`close()` 改為接受一個 `onComplete` callback（供動畫結束後呼叫），在 callback 中設 `lightboxOpen.set(false)`

## 3. Lightbox 重寫（Vue island）

- [x] 3.1 修改 `src/components/photographer/Lightbox.vue` 佈局：移除外層 `max-w-5xl`，將 `px-16` 縮減為 `px-12`，圖片 `max-h` 提高至 `92vh`
- [x] 3.2 將 caption 改為 `position: absolute; bottom: 0` 浮動覆蓋，加半透明漸層背景（`linear-gradient(transparent, rgba(0,0,0,0.7))`），無 caption 時不渲染
- [x] 3.3 新增 GSAP 進場動畫：`onMounted` 中建立 timeline — backdrop 淡入（250ms）→ image scale(0.92→1) + opacity(0→1)（400ms）→ caption 滑入（300ms）→ controls 淡入（300ms）
- [x] 3.4 新增 GSAP 退場動畫：關閉時 `timeline.reverse()`，`onReverseComplete` callback 中呼叫 `close()` 的 `onComplete`
- [x] 3.5 加入 `prefers-reduced-motion` 檢測：若啟用則跳過所有 GSAP 動畫，直接顯示/隱藏
- [x] 3.6 處理快速開關情境：若 timeline 正在播放中觸發新的開/關操作，先 `kill()` 再重建

## 4. MasonryGallery Teleport（Vue island）

- [x] 4.1 修改 `src/components/photographer/MasonryGallery.vue`：用 `<Teleport to="body">` 包住 `<Lightbox>` 元件
- [x] 4.2 將 `v-if="isOpen"` 改為監聽新的 `isVisible` ref（由 useLightbox 提供），確保動畫完成後才移除 DOM

## 5. Astro 頁面整合

- [x] 5.1 修改 `src/pages/index.astro`：新增 inline script 引入 `lightboxOpen` store，subscribe 監聯變化，toggle `#toggle-wrapper` 和 `<footer>` 的隱藏 class（fade out 動畫）
- [x] 5.2 在 `index.astro` 的 `<style is:global>` 中新增 footer/toggle-wrapper 隱藏時的 CSS class（opacity + pointer-events transition）
