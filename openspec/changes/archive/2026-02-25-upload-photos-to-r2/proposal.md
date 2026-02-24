## Why

目前攝影作品集的照片放在 `src/assets/images/gallery/`，以小型 placeholder 圖為主。需要將 37 張真實攝影原圖（592MB）上傳至 Cloudflare R2，並更新 `photos.yaml` 以反映實際照片清單，按拍攝日期排序。網站已部署在 Cloudflare Workers，R2 是同生態系最低成本的方案。

## What Changes

- 建立 Cloudflare R2 bucket `xuno8-photos`，上傳 37 張照片
- 更新 `src/data/photos.yaml`：替換 placeholder 資料為實際照片清單，按日期排序，`src` 欄位改為 R2 上的檔名
- 移除 `src/assets/images/gallery/` 中的 placeholder 圖片
- 修改 `wrangler.jsonc` 加入 R2 bucket binding（若需要 Worker 層存取）
- 調整 `index.astro` 的圖片處理流程：從本地 `import.meta.glob` + `getImage()` 改為引用 R2 外部 URL
- 更新 `MasonryGallery.vue` 和 `Lightbox.vue` 以支援遠端圖片 URL

## Non-goals

- 不處理 Cloudflare Image Resizing 的整合（後續獨立變更）
- 不撰寫 caption / location / camera 等 metadata（後續補充）
- 不建立自動化上傳腳本

## Capabilities

### New Capabilities
- `r2-photo-storage`: R2 bucket 建立與照片上傳，photos.yaml 資料結構調整為引用外部 URL

### Modified Capabilities
- `immersive-lightbox`: Lightbox 需支援從遠端 URL 載入圖片，而非本地 Astro 優化後的圖片

## Impact

- `src/data/photos.yaml` — 完整重寫
- `src/pages/index.astro` — 圖片處理邏輯變更
- `src/components/photographer/MasonryGallery.vue` — 圖片來源改為遠端 URL
- `src/components/photographer/Lightbox.vue` — 同上
- `src/assets/images/gallery/` — 移除 placeholder 圖片
- `wrangler.jsonc` — 可能新增 R2 binding
- `src/types/index.ts` — Photo type 可能需要調整
