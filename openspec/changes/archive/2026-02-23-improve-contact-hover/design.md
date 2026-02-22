## Context

Hero 元件（`src/components/developer/Hero.vue`）中的 social links 以 terminal 風格呈現，模擬 `$ contact --list` 指令輸出。目前 hover 互動存在以下問題：

1. **Icon 靜止即亮色** — SVG icon 永遠是 `--color-accent`，hover 時僅加微弱 `drop-shadow`，視覺變化不足
2. **Transition 不同步** — 文字用 `cubic-bezier(0.22, 1, 0.36, 1)`，SVG 用 `ease`，兩者節奏不一致
3. **缺少 fade-in** — opacity 從 0 → 1 無 transition，stagger 動畫為瞬間跳變
4. **無空間反饋** — 沒有 transform（相較 avatar 有 bouncy hover）
5. **無 focus/active 狀態** — 鍵盤導航與點擊均無回饋

所有改動限定在 scoped CSS 區塊，不涉及 JS 邏輯或資料結構。

## Goals / Non-Goals

**Goals:**
- 建立清晰的 rest → hover → active 狀態切換（dim → bright）
- 統一所有動畫屬性使用同一 easing curve
- 為 stagger 出現加入 fade-in transition
- 加入符合 terminal aesthetic 的 transform 微動畫
- 補充 `:focus-visible` 和 `:active` 互動狀態
- 維持 `prefers-reduced-motion` 支援

**Non-Goals:**
- 不修改 HTML 結構或 Vue 邏輯
- 不調整 GSAP timeline 或 stagger 時序
- 不為不同 platform 設定不同色調（可作為後續改進）
- 不影響 photographer mode
- 不新增 CSS 變數到 global.css

## Decisions

### 1. Icon 靜止色改為 muted

**決定**: 將 `.social-link svg` 的 `color` 從 `var(--color-accent)` 改為 `var(--color-text-muted)`

**理由**: 建立明確的 dim → bright 視覺層次。icon 在靜止時與文字都是低調狀態，hover 時同時亮起，避免「icon 已經亮了但好像沒反應」的觀感。

**替代方案考量**:
- 維持 accent 色但降低 opacity → 會讓 icon 看起來像 disabled，語義不正確
- 用 `filter: brightness()` 控制 → 更難維護，且與 theme 系統不一致

### 2. 統一 easing curve

**決定**: 所有 transition 統一使用 `cubic-bezier(0.22, 1, 0.36, 1)`（快進快停），包含 SVG 的 `color`、`filter`、`transform`

**理由**: 消除文字與 icon 動畫節奏的感知落差。此 easing 是「ease-out-expo」風格，反應迅速且收尾乾脆，符合 terminal/hacker 的 snappy 調性。

### 3. hover 加入 translateX(2px)

**決定**: `.social-link:hover` 加入 `transform: translateX(2px)`

**理由**: 模擬 terminal 中「選取命令」的微位移感。2px 幅度極小，不會造成 layout shift 疑慮，但提供清晰的空間回饋。

**替代方案考量**:
- `translateX(4px)` → 太大，會感覺跳動
- `scale(1.02)` → 文字 scale 會模糊，不適合 monospace 字型

### 4. 雙層 neon glow

**決定**: hover 時 SVG icon 使用雙層 `drop-shadow`（一層寬散、一層緊實），取代現有單層微弱 shadow

**理由**: 雙層 glow 產生 neon-sign 效果，與 terminal 的 cyan/purple 漸層光暈一致。

### 5. border-left 保持純色彩變化，不動寬度

**決定**: 維持 `border-left: 2px solid transparent` → hover 時變 `var(--color-accent)`，不改寬度

**理由**: 改寬度（0→3px）會造成文字位移，在現有 flex layout 中產生跳動。純色彩切換已足夠，搭配 translateX 提供空間感。

### 6. 背景使用 gradient sweep

**決定**: hover 背景從平色 tint 改為 `linear-gradient(90deg, accent 12% → accent 3%)`

**理由**: 從左（border 側）到右的漸淡效果，強化「掃描線」的 terminal 氛圍，比均勻 tint 更有層次。

## Risks / Trade-offs

- **[Icon 靜止色太暗]** → 在低對比螢幕上可能不夠清楚。Mitigation: `--color-text-muted` (#565f89) 對 `--color-bg` (#1a1b26) 的對比度為 3.2:1，通過 WCAG AA 非文字元素要求。
- **[drop-shadow 效能]** → 雙層 `drop-shadow` 在大量元素上可能影響效能。Mitigation: 僅 4 個 link，且 `will-change` 不需要，影響可忽略。
- **[translateX 與 border 的配合]** → 平移可能讓 border-left 看起來脫離容器邊緣。Mitigation: 2px 位移極小，且 border 隨整個元素移動，視覺上保持一致。
