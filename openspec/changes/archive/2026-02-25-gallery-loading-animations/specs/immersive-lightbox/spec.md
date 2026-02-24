## MODIFIED Requirements

### Requirement: GSAP open animation sequence
Lightbox 開啟時 SHALL 播放 GSAP timeline 動畫序列：backdrop 淡入、圖片 scale + fade 進場、caption 從底部滑入。全尺寸圖片載入前 SHALL 先顯示已快取的縮圖（帶 blur filter）作為預覽，全尺寸圖片載入完成後以 opacity 過渡淡入覆蓋。

#### Scenario: Open animation plays in order
- **WHEN** Lightbox 掛載並顯示
- **THEN** backdrop 先淡入（~250ms），接著圖片區域從 scale 0.92 + opacity 0 過渡到 scale 1 + opacity 1（~400ms），最後 caption 從底部滑入（~300ms）。圖片區域 SHALL 立即顯示模糊的縮圖，全圖載入後淡入

#### Scenario: Reduced motion skips animation
- **WHEN** 用戶啟用 `prefers-reduced-motion: reduce`
- **THEN** Lightbox SHALL 直接顯示，不播放任何 GSAP 動畫。縮圖預覽仍 SHALL 顯示，全圖載入後直接替換（無淡入）

## ADDED Requirements

### Requirement: Thumbnail blur preview in Lightbox
Lightbox SHALL 同時渲染兩層圖片：底層為 `thumbSrc`（縮圖，帶 `filter: blur(8px)` 及 `scale(1.03)` 避免模糊邊緣），上層為 `src`（全尺寸圖片）。全尺寸圖片載入完成前 opacity SHALL 為 0，載入完成後以 opacity 過渡（~500ms）淡入覆蓋。

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
