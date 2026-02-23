## 1. Setup — UnoCSS Icons Preset

- [x] 1.1 安裝 `@unocss/preset-icons` 和 `@iconify-json/simple-icons`（社群圖示）以及 `@iconify-json/lucide`（mail 圖示）— 修改 `package.json`
- [x] 1.2 在 `uno.config.ts` 中加入 `presetIcons()` 到 presets 陣列

## 2. Core Implementation — Footer 社群連結

- [x] 2.1 修改 `src/components/shared/Footer.astro`：讀取 `site.socialLinks` 與 `site.email`，在版權文字上方渲染社群圖示連結列
- [x] 2.2 每個社群連結使用 UnoCSS icon class（`i-simple-icons-github`、`i-simple-icons-linkedin`、`i-simple-icons-instagram`）、Email 使用 `i-lucide-mail`
- [x] 2.3 所有連結加入 `aria-label` 屬性（平台名稱），社群連結加入 `target="_blank"` 和 `rel="noopener noreferrer"`，Email 連結使用 `mailto:` href

## 3. Styling — 雙主題支援

- [x] 3.1 為 Footer 圖示連結加入樣式：使用 `var(--color-text-muted)` 預設色、hover 時過渡到 `var(--color-accent)`，確保兩個主題下都正確顯示
