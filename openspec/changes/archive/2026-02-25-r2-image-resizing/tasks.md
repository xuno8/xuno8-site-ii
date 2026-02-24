## 1. Astro 端資料層修改

- [x] 1.1 修改 `src/pages/index.astro`：將 `R2_BASE` 常數從 `r2.dev` URL 改為 `https://images.xuno8.com`
- [x] 1.2 修改 `src/pages/index.astro`：在 `galleryImages.map()` 中為每筆資料新增 `thumbSrc` 欄位，格式為 `https://images.xuno8.com/cdn-cgi/image/width=800,quality=80,format=auto,onerror=redirect/${photo.src}`

## 2. Vue 元件修改

- [x] 2.1 修改 `src/components/photographer/MasonryGallery.vue`：`GalleryImage` interface 新增 `thumbSrc: string` 欄位
- [x] 2.2 修改 `src/components/photographer/MasonryGallery.vue`：masonry grid 中的 `<img>` 改用 `image.thumbSrc` 作為 `src`
- [x] 2.3 確認 `src/components/photographer/Lightbox.vue` 維持使用 `current.src`（原圖 URL），無需修改

## 3. 驗證

- [x] 3.1 `npm run build` 確認建置成功
- [x] 3.2 `npm run dev` 啟動開發伺服器，切換到 photographer 模式，確認縮圖正常顯示
- [x] 3.3 開啟瀏覽器 DevTools Network 面板，確認縮圖請求 URL 包含 `/cdn-cgi/image/` 前綴且回應尺寸明顯小於原圖
- [x] 3.4 點擊縮圖開啟 Lightbox，確認大圖使用原圖 URL（不含 `/cdn-cgi/image/`）
