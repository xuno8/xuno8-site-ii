## Why

Photographer 模式目前只有照片 gallery，缺少器材資訊。訪客無法得知照片是用什麼相機/鏡頭拍攝的。加一行極簡的器材列表，讓作品集更完整，同時維持「照片為主角」的設計調性。

## What Changes

- 在 photographer 頁面（gallery 上方或下方）新增一行器材展示，以品牌分組、中點分隔的 inline 排列
- 新增 `src/data/gear.yaml` 存放器材資料
- 新增 `GearBar.vue` 元件，使用 Newsreader 襯線體、accent 色分隔符，風格極簡
- 排列順序：Sony 機身與鏡頭排在一起，RICOH 接續

顯示效果類似：
```
Sony α7 III · Sony FE 24-105mm F4 · RICOH GR IV
```

## Non-goals

- 不做卡片式 grid 或詳細規格表
- 不加器材圖片
- 不做器材與照片的關聯對應

## Capabilities

### New Capabilities
- `gear-bar`: Photographer 模式下的極簡器材展示列，從 YAML 讀取器材資料，inline 排列顯示

### Modified Capabilities

（無既有 capability 需要修改）

## Impact

- 新增檔案：`src/data/gear.yaml`、`src/components/photographer/GearBar.vue`
- 修改檔案：`src/pages/index.astro`（引入 GearBar 元件並傳入資料）
- 可能修改：`src/types/index.ts`（新增 GearItem 型別）、`src/utils/data.ts`（新增 loadGear helper）
