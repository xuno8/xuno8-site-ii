<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { useFullscreenZoom } from '@/composables/useFullscreenZoom';
import type { GalleryImage } from './MasonryGallery.vue';

const props = defineProps<{
  images: GalleryImage[];
  currentIndex: number;
}>();

const emit = defineEmits<{
  close: [];
  next: [];
  prev: [];
}>();

const current = computed(() => props.images[props.currentIndex]);
const hasCaption = computed(
  () => current.value.caption || current.value.location || current.value.camera,
);

const { prefersReducedMotion } = useReducedMotion();
const fullImageLoaded = ref(false);
const skipTransition = ref(false);
const loadedFullImages = new Set<string>();

const {
  isFullscreen,
  containerRef,
  enterFullscreen,
  exitFullscreen,
  scale,
  translateX,
  translateY,
  isAnimating: zoomAnimating,
  resetTransform,
  handleWheel,
  handleDoubleClick,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  fullImageSrc,
  isFullImageLoaded,
  loadFullImage,
  releaseFullImage,
  controlsVisible,
  showControls,
} = useFullscreenZoom();

const zoomLabel = computed(() => {
  if (scale.value <= 1) return '';
  return `${scale.value.toFixed(1)}x`;
});

const zoomCursor = computed(() => {
  if (scale.value > 1) return 'grab';
  return 'zoom-in';
});

function onFullImageLoad() {
  loadedFullImages.add(current.value.lightboxSrc);
  fullImageLoaded.value = true;
}

function preloadImage(url: string) {
  if (loadedFullImages.has(url)) return;
  const img = new Image();
  img.onload = () => loadedFullImages.add(url);
  img.src = url;
}

function preloadAdjacent() {
  const total = props.images.length;
  if (total <= 1) return;
  const prevIdx = (props.currentIndex - 1 + total) % total;
  const nextIdx = (props.currentIndex + 1) % total;
  preloadImage(props.images[prevIdx].lightboxSrc);
  preloadImage(props.images[nextIdx].lightboxSrc);
}

watch(
  () => props.currentIndex,
  () => {
    const cached = loadedFullImages.has(current.value.lightboxSrc);
    fullImageLoaded.value = cached;
    skipTransition.value = cached;
    preloadAdjacent();

    // If in fullscreen, reset zoom and load new full image
    if (isFullscreen.value) {
      resetTransform();
      loadFullImage(current.value.fullSrc);
    }
  },
);

const backdropRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);
const captionRef = ref<HTMLElement | null>(null);
const controlsRef = ref<HTMLElement[]>([]);

let tl: gsap.core.Timeline | null = null;
let isAnimating = false;

function buildTimeline() {
  if (tl) {
    tl.kill();
    tl = null;
  }

  tl = gsap.timeline({
    onComplete: () => {
      isAnimating = false;
    },
    onReverseComplete: () => {
      isAnimating = false;
      emit('close');
    },
  });

  tl.fromTo(
    backdropRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.25, ease: 'power2.out' },
    0,
  );

  tl.fromTo(
    imageRef.value,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
    0.1,
  );

  if (captionRef.value) {
    tl.fromTo(
      captionRef.value,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      0.35,
    );
  }

  tl.fromTo(
    controlsRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: 'power2.out' },
    0,
  );
}

function requestClose() {
  if (prefersReducedMotion.value || !tl) {
    emit('close');
    return;
  }
  if (isAnimating) {
    tl.kill();
  }
  isAnimating = true;
  tl.timeScale(2.2);
  tl.reverse();
}

async function downloadImage() {
  const image = current.value;
  const filename = image.fullSrc.split('/').pop() || 'photo.jpg';
  try {
    const res = await fetch(image.fullSrc);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    window.open(image.fullSrc, '_blank');
  }
}

function handleEnterFullscreen() {
  loadFullImage(current.value.fullSrc);
  enterFullscreen();
  showControls();
}

function handleExitFullscreen() {
  exitFullscreen();
  releaseFullImage();
}

function fsNav(dir: 'next' | 'prev') {
  emit(dir);
}

let touchStartX = 0;

