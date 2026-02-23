## MODIFIED Requirements

### Requirement: ModeToggle 浮空定位於頁面頂部置中

ModeToggle SHALL 以 fixed 定位顯示於視窗頂部水平置中位置，z-index 維持在所有內容之上（z-50）。頁面不再有 Navbar 導航列。ModeToggle 的背景 SHALL 使用 Liquid Glass 效果（半透明 + backdrop-filter blur）取代原有的不透明 `--color-bg-card` 背景。

#### Scenario: 頁面載入時 toggle 可見
- **WHEN** 使用者載入頁面
- **THEN** ModeToggle 顯示於視窗頂部置中，與頂部有適當間距（top: 1rem）
- **THEN** ModeToggle 背景為 Liquid Glass 效果（半透明 + 毛玻璃模糊）

#### Scenario: 無 Navbar 佔位
- **WHEN** 頁面載入
- **THEN** 頁面主要內容從視窗最頂部開始，不存在 navbar 高度的 padding offset
