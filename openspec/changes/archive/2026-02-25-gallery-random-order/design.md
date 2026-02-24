## Context

Gallery 照片透過 `photos.yaml` → `index.astro` → `MasonryGallery.vue` 的流程傳入。目前 `galleryImages` 保持 YAML 原始順序（按日期）。

## Goals / Non-Goals

**Goals:**
- 每次 build 時隨機打亂 `galleryImages` 順序

**Non-Goals:**
- 不修改 `photos.yaml` 的排序
- 不做 client-side shuffle

## Decisions

### Fisher-Yates shuffle in index.astro frontmatter

**選擇**: 在 `index.astro` 的 frontmatter 中對 `galleryImages` 做 in-place Fisher-Yates shuffle

**理由**: 這是標準的無偏差隨機排序演算法。在 Astro frontmatter 中執行，確保 SSG 輸出的 HTML 就是打亂後的順序，Vue hydration 不會產生 mismatch。

## Risks / Trade-offs

- **[每次 build 順序固定]** → 這是預期行為。若需要每次造訪都不同，未來可改為 client-side 方案。
