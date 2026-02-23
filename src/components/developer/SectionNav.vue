<script setup lang="ts">
import { ref } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@/composables/useGsapContext';

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
];

const activeSection = ref('hero');

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

useGsapContext(() => {
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        activeSection.value = section.id;
      },
      onEnterBack: () => {
        activeSection.value = section.id;
      },
    });
  });
});
</script>

<template>
  <nav
    class="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
    aria-label="Section navigation"
  >
    <button
      v-for="section in sections"
      :key="section.id"
      :aria-label="section.label"
      :title="section.label"
      class="group relative w-3 h-3 rounded-full transition-all duration-200 cursor-pointer border-0 p-0"
      :style="{
        backgroundColor:
          activeSection === section.id ? 'var(--color-accent)' : 'var(--color-border)',
        transform: activeSection === section.id ? 'scale(1.4)' : 'scale(1)',
      }"
      @click="scrollToSection(section.id)"
    >
      <span
        class="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-2 py-1 rounded"
        style="background-color: var(--color-bg-card); color: var(--color-text)"
      >
        {{ section.label }}
      </span>
    </button>
  </nav>
</template>
