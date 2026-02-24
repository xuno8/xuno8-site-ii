## Why

Photographer gallery 的照片目前固定按拍攝日期排序，每次造訪看到的順序都一樣。透過 build-time shuffle 讓每次部署後照片以不同隨機順序呈現，增加新鮮感。

## What Changes

- 在 `index.astro` 對 `galleryImages` 陣列進行 Fisher-Yates shuffle，使照片順序在每次 build 時隨機化

## Non-goals

- 不做 client-side shuffle（避免 hydration mismatch）
- 不影響 `photos.yaml` 的檔案順序（YAML 維持日期排序，shuffle 只在 build-time 記憶體中）

## Capabilities

### New Capabilities
- `gallery-random-order`: Gallery 照片在 build-time 隨機排序

### Modified Capabilities
(none)

## Impact

- `src/pages/index.astro` — 對 `galleryImages` 加 shuffle 邏輯
