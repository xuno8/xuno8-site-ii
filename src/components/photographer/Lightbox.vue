<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import gsap from 'gsap';
import { useReducedMotion } from '@/composables/useReducedMotion';
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

let touchStartX = 0;

function onKeydown(e: KeyboardEvent) {
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
  if ((e.target as HTMLElement).classList.contains('lightbox-backdrop')) {
    requestClose();
  }
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown);

  if (prefersReducedMotion.value) return;

  await nextTick();
  isAnimating = true;
  buildTimeline();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  if (tl) {
    tl.kill();
    tl = null;
  }
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
    <!-- Close button -->
    <button
      :ref="
        (el) => {
          if (el) controlsRef.push(el as HTMLElement);
        }
      "
      class="lightbox-control fixed top-4 right-4 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Close lightbox"
      @click="requestClose"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
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
      class="lightbox-control fixed left-4 top-1/2 -translate-y-1/2 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Previous image"
      @click.stop="emit('prev')"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
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
      class="lightbox-control fixed right-4 top-1/2 -translate-y-1/2 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      aria-label="Next image"
      @click.stop="emit('next')"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <!-- Image container -->
    <div class="relative w-full h-full flex items-center justify-center px-12">
      <div ref="imageRef" class="relative">
        <img
          :src="current.src"
          :alt="current.alt"
          class="max-w-full max-h-[92vh] object-contain mx-auto block"
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
  </div>
</template>

<style scoped>
.lightbox-backdrop {
  background-color: rgba(0, 0, 0, 0.92);
}

.lightbox-control {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: background-color 0.2s ease;
}

.lightbox-control:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
