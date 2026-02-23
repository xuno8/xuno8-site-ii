## Why

ModeToggle 目前使用不透明的 `--color-bg-card` 背景搭配實心邊框，視覺上顯得扁平且與頁面斷開。Apple 在 WWDC 2025 發表的 Liquid Glass 設計語言提供了一種讓浮動 UI 元素融入背景的方式——透過毛玻璃模糊、折射和高光效果，讓 toggle 看起來像是一片懸浮的透明玻璃。作為網站中唯一持續可見的浮動元素，ModeToggle 是引入此效果的最佳起點。

## What Changes

- 將 ModeToggle 的背景從不透明 `--color-bg-card` 改為 `backdrop-filter: blur()` 毛玻璃效果
- 加入半透明漸層背景模擬玻璃折射光澤
- 加入 inset box-shadow 模擬玻璃邊緣高光（specular rim）
- 在 Chromium 瀏覽器中使用 SVG `feDisplacementMap` filter 實現折射扭曲效果
- 為不支援 `backdrop-filter` 的瀏覽器提供優雅降級（fallback 為半透明實色背景）
- 尊重 `prefers-reduced-motion` 設定，停用動態高光動畫

## Capabilities

### New Capabilities

- `liquid-glass-effect`: ModeToggle 的 Liquid Glass 視覺效果，包含毛玻璃模糊、折射、高光及降級策略

### Modified Capabilities

- `floating-toggle`: 外觀樣式從不透明改為透明玻璃，定位與捲動行為不變

## Impact

- **元件：** `src/components/shared/ModeToggle.vue` — 樣式大幅修改
- **樣式：** `src/styles/global.css` — 可能新增 Liquid Glass 相關 CSS custom properties
- **頁面：** `src/pages/index.astro` — 可能需嵌入 SVG filter 定義
- **依賴：** 無新增套件，純 CSS + SVG 實作
- **相容性：** 完整效果需 Chromium；Safari/Firefox 降級為基本毛玻璃
