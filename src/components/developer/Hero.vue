<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

defineProps<{
  name: string;
  title: string;
  intro: string;
  avatarSrc?: string;
  avatarWidth?: number;
  avatarHeight?: number;
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  gsap.from(sectionRef.value!.querySelectorAll('.hero-animate'), {
    opacity: 0,
    y: 40,
    scale: 0.97,
    duration: 1.2,
    stagger: 0.2,
    ease: 'expo.out',
  });
}, sectionRef);
</script>

<template>
  <section ref="sectionRef" class="py-20 md:py-32 relative overflow-hidden">
    <div
      class="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
      style="background: var(--color-accent-subtle)"
    />
    <div
      class="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10"
    >
      <div v-if="avatarSrc" class="shrink-0 hero-animate">
        <img
          :src="avatarSrc"
          :width="avatarWidth"
          :height="avatarHeight"
          alt="Avatar"
          class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
          style="border: 3px solid var(--color-accent); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)"
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <div class="text-center md:text-left hero-animate">
        <h1
          class="font-bold mb-3"
          style="color: var(--color-text-heading); font-size: clamp(2.5rem, 5vw, 3rem)"
        >
          {{ name }}
        </h1>
        <p
          class="font-semibold mb-4"
          style="color: var(--color-accent); font-size: clamp(1.25rem, 3vw, 1.5rem)"
        >
          {{ title }}
        </p>
        <p
          class="leading-relaxed max-w-2xl"
          style="color: var(--color-text-muted); font-size: var(--font-size-lg)"
        >
          {{ intro }}
        </p>
      </div>
    </div>
  </section>
</template>
