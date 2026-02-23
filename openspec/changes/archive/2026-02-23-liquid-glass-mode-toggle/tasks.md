## 1. CSS Custom Properties 設定

- [x] 1.1 在 `src/styles/global.css` 的 `[data-theme='developer']` 區塊新增 Liquid Glass 變數：`--glass-bg`, `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--glass-bg-fallback`（冷色調）
- [x] 1.2 在 `src/styles/global.css` 的 `[data-theme='photographer']` 區塊新增對應的 Liquid Glass 變數（暖色調）

## 2. SVG Filter 定義（Astro 側）

- [x] 2.1 在 `src/pages/index.astro` 的 `<Layout>` 內嵌入隱藏的 SVG `<defs>`，定義 `id="liquid-glass-filter"` 的 `feDisplacementMap` + `feGaussianBlur` 濾鏡

## 3. ModeToggle 樣式重構（Vue 側）

- [x] 3.1 在 `src/components/shared/ModeToggle.vue` 中移除 button 的 inline `backgroundColor` 和 `border` 樣式，改由 scoped CSS class 控制
- [x] 3.2 在 scoped CSS 中設定 button 半透明背景 `var(--glass-bg)` 和半透明邊框 `var(--glass-border)`
- [x] 3.3 加入 `::before` 偽元素實現 `backdrop-filter: blur(20px) saturate(1.8)` 毛玻璃效果
- [x] 3.4 加入 `::after` 偽元素實現漸層高光（`var(--glass-highlight)`）模擬玻璃光澤
- [x] 3.5 設定 inset box-shadow 模擬上方光源反射，外部 box-shadow 提供浮動投影

## 4. 降級與無障礙

- [x] 4.1 使用 `@supports (backdrop-filter: blur(1px))` 包裹 `::before` 的 backdrop-filter 效果
- [x] 4.2 在不支援時使用 `--glass-bg-fallback` 半透明實色背景
- [x] 4.3 加入 `@media (prefers-reduced-motion: reduce)` 停用高光動畫效果，保留靜態毛玻璃

## 5. Hover 與互動狀態

- [x] 5.1 更新 `.mode-toggle:hover` 樣式：增強邊框亮度和外部光暈
- [x] 5.2 確認 toggle knob 的漸層和陰影在玻璃背景上的可見度

## 6. 驗證

- [x] 6.1 在 Chromium 瀏覽器中確認完整 Liquid Glass 效果（blur + 折射 + 高光）
- [x] 6.2 在 Safari/Firefox 中確認降級效果正常（毛玻璃 + 高光，無折射）
- [x] 6.3 切換 developer/photographer 主題確認色調正確切換
- [x] 6.4 開啟 `prefers-reduced-motion` 確認動畫停用
- [x] 6.5 執行 `npm run build` 確認建置無錯誤
