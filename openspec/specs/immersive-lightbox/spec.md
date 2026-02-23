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
Lightbox 開啟時 SHALL 播放 GSAP timeline 動畫序列：backdrop 淡入、圖片 scale + fade 進場、caption 從底部滑入。

#### Scenario: Open animation plays in order
- **WHEN** Lightbox 掛載並顯示
- **THEN** backdrop 先淡入（~250ms），接著圖片從 scale 0.92 + opacity 0 過渡到 scale 1 + opacity 1（~400ms），最後 caption 從底部滑入（~300ms）

#### Scenario: Reduced motion skips animation
- **WHEN** 用戶啟用 `prefers-reduced-motion: reduce`
- **THEN** Lightbox SHALL 直接顯示，不播放任何 GSAP 動畫

### Requirement: GSAP close animation sequence
Lightbox 關閉時 SHALL 反向播放開啟動畫序列，動畫完成後才移除 DOM。

#### Scenario: Close animation reverses open
- **WHEN** 用戶觸發關閉（Escape 鍵、點擊 backdrop、點擊關閉按鈕）
- **THEN** 動畫 SHALL 反向播放，完成後 Lightbox 從 DOM 移除

#### Scenario: Rapid open-close does not break animation
- **WHEN** 用戶在動畫進行中再次觸發開/關
- **THEN** 系統 SHALL 停止當前動畫並正確執行新的狀態轉換

### Requirement: Maximized image display
圖片 SHALL 佔滿盡可能大的視窗面積。外層容器移除固定最大寬度限制，圖片最大高度 SHALL 不低於 `92vh`，左右 padding 僅保留導航按鈕所需空間。

#### Scenario: Image fills viewport
- **WHEN** Lightbox 顯示一張圖片
- **THEN** 圖片 SHALL 使用 `object-contain` 在最大可用空間內完整顯示，不裁切

#### Scenario: Navigation buttons have clearance
- **WHEN** Lightbox 顯示
- **THEN** 左右導航按鈕與圖片之間 SHALL 有足夠間距（不重疊於圖片主體）

### Requirement: Floating caption overlay
Caption（標題、日期、地點、相機）SHALL 浮動覆蓋在圖片底部區域，使用半透明漸層背景確保文字可讀性，不佔用圖片以外的垂直空間。

#### Scenario: Caption overlays image bottom
- **WHEN** 圖片有 caption/metadata
- **THEN** caption SHALL 顯示在圖片底部，帶有從透明到半透明黑色的漸層背景

#### Scenario: No caption area when empty
- **WHEN** 圖片沒有任何 caption/metadata
- **THEN** SHALL 不顯示 caption 區域，圖片佔據全部空間
