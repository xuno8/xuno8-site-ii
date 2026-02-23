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
    class="mode-toggle relative flex items-center w-20 h-10 rounded-full cursor-pointer p-1.5"
    :aria-label="`Switch to ${mode === 'developer' ? 'photographer' : 'developer'} mode`"
    role="switch"
    :aria-checked="mode === 'photographer'"
    @click="toggle"
  >
    <!-- Photographer icon (left side — visible when knob is right / photographer mode) -->
    <span
      class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      :style="{
        opacity: mode === 'photographer' ? '0.85' : '0',
        color: 'var(--color-accent)',
        transform:
          mode === 'photographer' ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.8)',
        transition:
          'opacity 250ms cubic-bezier(0.22, 1, 0.36, 1), transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path
          d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4ZM9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
        />
      </svg>
    </span>

    <!-- Developer icon (right side — visible when knob is left / developer mode) -->
    <span
      class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      :style="{
        opacity: mode === 'developer' ? '0.85' : '0',
        color: 'var(--color-accent)',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        fontWeight: '700',
        transform:
          mode === 'developer' ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.8)',
        transition:
          'opacity 250ms cubic-bezier(0.22, 1, 0.36, 1), transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }"
      >&lt;/&gt;</span
    >

    <!-- Toggle knob -->
    <span
      class="toggle-knob block w-6 h-6 rounded-full"
      :style="{
        transform: mode === 'photographer' ? 'translateX(40px)' : 'translateX(0)',
      }"
    />
    <span class="sr-only"> {{ mode === 'developer' ? 'Developer' : 'Photographer' }} mode </span>
  </button>
</template>

<style scoped>
.mode-toggle {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-fallback);
  box-shadow:
    0 4px 16px var(--glass-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 150ms ease,
    box-shadow 200ms ease,
    border-color 200ms ease;
}

/* Backdrop blur glass layer */
@supports (backdrop-filter: blur(1px)) {
  .mode-toggle {
    background: var(--glass-bg);
  }

  .mode-toggle::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    backdrop-filter: url(#liquid-glass-filter) blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    z-index: 0;
    pointer-events: none;
  }
}

/* Specular highlight layer */
.mode-toggle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-highlight);
  opacity: 0.5;
  z-index: 1;
  pointer-events: none;
  transition: opacity 200ms ease;
}

.mode-toggle:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow:
    0 4px 24px var(--glass-shadow),
    0 0 20px var(--color-accent-subtle),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.mode-toggle:hover::after {
  opacity: 0.85;
}

.mode-toggle:active {
  transform: scale(0.98);
}

/* Toggle knob */
.toggle-knob {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.35),
    0 0 4px var(--color-accent-subtle);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Icons above glass layers */
.mode-toggle > span {
  z-index: 2;
}

@media (prefers-reduced-motion: reduce) {
  .mode-toggle::after {
    transition: none;
  }

  .mode-toggle {
    transition: none;
  }

  .toggle-knob {
    transition: none;
  }
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
