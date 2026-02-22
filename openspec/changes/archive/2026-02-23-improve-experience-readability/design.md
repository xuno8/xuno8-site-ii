## Context

網站使用 CSS custom properties 驅動雙主題系統（Developer: Tokyo Night / Photographer: Wabi-sabi）。目前色彩層級只有兩階：`--color-text`（主要文字）和 `--color-text-muted`（次要/裝飾性文字）。Experience 區塊的 Location 和 Date 使用了 `--color-text-muted`，但這些是功能性 metadata，需要可讀而非隱匿。

相關檔案：
- `src/styles/global.css` — 主題 custom properties 定義
- `src/components/developer/ExperienceTimeline.vue` — Experience 卡片元件

## Goals / Non-Goals

**Goals:**
- Location 和 Date 文字在兩個主題下都符合 WCAG AA 對比度標準（≥ 4.5:1）
- 建立可複用的 `--color-text-secondary` 色階，未來其他 metadata 文字可統一使用
- 日期文字使用 monospace 字型，強化開發者 portfolio 的技術精確感

**Non-Goals:**
- 不重新設計 Experience 卡片的佈局
- 不修改 `--color-text-muted` 的值
- 不影響其他元件的樣式

## Decisions

### 1. 新增 `--color-text-secondary` 而非修改 `--color-text-muted`

**選擇**: 新增第三個文字色階 `--color-text-secondary`

**替代方案**: 直接調亮 `--color-text-muted`
**理由**: `--color-text-muted` 在 Navbar 分隔符、footer 裝飾元素等地方仍需保持低調。修改它會產生非預期的連鎖影響。新增一個專門的中間色階是更安全且語義更清晰的做法。

### 2. Developer 主題色值選擇 `#a9b1d6`

**選擇**: `#a9b1d6`（Tokyo Night 調色盤中的 `fg_dark`）

**替代方案**: `#7982a9`（較暗，約 4.2:1）、`#b4bce8`（較亮，約 7:1）
**理由**: `#a9b1d6` 在 `#292e42` 卡片背景上提供約 6:1 的對比度，符合 WCAG AA。它來自 Tokyo Night 原始調色盤，保持視覺一致性。比 `--color-text`（`#c0caf5`）略暗，不會搶走主要文字的層級。

### 3. Photographer 主題色值選擇 `#c4b9a8`

**選擇**: `#c4b9a8`

**理由**: 在 Photographer 卡片背景 `#252320` 上提供約 6.5:1 的對比度。色調偏暖，與 Photographer 的 earth tone 系統一致。介於 `--color-text`（`#f0ebe5`）和 `--color-text-muted`（`#a39b8e`）之間。

### 4. Date 使用 monospace 字型

**選擇**: 日期文字套用 `font-family: var(--font-mono)`（JetBrains Mono）

**理由**: 等寬字型讓日期在視覺上有「精確」感，非常適合開發者 portfolio。字型已在 `:root` 定義且載入，無額外 bundle 成本。

### 5. Location 增加 font-weight

**選擇**: Location 文字從 inherit（400）改為 `font-semibold`（600）

**理由**: 在不改變字體大小的前提下，增加視覺重量。搭配新色值即可達到足夠的可辨識性。

## Risks / Trade-offs

- **[極低風險] 新 custom property 未被其他元件使用**: 目前只有 ExperienceTimeline 會用到，但命名為通用的 `--color-text-secondary` 方便未來複用 → 無需特別處理
- **[低風險] Photographer 主題下的 Experience 目前不會顯示**: 因為 Experience 只在 Developer 模式下出現，但仍應維持雙主題定義的一致性 → 同步新增 Photographer 色值
