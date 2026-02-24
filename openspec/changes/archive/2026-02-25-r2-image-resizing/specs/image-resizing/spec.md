## ADDED Requirements

### Requirement: Gallery thumbnails use Cloudflare Image Resizing
Masonry gallery 中的縮圖 SHALL 透過 Cloudflare Image Resizing URL transform 載入，使用 `/cdn-cgi/image/` 前綴格式。

#### Scenario: Thumbnail URL format
- **WHEN** 產生 gallery 縮圖 URL
- **THEN** URL 格式 SHALL 為 `https://images.xuno8.com/cdn-cgi/image/width=800,quality=80,format=auto,onerror=redirect/<filename>`

#### Scenario: Thumbnail displayed in masonry grid
- **WHEN** MasonryGallery 渲染圖片
- **THEN** `<img>` 元素的 `src` SHALL 使用 resized thumbnail URL 而非原圖 URL

### Requirement: Lightbox uses original image URL
Lightbox 全螢幕檢視 SHALL 使用原圖 URL，不經過 Image Resizing 處理。

#### Scenario: Lightbox image source
- **WHEN** 使用者點擊縮圖開啟 Lightbox
- **THEN** Lightbox 中的 `<img>` 元素 SHALL 使用 `https://images.xuno8.com/<filename>` 原圖 URL

### Requirement: GalleryImage includes thumbnail source
GalleryImage 資料結構 SHALL 包含 `thumbSrc` 欄位，用於縮圖顯示，與 `src`（原圖 URL）分離。

#### Scenario: GalleryImage data shape
- **WHEN** 建構 galleryImages 陣列
- **THEN** 每筆資料 SHALL 同時包含 `src`（原圖 URL）和 `thumbSrc`（resized URL）
