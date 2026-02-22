## Why

Hero 區塊的入場動畫在方塊（content-box）、頭像、title/intro 出現時有明顯卡頓。根本原因是使用 `v-if` 搭配 GSAP timeline —— 每次 `v-if` 切為 true 都會觸發 DOM 插入和 layout reflow，而 Vue 的非同步 DOM 更新又與 GSAP 的同步 tween 產生時序衝突。打字機效果（純文字 slice 更新）不受影響，問題僅在元素出現階段。

## What Changes

- 將 Hero.vue 中所有用 `v-if` 控制出場的元素改為**始終渲染在 DOM 中**（`v-show` 或初始 `opacity: 0` + `visibility: hidden`），完全由 GSAP 控制可見性動畫
- 移除所有 `showContentBox`、`showAvatar`、`showTitle`、`showIntro`、`showContactBox`、`showLinks` 等 Vue reactive flags
- 用 GSAP `set()` + `to()` 取代 `tl.call()` + `tl.from()` 的模式，避免 Vue 非同步更新與 GSAP 同步 tween 之間的時序問題
- 簡化 `.content-box` 的 `opacity: 0.85` 設定，避免多層透明度合成造成的效能開銷

## Non-goals

- 不改變動畫的視覺效果、時序或階段順序——修復後應與原設計意圖一致
- 不改動 box-shadow 樣式或主題色彩
- 不改動打字機效果的實作方式（它已經是流暢的）
- 不改動 `useGsapContext` composable 的 API

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `terminal-hero`: Entry animation sequence 的實作方式從 `v-if` DOM 插入改為 GSAP 直接控制已渲染元素的可見性。動畫的行為規格不變，只修改實作策略以消除卡頓。

## Impact

- `src/components/developer/Hero.vue` — 主要修改檔案：template 的 `v-if` 改為始終渲染 + GSAP 初始設定，script 移除 reactive visibility flags 並重寫 timeline
- 不影響其他元件、composables 或頁面
- 不影響 props 介面
- 不需要新增任何依賴
