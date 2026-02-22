## Why

Projects 區塊有三個可讀性與 UX 問題：描述文字對比度不足（未達 WCAG AA）、Source Code 連結幾乎隱形、以及 "Personal Portfolio" 命名過於泛用且自指。

## What Changes

- 將 project 描述文字色從 `--color-text-muted` 改為 `--color-text-secondary`，對比度從 ~3.2:1 提升至 ~7.8:1
- 將 Source Code 連結色從 `--color-text-muted` 改為 `--color-accent-2`，使其可見且與 Live Demo 連結形成色相區隔
- 將 projects.yaml 中 "Personal Portfolio" 重新命名為 "xuno8.com"

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

（無 spec 層級的行為變更，僅為視覺樣式與內容文字調整）

## Non-goals

- 不改變卡片佈局結構或間距
- 不新增 hover 效果或動畫
- 不調整 tech tags 或 featured badge 樣式
- 不修改 photographer 模式的視覺

## Impact

- `src/components/developer/ProjectCards.vue`：第 57、87 行的 inline style 色彩值
- `src/data/projects.yaml`：第 10 行的 title 欄位
