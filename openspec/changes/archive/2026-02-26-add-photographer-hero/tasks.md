## 1. Data Layer

- [x] 1.1 在 `src/data/site.yaml` 新增 `photographerTagline: 'chasing light and stories'` 欄位
- [x] 1.2 在 `src/types/index.ts` 的 `SiteConfig` interface 新增 `photographerTagline?: string` 可選欄位

## 2. Vue Island

- [x] 2.1 建立 `src/components/photographer/PhotoHero.vue`，接收 `name: string` 和 `tagline: string` props，置中顯示名字與 tagline
- [x] 2.2 套用 photographer 視覺風格：Newsreader 襯線體、名字大字 heading 色、tagline italic secondary 色、充足垂直留白
- [x] 2.3 使用 `useGsapContext` 實現 fade-in + translateY stagger 動畫，搭配 `useReducedMotion` 處理無障礙

## 3. Astro Integration

- [x] 3.1 在 `src/pages/index.astro` import PhotoHero 元件，從 site config 讀取 name 和 photographerTagline
- [x] 3.2 將 PhotoHero 以 `client:load` 放入 `#photographer-content` 容器，位於 MasonryGallery 上方
