## Why

Experience 區塊中的 Location 和 Date 文字使用 `--color-text-muted` (`#565f89`)，在卡片背景 `--color-bg-card` (`#292e42`) 上的對比度僅約 2.8:1，遠低於 WCAG AA 4.5:1 標準。這些是使用者需要快速掃描的功能性資訊，卻被當成裝飾性元素處理，導致可讀性不足。

## What Changes

- 在 Developer 主題的 CSS custom properties 中新增 `--color-text-secondary` 中間色階（`#a9b1d6`，對比度約 6:1）
- 在 Photographer 主題中新增對應的 `--color-text-secondary`，維持雙主題一致性
- Experience 卡片的 Date 文字改用 `--color-text-secondary` 並套用 monospace 字型（`--font-mono`）
- Experience 卡片的 Location 文字改用 `--color-text-secondary` 並增加 font-weight 至 semibold

## Non-goals

- 不改變 Experience 區塊的整體佈局結構
- 不新增互動效果（hover state 等）
- 不修改其他區塊（Hero、Skills、Projects 等）的設計
- 不改動 `--color-text-muted` 本身的值（它仍適用於裝飾性元素）

## Capabilities

### New Capabilities

- `theme-text-secondary`: 為雙主題系統新增 `--color-text-secondary` 色階，填補 `--color-text` 與 `--color-text-muted` 之間的視覺落差

### Modified Capabilities

_(無既有 spec 需要修改)_

## Impact

- `src/styles/global.css` — 兩個主題區塊各新增一個 CSS custom property
- `src/components/developer/ExperienceTimeline.vue` — Date 和 Location 的 inline style 及 class 調整
