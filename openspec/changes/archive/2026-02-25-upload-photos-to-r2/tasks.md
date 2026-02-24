## 1. R2 Bucket 建立與照片上傳

- [x] 1.1 使用 `wrangler r2 bucket create xuno8-photos` 建立 R2 bucket
- [x] 1.2 設定 R2 bucket 公開存取（Custom Domain 或 r2.dev public URL）
- [x] 1.3 使用 `wrangler r2 object put` 將 `photo_temp/` 中的 37 張照片上傳至 R2 bucket
- [x] 1.4 驗證所有照片可透過公開 URL 存取

## 2. photos.yaml 更新

- [x] 2.1 取得所有 37 張照片的寬高資訊（從檔案 metadata 讀取）
- [x] 2.2 重寫 `src/data/photos.yaml`：按拍攝日期排序，`src` 為檔名，包含 `width`/`height`/`alt`（alt 暫填檔名或空字串）

## 3. Astro 圖片流程調整（`src/pages/index.astro`）

- [x] 3.1 定義 R2 base URL 常數（如 `const R2_BASE = 'https://photos.xuno8.com/'`）
- [x] 3.2 移除 `import.meta.glob` gallery 相關邏輯（`galleryModules` / `galleryResults`）
- [x] 3.3 改為從 `photosData` 直接 map 產生 `galleryImages`，拼接 R2 URL 作為 `src`，帶入 `width`/`height`/`alt`
- [x] 3.4 確認 `MasonryGallery` 的 `images` prop 格式不變（`GalleryImage[]`）

## 4. TypeScript 類型調整（`src/types/index.ts`）

- [x] 4.1 確認 `Photograph` interface 包含 `width` 和 `height` 為必填欄位（目前缺少）

## 5. 清理

- [x] 5.1 移除 `src/assets/images/gallery/` 中的 placeholder 圖片
- [x] 5.2 確認 `photo_temp/` 已加入 `.gitignore`（避免原圖進入 git）

## 6. 驗證

- [x] 6.1 執行 `npm run build` 確認建置成功
- [x] 6.2 執行 `npm run preview` 確認 photographer 模式圖片正常顯示
- [x] 6.3 確認 Lightbox 開啟/關閉/導航功能正常
