## Context

Gallery 圖片從 Cloudflare R2 遠端載入，縮圖經 Image Resizing（800px），全尺寸圖片為原圖。目前 `MasonryGallery.vue` 使用 `loading="lazy"` 但無任何載入中的視覺回饋，圖片突然出現造成不佳的體驗。Lightbox 開啟時載入全尺寸圖片同樣沒有過渡。

每張圖片的 `width` 和 `height` 已在 `photos.yaml` 中定義並作為 props 傳入，可直接用於計算 `aspect-ratio`。

## Goals / Non-Goals

**Goals:**
- Gallery 縮圖載入前顯示 skeleton shimmer placeholder，消除 layout shift
- Lightbox 全圖載入前以已快取的縮圖作為模糊預覽，提供即時視覺回饋
- 尊重 `prefers-reduced-motion` 偏好

**Non-Goals:**
- 不引入 BlurHash 或任何 build pipeline 變更
- 不修改 `photos.yaml` 資料結構
- 不修改現有 GSAP ScrollTrigger batch 動畫的行為

## Decisions

### D1: Gallery 縮圖使用 CSS skeleton shimmer

**選擇**: 純 CSS `@keyframes` shimmer 動畫 + Vue 狀態追蹤

**替代方案**:
- BlurHash：需要 build pipeline 變更和額外依賴，圖片存在 R2 無法在 build time 存取
- Spinner icon：視覺上與攝影作品集質感不搭，且不保留 aspect ratio

**原因**: 零依賴、利用已有 `width/height` 維持 aspect ratio、shimmer 色調用 CSS custom properties 自動適配 photographer 暖色主題。

### D2: Lightbox 使用縮圖作為模糊預覽（LQIP）

**選擇**: 疊加兩層 `<img>` — 底層為 `thumbSrc`（blur filter），上層為 `src`（全尺寸），全圖 `onload` 後淡入覆蓋

**替代方案**:
- Skeleton shimmer：在 Lightbox 中體驗不佳，使用者看到灰色方塊而非圖片輪廓
- 什麼都不做：大圖載入可能需要數秒，期間黑屏不佳

**原因**: 使用者點開 Lightbox 時縮圖已在瀏覽器快取中，可零延遲顯示。模糊的縮圖仍然傳達了圖片的色調和構圖。

### D3: 載入狀態追蹤使用 `ref<Set<number>>`

**選擇**: 在 `MasonryGallery.vue` 中用 `loadedImages: ref<Set<number>>` 追蹤已完成載入的圖片索引

**原因**: 與現有的 `failedImages` ref 模式一致，簡單且高效。Lightbox 中則用單張圖片的 `ref<boolean>` 即可，因為一次只顯示一張。

### D4: Shimmer 動畫與 GSAP ScrollTrigger 的共存策略

**選擇**: shimmer 是 `.masonry-item` 內部的視覺效果，不影響 ScrollTrigger batch 動畫。ScrollTrigger 控制整個 `.masonry-item` 的進場（opacity + y + scale），shimmer/loaded 過渡控制 `<img>` 自身的 opacity。兩者互不干擾。

## Risks / Trade-offs

- **[大量 shimmer 同時動畫]** → 使用 `transform` 而非 `background-position` 做 shimmer 位移，確保 GPU 加速；shimmer 用偽元素實作，不增加 DOM 節點
- **[Lightbox 切換時縮圖閃爍]** → `watch` currentIndex 變化時重設 loaded 狀態，縮圖底層因快取應立即顯示
- **[已快取圖片不需要 loading 狀態]** → `<img>` 的 `onload` 事件在快取命中時仍會觸發，shimmer 會立即消失，使用者不會感覺到延遲