function onKeydown(e: KeyboardEvent) {
  if (isFullscreen.value) {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        handleExitFullscreen();
        return;
      case 'ArrowLeft':
        fsNav('prev');
        return;
      case 'ArrowRight':
        fsNav('next');
        return;
    }
  }
  switch (e.key) {
    case 'Escape':
      requestClose();
      break;
    case 'ArrowLeft':
      emit('prev');
      break;
    case 'ArrowRight':
      emit('next');
      break;
    case 'f':
      if (!isFullscreen.value) handleEnterFullscreen();
      break;
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent) {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      emit('prev');
    } else {
      emit('next');
    }
  }
}

function onBackdropClick(e: MouseEvent) {
  if (!imageRef.value?.contains(e.target as Node)) {
    requestClose();
  }
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown);

  if (prefersReducedMotion.value) return;

  await nextTick();
  isAnimating = true;
  buildTimeline();
  preloadAdjacent();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  if (tl) {
    tl.kill();
    tl = null;
  }
  releaseFullImage();
});
</script>

<template>
  <div
    ref="backdropRef"
    class="lightbox-backdrop fixed inset-0 z-60 flex items-center justify-center"
    @click="onBackdropClick"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Fullscreen button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed top-3 right-25 z-70 w-9 h-9 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="View fullscreen original"
      @click.stop="handleEnterFullscreen"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
    </button>

    <!-- Download button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed top-3 right-14 z-70 w-9 h-9 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Download original image"
      @click.stop="downloadImage"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>

    <!-- Close button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed top-3 right-3 z-70 w-9 h-9 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Close lightbox"
      @click="requestClose"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>

    <!-- Previous button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed left-3 top-0 bottom-0 my-auto z-70 w-9 h-9 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Previous image"
      @click.stop="emit('prev')"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <!-- Next button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed right-3 top-0 bottom-0 my-auto z-70 w-9 h-9 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Next image"
      @click.stop="emit('next')"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <!-- Image container -->
    <div class="relative w-full h-full flex items-center justify-center px-14">
      <div ref="imageRef" class="relative">
        <!-- Blurred thumbnail preview (cached, shows immediately; hidden once full image loads) -->
        <img
          v-show="!fullImageLoaded"
          :src="current.thumbSrc"
          :alt="current.alt"
          class="max-w-full max-h-[92vh] object-contain mx-auto block lightbox-thumb"
        />
        <!-- Full-size image (loads over thumbnail) -->
        <img
          :src="current.lightboxSrc"
          :alt="current.alt"
          class="max-w-full max-h-[92vh] object-contain mx-auto block lightbox-full"
          :class="{ 'is-loaded': fullImageLoaded, 'is-cached': skipTransition }"
          @load="onFullImageLoad"
        />
        <!-- Floating caption overlay -->
        <div
          v-if="hasCaption"
          ref="captionRef"
          class="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-12 text-center"
          style="background: linear-gradient(transparent, rgba(0, 0, 0, 0.7)); pointer-events: none"
        >
          <p v-if="current.caption" class="text-base font-medium mb-1" style="color: white">
            {{ current.caption }}
          </p>
          <p class="text-sm" style="color: rgba(255, 255, 255, 0.6)">
            <span v-if="current.date">{{ current.date }}</span>
            <span v-if="current.date && current.location"> &middot; </span>
            <span v-if="current.location">{{ current.location }}</span>
            <span v-if="(current.date || current.location) && current.camera"> &middot; </span>
            <span v-if="current.camera">{{ current.camera }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Fullscreen overlay -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        ref="containerRef"
        class="fs-overlay"
        :style="{ cursor: zoomCursor }"
        @wheel.prevent="handleWheel"
        @dblclick="handleDoubleClick"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @mousemove="showControls"
      >
        <!-- Image with zoom/pan transform -->
        <div
          class="fs-image-wrapper"
          :class="{ 'fs-animating': zoomAnimating }"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          }"
        >
          <!-- Resized placeholder (shows while original loads) -->
          <img :src="current.lightboxSrc" :alt="current.alt" class="fs-image" draggable="false" />
          <!-- Original full-size image -->
          <img
            v-if="isFullImageLoaded"
            :src="fullImageSrc"
            :alt="current.alt"
            class="fs-image fs-image-full"
            draggable="false"
          />
        </div>

        <!-- Loading indicator -->
        <div v-if="!isFullImageLoaded" class="fs-loading">
          <svg class="fs-spinner" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="90 150"
              stroke-dashoffset="0"
            />
          </svg>
        </div>

        <!-- Zoom indicator -->
        <div
          v-if="zoomLabel"
          class="fs-zoom-label"
          :class="{ 'fs-controls-hidden': !controlsVisible }"
        >
          {{ zoomLabel }}
        </div>

        <!-- Fullscreen controls -->
        <div class="fs-controls" :class="{ 'fs-controls-hidden': !controlsVisible }">
          <!-- Exit fullscreen button -->
          <button
            class="lightbox-control fs-btn fixed top-4 right-4 z-80 w-8 h-8 flex items-center justify-center rounded-full border-0 cursor-pointer"
            aria-label="Exit fullscreen"
            @click.stop="handleExitFullscreen"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
            </svg>
          </button>

          <!-- Prev in fullscreen -->
          <button
            class="lightbox-control fs-btn fixed left-4 top-0 bottom-0 my-auto z-80 w-8 h-8 flex items-center justify-center rounded-full border-0 cursor-pointer"
            aria-label="Previous image"
            @click.stop="fsNav('prev')"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <!-- Next in fullscreen -->
          <button
            class="lightbox-control fs-btn fixed right-4 top-0 bottom-0 my-auto z-80 w-8 h-8 flex items-center justify-center rounded-full border-0 cursor-pointer"
            aria-label="Next image"
            @click.stop="fsNav('next')"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.lightbox-backdrop {
  background-color: rgba(0, 0, 0, 0.92);
}

