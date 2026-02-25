## 1. Data Layer

- [x] 1.1 建立 `src/data/gear.yaml`，包含三筆器材（Sony α7 III、Sony FE 24-105mm F4、RICOH GR IV），Sony 排前面
- [x] 1.2 在 `src/types/index.ts` 新增 `GearItem` interface（`brand: string`, `model: string`）
- [x] 1.3 在 `src/utils/data.ts` 新增 `loadGear()` helper function

## 2. Vue Island

- [x] 2.1 建立 `src/components/photographer/GearBar.vue`，接收 `gear: GearItem[]` prop，渲染 inline 列表（品牌 型號 · 品牌 型號）
- [x] 2.2 套用 photographer 視覺風格：Newsreader 襯線字體、小字號、accent 色分隔符
- [x] 2.3 使用 `useGsapContext` + ScrollTrigger 實現 fade-in 動畫，搭配 `useReducedMotion` 處理無障礙

## 3. Astro Integration

- [x] 3.1 在 `src/pages/index.astro` import GearBar 元件，讀取 gear.yaml 資料
- [x] 3.2 將 GearBar 以 `client:visible` 放入 `#photographer-content` 容器，位於 MasonryGallery 下方
