## Context

Photographer 模式目前進入後直接是 MasonryGallery + GearBar，頂部沒有任何身份識別。Developer 模式有完整 Hero 區塊。需要在 photographer 模式加一個極簡的 hero，僅顯示名字和一句 tagline。

## Goals / Non-Goals

**Goals:**
- 在 gallery 上方加入名字 + tagline 的置中 hero 區塊
- 從 site.yaml 驅動資料，維持 YAML 資料模式一致性
- GSAP 淡入動畫，與其他 photographer 元件風格統一

**Non-Goals:**
- 不加頭像、社群連結、詳細簡介
- 不做複雜動畫或視差效果

## Decisions

### 1. 元件形式：Vue island（PhotoHero.vue）

**選擇**：獨立 Vue 元件 `PhotoHero.vue`，走 `client:load`（above-fold 需要立即 hydrate 動畫）。

**替代方案**：純 Astro HTML。但需要 GSAP 動畫，Vue island 較容易管理生命週期。

### 2. 資料欄位：site.yaml 新增 photographerTagline

**選擇**：在 `site.yaml` 新增 `photographerTagline: 'chasing light and stories'`，`SiteConfig` interface 加對應可選欄位。名字直接複用既有 `name` 欄位。

**替代方案**：硬編碼在元件中。但 YAML 驅動更符合既有模式，日後修改文字不需改 code。

### 3. 視覺設計

- 名字：Newsreader 襯線體、`text-3xl` ~ `text-4xl`、`--color-text-heading`
- Tagline：Newsreader italic、`text-base` ~ `text-lg`、`--color-text-secondary`
- 垂直留白：`py-20` 以上，給予呼吸空間
- 整體置中，`max-w-6xl mx-auto`

### 4. 動畫

**選擇**：`useGsapContext` fade-in + 微量 translateY，名字和 tagline 依序出現（stagger）。

**理由**：和 developer Hero 的進場動畫對稱但更克制，符合 photographer 模式的靜謐氣質。

## Risks / Trade-offs

- [Hero 太空太簡單] → 刻意為之，攝影作品集的重心在照片，hero 只是身份標示。日後可視需要擴充。
