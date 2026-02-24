## Why

Gallery 圖片來自 Cloudflare R2 遠端載入，目前沒有任何 loading 狀態的視覺回饋——圖片載入前區域空白，載入完成才突然出現。這導致使用者體驗不佳（CLS layout shift + 感覺卡頓）。需要為 masonry gallery 縮圖和 lightbox 全尺寸圖片都加入載入動畫。

## What Changes

- Masonry gallery 的每張縮圖加入 skeleton shimmer placeholder，利用已知的 width/height 計算 aspect-ratio 佔位，圖片 `onload` 後淡入
- Lightbox 開啟時使用已快取的縮圖作為模糊預覽底圖（LQIP），全尺寸圖片載入後淡入覆蓋
- Lightbox 切換上/下一張時同樣套用模糊縮圖 → 全圖淡入的過渡效果
- 尊重 `prefers-reduced-motion`：減少動態偏好時跳過 shimmer 動畫和淡入過渡

## Non-goals

- 不引入 BlurHash 或額外 build pipeline 變更
- 不修改 photos.yaml 資料結構
- 不修改 Cloudflare Image Resizing 的設定

## Capabilities

### New Capabilities
- `gallery-loading-state`: Gallery 圖片載入狀態的視覺回饋——包含 masonry shimmer placeholder 和 lightbox 縮圖模糊預覽

### Modified Capabilities
- `immersive-lightbox`: Lightbox 圖片載入時新增縮圖模糊預覽底圖及全圖淡入過渡

## Impact

- `src/components/photographer/MasonryGallery.vue`：新增 loaded 狀態追蹤、shimmer overlay、loaded transition
- `src/components/photographer/Lightbox.vue`：新增縮圖底圖層、全圖 onload 淡入邏輯
- 無新增依賴，純 CSS + Vue 狀態實作
