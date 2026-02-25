<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';
import type { GearItem } from '@/types';

defineProps<{
  gear: GearItem[];
}>();

const barRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  gsap.from(barRef.value!, {
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: barRef.value!,
      start: 'top 90%',
    },
  });
}, barRef);
</script>

<template>
  <div ref="barRef" class="gear-bar">
    <template v-for="(item, index) in gear" :key="index">
      <span class="gear-item">{{ item.brand }} {{ item.model }}</span>
      <span v-if="index < gear.length - 1" class="gear-sep">&middot;</span>
    </template>
  </div>
</template>

<style scoped>
.gear-bar {
  text-align: center;
  padding: 2rem 1rem 3rem;
  font-family: var(--font-display);
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}

.gear-item {
  white-space: nowrap;
}

.gear-sep {
  margin: 0 0.75em;
  color: var(--color-accent);
}
</style>
