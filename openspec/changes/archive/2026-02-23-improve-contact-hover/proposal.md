## Why

Hero 元件中 social links 的 hover 互動感受不佳。Icon 靜止時已是 accent 色，hover 時幾乎無視覺變化（僅加微弱 drop-shadow），加上 SVG 和文字使用不同 easing curve，造成「icon 延遲才亮」的觀感。整體缺乏 transform 反饋、fade-in 過渡、以及 focus/active 狀態，與 terminal aesthetic 不匹配。

## What Changes

- 調整 social link icon 靜止色為 muted，hover 時才亮起（dim → bright 狀態切換）
- 統一所有 transition easing curve，消除 icon 與文字的動畫不同步
- 為 link 出現加入 opacity fade-in transition
- 加入 hover transform（translateX 微位移）與 icon scale 效果
- 強化 border-left 動畫（寬度 + 顏色變化）
- 升級 hover 背景為 gradient sweep
- 增加 icon 雙層 neon glow
- 補充 `:focus-visible` 與 `:active` 狀態

## Capabilities

### New Capabilities

- `contact-hover-interaction`: 涵蓋 social links 的完整互動狀態（rest / hover / focus / active）及動畫行為

### Modified Capabilities

<!-- 無既有 spec 需要修改 -->

## Impact

- 僅影響 `src/components/developer/Hero.vue` 的 `<style scoped>` 區塊
- 不涉及 JavaScript 邏輯、資料結構、或其他元件
- 不影響 photographer mode（social links 僅在 developer mode 顯示）
- 需確保 `prefers-reduced-motion` 媒體查詢仍有效
