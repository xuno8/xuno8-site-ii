## 1. CSS Custom Properties

- [x] 1.1 在 `src/styles/global.css` 的 `[data-theme="developer"]` 區塊中新增 `--color-text-secondary: #a9b1d6`
- [x] 1.2 在 `src/styles/global.css` 的 `[data-theme="photographer"]` 區塊中新增 `--color-text-secondary: #c4b9a8`

## 2. ExperienceTimeline 元件樣式調整

- [x] 2.1 修改 `src/components/developer/ExperienceTimeline.vue` 中 Date 文字的 inline style：color 改為 `var(--color-text-secondary)`，新增 `font-family: var(--font-mono)`
- [x] 2.2 修改 `src/components/developer/ExperienceTimeline.vue` 中 Location 文字的 inline style：color 改為 `var(--color-text-secondary)`，新增 `font-weight: 600`

## 3. 驗證

- [x] 3.1 執行 `npm run build` 確認建置成功無錯誤
- [x] 3.2 在 dev server 中目視確認 Developer 主題下 Date 和 Location 的可讀性提升
