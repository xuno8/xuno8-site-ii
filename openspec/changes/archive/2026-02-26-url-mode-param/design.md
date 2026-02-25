## Context

網站目前是單頁 SSG 架構，模式（developer / photographer）由 Nanostores atom 管理，預設固定為 `developer`。Pre-hydration inline script 在 `Layout.astro` 中同步設定 `data-theme`、favicon、title，確保無閃爍。

使用者希望能透過 URL 分享特定模式的連結，讓訪客一進來就看到指定模式。

## Goals / Non-Goals

**Goals:**
- 透過 `?m=p` / `?m=d` query parameter 控制初始模式
- Pre-hydration script 和 Nanostores atom 同步讀取同一參數，零閃爍
- 未帶參數時完全向後相容（預設 developer）

**Non-Goals:**
- Path-based routing（`/photographer`）— 會破壞 SSG 單頁架構
- 模式持久化（localStorage / cookie）
- 修改 mode toggle 的現有行為

## Decisions

### 1. 使用 query parameter 而非 path 或 hash

**選擇**: `?m=p` / `?m=d` query parameter

**替代方案**:
- `/photographer` path — 需要多頁面或 worker rewrite，增加部署複雜度
- `#photographer` hash — 語意不符（hash 通常用於錨點），且可能與未來頁內導航衝突

**理由**: Query parameter 在純 SSG 架構下零成本實作，不需改路由或部署設定，且語意明確。

### 2. 參數映射使用短名稱

**選擇**: `m=p`（photographer）、`m=d`（developer）

**理由**: 使用者要求簡短的參數格式，URL 更乾淨。只有兩個值，不需要長名稱。

### 3. 三層同步策略解決 SSR hydration mismatch

**問題**: Astro SSG 在 build time 產出的靜態 HTML 固定是 developer 模式內容。Client 端若透過 URL 參數切換到 photographer，Vue hydration 會偵測到 SSR DOM 與 client state 不一致（hydration mismatch），導致 toggle 狀態錯誤或內容不切換。

**選擇**: 三層同步，各負責不同時機：

1. **`<head>` inline script**（最早、同步）— 解析 `URLSearchParams`，設定 `data-theme`、favicon、title、`window.__INITIAL_MODE__`
2. **`</main>` 後 body inline script**（DOM ready、同步）— 直接切換 `#developer-content` / `#photographer-content` 的 `display`，在 Vue hydration 之前就讓正確的內容可見
3. **`mode.ts` module**（deferred）— 讀取 `window.__INITIAL_MODE__` 呼叫 `currentMode.set()`，同步 Nanostores atom 給所有 Vue 島嶼

**替代方案**:
- 在 Nanostores atom 初始值直接讀 URL → 造成 atom 與 SSR HTML 不一致，hydration mismatch 讓 Vue 保留錯誤 DOM
- 在 `useModeTransition` 的 `onMounted` 設定 mode → island hydration 時機不可控，`onMounted` 未必在預期時間點觸發

**理由**: 將視覺切換（inline script）與響應式狀態同步（module code）分開，各自在最可靠的時機執行，完全避開 hydration mismatch 問題。

### 4. ModeToggle 和 ModeTransitionController 使用 `client:only="vue"`

**選擇**: 將 `ModeToggle` 和 `ModeTransitionController` 從 `client:load` 改為 `client:only="vue"`

**替代方案**: 保持 `client:load`，接受 hydration mismatch

**理由**:
- `ModeToggle` 使用 `client:load` 時，SSR HTML 固定渲染 developer 狀態的 toggle，client 端 atom 為 photographer 時產生 hydration mismatch，Vue 保留 SSR DOM 導致 toggle 顯示錯誤方向
- `client:only` 跳過 SSR，直接在 client 用正確的 atom 值渲染，零 mismatch
- Toggle 和 transition controller 都需要 JS 才能互動，不 SSR 沒有實質損失
- `ModeTransitionController` 本身渲染隱藏 div，改為 `client:only` 是防禦性修改，保持一致

### 5. 無效參數值 fallback 到 developer

**選擇**: `?m=x`（非 p/d 的值）靜默 fallback 到 `developer`

**替代方案**: 忽略無效參數、顯示錯誤

**理由**: 使用者不應看到錯誤畫面，靜默 fallback 是最安全的行為。

## Risks / Trade-offs

- **[SEO]** → Query parameter 不影響 SSG 產出的靜態 HTML，搜尋引擎爬到的仍是 developer 模式。可接受，因為這是刻意的預設。
- **[URL 分享]** → 使用者手動切換模式後 URL 不會自動更新 `?m=` 參數。這是刻意的——toggle 是臨時切換，不應改變 URL。若未來需要，可用 `history.replaceState` 擴展。
- **[Hydration mismatch warnings]** → 其他仍使用 `client:load` / `client:visible` 的 SSR 元件（Hero, ExperienceTimeline 等）在 `?m=p` 時會因 `data-theme` 改變而產生 style mismatch warnings。這些元件在 `#developer-content` 內已被 `display:none` 隱藏，不影響使用者體驗。
- **[Toggle 載入延遲]** → `client:only` 讓 ModeToggle 不出現在初始 HTML，需等 JS 載入後才顯示。因 toggle 是小型互動元件且使用 `client:only`（不等 visible），延遲極短，可接受。
