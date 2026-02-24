### Requirement: Photos stored in Cloudflare R2
所有攝影作品 SHALL 儲存在 Cloudflare R2 bucket `xuno8-photos` 中，以原始檔名作為 object key。

#### Scenario: Photo accessible via R2 URL
- **WHEN** 圖片已上傳至 R2 bucket
- **THEN** 圖片 SHALL 可透過 R2 custom domain 或公開 URL 存取

### Requirement: photos.yaml as photo catalog
`src/data/photos.yaml` SHALL 作為照片目錄，每筆記錄包含 `src`（檔名）、`alt`（替代文字）、`width`（像素寬度）、`height`（像素高度），以及可選的 `caption`、`date`、`location`、`camera` 欄位。

#### Scenario: Minimal photo entry
- **WHEN** 新增一張照片
- **THEN** YAML 條目 SHALL 至少包含 `src`、`alt`、`width`、`height`

#### Scenario: Photos sorted by date
- **WHEN** 讀取 `photos.yaml`
- **THEN** 照片 SHALL 按拍攝日期由舊到新排序

### Requirement: R2 base URL configured as constant
R2 圖片的 base URL SHALL 定義為單一常數，使用 custom domain `https://images.xuno8.com`。前端元件透過 `baseURL + src` 拼接完整圖片 URL。

#### Scenario: Base URL change propagates globally
- **WHEN** R2 domain 變更
- **THEN** 只需修改一處常數，所有圖片 URL 自動更新

#### Scenario: Custom domain used instead of r2.dev
- **WHEN** 產生圖片 URL
- **THEN** base URL SHALL 為 `https://images.xuno8.com` 而非 `r2.dev` 公開 URL

### Requirement: index.astro uses YAML data directly
`index.astro` SHALL 從 `photos.yaml` 讀取照片資料並拼接 R2 URL，不再使用 `import.meta.glob` 或 `getImage()` 處理 gallery 圖片。

#### Scenario: Gallery images loaded from YAML
- **WHEN** 建置網站
- **THEN** `galleryImages` 陣列 SHALL 從 YAML 資料產生，每筆包含完整 R2 URL 作為 `src`，以及 `width`、`height`、`alt`

### Requirement: Local placeholder images removed
`src/assets/images/gallery/` 中的 placeholder 圖片 SHALL 移除，不再被任何程式碼引用。

#### Scenario: No local gallery images remain
- **WHEN** 變更完成
- **THEN** `src/assets/images/gallery/` 目錄 SHALL 不包含任何圖片檔案（目錄本身可保留或移除）
