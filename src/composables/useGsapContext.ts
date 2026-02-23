import { onMounted, onUnmounted, type Ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapContext(
  setup: (ctx: gsap.Context) => void,
  scope?: Ref<HTMLElement | null>,
) {
  let ctx: gsap.Context;

  onMounted(() => {
    ctx = gsap.context(setup, scope?.value ?? undefined);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}
