# xuno8-site-ii Development Guidelines

## Tech Stack

Astro 5.x (SSG) + Vue 3 islands + UnoCSS (attributify) + Nanostores + GSAP (ScrollTrigger) + Cloudflare Pages

## Project Structure

```text
src/
├── assets/images/gallery/   # Source photos (optimized at build time)
├── components/
│   ├── developer/            # Developer mode Vue islands (Hero, ExperienceTimeline, SkillsGrid, ProjectCards, SectionNav)
│   ├── photographer/         # Photographer mode Vue islands (MasonryGallery, Lightbox)
│   └── shared/               # Cross-mode (Navbar.astro, Footer.astro, ModeToggle.vue)
├── composables/              # Vue composables (useGsapContext, useModeTransition, useReducedMotion, useLightbox)
├── data/                     # YAML content files (site, experience, projects, skills, photos)
├── layouts/Layout.astro      # Base HTML shell with SEO + pre-hydration script
├── pages/index.astro         # Single page — assembles all sections + image processing
├── stores/mode.ts            # Nanostores atom: 'developer' | 'photographer'
├── styles/global.css         # CSS custom properties for dual themes
├── types/index.ts            # Shared TypeScript interfaces
└── utils/data.ts             # YAML loading helpers
tests/
```

## Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # ESLint check (cached)
npm run lint:fix     # ESLint auto-fix (cached)
npm run format       # Prettier format all files
npm run format:check # Prettier check only
```

## Path Aliases

- `@/*` → `src/*`
- `@data/*` → `src/data/*`
- `@components/*` → `src/components/*`

## Architecture Patterns

- **Astro owns layout**, Vue components are interactive islands with `client:load` (above-fold) or `client:visible` (below-fold)
- **Images in Vue**: Process via `getImage()` in parent `.astro` file, pass optimized data as props — Vue cannot use `<Image>` directly
- **GSAP lifecycle**: Always use `useGsapContext` composable — creates in `onMounted`, reverts in `onUnmounted`
- **Dual theme**: `data-theme` attribute on `<html>` drives CSS custom properties in `global.css`
- **Content**: Edit YAML files in `src/data/` — no database, all static build-time
- **Mode state**: Nanostores `currentMode` atom shared across islands, persisted to `localStorage`

<!-- MANUAL ADDITIONS START -->

## Workflow

- When designing or implementing frontend work, use the `frontend-aesthetics-enforcer` subagent to review visual quality and avoid generic AI-style aesthetics.

<!-- MANUAL ADDITIONS END -->
