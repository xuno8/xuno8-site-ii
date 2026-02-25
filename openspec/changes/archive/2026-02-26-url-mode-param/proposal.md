## Why

目前網站預設模式固定為 `developer`，無法透過連結直接開啟 `photographer` 模式。需要一個輕量的方式讓使用者或站主可以分享特定模式的連結（如 `?m=p`），讓訪客一進來就看到指定模式的內容。

## What Changes

- 支援 URL query parameter `?m=p`（photographer）和 `?m=d`（developer）控制初始模式
- 未帶參數時維持現有預設行為（developer）
- Pre-hydration script 和 Nanostores atom 同步讀取 URL 參數，確保無閃爍

## Non-goals

- 不做 path-based routing（如 `/photographer`），維持 SSG 單頁架構
- 不做模式持久化（localStorage / cookie），每次訪問由 URL 決定
- 不改變現有 mode toggle 的行為

## Capabilities

### New Capabilities
- `url-mode-param`: 透過 URL query parameter `?m=p` / `?m=d` 設定網站初始模式

### Modified Capabilities
- `mode-favicon`: pre-hydration script 需讀取 URL 參數決定初始 favicon
- `mode-title`: pre-hydration script 需讀取 URL 參數決定初始 title

## Impact

- `src/layouts/Layout.astro` — pre-hydration `is:inline` script 加入 URL 參數解析，動態設定 `data-theme`、favicon、title
- `src/pages/index.astro` — 新增 body inline script 切換 content display；`ModeToggle` 和 `ModeTransitionController` 改為 `client:only="vue"` 避免 SSR hydration mismatch
- `src/stores/mode.ts` — atom 初始值保持 `developer`，client 端讀取 `window.__INITIAL_MODE__` 後 `set()` 同步
