## MODIFIED Requirements

### Requirement: R2 base URL configured as constant
R2 圖片的 base URL SHALL 定義為單一常數，使用 custom domain `https://images.xuno8.com`。前端元件透過 `baseURL + src` 拼接完整圖片 URL。

#### Scenario: Base URL change propagates globally
- **WHEN** R2 domain 變更
- **THEN** 只需修改一處常數，所有圖片 URL 自動更新

#### Scenario: Custom domain used instead of r2.dev
- **WHEN** 產生圖片 URL
- **THEN** base URL SHALL 為 `https://images.xuno8.com` 而非 `r2.dev` 公開 URL
