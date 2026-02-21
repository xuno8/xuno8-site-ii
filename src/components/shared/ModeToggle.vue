<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { currentMode } from '@/stores/mode';

const mode = useStore(currentMode);

function toggle() {
  currentMode.set(mode.value === 'developer' ? 'photographer' : 'developer');
}
</script>

<template>
  <button
    class="mode-toggle relative flex items-center w-20 h-10 rounded-full cursor-pointer border-0 p-1.5"
    :style="{
      backgroundColor: 'var(--color-bg-card)',
      border: '2px solid var(--color-border)',
      boxShadow: `0 0 16px var(--color-accent-subtle), inset 0 2px 4px rgba(0,0,0,0.2)`,
    }"
    :aria-label="`Switch to ${mode === 'developer' ? 'photographer' : 'developer'} mode`"
    role="switch"
    :aria-checked="mode === 'photographer'"
    @click="toggle"
  >
    <!-- Developer icon -->
    <span
      class="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
      :style="{
        opacity: mode === 'developer' ? '0' : '0.4',
        color: 'var(--color-text-muted)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        fontWeight: '600',
        transition: 'opacity 200ms ease',
      }"
    >&lt;/&gt;</span>

    <!-- Photographer icon -->
    <span
      class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
      :style="{
        opacity: mode === 'photographer' ? '0' : '0.4',
        color: 'var(--color-text-muted)',
        fontSize: '13px',
        transition: 'opacity 200ms ease',
      }"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4ZM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/>
      </svg>
    </span>

    <!-- Toggle knob -->
    <span
      class="block w-6 h-6 rounded-full shadow-lg"
      :style="{
        background: `linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))`,
        transform: mode === 'photographer' ? 'translateX(40px)' : 'translateX(0)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
      }"
    />
    <span class="sr-only">
      {{ mode === 'developer' ? 'Developer' : 'Photographer' }} mode
    </span>
  </button>
</template>

<style scoped>
.mode-toggle {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.mode-toggle:hover {
  transform: scale(1.05);
}
.mode-toggle:active {
  transform: scale(0.98);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
