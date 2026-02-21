<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
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

let touchStartX = 0;

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      emit('close');
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
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div
    class="lightbox-backdrop fixed inset-0 z-60 flex items-center justify-center"
    style="background-color: rgba(0, 0, 0, 0.92)"
    @click="onBackdropClick"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Close button -->
    <button
      class="fixed top-4 right-4 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      style="background-color: rgba(255, 255, 255, 0.1); color: white"
      aria-label="Close lightbox"
      @click="emit('close')"
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
      class="fixed left-4 top-1/2 -translate-y-1/2 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      style="background-color: rgba(255, 255, 255, 0.1); color: white"
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
      class="fixed right-4 top-1/2 -translate-y-1/2 z-70 w-11 h-11 flex items-center justify-center rounded-full border-0 cursor-pointer"
      style="background-color: rgba(255, 255, 255, 0.1); color: white"
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

    <!-- Image -->
    <div class="max-w-5xl max-h-[85vh] px-16">
      <img
        :src="current.src"
        :alt="current.alt"
        class="max-w-full max-h-[75vh] object-contain mx-auto"
      />
      <!-- Caption / Metadata -->
      <div v-if="current.caption || current.location || current.camera" class="text-center mt-4">
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
</template>
