## Why

Photographer 頁面的 masonry gallery 縮圖目前直接載入 R2 原圖（最大 6192×4128），但實際顯示寬度在三欄佈局下僅約 350px。每張圖的傳輸量是實際需要的 10-20 倍，嚴重影響頁面載入速度與行動裝置流量。

## What Changes

- Gallery 縮圖改用 Cloudflare Image Resizing（透過 `/cdn-cgi/image/` URL）載入適當尺寸的圖片
- R2 base URL 從 `r2.dev` 公開 URL 切換至 custom domain `images.xuno8.com`
- MasonryGallery 與 Lightbox 使用不同的圖片 URL：縮圖用 resized URL，Lightbox 維持原圖
- GalleryImage type 新增 `thumbSrc` 欄位以區分縮圖與原圖 URL

## Non-goals

- Lightbox 大圖不做 resize，維持原圖品質
- 不預先產生多種尺寸的靜態檔案
- 不使用 Cloudflare Worker 方式，採用較簡單的 URL transform 方式
- 不實作 `srcset` / responsive images（未來可考慮）

## Capabilities

### New Capabilities
- `image-resizing`: 透過 Cloudflare Image Resizing URL transform 為 gallery 縮圖提供適當尺寸的圖片

### Modified Capabilities
- `r2-photo-storage`: R2 base URL 從 `r2.dev` 公開 URL 改為 custom domain `images.xuno8.com`

## Impact

- `src/pages/index.astro` — R2_BASE 常數變更，新增 thumbnail URL 產生邏輯
- `src/components/photographer/MasonryGallery.vue` — GalleryImage interface 新增 `thumbSrc`，`<img>` 改用 `thumbSrc`
- `src/components/photographer/Lightbox.vue` — 維持使用 `src`（原圖），無需修改
- `src/types/index.ts` — 若 GalleryImage type 定義在此則需更新
