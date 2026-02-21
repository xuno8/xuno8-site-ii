# Quickstart: Dual-Mode Portfolio Website

**Feature**: `001-dual-mode-portfolio` | **Date**: 2026-02-21

## Prerequisites

- Node.js 20+ (LTS)
- pnpm (recommended) or npm

## Project Setup

```bash
# 1. Initialize Astro project
npm create astro@latest . -- --template minimal --typescript strict

# 2. Add Vue integration
npx astro add vue

# 3. Add Vercel adapter
npx astro add vercel

# 4. Install UnoCSS
pnpm add -D unocss @unocss/preset-uno @unocss/preset-attributify @unocss/reset

# 5. Install Nanostores
pnpm add nanostores @nanostores/vue

# 6. Install GSAP
pnpm add gsap

# 7. Install YAML support
pnpm add -D @rollup/plugin-yaml

# 8. Install dev/test tooling
pnpm add -D vitest @playwright/test
```

## Configuration Files

### `astro.config.ts`

```typescript
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [
    vue(),
    UnoCSS({ injectReset: true }),
  ],
});
```

### `uno.config.ts`

```typescript
import { defineConfig, presetUno } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      // Defined via CSS custom properties in global.css
    },
  },
  safelist: [
    // Dynamic utilities used in script blocks
  ],
});
```

### `tsconfig.json` (extend Astro's base)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@data/*": ["src/data/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

## Directory Setup

```bash
# Create source directories
mkdir -p src/{assets/images/gallery,components/{developer,photographer,shared},composables,data,layouts,pages,stores,styles,types,utils}

# Create test directories
mkdir -p tests/{e2e,unit/{stores,utils}}
```

## Data Files (starter templates)

### `src/data/site.yaml`

```yaml
name: "Your Name"
title: "Software Engineer"
intro: "A brief introduction about yourself."
email: "you@example.com"
seoDescription: "Portfolio of Your Name — Software Engineer and Photographer"
socialLinks:
  - platform: github
    url: "https://github.com/yourname"
  - platform: linkedin
    url: "https://linkedin.com/in/yourname"
```

### `src/data/experience.yaml`

```yaml
- company: "Company Name"
  role: "Senior Software Engineer"
  startDate: "2023-01"
  endDate: "present"
  description: "Description of responsibilities and achievements."
  technologies: ["TypeScript", "Vue", "Node.js"]
```

### `src/data/projects.yaml`

```yaml
- title: "Project Name"
  description: "Brief project description."
  technologies: ["Astro", "Vue", "GSAP"]
  demoUrl: "https://example.com"
  repoUrl: "https://github.com/yourname/project"
  featured: true
```

### `src/data/skills.yaml`

```yaml
- category: "Languages"
  skills: ["TypeScript", "Python", "Rust"]
- category: "Frameworks"
  skills: ["Vue", "Astro", "Node.js"]
- category: "Tools"
  skills: ["Git", "Docker", "VS Code"]
```

### `src/data/photos.yaml`

```yaml
- src: "gallery/photo-01.jpg"
  alt: "Description of the photograph"
  caption: "Optional display caption"
  date: "2025-06-15"
  location: "Tokyo, Japan"
```

## Key Patterns

### GSAP Lifecycle (composable)

```typescript
// src/composables/useGsapContext.ts
import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export function useGsapContext(setup: (ctx: gsap.Context) => void) {
  let ctx: gsap.Context;

  onMounted(() => {
    ctx = gsap.context(setup);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}
```

### Nanostores Mode Store

```typescript
// src/stores/mode.ts
import { atom } from 'nanostores';
import type { Mode } from '@/types';

export const currentMode = atom<Mode>('developer');
```

### Pre-Hydration Theme Script

```html
<!-- In Layout.astro <head>, before any other scripts -->
<script is:inline>
  (function() {
    var mode = localStorage.getItem('portfolio-mode') || 'developer';
    document.documentElement.dataset.theme = mode;
    window.__INITIAL_MODE__ = mode;
  })();
</script>
```

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run unit tests
pnpm vitest

# Run e2e tests
pnpm playwright test
```

## Verification Checklist

- [ ] `pnpm dev` starts without errors
- [ ] Vue component renders in browser with `client:load`
- [ ] UnoCSS attributify utilities apply (e.g., `bg="gray-100"`)
- [ ] GSAP animation plays on a test element
- [ ] Nanostores value shared between two Vue islands
- [ ] `<Image>` component renders optimized image
- [ ] `data-theme` attribute switches between `developer` and `photographer`
- [ ] `pnpm build` completes with no errors