.lightbox-control {
  background-color: var(--color-accent-subtle);
  color: var(--color-accent);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-control:hover {
  background-color: rgba(212, 165, 116, 0.25);
  scale: 1.05;
}

.lightbox-control:active {
  scale: 0.92;
  transition-duration: 0.1s;
}

.lightbox-control:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.lightbox-thumb {
  filter: blur(8px);
  transform: scale(1.03);
}

.lightbox-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
}

.lightbox-full.is-loaded {
  position: static;
  width: auto;
  height: auto;
  opacity: 1;
  transition: opacity 500ms ease;
}

.lightbox-full.is-cached {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-full {
    transition: none;
  }

  .lightbox-full.is-loaded {
    opacity: 1;
  }
}

/* --- Fullscreen overlay --- */

.fs-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  user-select: none;
  overflow: hidden;
}

.fs-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  transform-origin: center center;
}

.fs-image-wrapper.fs-animating {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.fs-image {
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
  pointer-events: none;
}

.fs-image-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Loading spinner */

.fs-loading {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 110;
  color: var(--color-accent);
}

.fs-spinner {
  width: 32px;
  height: 32px;
  animation: fs-spin 1.2s cubic-bezier(0.4, 0.2, 0.6, 0.8) infinite;
}

@keyframes fs-spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Zoom label */

.fs-zoom-label {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 110;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  font-variant-numeric: tabular-nums;
  background-color: var(--color-accent-subtle);
  color: var(--color-accent);
  border: 1px solid rgba(212, 165, 116, 0.2);
  transition: opacity 0.3s ease;
}

/* Controls auto-hide */

.fs-controls {
  transition: opacity 0.5s cubic-bezier(0, 0.55, 0.45, 1);
}

.fs-controls-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Fullscreen button overrides inside fs-overlay */

.fs-btn {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
}

.fs-btn:hover {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.85);
  scale: 1;
  box-shadow: none;
}

/* Grabbing cursor while panning */

.fs-overlay:active {
  cursor: grabbing;
}

@media (prefers-reduced-motion: reduce) {
  .fs-image-wrapper.fs-animating {
    transition: none;
  }

  .fs-controls {
    transition: none;
  }
}
</style>
