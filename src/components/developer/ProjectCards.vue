<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/types';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

defineProps<{
  projects: Project[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  gsap.from(sectionRef.value!.querySelectorAll('.project-card'), {
    opacity: 0,
    scale: 0.92,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
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
      <h2 class="text-3xl font-bold mb-10" style="color: var(--color-text-heading)">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="project in projects"
          :key="project.title"
          class="p-6 rounded-lg flex flex-col project-card"
          style="background-color: var(--color-bg-card); border: 1px solid var(--color-border)"
        >
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold" style="color: var(--color-text-heading)">
              {{ project.title }}
            </h3>
            <span
              v-if="project.featured"
              class="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
              style="background-color: var(--color-accent-subtle); color: var(--color-accent)"
            >
              Featured
            </span>
          </div>
          <p class="text-sm leading-relaxed mb-4 flex-1" style="color: var(--color-text-muted)">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="text-xs px-2 py-0.5 rounded"
              style="background-color: var(--color-accent-subtle); color: var(--color-accent)"
            >
              {{ tech }}
            </span>
          </div>
          <div class="flex gap-3">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium"
              style="color: var(--color-accent)"
            >
              Live Demo &rarr;
            </a>
            <a
              v-if="project.repoUrl"
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium"
              style="color: var(--color-text-muted)"
            >
              Source Code
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
