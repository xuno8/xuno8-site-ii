<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';
import Lightbox from './Lightbox.vue';
import { useLightbox } from '@/composables/useLightbox';

export interface GalleryImage {
  src: string;
  thumbSrc: string;
  lightboxSrc: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  date?: string;
  location?: string;
  camera?: string;
}

const props = defineProps<{
  images: GalleryImage[];
}>();

const galleryRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();
const { isVisible, currentIndex, open, close, next, prev } = useLightbox(() => props.images.length);
const failedImages = ref<Set<number>>(new Set());
const loadedImages = ref<Set<number>>(new Set());

function onImageError(index: number) {
  failedImages.value.add(index);
}

function onImageLoad(index: number) {
  loadedImages.value.add(index);
}

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  const items = galleryRef.value!.querySelectorAll('.masonry-item');
  ScrollTrigger.batch(items, {
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1,
        stagger: { amount: 0.6, from: 'random' },
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    start: 'top 85%',
  });
}, galleryRef);
</script>

<template>
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-4">
      <div ref="galleryRef" class="masonry-grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="masonry-item cursor-pointer"
          @click="!failedImages.has(index) && open(index)"
        >
          <template v-if="!failedImages.has(index)">
            <div
              class="gallery-img-wrapper rounded-sm"
              :class="{ 'is-loaded': loadedImages.has(index) }"
              :style="{ aspectRatio: `${image.width} / ${image.height}` }"
            >
              <img
                :src="image.thumbSrc"
                :width="image.width"
                :height="image.height"
                :alt="image.alt"
                loading="lazy"
                decoding="async"
                class="w-full h-auto rounded-sm gallery-img"
                @load="onImageLoad(index)"
                @error="onImageError(index)"
              />
            </div>
          </template>
          <template v-else>
            <div
              class="w-full rounded-lg flex items-center justify-center"
              style="
                background-color: var(--color-bg-card);
                border: 1px dashed var(--color-border);
                aspect-ratio: 4/3;
              "
            >
              <span class="text-sm" style="color: var(--color-text-muted)">
                Image unavailable
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Lightbox
        v-if="isVisible"
        :images="images"
        :current-index="currentIndex"
        @close="close"
        @next="next"
        @prev="prev"
      />
    </Teleport>
  </section>
</template>

<style scoped>
.masonry-grid {
  columns: 1;
  column-gap: 1.5rem;
}

@media (min-width: 640px) {
  .masonry-grid {
    columns: 2;
    column-gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    columns: 3;
    column-gap: 2.5rem;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.gallery-img-wrapper {
  position: relative;
  overflow: hidden;
  background-color: var(--color-bg-card);
}

.gallery-img-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: shimmer 1.8s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

.gallery-img-wrapper.is-loaded::before {
  display: none;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-img-wrapper::before {
    animation: none;
  }
}

.gallery-img {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition:
    opacity 400ms ease,
    transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0;
}

.gallery-img-wrapper.is-loaded .gallery-img {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-img {
    transition: none;
    opacity: 1;
  }
}

.masonry-item:hover .gallery-img {
  transform: scale(1.02);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px var(--color-accent);
}
</style>
