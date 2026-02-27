<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import type { Project } from '@/types';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

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
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-heading)">
                {{ project.title }}
              </h3>
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="source-link"
                aria-label="Source code"
              >
                <svg class="source-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                  />
                </svg>
              </a>
            </div>
            <span v-if="project.featured" class="badge-active"> Active </span>
          </div>
          <p v-if="project.period" class="text-xs mb-2" style="color: var(--color-text-secondary)">
            {{ project.period }}
          </p>
          <p class="text-sm leading-relaxed mb-4 flex-1" style="color: var(--color-text-secondary)">
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
          <div v-if="project.demoUrl" class="flex">
            <a
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium"
              style="color: var(--color-accent)"
            >
              Live Demo &rarr;
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.badge-active {
  background-color: var(--color-active-bg);
  color: var(--color-active-text);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.badge-active::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  margin-right: 6px;
  animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .badge-active::before {
    animation: none;
  }
}

.source-link {
  color: var(--color-text-secondary);
  opacity: 0.4;
  transition: opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);
  display: inline-flex;
  line-height: 1;
}

.source-link:hover {
  opacity: 1;
}

.source-icon {
  width: 16px;
  height: 16px;
}
</style>
