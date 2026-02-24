## 1. Gallery Shimmer Placeholder (MasonryGallery.vue)

- [x] 1.1 新增 `loadedImages: ref<Set<number>>` 狀態追蹤，加入 `onImageLoad(index)` handler 將載入完成的索引加入 Set
- [x] 1.2 在 template 中為每張圖片加上 wrapper `<div>`，設定 `aspect-ratio` 為 `image.width / image.height`，內含 shimmer overlay 偽元素和 `<img>`
- [x] 1.3 在 `<style scoped>` 新增 shimmer `@keyframes` 動畫（使用 `var(--color-bg-card)` 和 `var(--color-border)` 色調），圖片未載入時 `opacity: 0`，載入後 `transition: opacity 0.4s` 淡入
- [x] 1.4 加入 `prefers-reduced-motion` 支援：停用 shimmer 動畫、移除 opacity 過渡

## 2. Lightbox 縮圖模糊預覽 (Lightbox.vue)

- [x] 2.1 新增 `fullImageLoaded: ref<boolean>` 狀態，加入 `onFullImageLoad` handler
- [x] 2.2 修改圖片區域為雙層結構：底層 `<img>` 顯示 `thumbSrc`（帶 `filter: blur(8px)` + `scale(1.03)`），上層 `<img>` 顯示 `src`（全尺寸），上層載入前 `opacity: 0`
- [x] 2.3 全尺寸圖片 `onload` 後以 `transition: opacity 500ms` 淡入覆蓋
- [x] 2.4 `watch` props.currentIndex 變化時重設 `fullImageLoaded` 為 `false`，確保切換圖片時重新顯示模糊預覽
- [x] 2.5 加入 `prefers-reduced-motion` 支援：模糊預覽仍顯示，但全圖載入後直接替換（無 opacity 過渡）

## 3. 驗證

- [x] 3.1 Dev server 測試：Gallery 縮圖顯示 shimmer → 載入後淡入，無 layout shift
- [x] 3.2 Dev server 測試：Lightbox 開啟時顯示模糊縮圖 → 全圖淡入，切換圖片時正確重設
- [x] 3.3 確認 GSAP ScrollTrigger batch 動畫與 shimmer 不衝突
- [x] 3.4 確認 `prefers-reduced-motion` 下行為正確
- [x] 3.5 Production build（`npm run build`）成功，無 TypeScript/ESLint 錯誤
