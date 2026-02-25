## Why

Photographer 模式進入後直接是照片牆，頂部缺少身份識別和開場氛圍。Developer 模式有完整的 Hero 區塊（名字、職稱、簡介），photographer 模式也需要對等的最小化開場——名字加一句 tagline，讓訪客知道這是誰的作品集。

## What Changes

- 在 photographer 頁面 gallery 上方新增一個極簡的 hero 區塊
- 顯示名字（Tim Lin）與 tagline（chasing light and stories）
- 使用 Newsreader 襯線體大字置中，搭配 GSAP 淡入動畫
- 資料從既有 `site.yaml` 讀取名字，tagline 新增至 `site.yaml`

## Non-goals

- 不加頭像圖片（photographer 模式讓照片說話）
- 不做社群連結（footer 已有）
- 不做複雜動畫或視差效果

## Capabilities

### New Capabilities
- `photographer-hero`: Photographer 模式頂部的極簡 hero 區塊，顯示名字與攝影 tagline

### Modified Capabilities

（無）

## Impact

- 新增檔案：`src/components/photographer/PhotoHero.vue`
- 修改檔案：`src/data/site.yaml`（新增 `photographerTagline` 欄位）、`src/types/index.ts`（SiteConfig 加欄位）、`src/pages/index.astro`（引入 PhotoHero）
