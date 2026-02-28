### Requirement: Lightbox renders outside main stacking context
Lightbox 元件 SHALL 使用 Vue `<Teleport to="body">` 渲染至 `<body>` 的直接子層，使其 z-index 在 root stacking context 中生效，確保遮蓋頁面上所有其他元素。

#### Scenario: Lightbox covers footer and ModeToggle
- **WHEN** 用戶在 photographer 模式點擊圖片開啟 Lightbox
- **THEN** Lightbox 的 backdrop SHALL 遮蓋 `<footer>` 和 `#toggle-wrapper`，無論頁面捲動位置

### Requirement: External UI hidden when Lightbox is open
Lightbox 開啟時 SHALL 隱藏 `#toggle-wrapper`（ModeToggle）和 `<footer>` 元素，關閉時恢復顯示。隱藏/顯示 SHALL 透過 `lightboxOpen` nanostore atom 驅動。

#### Scenario: ModeToggle and Footer hide on open
- **WHEN** Lightbox 開啟
- **THEN** `#toggle-wrapper` 和 `<footer>` SHALL 帶淡出動畫隱藏，`pointer-events` 設為 `none`

#### Scenario: ModeToggle and Footer restore on close
- **WHEN** Lightbox 關閉動畫結束
- **THEN** `#toggle-wrapper` 和 `<footer>` SHALL 帶淡入動畫恢復顯示

### Requirement: GSAP open animation sequence
Lightbox 開啟時 SHALL 播放 GSAP timeline 動畫序列：backdrop 淡入、圖片 scale + fade 進場、caption 從底部滑入。全尺寸圖片載入前 SHALL 先顯示已快取的縮圖（帶 blur filter）作為預覽，全尺寸圖片載入完成後以 opacity 過渡淡入覆蓋。

#### Scenario: Open animation plays in order
- **WHEN** Lightbox 掛載並顯示
- **THEN** backdrop 先淡入（~250ms），接著圖片區域從 scale 0.92 + opacity 0 過渡到 scale 1 + opacity 1（~400ms），最後 caption 從底部滑入（~300ms）。圖片區域 SHALL 立即顯示模糊的縮圖，全圖載入後淡入

#### Scenario: Reduced motion skips animation
- **WHEN** 用戶啟用 `prefers-reduced-motion: reduce`
- **THEN** Lightbox SHALL 直接顯示，不播放任何 GSAP 動畫。縮圖預覽仍 SHALL 顯示，全圖載入後直接替換（無淡入）

### Requirement: GSAP close animation sequence
Lightbox 關閉時 SHALL 反向播放開啟動畫序列，動畫完成後才移除 DOM。

#### Scenario: Close animation reverses open
- **WHEN** 用戶觸發關閉（Escape 鍵、點擊 backdrop、點擊關閉按鈕）
- **THEN** 動畫 SHALL 反向播放，完成後 Lightbox 從 DOM 移除

#### Scenario: Rapid open-close does not break animation
- **WHEN** 用戶在動畫進行中再次觸發開/關
- **THEN** 系統 SHALL 停止當前動畫並正確執行新的狀態轉換

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

### Requirement: Floating caption overlay
Caption（標題、日期、地點、相機）SHALL 浮動覆蓋在圖片底部區域，使用半透明漸層背景確保文字可讀性，不佔用圖片以外的垂直空間。

#### Scenario: Caption overlays image bottom
- **WHEN** 圖片有 caption/metadata
- **THEN** caption SHALL 顯示在圖片底部，帶有從透明到半透明黑色的漸層背景

#### Scenario: No caption area when empty
- **WHEN** 圖片沒有任何 caption/metadata
- **THEN** SHALL 不顯示 caption 區域，圖片佔據全部空間

### Requirement: Thumbnail blur preview in Lightbox
Lightbox SHALL 同時渲染兩層圖片：底層為 `thumbSrc`（縮圖，帶 `filter: blur(8px)` 及 `scale(1.03)` 避免模糊邊緣），上層為 `src`（全尺寸圖片）。全尺寸圖片載入完成前 opacity SHALL 為 0，載入完成後以 opacity 過渡（~500ms）淡入覆蓋。全尺寸圖片載入完成後縮圖 SHALL 隱藏。

#### Scenario: Thumbnail shown immediately on open
- **WHEN** 用戶點擊 gallery 圖片開啟 Lightbox
- **THEN** 已快取的縮圖 SHALL 立即顯示（帶模糊效果），全尺寸圖片在背景載入

#### Scenario: Full image fades in over thumbnail
- **WHEN** 全尺寸圖片載入完成（`onload` 事件觸發）
- **THEN** 全尺寸圖片 SHALL 以 opacity 0 → 1 過渡淡入，覆蓋模糊縮圖

#### Scenario: Navigation resets loading state
- **WHEN** 用戶切換到上/下一張圖片
- **THEN** 新圖片的全尺寸載入狀態 SHALL 重設，先顯示新的模糊縮圖，全尺寸圖片載入後淡入

#### Scenario: Already cached full image shows immediately
- **WHEN** 全尺寸圖片已在瀏覽器快取中
- **THEN** `onload` SHALL 立即觸發，模糊縮圖幾乎不可見地被覆蓋
