## Context

目前 `Navbar.astro` 是一個 fixed 頂部導航列（h-16, z-50），內含 site name 和透過 slot 傳入的 `ModeToggle.vue`。`<main>` 有 `pt-16` 來補償 navbar 高度。

這次要移除 Navbar，讓 ModeToggle 成為獨立浮空元件，並加上捲動方向感知的隱藏/顯示行為。

## Goals / Non-Goals

**Goals:**

- 移除 Navbar.astro，頁面頂部不再有固定導航列
- ModeToggle 浮空於頁面頂部置中，z-index 維持在最上層
- 向下捲動時 toggle 自動隱藏（上滑離開視窗），向上捲動時重新出現
- 頁面頂部（scrollY < 100px）時 toggle 永遠可見
- 過渡動畫使用 CSS transition，不依賴 GSAP

**Non-Goals:**

- 不加 backdrop-blur 或額外背景容器（先看最簡版效果）
- 不調整 SectionNav（右側圓點導航）
- 不改變 ModeToggle 本身的切換邏輯或視覺樣式

## Decisions

### 1. 定位方式：在 index.astro 包一層容器

ModeToggle.vue 本身不處理定位，改由 index.astro 包一個定位容器：

```html
<div class="fixed top-4 left-1/2 -translate-x-1/2 z-50" id="toggle-wrapper">
  <ModeToggle client:load />
</div>
```

**理由**：ModeToggle 是純 UI 元件，定位職責留在頁面層級，保持元件的可重用性。

### 2. 捲動隱藏：Vapor 動畫風格

不使用 GSAP ScrollTrigger，改用原生 scroll event listener + CSS transition 多屬性交織動畫。

**動畫設計（Vapor — 蒸發消散）：**

隱藏狀態（向下捲動）：
- `transform: translateX(-50%) translateY(-20px) scale(0.85)`
- `opacity: 0`
- `filter: blur(8px)`
- `pointer-events: none`（防止隱藏時誤觸）

顯現狀態（向上捲動 / 頁面頂部）：
- `transform: translateX(-50%) translateY(0) scale(1)`
- `opacity: 1`
- `filter: blur(0)`
- `pointer-events: auto`

**過渡時序（關鍵：各屬性錯開）：**
- `transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 350ms ease, filter 300ms ease`
- transform 最慢（400ms）帶位移和縮放的主體感
- opacity 稍快（350ms）讓淡出先於位移完成
- filter blur 最快（300ms）讓模糊先行，製造消散前兆

**觸發條件：**
- `scrollY < 100` → 強制顯現
- 向下捲動 → 隱藏（Vapor out）
- 向上捲動 → 顯現（Vapor in）

**理由**：多屬性錯開時序讓動畫有層次而非機械感。blur 作為先行訊號暗示「正在消散」，比單純 translateY 滑出更有質感。cubic-bezier(0.22, 1, 0.36, 1) 提供快啟慢收的自然手感。

### 3. 捲動邏輯放置位置

在 index.astro 用 inline `<script>` 處理，因為：
- 這是頁面級行為，不是元件級
- 操作的是包裹容器（`#toggle-wrapper`），不是 Vue 元件內部
- 不需要 Vue 響應式系統

透過 class toggle（`.vapor-hidden`）而非 inline style 控制，讓 transition 定義留在 CSS：

```html
<style>
  #toggle-wrapper {
    transition:
      transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 350ms ease,
      filter 300ms ease;
  }
  #toggle-wrapper.vapor-hidden {
    transform: translateX(-50%) translateY(-20px) scale(0.85);
    opacity: 0;
    filter: blur(8px);
    pointer-events: none;
  }
</style>

<script>
  const wrapper = document.getElementById('toggle-wrapper');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY < 100 || currentY < lastScrollY) {
      wrapper.classList.remove('vapor-hidden');
    } else if (currentY > lastScrollY) {
      wrapper.classList.add('vapor-hidden');
    }
    lastScrollY = currentY;
  });
</script>
```

### 4. 移除策略

- 刪除 `Navbar.astro` 檔案
- `index.astro` 移除 Navbar import 和使用
- `<main>` 移除 `pt-16` class

## Risks / Trade-offs

- **toggle 蓋住 Hero 頂部內容** → 目前 toggle 很小（w-20 h-10），影響有限；且向下捲動後會自動隱藏
- **scroll event 效能** → 不做 throttle，因為只是讀 scrollY + 改一個 style，開銷極低；如果之後有問題再加 `requestAnimationFrame`
- **CSS filter 效能** → `filter: blur()` 會觸發合成層，但只作用在一個小元素上，影響可忽略；若有問題可用 `will-change: transform, opacity, filter` 提示瀏覽器優化
