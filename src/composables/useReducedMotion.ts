import { ref, onMounted, onUnmounted } from 'vue';

export function useReducedMotion() {
  const prefersReducedMotion = ref(false);
  let mediaQuery: MediaQueryList | null = null;

  function update(e: MediaQueryListEvent | MediaQueryList) {
    prefersReducedMotion.value = e.matches;
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', update);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', update);
  });

  return { prefersReducedMotion };
}
