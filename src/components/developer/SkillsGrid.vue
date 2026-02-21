<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SkillCategory } from '@/types';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

defineProps<{
  categories: SkillCategory[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  gsap.from(sectionRef.value!.querySelectorAll('.skill-card'), {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.08,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top 80%',
    },
  });
}, sectionRef);
</script>

<template>
  <section ref="sectionRef" class="py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-10" style="color: var(--color-text-heading)">Skills</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="cat in categories" :key="cat.category" class="skill-card">
          <h3
            class="text-xs font-bold uppercase mb-4"
            style="
              color: var(--color-accent);
              letter-spacing: var(--tracking-widest);
              font-family: var(--font-mono);
            "
          >
            {{ cat.category }}
          </h3>
          <ul class="space-y-2.5">
            <li
              v-for="skill in cat.skills"
              :key="skill"
              class="text-base"
              style="color: var(--color-text); line-height: var(--line-height-snug)"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
