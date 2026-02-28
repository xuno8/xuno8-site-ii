import { ref, nextTick, onMounted, onUnmounted } from 'vue';

interface WebKitDocument extends Document {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
}

interface WebKitHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DOUBLE_TAP_SCALE = 2;
const ZOOM_SENSITIVITY = 0.002;
const CONTROLS_HIDE_DELAY = 3000;

export function useFullscreenZoom() {
  const isFullscreen = ref(false);
  const containerRef = ref<HTMLElement | null>(null);

  // Zoom / pan state
  const scale = ref(1);
  const translateX = ref(0);
  const translateY = ref(0);
  const isAnimating = ref(false);

  // Full image loading
  const fullImageSrc = ref('');
  const isFullImageLoaded = ref(false);
  let fullImageLoader: HTMLImageElement | null = null;

  // Controls auto-hide
  const controlsVisible = ref(true);
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  // Pointer tracking
  let isPanning = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let pointerCache: PointerEvent[] = [];
  let prevPinchDist = 0;

  // --- Fullscreen API ---

  const doc = document as WebKitDocument;

  function supportsFullscreen(): boolean {
    return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
  }

  async function enterFullscreen() {
    // Set isFullscreen first so the overlay DOM renders (v-if="isFullscreen"),
    // then on nextTick the containerRef element exists for requestFullscreen().
    isFullscreen.value = true;
    await nextTick();

    const el = containerRef.value as WebKitHTMLElement | null;
    if (!el) return;

    if (supportsFullscreen()) {
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        }
      } catch {
        // CSS fullscreen fallback — overlay is already visible
      }
    }
    // iOS Safari: overlay already visible via CSS fixed positioning
  }

  async function exitFullscreen() {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      try {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      } catch {
        isFullscreen.value = false;
      }
    } else {
      isFullscreen.value = false;
    }
    resetTransform();
  }

  function onFullscreenChange() {
    const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
    isFullscreen.value = !!fsEl;
    if (!isFullscreen.value) {
      resetTransform();
    }
  }

  // --- Zoom / Pan ---

  function clampScale(s: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
  }

  function clampPan() {
    if (scale.value <= 1) {
      translateX.value = 0;
      translateY.value = 0;
      return;
    }
    const el = containerRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxX = (rect.width * (scale.value - 1)) / 2;
    const maxY = (rect.height * (scale.value - 1)) / 2;
    translateX.value = Math.min(maxX, Math.max(-maxX, translateX.value));
    translateY.value = Math.min(maxY, Math.max(-maxY, translateY.value));
  }

  function resetTransform() {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    isAnimating.value = false;
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY * ZOOM_SENSITIVITY;
    const newScale = clampScale(scale.value + delta * scale.value);

    if (newScale !== scale.value) {
      // Zoom toward cursor position
      const el = containerRef.value;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        const factor = newScale / scale.value;
        translateX.value = cx - factor * (cx - translateX.value);
        translateY.value = cy - factor * (cy - translateY.value);
      }
      scale.value = newScale;
      clampPan();
    }
    showControls();
  }

  function handleDoubleClick(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    isAnimating.value = true;

    if (scale.value > 1) {
      // Reset to 1x
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    } else {
      // Zoom to 2x at click point
      const el = containerRef.value;
      if (el) {
        const rect = el.getBoundingClientRect();
        let cx: number, cy: number;
        if ('touches' in e) {
          cx = e.changedTouches[0].clientX - rect.left - rect.width / 2;
          cy = e.changedTouches[0].clientY - rect.top - rect.height / 2;
        } else {
          cx = e.clientX - rect.left - rect.width / 2;
          cy = e.clientY - rect.top - rect.height / 2;
        }
        const factor = DOUBLE_TAP_SCALE / scale.value;
        translateX.value = cx - factor * (cx - translateX.value);
        translateY.value = cy - factor * (cy - translateY.value);
      }
      scale.value = DOUBLE_TAP_SCALE;
      clampPan();
    }

    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
    showControls();
  }

  function handlePointerDown(e: PointerEvent) {
    pointerCache.push(e);
    if (pointerCache.length === 1 && scale.value > 1) {
      isPanning = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    }
    if (pointerCache.length === 2) {
      isPanning = false;
      prevPinchDist = getPinchDist();
    }
    showControls();
  }

  function handlePointerMove(e: PointerEvent) {
    // Update pointer cache
    const idx = pointerCache.findIndex((p) => p.pointerId === e.pointerId);
    if (idx >= 0) pointerCache[idx] = e;

    if (pointerCache.length === 2) {
      // Pinch zoom
      const dist = getPinchDist();
      if (prevPinchDist > 0) {
        const factor = dist / prevPinchDist;
        const newScale = clampScale(scale.value * factor);
        if (newScale !== scale.value) {
          const el = containerRef.value;
          if (el) {
            const rect = el.getBoundingClientRect();
            const cx =
              (pointerCache[0].clientX + pointerCache[1].clientX) / 2 - rect.left - rect.width / 2;
            const cy =
              (pointerCache[0].clientY + pointerCache[1].clientY) / 2 - rect.top - rect.height / 2;
            const sf = newScale / scale.value;
            translateX.value = cx - sf * (cx - translateX.value);
            translateY.value = cy - sf * (cy - translateY.value);
          }
          scale.value = newScale;
          clampPan();
        }
      }
      prevPinchDist = dist;
    } else if (isPanning && pointerCache.length === 1) {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      translateX.value += dx;
      translateY.value += dy;
      clampPan();
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    pointerCache = pointerCache.filter((p) => p.pointerId !== e.pointerId);
    if (pointerCache.length < 2) {
      prevPinchDist = 0;
    }
    if (pointerCache.length === 0) {
      isPanning = false;
    }
  }

  function getPinchDist(): number {
    if (pointerCache.length < 2) return 0;
    const dx = pointerCache[0].clientX - pointerCache[1].clientX;
    const dy = pointerCache[0].clientY - pointerCache[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // --- Full image loading ---

  function loadFullImage(url: string) {
    // Cleanup previous
    if (fullImageLoader) {
      fullImageLoader.onload = null;
      fullImageLoader.onerror = null;
      fullImageLoader.src = '';
      fullImageLoader = null;
    }
    isFullImageLoaded.value = false;
    fullImageSrc.value = url;

    fullImageLoader = new Image();
    fullImageLoader.onload = () => {
      isFullImageLoaded.value = true;
    };
    fullImageLoader.src = url;
  }

  function releaseFullImage() {
    if (fullImageLoader) {
      fullImageLoader.onload = null;
      fullImageLoader.onerror = null;
      fullImageLoader.src = '';
      fullImageLoader = null;
    }
    isFullImageLoaded.value = false;
    fullImageSrc.value = '';
  }

  // --- Controls auto-hide ---

  function showControls() {
    controlsVisible.value = true;
    resetHideTimer();
  }

  function resetHideTimer() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      controlsVisible.value = false;
    }, CONTROLS_HIDE_DELAY);
  }

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  // --- Lifecycle ---

  onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    clearHideTimer();
    releaseFullImage();
  });

  return {
    // Fullscreen
    isFullscreen,
    containerRef,
    enterFullscreen,
    exitFullscreen,

    // Zoom / pan
    scale,
    translateX,
    translateY,
    isAnimating,
    resetTransform,
    handleWheel,
    handleDoubleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,

    // Full image loading
    fullImageSrc,
    isFullImageLoaded,
    loadFullImage,
    releaseFullImage,

    // Controls
    controlsVisible,
    showControls,
  };
}
