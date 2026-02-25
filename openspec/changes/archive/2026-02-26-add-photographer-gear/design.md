## Context

Photographer 模式目前僅包含 MasonryGallery 照片牆。使用者希望在頁面加入器材資訊，採極簡 inline 一行式呈現（品牌 + 型號，中點分隔），與 wabi-sabi 暖色調風格一致。

現有器材：Sony α7 III、Sony FE 24-105mm F4、RICOH GR IV。Sony 品牌的排在一起。

## Goals / Non-Goals

**Goals:**
- 在 photographer 頁面新增一行器材展示，視覺極簡
- 器材資料從 YAML 驅動，方便日後增減
- 遵循既有架構模式（Astro 組裝、Vue island、YAML 資料）

**Non-Goals:**
- 不做卡片式佈局或詳細規格表
- 不加器材圖片
- 不做器材與個別照片的對應關聯
- 不做複雜動畫（最多淡入即可）

## Decisions

### 1. 元件形式：Vue island（GearBar.vue）

**選擇**：建立獨立 Vue 元件 `GearBar.vue`，走 `client:visible` hydration。

**替代方案**：直接在 Astro 模板寫 HTML。但既有 photographer 區塊都是 Vue island，保持一致性較好。且若日後想加 GSAP 淡入動畫，Vue 元件較容易擴展。

### 2. 資料來源：gear.yaml

**選擇**：新增 `src/data/gear.yaml`，每筆含 `brand` 和 `model` 欄位。`index.astro` build time 讀取並傳入元件 props。

**理由**：遵循既有 YAML 資料模式（photos.yaml、experience.yaml 等），build time 靜態產生，無 runtime 開銷。

### 3. 排列順序：YAML 定義順序

**選擇**：gear.yaml 中的順序即為顯示順序，不做 runtime 排序。使用者自行在 YAML 控制排列。

**理由**：只有 3 項器材，YAML 層級排序最直覺，不需額外排序邏輯。

### 4. 視覺呈現

- 字體：`var(--font-display)`（Newsreader 襯線體）
- 分隔符：中點 `·`，使用 `var(--color-accent)` accent 色
- 品牌名稱顯示：每項格式為「品牌 型號」（如 `Sony α7 III`）
- 字號：較小（`text-sm` 級別），不搶照片風頭
- 位置：gallery 下方，作為 footer 前的收尾資訊

### 5. 動畫

**選擇**：使用 `useGsapContext` 做簡單 fade-in（opacity 0→1），搭配 ScrollTrigger。

**理由**：其他 photographer 元件都用 GSAP，保持一致。動畫極簡，不過度設計。

## Risks / Trade-offs

- [極少器材項目時顯得空] → 目前 3 項剛好適合一行式，日後增加到 5+ 項可能需要換行或調整佈局，屆時再考慮。
- [品牌重複顯示] → 使用者明確要求列出品牌名稱，接受每項都帶品牌前綴的呈現方式。
