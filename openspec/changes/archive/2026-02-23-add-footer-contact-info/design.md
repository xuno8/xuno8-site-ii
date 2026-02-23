## Context

Footer (`src/components/shared/Footer.astro`) 目前僅顯示版權文字。`src/data/site.yaml` 已定義 `socialLinks`（GitHub、LinkedIn、Instagram）與 `email` 欄位，資料已就緒，只需在 Footer 中讀取並渲染。

## Goals / Non-Goals

**Goals:**
- 在 Footer 版權文字上方顯示社群圖示連結與 Email 連結
- 支援雙主題切換，圖示顏色隨 `data-theme` 自動調整

**Non-Goals:**
- 不新增聯絡表單
- 不修改 `site.yaml` 資料結構
- 不將 Footer 轉為 Vue island（保持 Astro 靜態元件）

## Decisions

### 1. 圖示實作方式：UnoCSS Icons preset

**選擇**: 使用 UnoCSS Icons preset（`i-simple-icons-github` 等 class）

**替代方案**:
- Inline SVG：需手動維護 SVG 程式碼，不夠簡潔
- Icon component library：增加額外依賴

**理由**: 專案已使用 UnoCSS，Icons preset 是最自然的方式，零額外依賴，且支援 attributify mode。

### 2. Email 連結處理

**選擇**: 使用 `mailto:` 連結，與社群圖示並排顯示

**理由**: 一致的視覺呈現，使用者點擊即可開啟郵件客戶端。

### 3. 元件結構

**選擇**: 保持 Footer 為 Astro 元件，不轉為 Vue island

**理由**: 社群連結無互動邏輯，純靜態渲染即可，符合專案「Astro owns layout」的架構原則。

### 4. 佈局

**選擇**: 社群連結置於版權文字上方，水平排列置中，圖示間距適當

**理由**: 常見的 Footer 佈局模式，視覺層次清晰。

## Risks / Trade-offs

- [UnoCSS Icons preset 未安裝] → 確認 `@iconify-json/simple-icons` 是否已在 dependencies 中，若無需安裝
- [Email 暴露爬蟲風險] → 靜態站點本身即有此風險，可接受；未來可考慮 obfuscation 但不在此次範圍
