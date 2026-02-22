## Context

Hero.vue 的入場動畫使用 GSAP timeline 驅動一個 5 階段序列。目前的實作中，方塊、頭像、title、intro 等元素透過 Vue 的 `v-if` reactive flags 控制是否渲染在 DOM 中。當 flag 從 `false` 變為 `true` 時，DOM 節點才被插入，隨後 GSAP 對該元素做 fade/transform 動畫。

這個模式造成卡頓，因為：
1. DOM 插入觸發 layout reflow，整個 terminal body 的尺寸需要重新計算
2. Vue 的 DOM 更新是非同步的（batched via nextTick），但 GSAP timeline 中的 `tl.from()` 是同步排程的，兩者之間存在時序衝突
3. `.content-box` 的 `opacity: 0.85` 造成額外的合成層開銷

## Goals / Non-Goals

**Goals:**
- 消除 Hero 入場動畫在元素出現時的卡頓和跳動
- 保持動畫的視覺效果與原設計完全一致（時序、easing、順序）
- 用純 GSAP 控制所有元素的可見性，不依賴 Vue 的 `v-if` 做動畫時的 DOM 操作

**Non-Goals:**
- 不改變動畫的視覺設計或階段順序
- 不改動 box-shadow 或主題色彩
- 不改動打字機效果（已經流暢）
- 不改動 `useGsapContext` composable 的 API
- 不改動 reduced-motion 行為

## Decisions

### Decision 1: 用 GSAP `set()` + `to()` 取代 `v-if` + `tl.call()` + `tl.from()`

**選擇**: 所有動畫元素始終渲染在 DOM 中。在 GSAP context 的 setup 開頭用 `gsap.set()` 將它們設為不可見（`opacity: 0`, `visibility: 'hidden'`），然後在 timeline 中用 `tl.to()` 做出現動畫。

**替代方案**:
- `v-show`（`display: none`）：雖然不插入/移除 DOM，但 `display: none` → `display: block` 仍然觸發 layout reflow。且 GSAP 無法對 `display: none` 的元素做動畫。
- CSS `animation` 取代 GSAP：需要重寫整個 timeline 邏輯，且難以維持精確的 stagger 和 sequential 排程。

**理由**: `gsap.set()` 在 `onMounted` 時同步執行，元素從第一幀起就在 DOM 中但不可見。後續 `tl.to()` 只改 opacity/transform，屬於 GPU 可處理的 composite-only 屬性，不觸發 layout。

### Decision 2: 用 `autoAlpha` 取代手動 `opacity` + `visibility`

**選擇**: 使用 GSAP 的 `autoAlpha` 屬性，它會自動管理 `opacity` 和 `visibility`。當 `autoAlpha: 0` 時，元素是 `visibility: hidden`（不佔互動空間但佔佈局空間），當 `autoAlpha > 0` 時自動切回 `visibility: visible`。

**理由**: 比手動管理兩個屬性更簡潔，且避免 `opacity: 0` 的元素仍然可被點擊的問題。

### Decision 3: 保留打字機相關的 reactive refs，移除 visibility flags

**選擇**: `whoamiChars`、`nameChars`、`contactChars`、`animationDone` 保留（打字機需要它們）。移除 `showContentBox`、`showAvatar`、`showTitle`、`showIntro`、`showContactBox`、`showLinks`。

**理由**: 打字機效果需要 Vue 的 reactive computed 做 `slice()` 更新，這部分效能良好不需修改。而 visibility flags 的職責可以完全由 GSAP 接管。

### Decision 4: `.content-box` 移除 CSS `opacity: 0.85`

**選擇**: 移除 `.content-box` 上靜態的 `opacity: 0.85`，改用 GSAP 動畫結束後的目標值直接設為 `1`。如果需要視覺上的 dimming 效果，改用 `background` 的 alpha 值實現。

**理由**: 元素級的 `opacity < 1` 會強制建立獨立合成層，且其子元素的 opacity 動畫會疊加計算。用 background alpha 達成同樣視覺效果，不會觸發額外的合成層。

## Risks / Trade-offs

- **[FOUC 風險]** 元素始終在 DOM 中，如果 GSAP 的 `set()` 因某種原因未執行（如 JS 載入失敗），所有內容會立即可見而非漸進出現。→ **緩解**: 在 CSS 中為動畫目標元素預設 `opacity: 0`，GSAP 載入後再控制。
- **[Layout 空間佔用]** 用 `visibility: hidden` 的元素仍佔佈局空間，不像 `v-if` 完全不存在。→ **影響極小**：因為 terminal body 的最終尺寸本來就包含所有內容，這反而消除了「撐開」的跳動。
- **[Reduced motion path]** 目前 reduced motion 直接設所有 flags 為 true，改後需改為直接用 GSAP `set()` 設 `autoAlpha: 1`。→ **簡單修改**。
