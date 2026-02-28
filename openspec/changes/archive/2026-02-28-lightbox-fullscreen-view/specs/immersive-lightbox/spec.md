## MODIFIED Requirements

### Requirement: Maximized image display
圖片 SHALL 佔滿盡可能大的視窗面積。外層容器移除固定最大寬度限制，圖片最大高度 SHALL 不低於 `92vh`，左右 padding 僅保留導航按鈕所需空間。圖片來源 SHALL 支援遠端 URL（R2 external URL），與本地路徑行為一致。`GalleryImage` interface SHALL 新增 `fullSrc` 欄位，提供原始尺寸圖片 URL 供全螢幕模式使用。

#### Scenario: Image fills viewport
- **WHEN** Lightbox 顯示一張圖片
- **THEN** 圖片 SHALL 使用 `object-contain` 在最大可用空間內完整顯示，不裁切

#### Scenario: Navigation buttons have clearance
- **WHEN** Lightbox 顯示
- **THEN** 左右導航按鈕與圖片之間 SHALL 有足夠間距（不重疊於圖片主體）

#### Scenario: Remote URL images display correctly
- **WHEN** 圖片 `src` 為 R2 外部 URL
- **THEN** Lightbox SHALL 正常載入並顯示圖片，行為與本地路徑一致

#### Scenario: fullSrc provides original image URL
- **WHEN** Lightbox 接收到 images props
- **THEN** 每張圖片 SHALL 包含 `fullSrc` 欄位，值為 R2 原始 URL（不經 cdn-cgi Image Resizing）
