### Requirement: ModeToggle 毛玻璃背景效果

ModeToggle SHALL 使用半透明背景搭配 `backdrop-filter: blur()` 實現毛玻璃效果，讓底層頁面內容透過模糊折射隱約可見。

#### Scenario: 支援 backdrop-filter 的瀏覽器
- **WHEN** 瀏覽器支援 `backdrop-filter`
- **THEN** ModeToggle 背景為半透明色（opacity < 0.3）
- **THEN** 底層內容透過 20px 高斯模糊可隱約辨識
- **THEN** 色彩飽和度提升（saturate >= 1.5）

#### Scenario: 不支援 backdrop-filter 的瀏覽器
- **WHEN** 瀏覽器不支援 `backdrop-filter`
- **THEN** ModeToggle 使用半透明實色背景（`--glass-bg-fallback`）
- **THEN** 元件仍可正常使用，文字與圖示可清楚辨識

### Requirement: 玻璃邊框與高光

ModeToggle SHALL 具備半透明邊框和邊緣高光效果，模擬物理玻璃的光學特性。

#### Scenario: 靜態高光顯示
- **WHEN** ModeToggle 可見
- **THEN** 上方邊緣有一條亮色 inset shadow 模擬頂部光源反射
- **THEN** 邊框為半透明色（opacity 0.15-0.25）
- **THEN** 外部投影提供浮動感

#### Scenario: hover 狀態高光增強
- **WHEN** 使用者 hover ModeToggle
- **THEN** 邊框亮度增加
- **THEN** 外部光暈（glow）強度增加

### Requirement: 雙主題玻璃色調

Liquid Glass 效果 SHALL 根據目前的 `data-theme` 屬性呈現不同色調，與各主題的整體視覺風格一致。

#### Scenario: Developer 主題玻璃色調
- **WHEN** `data-theme="developer"`
- **THEN** 玻璃背景偏冷色調（偏藍/青色系，與 `--color-accent: #7dcfff` 呼應）
- **THEN** 高光帶有淡藍色調
- **THEN** 投影帶有深藍色調

#### Scenario: Photographer 主題玻璃色調
- **WHEN** `data-theme="photographer"`
- **THEN** 玻璃背景偏暖色調（偏琥珀/棕色系，與 `--color-accent: #d4a574` 呼應）
- **THEN** 高光帶有暖白色調
- **THEN** 投影帶有深棕色調

### Requirement: SVG 折射濾鏡（Chromium 增強）

在支援 SVG filter 作為 `backdrop-filter` 的瀏覽器中，ModeToggle SHALL 顯示折射扭曲效果，模擬光線穿過凸面玻璃的光學變形。

#### Scenario: Chromium 瀏覽器折射效果
- **WHEN** 瀏覽器支援 SVG filter 作為 backdrop-filter（Chromium 系列）
- **THEN** 底層內容在 toggle 邊緣附近產生輕微扭曲位移
- **THEN** 扭曲方向由 displacement map 的 R/G 通道控制

#### Scenario: 非 Chromium 瀏覽器降級
- **WHEN** 瀏覽器不支援 SVG filter 作為 backdrop-filter
- **THEN** 僅套用高斯模糊效果，不顯示折射扭曲
- **THEN** 不產生 JavaScript 錯誤或視覺破損

### Requirement: 無障礙與效能

Liquid Glass 效果 SHALL 尊重使用者的 motion 偏好設定，且不影響元件的可操作性。

#### Scenario: prefers-reduced-motion 啟用
- **WHEN** 系統設定 `prefers-reduced-motion: reduce`
- **THEN** 停用所有動態高光動畫
- **THEN** 保留靜態毛玻璃效果（blur + 半透明背景）

#### Scenario: 效能影響
- **WHEN** ModeToggle 顯示在頁面上
- **THEN** Liquid Glass 效果不導致頁面滾動時掉幀（維持 60fps）
- **THEN** 不增加 JavaScript bundle size（純 CSS + inline SVG）
