## 1. Template 改造：移除 v-if，元素始終渲染

- [x] 1.1 移除 `Hero.vue` template 中所有動畫相關的 `v-if` 條件（`showContentBox`、`showAvatar`、`showTitle`、`showIntro`、`showContactBox`、`showLinks[i]`），讓這些元素始終渲染在 DOM 中 _(修改 `src/components/developer/Hero.vue`)_
- [x] 1.2 為這些元素加上 CSS class 標記（如 `.anim-target`），以便 GSAP 批次選取。social links 保留現有 `.social-link` class 即可 _(修改 `src/components/developer/Hero.vue`)_

## 2. CSS 預設隱藏 + 移除多層 opacity

- [x] 2.1 在 `<style scoped>` 中為所有動畫目標元素預設 `opacity: 0`，防止 JS 載入前的 FOUC _(修改 `src/components/developer/Hero.vue`)_
- [x] 2.2 移除 `.content-box` 的 `opacity: 0.85`，改用 `background` alpha 值達到同樣的視覺 dimming 效果 _(修改 `src/components/developer/Hero.vue`)_

## 3. Script 重寫：移除 reactive flags，改用 GSAP 控制

- [x] 3.1 移除 `showContentBox`、`showAvatar`、`showTitle`、`showIntro`、`showContactBox`、`showLinks` 等所有 visibility reactive refs _(修改 `src/components/developer/Hero.vue`)_
- [x] 3.2 在 `useGsapContext` setup 開頭用 `gsap.set()` 將所有動畫目標元素設為 `autoAlpha: 0`（加上各自需要的初始 transform） _(修改 `src/components/developer/Hero.vue`)_
- [x] 3.3 重寫 GSAP timeline：將所有 `tl.call(() => flag = true)` + `tl.from('.class', ...)` 組合改為 `tl.to('.class', { autoAlpha: 1, ... })`，保持原有時序和 easing _(修改 `src/components/developer/Hero.vue`)_
- [x] 3.4 將 social links 的 stagger 從 for-loop `tl.call()` 改為 `tl.to('.social-link', { autoAlpha: 1, stagger: 0.06 })` _(修改 `src/components/developer/Hero.vue`)_

## 4. Reduced Motion 路徑更新

- [x] 4.1 更新 reduced motion 分支：用 `gsap.set()` 將所有動畫目標設為 `autoAlpha: 1`，取代設定 reactive flags 的方式，同時保留 typewriter refs 的立即設值 _(修改 `src/components/developer/Hero.vue`)_

## 5. 驗證

- [x] 5.1 啟動 dev server，驗證動畫序列在正常模式下流暢播放，無卡頓或 layout shift
- [x] 5.2 驗證 reduced motion 模式下所有內容立即可見
- [x] 5.3 驗證 social links 的 hover 效果和互動功能正常
- [x] 5.4 驗證行動裝置斷點下的版面正確
