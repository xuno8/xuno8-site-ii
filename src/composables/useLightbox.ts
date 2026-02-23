import { ref, onUnmounted } from 'vue';
import { lightboxOpen } from '@/stores/lightbox';

export function useLightbox(totalItems: () => number) {
  const isVisible = ref(false);
  const currentIndex = ref(0);
  let savedScrollY = 0;

  function open(index: number) {
    savedScrollY = window.scrollY;
    currentIndex.value = index;
    isVisible.value = true;
    lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isVisible.value = false;
    lightboxOpen.set(false);
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  function next() {
    const total = totalItems();
    if (total > 0) {
      currentIndex.value = (currentIndex.value + 1) % total;
    }
  }

  function prev() {
    const total = totalItems();
    if (total > 0) {
      currentIndex.value = (currentIndex.value - 1 + total) % total;
    }
  }

  onUnmounted(() => {
    if (isVisible.value) {
      lightboxOpen.set(false);
      document.body.style.overflow = '';
    }
  });

  return { isVisible, currentIndex, open, close, next, prev };
}
