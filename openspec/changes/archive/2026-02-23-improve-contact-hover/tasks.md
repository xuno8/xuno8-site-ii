## 1. Rest State — Icon 靜止色調整

- [x] 1.1 將 `.social-link svg` 的 `color` 從 `var(--color-accent)` 改為 `var(--color-text-muted)`（修改 `src/components/developer/Hero.vue`）
- [x] 1.2 為 `.social-link svg` 的 transition 加入 `color` 屬性，使用統一 easing `cubic-bezier(0.22, 1, 0.36, 1)`

## 2. Hover State — 統一亮起效果

- [x] 2.1 在 `.social-link:hover svg` 中加入 `color: var(--color-accent)` 使 icon 從 muted 亮起
- [x] 2.2 將 `.social-link:hover` 的 text color 改為 `var(--color-accent-hover)` 以提供更亮一階的文字
- [x] 2.3 將 `.social-link:hover svg` 的 `filter` 改為雙層 drop-shadow（寬散 + 緊實 neon glow）
- [x] 2.4 在 `.social-link:hover svg` 加入 `transform: scale(1.1)`
- [x] 2.5 在 `.social-link:hover` 加入 `transform: translateX(2px)`
- [x] 2.6 將 hover background 從平色 tint 改為 `linear-gradient(90deg, accent 12% → accent 3%)`

## 3. Transition 統一

- [x] 3.1 將 `.social-link` 的 transition 加入 `transform` 屬性
- [x] 3.2 將 `.social-link svg` 的 transition easing 從 `ease` 改為 `cubic-bezier(0.22, 1, 0.36, 1)`，並加入 `color` 和 `transform` 屬性
- [x] 3.3 為 `.social-link` 的 transition 加入 `opacity 0.3s` 以支援 fade-in

## 4. Focus 與 Active 狀態

- [x] 4.1 新增 `.social-link:focus-visible` 樣式：`outline: 2px solid var(--color-accent)`、`outline-offset: 2px`、背景 accent tint
- [x] 4.2 新增 `.social-link:active` 樣式：`transform: translateX(1px) scale(0.98)`、加深背景 tint

## 5. Reduced Motion 支援

- [x] 5.1 在 `@media (prefers-reduced-motion: reduce)` 中加入 `.social-link` 的 transition 和 transform 禁用規則，保留色彩狀態切換

## 6. 驗證

- [x] 6.1 啟動 dev server，確認 social links 靜止時 icon 為 muted 色
- [x] 6.2 驗證 hover 時 icon、text、border、background、transform 同步變化，無延遲感
- [x] 6.3 驗證 Tab 鍵導航時 focus-visible 樣式正確顯示
- [x] 6.4 驗證點擊時有 scale(0.98) 按壓回饋（CSS 規則已確認存在於 scoped styles）
- [x] 6.5 在 DevTools 中模擬 `prefers-reduced-motion: reduce`，確認動畫被禁用但狀態切換保留（CSS 規則已確認完整）
