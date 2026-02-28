## ADDED Requirements

### Requirement: Fullscreen entry and exit
Lightbox SHALL 提供全螢幕按鈕，點擊後使用 Fullscreen API 將 Lightbox 容器進入瀏覽器全螢幕模式。在不支援 Fullscreen API 的環境（如 iOS Safari）SHALL 降級為 CSS fixed 模式（佔滿視窗、隱藏其他 UI）。全螢幕中 SHALL 提供退出按鈕，按下 Escape 鍵也 SHALL 退出全螢幕。

#### Scenario: Enter fullscreen via button
- **WHEN** 使用者在 Lightbox 中點擊全螢幕按鈕
- **THEN** Lightbox 容器 SHALL 進入瀏覽器全螢幕模式，隱藏瀏覽器工具列

#### Scenario: Exit fullscreen via button
- **WHEN** 使用者在全螢幕模式中點擊退出按鈕
- **THEN** SHALL 退出全螢幕模式，回到正常 Lightbox 檢視

#### Scenario: Exit fullscreen via Escape key
- **WHEN** 使用者在全螢幕模式中按下 Escape 鍵
- **THEN** SHALL 退出全螢幕模式，回到正常 Lightbox 檢視（不關閉 Lightbox）

#### Scenario: Fallback on unsupported browsers
- **WHEN** 瀏覽器不支援 Fullscreen API（如 iOS Safari）
- **THEN** SHALL 使用 CSS `position: fixed; inset: 0` 模擬全螢幕效果，功能行為一致

### Requirement: Original image loading in fullscreen
全螢幕模式 SHALL 載入並顯示原始尺寸圖片（`fullSrc`，R2 原始 URL，未經 Image Resizing）。載入期間 SHALL 先顯示已快取的 `lightboxSrc`（2048px resized）作為佔位圖，並顯示環形進度指示器。原圖載入完成後 SHALL 平滑替換佔位圖。

#### Scenario: Progressive loading from resized to full
- **WHEN** 使用者進入全螢幕模式
- **THEN** SHALL 立即顯示已快取的 lightboxSrc 作為底圖，背景開始載入 fullSrc

#### Scenario: Loading indicator during full image load
- **WHEN** fullSrc 正在載入
- **THEN** SHALL 顯示環形進度指示器，讓使用者知道正在載入更高解析度的圖片

#### Scenario: Full image replaces resized on load complete
- **WHEN** fullSrc 載入完成
- **THEN** SHALL 以平滑過渡替換為原圖，進度指示器消失

### Requirement: Zoom interaction in fullscreen
全螢幕模式 SHALL 支援縮放互動。桌面環境 SHALL 支援滑鼠滾輪縮放。觸控環境 SHALL 支援雙指 pinch zoom。縮放 SHALL 以游標/觸控中心點為錨點。縮放範圍 SHALL 限制在 1x（fit-to-screen）到 3x 之間。雙擊/雙點 SHALL 在 1x 與 2x 之間切換。

#### Scenario: Desktop scroll wheel zoom
- **WHEN** 使用者在全螢幕模式中滾動滑鼠滾輪
- **THEN** 圖片 SHALL 以游標位置為中心縮放，向上滾動放大、向下滾動縮小

#### Scenario: Touch pinch zoom
- **WHEN** 使用者在全螢幕模式中雙指 pinch
- **THEN** 圖片 SHALL 以雙指中心點為錨點縮放

#### Scenario: Double click/tap toggle zoom
- **WHEN** 使用者雙擊（桌面）或雙點（觸控）圖片
- **THEN** 圖片 SHALL 在 1x（fit-to-screen）與 2x 之間平滑切換

#### Scenario: Zoom range limits
- **WHEN** 使用者嘗試縮放超出範圍
- **THEN** 縮放 SHALL 限制在 1x 到 3x 之間，不可超出

### Requirement: Pan interaction in fullscreen
當圖片被放大（scale > 1）時，使用者 SHALL 能夠平移圖片以查看不同區域。桌面環境 SHALL 支援滑鼠拖曳平移。觸控環境 SHALL 支援單指拖曳平移。平移 SHALL 限制在圖片邊界內，不允許拖出圖片範圍。

#### Scenario: Mouse drag pan when zoomed
- **WHEN** 圖片被放大且使用者按住滑鼠拖曳
- **THEN** 圖片 SHALL 跟隨滑鼠移動，顯示圖片的不同區域

#### Scenario: Touch drag pan when zoomed
- **WHEN** 圖片被放大且使用者單指拖曳
- **THEN** 圖片 SHALL 跟隨手指移動

#### Scenario: Pan boundary constraints
- **WHEN** 使用者嘗試將圖片拖出邊界
- **THEN** 平移 SHALL 限制在圖片邊界內，圖片邊緣不超出視窗邊緣

#### Scenario: No pan at 1x zoom
- **WHEN** 圖片處於 1x（fit-to-screen）縮放
- **THEN** SHALL 不允許平移操作

### Requirement: Navigation in fullscreen mode
全螢幕模式中 SHALL 保留前/後圖片切換功能。切換圖片時 SHALL 重設 zoom 為 1x 並清除 pan 位置。切換圖片時 SHALL 釋放前一張圖片的 fullSrc 引用以控制記憶體使用。

#### Scenario: Navigate to next/prev in fullscreen
- **WHEN** 使用者在全螢幕模式中點擊前/後按鈕或使用方向鍵
- **THEN** SHALL 切換到上/下一張圖片，zoom 重設為 1x，啟動新圖片的原圖載入流程

#### Scenario: Memory cleanup on navigation
- **WHEN** 使用者在全螢幕模式中切換圖片
- **THEN** 前一張圖片的 fullSrc Image 物件 SHALL 被釋放

### Requirement: Fullscreen UI controls styling
全螢幕模式的控制項 SHALL 與現有 Lightbox 控制項風格一致（使用 `--color-accent-subtle` 背景、`--color-accent` 文字色），帶有 hover/active 動態效果。控制項在使用者無操作數秒後 SHALL 自動淡出，滑鼠移動或觸控時重新顯示。

#### Scenario: Controls auto-hide after inactivity
- **WHEN** 使用者在全螢幕模式中無操作 3 秒
- **THEN** 控制項（前/後/退出/zoom 指示器）SHALL 淡出隱藏

#### Scenario: Controls reappear on interaction
- **WHEN** 使用者在控制項已隱藏時移動滑鼠或觸控螢幕
- **THEN** 控制項 SHALL 立即重新顯示
