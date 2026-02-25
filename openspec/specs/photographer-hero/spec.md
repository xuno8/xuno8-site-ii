### Requirement: Photographer tagline stored in site config
`site.yaml` SHALL 包含 `photographerTagline` 欄位，供 photographer hero 使用。`SiteConfig` interface SHALL 包含對應的可選欄位。

#### Scenario: YAML field exists
- **WHEN** `site.yaml` 被讀取
- **THEN** SHALL 包含 `photographerTagline`（string）欄位，值為 `'chasing light and stories'`

#### Scenario: SiteConfig type includes tagline
- **WHEN** `SiteConfig` interface 被使用
- **THEN** SHALL 包含 `photographerTagline?: string` 可選欄位

### Requirement: Photo hero displays name and tagline
Photographer 模式 SHALL 在 gallery 上方顯示一個 hero 區塊，包含使用者名字和攝影 tagline，置中排列。

#### Scenario: Name and tagline rendered
- **WHEN** 使用者瀏覽 photographer 模式頁面
- **THEN** 頁面頂部 SHALL 顯示名字（來自 `site.yaml` 的 `name`）和 tagline（來自 `photographerTagline`）

#### Scenario: Position above gallery
- **WHEN** photographer 模式頁面載入
- **THEN** hero 區塊 SHALL 位於 MasonryGallery 上方

### Requirement: Photo hero visual style matches photographer theme
Hero 區塊 SHALL 使用 photographer 模式的 wabi-sabi 暖色調風格。

#### Scenario: Typography
- **WHEN** hero 區塊渲染時
- **THEN** 名字 SHALL 使用 display 襯線字體（Newsreader）、較大字號、heading 色；tagline SHALL 使用 display 襯線字體 italic 樣式、較小字號、secondary 色

#### Scenario: Layout
- **WHEN** hero 區塊渲染時
- **THEN** 內容 SHALL 水平置中，具有充足的垂直留白

### Requirement: Photo hero has entrance animation
Hero 區塊 SHALL 使用 GSAP 實現淡入進場動畫。

#### Scenario: Fade-in with stagger
- **WHEN** 頁面載入
- **THEN** 名字和 tagline SHALL 依序淡入（opacity 0→1），帶有微量向上位移

#### Scenario: Reduced motion preference
- **WHEN** 使用者啟用 `prefers-reduced-motion`
- **THEN** 動畫 SHALL 被跳過，hero 區塊直接以完整狀態顯示

### Requirement: Photo hero only visible in photographer mode
Hero 區塊 SHALL 僅在 photographer 模式下顯示，隨 `#photographer-content` 容器的 display 控制。

#### Scenario: Developer mode
- **WHEN** 網站處於 developer 模式
- **THEN** photographer hero SHALL NOT 顯示

#### Scenario: Photographer mode
- **WHEN** 網站處於 photographer 模式
- **THEN** photographer hero SHALL 顯示在頁面頂部
