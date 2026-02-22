<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WorkExperience } from '@/types';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

defineProps<{
  experiences: WorkExperience[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  gsap.from(sectionRef.value!.querySelectorAll('.timeline-item'), {
    opacity: 0,
    x: -60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top 80%',
    },
  });
}, sectionRef);

function formatDate(date: string): string {
  if (date === 'present') return 'Present';
  const [year, month] = date.split('-');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}
</script>

<template>
  <section ref="sectionRef" class="py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-10" style="color: var(--color-text-heading)">Experience</h2>
      <div class="relative">
        <!-- Timeline line -->
        <div
          class="absolute left-4 md:left-6 top-0 bottom-0 w-px"
          style="
            background: linear-gradient(
              to bottom,
              transparent,
              var(--color-accent) 10%,
              var(--color-accent) 90%,
              transparent
            );
          "
        />

        <div
          v-for="(exp, index) in experiences"
          :key="index"
          class="relative pl-12 md:pl-16 pb-10 last:pb-0 timeline-item"
        >
          <!-- Timeline dot -->
          <div
            class="absolute left-2.5 md:left-4.5 top-1.5 w-3 h-3 rounded-full"
            style="
              background-color: var(--color-accent);
              box-shadow:
                0 0 12px var(--color-accent),
                0 0 0 4px var(--color-bg);
            "
          />

          <div
            class="p-5 rounded-md"
            style="
              background-color: var(--color-bg-card);
              border: 1px solid var(--color-border);
              border-left: 3px solid var(--color-accent);
            "
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 class="text-lg font-semibold" style="color: var(--color-text-heading)">
                {{ exp.role }}
              </h3>
              <span
                class="text-sm mt-1 sm:mt-0"
                style="color: var(--color-text-secondary); font-family: var(--font-mono)"
              >
                {{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}
              </span>
            </div>
            <p class="text-sm font-medium mb-3" style="color: var(--color-accent)">
              {{ exp.company
              }}<span
                v-if="exp.location"
                style="color: var(--color-text-secondary); font-weight: 600"
              >
                · {{ exp.location }}</span
              >
            </p>
            <ul
              v-if="Array.isArray(exp.description)"
              class="text-sm leading-relaxed mb-3 list-disc list-inside space-y-1"
              style="color: var(--color-text)"
            >
              <li v-for="(item, i) in exp.description" :key="i">{{ item }}</li>
            </ul>
            <p v-else class="text-sm leading-relaxed mb-3" style="color: var(--color-text)">
              {{ exp.description }}
            </p>
            <div v-if="exp.technologies?.length" class="flex flex-wrap gap-2">
              <span
                v-for="tech in exp.technologies"
                :key="tech"
                class="text-xs px-2.5 py-1 rounded-full"
                style="background-color: var(--color-accent-subtle); color: var(--color-accent)"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
