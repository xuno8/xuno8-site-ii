## Context

ModeToggle 是頁面中唯一持續浮動的 UI 元素（fixed 定位於頂部置中），目前使用 `--color-bg-card` 不透明背景和 `--color-border` 實心邊框。視覺上與背景內容割裂。

本設計將其改為 Liquid Glass 風格——半透明玻璃感，讓底層內容透過模糊折射隱約可見，並加入高光邊緣模擬物理光澤。

專案使用 Astro SSG + Vue 3 islands 架構。ModeToggle 是一個 Vue island（`client:load`），樣式主要透過 inline style 和 scoped CSS 控制。雙主題（developer/photographer）由 `data-theme` 屬性驅動 CSS custom properties。

## Goals / Non-Goals

**Goals:**

- 讓 ModeToggle 具備 Liquid Glass 毛玻璃效果（模糊背景 + 半透明 + 光澤邊緣）
- 在 Chromium 瀏覽器提供 SVG filter 折射增強效果
- 雙主題各有適合的玻璃色調（developer: 冷色偏藍 / photographer: 暖色偏琥珀）
- 為不支援 `backdrop-filter` 的瀏覽器提供可接受的降級
- 尊重 `prefers-reduced-motion`

**Non-Goals:**

- 不使用 Three.js / WebGL（bundle size 不合理）
- 不為 SectionNav 或其他元件加入 Liquid Glass（後續 change 處理）
- 不改變 toggle 的功能邏輯或定位/捲動隱藏行為
- 不引入 npm 套件依賴

## Decisions

### D1: 純 CSS + SVG filter 而非 JavaScript 函式庫

使用 CSS `backdrop-filter` + SVG `feDisplacementMap` 實現效果，不使用 `@specy/liquid-glass` 或 `liquidGL`。

**理由：** 這些函式庫依賴 Three.js（~150KB gzipped），對一個 toggle 元件來說成本太高。CSS-only 方案零依賴，且足以達成視覺目標。

**替代方案：** `@specy/liquid-glass` 提供物理正確的折射，但 bundle 開銷不合理。

### D2: 三層結構實現玻璃效果

在 ModeToggle button 內使用三個邏輯層：

1. **Button 本體** — 半透明背景 + 邊框 + 外陰影
2. **`::before` 偽元素** — `backdrop-filter: blur() saturate()` 作為毛玻璃層
3. **`::after` 偽元素** — 漸層高光模擬玻璃折射光澤

**理由：** Vue scoped CSS 支援偽元素，避免增加 DOM 節點。分層讓每個效果獨立可控。

### D3: SVG filter 嵌入在 index.astro 中

SVG filter 定義放在 `index.astro`（`<Layout>` 內），而非 Vue 元件中，因為 SVG filter 需要全域可存取的 `id`。Vue 元件透過 `url(#liquid-glass-filter)` 引用。

**理由：** Astro 控制 HTML shell，SVG defs 在 SSG 時就會存在於頁面中，無需等待 Vue hydration。

### D4: 主題適配透過 CSS custom properties

新增 Liquid Glass 專用 CSS custom properties：

- `--glass-bg`: 半透明背景色
- `--glass-border`: 半透明邊框色
- `--glass-highlight`: 高光漸層色
- `--glass-shadow`: 投影色

在 `global.css` 的 `[data-theme='developer']` 和 `[data-theme='photographer']` 區塊中分別定義值。

**理由：** 與現有主題系統一致，toggle 內的樣式直接讀 CSS variable，主題切換時自動轉換。

### D5: 降級策略使用 `@supports`

```css
/* 基本降級：半透明實色背景 */
.mode-toggle {
  background: var(--glass-bg-fallback);
}

/* 支援 backdrop-filter 時：完整效果 */
@supports (backdrop-filter: blur(1px)) {
  .mode-toggle::before {
    backdrop-filter: blur(20px) saturate(1.8);
  }
}
```

**理由：** `@supports` 是標準 CSS feature query，無 JS 開銷，且精確匹配瀏覽器能力。

## Risks / Trade-offs

- **[SVG filter 只有 Chromium 支援]** → 使用 `@supports` 降級；非 Chromium 瀏覽器仍有毛玻璃 + 高光，只缺折射扭曲
- **[backdrop-filter 效能]** → ModeToggle 面積小（80×40px），blur 計算開銷可忽略
- **[深色主題下對比度]** → 加入 `--glass-bg-fallback` 確保文字/icon 在無效果環境下仍可讀
- **[prefers-reduced-motion]** → 停用高光漸層動畫，保留靜態毛玻璃效果
