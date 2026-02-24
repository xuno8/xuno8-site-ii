### Requirement: Shimmer placeholder for gallery thumbnails
每張 gallery 縮圖在載入完成前 SHALL 顯示 skeleton shimmer placeholder。placeholder SHALL 使用圖片的已知 `width` 和 `height` 計算 `aspect-ratio`，維持正確的佔位尺寸以避免 layout shift。

#### Scenario: Placeholder shown before image loads
- **WHEN** gallery 縮圖尚未載入完成
- **THEN** 該圖片位置 SHALL 顯示一個帶有 shimmer 動畫的 placeholder，其 aspect ratio 與圖片相符

#### Scenario: Placeholder uses theme colors
- **WHEN** photographer 主題啟用
- **THEN** shimmer placeholder 的底色 SHALL 使用 `var(--color-bg-card)`，shimmer 高亮色 SHALL 使用 `var(--color-border)` 色調

#### Scenario: Image replaces placeholder on load
- **WHEN** 縮圖載入完成（`onload` 事件觸發）
- **THEN** 圖片 SHALL 以 opacity 過渡（~400ms）淡入顯示，shimmer placeholder SHALL 隱藏

#### Scenario: Cached images show immediately
- **WHEN** 縮圖已在瀏覽器快取中
- **THEN** `onload` 事件 SHALL 立即觸發，shimmer 幾乎不可見地消失，不造成視覺干擾

### Requirement: Reduced motion support for shimmer
當使用者啟用 `prefers-reduced-motion: reduce` 時，shimmer 動畫 SHALL 停用。placeholder 仍 SHALL 顯示（靜態背景色），圖片載入後直接顯示（無 opacity 過渡）。

#### Scenario: No shimmer animation with reduced motion
- **WHEN** `prefers-reduced-motion: reduce` 且縮圖尚未載入
- **THEN** placeholder SHALL 顯示為靜態背景色（無 shimmer 位移動畫），圖片載入後直接顯示

### Requirement: Shimmer coexists with ScrollTrigger animation
shimmer placeholder 和 loaded 過渡 SHALL 不干擾現有的 GSAP ScrollTrigger batch 進場動畫。ScrollTrigger 控制 `.masonry-item` 整體的進場，shimmer/loaded 控制 `<img>` 自身的顯示。

#### Scenario: Both animations play correctly
- **WHEN** `.masonry-item` 進入 viewport 觸發 ScrollTrigger batch 動畫
- **THEN** item 整體 SHALL 執行 fade + translate + scale 進場動畫，內部的 shimmer/loaded 過渡獨立運作
