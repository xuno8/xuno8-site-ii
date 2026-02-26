<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

defineProps<{
  name: string;
  gear: string;
}>();

const heroRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  const els = heroRef.value!.querySelectorAll('.hero-animate');
  gsap.from(els, {
    opacity: 0,
    y: 20,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out',
  });
}, heroRef);
</script>

<template>
  <section ref="heroRef" class="photo-hero">
    <h1 class="hero-name hero-animate">{{ name }}</h1>
    <p class="hero-gear hero-animate">{{ gear }}</p>
  </section>
</template>

<style scoped>
.photo-hero {
  text-align: center;
  padding: 6rem 1rem 3rem;
  max-width: 72rem;
  margin: 0 auto;
}

.hero-name {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 500;
  color: var(--color-text-heading);
  letter-spacing: 0;
  margin-bottom: 0.5rem;
}

.hero-gear {
  font-family: var(--font-display);
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
  margin: 0;
}

@media (min-width: 640px) {
  .hero-name {
    font-size: 3rem;
  }
}
</style>
