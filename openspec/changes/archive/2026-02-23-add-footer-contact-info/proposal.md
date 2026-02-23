## Why

Footer 目前只顯示版權資訊，缺少聯絡方式。使用者無法從頁面底部找到 GitHub、LinkedIn、Instagram 或 Email 等聯絡管道，需要在 Footer 加入社群連結與信箱，讓訪客能快速聯繫。

## What Changes

- 在 Footer 加入社群圖示連結（GitHub、LinkedIn、Instagram）和 Email 連結
- 資料來源沿用 `src/data/site.yaml` 中既有的 `socialLinks` 和 `email` 欄位
- 圖示樣式需支援雙主題（developer / photographer），使用 CSS custom properties 配色

## Non-goals

- 不新增額外的聯絡表單或留言功能
- 不修改 `site.yaml` 的資料結構（已有所需欄位）
- 不調整 Navbar 上的社群連結（如有的話）

## Capabilities

### New Capabilities
- `footer-contact-links`: Footer 區域顯示社群圖示連結（GitHub、LinkedIn、Instagram）與 Email 連結

### Modified Capabilities

## Impact

- `src/components/shared/Footer.astro`：新增社群連結區塊
- `src/styles/global.css`：可能需要新增 Footer 連結的 hover 樣式 custom properties
- 無新增依賴（圖示使用 UnoCSS icon preset 或 inline SVG）
