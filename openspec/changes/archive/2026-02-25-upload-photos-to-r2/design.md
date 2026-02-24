## Context

目前 photographer 模式的圖片流程：`photos.yaml`（本地路徑）→ `index.astro` 用 `import.meta.glob` + `getImage()` 在 build time 優化 → 優化後的圖片作為 props 傳入 `MasonryGallery.vue`。

現需將 37 張真實攝影原圖（592MB，混合 JPG/PNG）上傳至 Cloudflare R2，並將圖片引用從本地改為 R2 外部 URL。網站已部署在 Cloudflare Workers (`wrangler.jsonc` 使用 `assets` 模式)。

照片命名規則：大多以 `YYYYMMDD-` 前綴命名（如 `20240502-DSC06216.png`），有兩張無日期前綴（`DSC01753.jpg`、`DSC04635.jpg`），可從 EXIF 推斷。

## Goals / Non-Goals

**Goals:**
- 建立 R2 bucket 並上傳所有 37 張照片
- `photos.yaml` 反映實際照片清單，按拍攝日期排序
- 前端元件能正確載入並顯示 R2 上的圖片
- Masonry layout 保持正常運作（需要寬高資訊）

**Non-Goals:**
- 不整合 Cloudflare Image Resizing（後續變更處理）
- 不填寫 caption / location / camera metadata
- 不建立自動化上傳腳本
- 不變更 Lightbox 的 UI 或動畫行為

## Decisions

### D1: R2 公開存取方式 — 使用 R2 Custom Domain

**選擇**: R2 bucket 設定 Custom Domain（如 `photos.xuno8.com`），直接以 public URL 存取。

**替代方案**: 透過 Worker binding 代理存取 → 需要為現有純靜態 Worker 加入路由邏輯，過度複雜。

**理由**: 目前 Worker 是純 `assets` 模式（無程式邏輯），加 R2 binding 就必須寫 Worker script 來處理路由。Custom Domain 零程式碼，圖片直接用 URL 存取。

### D2: photos.yaml 結構 — src 欄位改為檔名，base URL 由程式拼接

**選擇**: `src` 欄位僅存檔名（如 `20240502-DSC06216.png`），base URL 定義為常數/環境變數，在 `index.astro` 或 Vue 元件中拼接完整 URL。

**替代方案**: `src` 存完整 URL → YAML 冗長，換 domain 時要改每一筆。

**理由**: 單一修改點，日後如果換 CDN 或 domain 只需改一個常數。

### D3: 圖片尺寸資訊 — 在 photos.yaml 記錄 width/height

**選擇**: 在 YAML 中預先記錄每張圖的寬高（像素值），build time 直接使用。

**替代方案**: 前端 `onload` 後動態取得 → 初次渲染會 layout shift。

**理由**: Masonry layout 需要寬高比來避免 CLS (Cumulative Layout Shift)。由於圖片在 R2 不經過 Astro pipeline，無法自動取得 metadata，需手動或腳本取得後寫入 YAML。

### D4: 不改 Lightbox 元件 — 現有介面已相容

**選擇**: `Lightbox.vue` 接收的 `GalleryImage` 介面包含 `src: string`，無論是本地 URL 還是遠端 URL 都能運作，不需改動。

**理由**: `<img :src="...">` 對 URL 來源無差異。

### D5: index.astro 圖片處理 — 移除 import.meta.glob/getImage，直接用 YAML 資料

**選擇**: 移除 `galleryModules` / `galleryResults` 邏輯，改為直接讀取 `photos.yaml` 並拼接 R2 URL 作為 `src`，連同 `width`/`height` 一起傳入 `MasonryGallery`。

**理由**: 圖片不在本地，Astro image pipeline 無法處理。改為純資料驅動。

## Risks / Trade-offs

- **[原圖檔案過大]** → 瀏覽器直接載入原圖（每張 5-35MB）效能極差。短期可接受（作品集瀏覽量低），後續應整合 Image Resizing。
- **[YAML 寬高資料手動維護]** → 人為錯誤風險。可寫一次性腳本從檔案中讀取寬高。
- **[R2 Custom Domain 需要已代管的域名]** → 需在 Cloudflare DNS 中有可用的子域名。若無，可暫用 R2 的 `r2.dev` 公開 URL（但有速率限制，不適合正式使用）。
- **[PNG 檔案特別大]** → 部分 PNG 高達 35MB，首次載入體驗差。可考慮事先轉 JPEG 再上傳，但這超出本次變更範圍。
