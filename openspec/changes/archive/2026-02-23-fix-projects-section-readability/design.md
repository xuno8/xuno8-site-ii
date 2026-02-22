## Context

Projects 區塊的 ProjectCards.vue 使用 inline style 搭配 CSS custom properties 控制色彩。目前描述文字和 Source Code 連結都使用 `--color-text-muted`，這是設計給真正需要去強調的元素（如 timestamp、metadata），不適合作為主要內容的文字色。

主題系統已定義更合適的色階：
- `--color-text-secondary`（developer: `#a9b1d6`，photographer: `#c4b9a8`）— 用於次要但需可讀的內容
- `--color-accent-2`（developer: `#bb9af7`，photographer: `#9aab8a`）— 用於次要強調色

## Goals / Non-Goals

**Goals:**
- 描述文字達到 WCAG AA 對比度標準（≥4.5:1）
- Source Code 連結具備足夠視覺辨識度，與 Live Demo 連結形成層級區隔
- Project 命名準確反映內容

**Non-Goals:**
- 不改變卡片佈局、間距、圓角
- 不新增 hover 效果或互動
- 不調整 tech tags 或 featured badge
- 不變更 photographer 模式主題色定義

## Decisions

### 1. 描述文字使用 `--color-text-secondary`

改用已存在的 `--color-text-secondary` 而非新增色階。此變數在兩個主題中都已定義，且 Experience 區塊已使用此色階作為描述文字，保持一致性。

### 2. Source Code 連結使用 `--color-accent-2`

使用已存在的 `--color-accent-2`（紫色/綠色），與 Live Demo 的 `--color-accent`（青色/金色）形成色相區隔。兩個連結都有足夠辨識度，但透過不同色相建立主次層級。

### 3. 命名改為 "xuno8.com"

以域名作為 project title，避免自指性的 "Personal Portfolio"。域名是開發者慣用的 project 識別方式。

## Risks / Trade-offs

- [低風險] `--color-accent-2` 在 hover 時會跟隨全域 `a:hover` 變為 `--color-accent-hover`，視覺上可接受 → 無需額外處理
