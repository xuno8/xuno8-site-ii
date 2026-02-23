## Context

Photographer 模式的 Lightbox 目前以 `v-if` 瞬間 mount/unmount，無任何過渡動畫。Lightbox 元件位於 `<main>` 內部，而 `global.css` 為 `main` 設定了 `position: relative; z-index: 1`，建立了 stacking context，導致 Lightbox 的 `z-60` 被困在 `main` 內部，無法遮蓋同級的 `<footer>`（z-1, DOM 順序更後）和 `#toggle-wrapper`（z-50）。圖片容器有多重尺寸限制（`max-w-5xl`, `px-16`, `max-h-[75vh]`），壓縮了可視面積。

## Goals / Non-Goals

**Goals:**
- 解決 z-index stacking context 問題，確保 Lightbox 遮蓋所有 UI
- 開啟/關閉時有流暢的 GSAP 動畫序列
- 圖片佔滿視窗，提供沈浸式觀看體驗
- Caption 浮動覆蓋不佔用垂直空間

**Non-Goals:**
- FLIP 動畫（從縮略圖位置展開到全屏）
- 切換圖片時的過渡動畫（prev/next）
- 觸控裝置的手勢增強（pinch-to-zoom 等）

## Decisions

### 1. Vue Teleport 解決 stacking context

**選擇**：`<Teleport to="body">` 將 Lightbox 移到 body 直接子層。

**替代方案**：
- 移除 `main` 的 `z-index` — 可能影響 developer 模式的 `body::before` 背景層疊
- 純 CSS 提升 — 無法真正脫離 stacking context

**理由**：Teleport 是 Vue 3 原生能力，不改動現有 CSS 架構，影響範圍最小。

### 2. Nanostore 驅動 UI 隱藏

**選擇**：新增 `src/stores/lightbox.ts` 匯出 `lightboxOpen` atom (`atom<boolean>`)。

**理由**：專案已使用 Nanostores 做跨 island 狀態共享（`currentMode`），同樣的模式。Vue 端用 `useStore()` 監聽，Astro 端（index.astro 的 inline script）用 `lightboxOpen.subscribe()` 監聽並 toggle footer/toggle-wrapper 的 CSS class。

### 3. GSAP Timeline 動畫編排

**選擇**：在 Lightbox.vue 的 `onMounted` 中建立 GSAP timeline 做進場動畫，關閉時反向播放（`timeline.reverse()`）。不使用 Vue `<Transition>` 組件。

**替代方案**：
- Vue `<Transition>` + CSS — 只能做簡單 fade，無法精細編排多元素序列
- Vue `<Transition>` + GSAP hooks — 可行但增加複雜度，且需要手動控制 `done()` callback

**理由**：直接用 GSAP 更符合專案現有模式，可以精確控制每個元素的時序。用 `v-show` 替代 `v-if` 讓元素始終存在於 DOM，由 GSAP 控制可見性。

**動畫時序**：

```
開啟（~550ms）
  t=0     backdrop opacity: 0 → 1        (250ms, power2.out)
  t=100   image opacity: 0 → 1,          (400ms, power2.out)
          scale: 0.92 → 1
  t=350   caption opacity: 0 → 1,        (300ms, power2.out)
          translateY: 10px → 0
  t=0     controls opacity: 0 → 1        (300ms, power2.out)

關閉：timeline.reverse()（自動反轉所有動畫）
```

### 4. 圖片最大化佈局

**選擇**：
- 移除外層 `max-w-5xl`，改為 `w-full`
- `padding` 從 `px-16` 縮減為 `px-12`（保留導航按鈕空間）
- 圖片 `max-h` 從 `75vh` 提高到 `92vh`
- Caption 使用 `position: absolute; bottom: 0` 浮動在圖片下方，帶半透明漸層背景

### 5. 關閉時序與 DOM 移除

**選擇**：用 `v-show` 控制 Lightbox 可見性，搭配 `isOpen` ref。`useLightbox.close()` 觸發 GSAP reverse，動畫完成後才設 `isOpen = false`（但因為用 `v-show`，元素不會被移除，只是 `display: none`）。

改為：保持 `v-if` 但用一個 `isVisible` ref 來控制。`open()` 設 `isVisible = true`（掛載 DOM），`onMounted` 播放進場動畫。`close()` 播放退場動畫，動畫 `onComplete` 時設 `isVisible = false`（移除 DOM）。

**理由**：避免 Lightbox 在隱藏時佔用 DOM 和事件監聽。

## Risks / Trade-offs

- **[Teleport 與 SSR]** → Astro SSG 環境中 Teleport 只在 client 端執行，不影響靜態生成。Lightbox 本身就是純 client 互動元件。
- **[動畫中斷]** → 用戶快速開關 Lightbox 可能導致動畫衝突。→ 在 `open()` / `close()` 中檢查動畫狀態，若正在播放則 `kill()` 後重啟。
- **[prefers-reduced-motion]** → 尊重用戶的減少動畫偏好。→ 檢測 `prefersReducedMotion`，若啟用則跳過 GSAP 動畫，直接顯示/隱藏。
