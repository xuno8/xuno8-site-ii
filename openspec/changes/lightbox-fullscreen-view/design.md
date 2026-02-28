## Context

Lightbox 目前以 Cloudflare Image Resizing（width=2048）提供「全尺寸」瀏覽，但原始照片可達 6192×4128。攝影師和觀眾希望能以原始解析度仔細欣賞細節。現有 Lightbox 架構已有完整的 GSAP 動畫、觸控手勢、鍵盤導覽等基礎，需要在其上擴展全螢幕原圖瀏覽層。

**現有資料流：**
- `index.astro` 從 `photos.yaml` 組出 `thumbSrc`（800px）和 `lightboxSrc`（2048px）
- `GalleryImage` interface 定義在 `MasonryGallery.vue`，含 `src`、`thumbSrc`、`lightboxSrc`
- Lightbox 透過 props 接收 images 和 currentIndex

## Goals / Non-Goals

**Goals:**
- 提供沉浸式全螢幕原圖瀏覽，支援 zoom/pan 互動
- 大圖載入時有清晰的進度回饋
- 與現有 lightbox 控制項（前/後導覽、關閉、鍵盤快捷鍵）自然整合
- 保持 photographer mode 的溫暖視覺風格

**Non-Goals:**
- 不實作圖片下載或編輯功能
- 不支援兩指旋轉手勢
- 不修改 gallery grid 的行為

## Decisions

### 1. 全螢幕實作方式：Fullscreen API + 覆蓋層

**選擇**：使用 `Element.requestFullscreen()` 將整個 Lightbox 容器進入全螢幕，並在其上渲染獨立的全螢幕 zoom 層。

**替代方案**：
- 僅用 CSS `position: fixed` 模擬全螢幕 → 無法隱藏瀏覽器 chrome，不夠沉浸
- 對 `<img>` 單獨 requestFullscreen → 無法在全螢幕內放自訂控制 UI

**理由**：Fullscreen API 在主流瀏覽器支援度良好，能隱藏瀏覽器工具列提供真正沉浸體驗，且對整個容器 fullscreen 可以保留自訂 UI 控制項。

### 2. Zoom/Pan 互動方式：CSS transform + 指標事件

**選擇**：透過 CSS `transform: scale() translate()` 實作 zoom/pan，監聽 wheel（桌面 scroll zoom）與 pointer events（拖曳 pan + 觸控 pinch zoom）。

**替代方案**：
- 使用第三方 library（panzoom、medium-zoom）→ 增加 bundle 體積，且風格難以與現有 GSAP 動畫體系整合
- 使用 CSS `overflow: scroll` + 大圖原尺寸渲染 → 無法控制縮放層級，不支援 pinch zoom

**理由**：自行以 pointer events + transform 實作可完全控制互動細節，零外部依賴，且能與現有的 warm theme CSS 變數和 GSAP 動畫風格無縫整合。

### 3. 原圖 URL 傳遞方式：擴展 GalleryImage interface

**選擇**：在 `GalleryImage` interface 新增 `fullSrc` 欄位，由 `index.astro` 組出 R2 原始 URL（`${R2_BASE}/${photo.src}`，不經 cdn-cgi resizing）傳入。

**理由**：遵循現有架構 — Astro 負責圖片 URL 組裝，Vue 接收 props。最小變更、一致的 data flow。

### 4. Composable 架構：獨立 `useFullscreenZoom`

**選擇**：建立 `src/composables/useFullscreenZoom.ts`，封裝 Fullscreen API 生命週期、zoom 層級、pan 位置、pinch 手勢偵測。

**理由**：遵循專案既有的 composable 模式（如 `useLightbox`、`useGsapContext`），在 `onMounted` 建立、`onUnmounted` 清理，保持 Lightbox.vue 的邏輯清晰。

### 5. 載入體驗：進度指示器 + lightboxSrc 作為佔位

**選擇**：進入全螢幕時，先顯示目前的 lightboxSrc（2048px，已快取）作為底圖並套用使用者的 zoom/pan，背景載入原圖。原圖載入完成後替換為 fullSrc。顯示環形進度條指示載入狀態。

**替代方案**：
- 直接顯示空白 + spinner 等待原圖 → 體驗差，使用者看到空白畫面
- 不顯示進度 → 使用者不知道是否在載入

**理由**：漸進式呈現（resized → full）讓使用者不必等待即可開始互動，體驗最佳。

## Risks / Trade-offs

- **[原圖檔案大小]** 原圖可達數 MB（6000×4000 JPG） → 載入時先以 resized 圖佔位，背景下載原圖；提供載入進度指示
- **[Fullscreen API 在 iOS Safari 的限制]** iOS Safari 僅支援 video 的 webkitRequestFullscreen → 降級為 CSS fixed 全螢幕模擬（隱藏所有 UI，佔滿視窗），功能不受影響，僅無法隱藏 Safari 工具列
- **[觸控 pinch zoom 與瀏覽器原生 zoom 衝突]** → 對全螢幕容器設定 `touch-action: none` 阻止瀏覽器原生行為
- **[記憶體使用量]** 同時持有 thumbSrc + lightboxSrc + fullSrc → 切換圖片時釋放前一張的 fullSrc 引用
