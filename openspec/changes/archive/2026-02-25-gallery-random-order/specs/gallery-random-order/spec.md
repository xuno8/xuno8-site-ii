## ADDED Requirements

### Requirement: Gallery photos displayed in random order
Photographer gallery 中的照片 SHALL 在每次 build 時以隨機順序排列。

#### Scenario: Build-time shuffle
- **WHEN** 執行 `npm run build` 或 `npm run dev`
- **THEN** `galleryImages` 陣列 SHALL 以 Fisher-Yates shuffle 隨機排序

#### Scenario: photos.yaml order preserved
- **WHEN** build-time shuffle 執行後
- **THEN** `src/data/photos.yaml` 檔案的內容 SHALL 不受影響，維持日期排序
