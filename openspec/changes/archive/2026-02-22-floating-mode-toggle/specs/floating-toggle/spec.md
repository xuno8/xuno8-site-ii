## ADDED Requirements

### Requirement: ModeToggle 浮空定位於頁面頂部置中

ModeToggle SHALL 以 fixed 定位顯示於視窗頂部水平置中位置，z-index 維持在所有內容之上（z-50）。頁面不再有 Navbar 導航列。

#### Scenario: 頁面載入時 toggle 可見
- **WHEN** 使用者載入頁面
- **THEN** ModeToggle 顯示於視窗頂部置中，與頂部有適當間距（top: 1rem）

#### Scenario: 無 Navbar 佔位
- **WHEN** 頁面載入
- **THEN** 頁面主要內容從視窗最頂部開始，不存在 navbar 高度的 padding offset

### Requirement: 向下捲動時 toggle 以 Vapor 動畫隱藏

當使用者向下捲動頁面且 scrollY >= 100px 時，ModeToggle SHALL 以 Vapor 消散動畫隱藏。

#### Scenario: 向下捲動超過閾值
- **WHEN** 使用者向下捲動且 scrollY >= 100px
- **THEN** toggle 以多屬性交織動畫隱藏：translateY(-20px) + scale(0.85) + opacity(0) + blur(8px)
- **THEN** 隱藏狀態下 toggle 不可點擊（pointer-events: none）

#### Scenario: 在頁面頂部向下捲動
- **WHEN** 使用者向下捲動但 scrollY < 100px
- **THEN** toggle 維持可見，不觸發隱藏

### Requirement: 向上捲動時 toggle 以 Vapor 動畫顯現

當使用者向上捲動頁面時，ModeToggle SHALL 以 Vapor 凝聚動畫重新顯現。

#### Scenario: 向上捲動
- **WHEN** toggle 處於隱藏狀態且使用者向上捲動
- **THEN** toggle 以動畫還原：translateY(0) + scale(1) + opacity(1) + blur(0)
- **THEN** 顯現後 toggle 可點擊（pointer-events: auto）

### Requirement: Vapor 動畫時序

動畫 SHALL 使用多屬性錯開時序以產生層次感。

#### Scenario: 動畫過渡屬性
- **WHEN** toggle 在顯現與隱藏之間切換
- **THEN** transform 過渡 400ms，使用 cubic-bezier(0.22, 1, 0.36, 1)
- **THEN** opacity 過渡 350ms，使用 ease
- **THEN** filter 過渡 300ms，使用 ease

### Requirement: 移除 Navbar

Navbar.astro SHALL 被完全移除，不再使用。

#### Scenario: Navbar 不存在
- **WHEN** 頁面載入
- **THEN** 頁面中不存在 Navbar 元件，不存在 site name 文字連結
