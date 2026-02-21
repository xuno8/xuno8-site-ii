## 1. 移除 Navbar

- [x] 1.1 從 `index.astro` 移除 Navbar import 和 `<Navbar>...</Navbar>` 使用
- [x] 1.2 從 `<main>` 移除 `pt-16` class
- [x] 1.3 刪除 `src/components/shared/Navbar.astro` 檔案

## 2. ModeToggle 浮空定位

- [x] 2.1 在 `index.astro` 中用 `#toggle-wrapper` 容器包裹 ModeToggle，設定 `fixed top-4 left-1/2 -translate-x-1/2 z-50`

## 3. Vapor 捲動動畫

- [x] 3.1 在 `index.astro` 加入 `#toggle-wrapper` 的 transition 樣式和 `.vapor-hidden` class（transform + opacity + filter 錯開時序）
- [x] 3.2 在 `index.astro` 加入 inline `<script>` 實作捲動方向偵測與 `.vapor-hidden` class toggle（含 scrollY < 100 強制顯現）

## 4. 驗證

- [x] 4.1 確認頁面載入時 toggle 可見於頂部置中
- [x] 4.2 確認向下捲動超過 100px 時 toggle 以 Vapor 動畫隱藏
- [x] 4.3 確認向上捲動時 toggle 以 Vapor 動畫顯現
- [x] 4.4 確認頁面不存在 Navbar、無 pt-16 offset
- [x] 4.5 執行 `npm run build` 確認無編譯錯誤
