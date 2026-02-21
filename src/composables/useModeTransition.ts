import { ref, watch, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { useStore } from '@nanostores/vue';
import { currentMode } from '@/stores/mode';

export function useModeTransition() {
  const mode = useStore(currentMode);
  const isTransitioning = ref(false);
  let pendingMode: 'developer' | 'photographer' | null = null;
  let ctx: gsap.Context | null = null;

  function applyTransition(
    newMode: 'developer' | 'photographer',
    reducedMotion: boolean,
  ) {
    const devContent = document.getElementById('developer-content');
    const photoContent = document.getElementById('photographer-content');
    if (!devContent || !photoContent) return;

    const outgoing = newMode === 'photographer' ? devContent : photoContent;
    const incoming = newMode === 'photographer' ? photoContent : devContent;

    if (reducedMotion) {
      outgoing.style.display = 'none';
      incoming.style.display = '';
      document.documentElement.dataset.theme = newMode;
      return;
    }

    isTransitioning.value = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning.value = false;

        const next = pendingMode;
        pendingMode = null;

        if (next && next !== newMode) {
          applyTransition(next, false);
        }
      },
    });

    tl.to(outgoing, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
      .call(() => {
        outgoing.style.display = 'none';
        incoming.style.display = '';
        gsap.set(incoming, { opacity: 0 });
        document.documentElement.dataset.theme = newMode;
      })
      .to(incoming, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
  }

  onMounted(() => {
    ctx = gsap.context(() => {});
  });

  watch(mode, (newMode) => {
    if (isTransitioning.value) {
      pendingMode = newMode;
      return;
    }
    applyTransition(newMode, false);
  });

  onUnmounted(() => {
    ctx?.revert();
  });

  return { isTransitioning };
}
