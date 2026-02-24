## Context

Photographer gallery 目前從 R2 的 `r2.dev` 公開 URL 直接載入原圖作為縮圖顯示。原圖尺寸最大達 6192×4128（約 25MP），但在 masonry grid 三欄佈局中，每欄實際顯示寬度僅約 350px。R2 bucket 已設定 custom domain `images.xuno8.com`，Cloudflare zone 已啟用 Image Transformations。

目前 `MasonryGallery` 和 `Lightbox` 共用同一個 `GalleryImage` 物件，兩者使用相同的 `src` 欄位。

## Goals / Non-Goals

**Goals:**
- 縮圖透過 Cloudflare Image Resizing 載入適當尺寸，減少傳輸量
- R2 URL 統一使用 custom domain `images.xuno8.com`
- 自動轉換為 WebP/AVIF（透過 `format=auto`）

**Non-Goals:**
- Lightbox 大圖不做 resize
- 不實作 `srcset` / responsive images
- 不使用 Worker-based transform
- 不預先產生多尺寸靜態檔案

## Decisions

### 1. URL Transform 而非 Worker Transform

**選擇**: 使用 `/cdn-cgi/image/` URL 前綴方式

**替代方案**: Cloudflare Worker + `cf.image` 選項

**理由**: URL transform 只需要修改 URL 字串，不需要部署額外的 Worker。對於靜態網站的圖片優化場景，URL 方式更簡單且維護成本低。

### 2. 縮圖寬度 800px

**選擇**: `width=800`

**理由**: masonry grid 在桌面版三欄佈局下每欄約 350px，考慮 Retina 2x DPR 需要 700px，取 800px 留有餘裕。`fit=scale-down` 為預設行為，不會放大小於 800px 的圖片，也會保持原始比例不失真。

### 3. 在 index.astro 產生雙 URL

**選擇**: 在 `index.astro` 建構 `galleryImages` 時同時產生 `thumbSrc`（resized URL）和 `src`（原圖 URL），透過 props 傳入 Vue 元件

**替代方案**: 在 Vue 元件內組裝 URL

**理由**: 符合現有架構模式 — Astro 負責資料準備，Vue 元件只接收 props。URL 組裝邏輯集中在一處，便於維護。

### 4. 使用 custom domain 取代 r2.dev

**選擇**: `https://images.xuno8.com` 取代 `https://pub-845b70163b814bd0bd05c1c918fbe89f.r2.dev/`

**理由**: `/cdn-cgi/image/` transform 不支援 `r2.dev` URL，必須使用 custom domain。同時 URL 更簡潔可讀。

## Risks / Trade-offs

- **[Free plan 5,000 次/月限制]** → 目前 37 張圖 × 1 種縮圖尺寸 = 37 unique transformations，遠低於上限。新增圖片時注意累計數量。
- **[Cloudflare Image Resizing 服務依賴]** → 若服務異常，`onerror=redirect` 選項可 fallback 到原圖。考慮在 URL 中加入此選項。
- **[Cache purge 限制]** → `/cdn-cgi/` 路徑無法個別 purge cache，只能 purge 原始 URL 或全站 purge。對於靜態圖片影響不大。
