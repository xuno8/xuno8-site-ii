import { ref } from 'vue';

export function useLightbox(totalItems: () => number) {
  const isOpen = ref(false);
  const currentIndex = ref(0);
  let savedScrollY = 0;

  function open(index: number) {
    savedScrollY = window.scrollY;
    currentIndex.value = index;
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen.value = false;
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

  return { isOpen, currentIndex, open, close, next, prev };
}
