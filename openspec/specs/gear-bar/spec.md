### Requirement: Gear data stored in YAML
器材資料 SHALL 定義在 `src/data/gear.yaml`，每筆包含 `brand`（品牌名稱）和 `model`（型號名稱）欄位。YAML 中的順序即為顯示順序。

#### Scenario: YAML structure
- **WHEN** `src/data/gear.yaml` 被讀取
- **THEN** 每筆項目 MUST 包含 `brand`（string）和 `model`（string）欄位

#### Scenario: Display order matches YAML order
- **WHEN** 器材列表渲染時
- **THEN** 項目順序 SHALL 與 `gear.yaml` 中定義的順序一致

### Requirement: Gear bar renders inline list
Photographer 模式 SHALL 在 gallery 下方顯示一行器材列表，格式為「品牌 型號」以中點（`·`）分隔。

#### Scenario: Gear items displayed with brand and model
- **WHEN** 使用者瀏覽 photographer 模式頁面
- **THEN** 頁面 SHALL 顯示所有器材項目，每項格式為「{brand} {model}」，項目間以 `·` 分隔

#### Scenario: Three gear items displayed
- **WHEN** gear.yaml 包含 Sony α7 III、Sony FE 24-105mm F4、RICOH GR IV
- **THEN** 顯示為 `Sony α7 III · Sony FE 24-105mm F4 · RICOH GR IV`

### Requirement: Gear bar visual style matches photographer theme
器材列表 SHALL 使用 photographer 模式的 wabi-sabi 暖色調風格。

#### Scenario: Typography and color
- **WHEN** 器材列表渲染時
- **THEN** 文字 SHALL 使用 display 襯線字體（Newsreader），字號較小，分隔符使用 accent 色

### Requirement: Gear bar has fade-in animation
器材列表 SHALL 使用 GSAP ScrollTrigger 實現淡入動畫。

#### Scenario: Scroll-triggered animation
- **WHEN** 使用者滾動至器材列表可見區域
- **THEN** 列表 SHALL 從 opacity 0 淡入至 opacity 1

#### Scenario: Reduced motion preference
- **WHEN** 使用者啟用 `prefers-reduced-motion`
- **THEN** 動畫 SHALL 被跳過，器材列表直接以 opacity 1 顯示

### Requirement: Gear bar only visible in photographer mode
器材列表 SHALL 僅在 photographer 模式下顯示，隨 `#photographer-content` 容器的 display 控制。

#### Scenario: Developer mode
- **WHEN** 網站處於 developer 模式
- **THEN** 器材列表 SHALL NOT 顯示

#### Scenario: Photographer mode
- **WHEN** 網站處於 photographer 模式
- **THEN** 器材列表 SHALL 顯示在 gallery 下方
