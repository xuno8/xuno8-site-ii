## Why

目前的 header bar（Navbar.astro）佔據頂部 64px，只放了 site name 和 mode toggle 兩個元素，視覺上偏重且不必要。移除 navbar 讓頁面更乾淨，Hero 內容可以從視窗最頂部開始，同時保留 mode toggle 作為浮空元素置頂置中。

## What Changes

- **移除 Navbar.astro**：刪除固定頂部導航列，包括 site name 連結
- **ModeToggle 改為獨立浮空定位**：`fixed top center z-50`，不再依賴 Navbar 的 slot
- **捲動時自動隱藏/顯示**：向下捲動時 toggle 往上滑出隱藏，向上捲動時滑回顯示；頁面頂部（scrollY < 100px）時永遠可見
- **移除 main 的 pt-16 offset**：不再需要為 navbar 預留空間
- **刪除 Navbar.astro 檔案**：不再使用，直接移除

## Capabilities

### New Capabilities

- `floating-toggle`: 定義 ModeToggle 作為獨立浮空 UI 元素的定位、捲動隱藏/顯示行為規格

### Modified Capabilities

（無現有 specs）

## Impact

- `src/components/shared/Navbar.astro` — 刪除
- `src/pages/index.astro` — 移除 Navbar import/使用，調整 ModeToggle 放置方式，移除 `pt-16`
- `src/components/shared/ModeToggle.vue` — 可能需要調整外層定位樣式（或在 index.astro 包一層定位容器）
