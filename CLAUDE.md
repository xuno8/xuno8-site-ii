# xuno8-site-ii Development Guidelines

## Tech Stack

Astro 5.x (SSG) + Vue 3 islands + UnoCSS (attributify) + Nanostores + GSAP (ScrollTrigger) + Cloudflare Workers (Static Assets)

## Project Structure

```text
src/
├── assets/images/gallery/   # Source photos (optimized at build time)
├── components/
│   ├── developer/            # Developer mode Vue islands (Hero, HeroSocialLinks, ExperienceTimeline, SkillsGrid, ProjectCards, SectionNav)
│   ├── photographer/         # Photographer mode Vue islands (MasonryGallery, Lightbox)
│   └── shared/               # Cross-mode (Footer.astro, ModeToggle.vue, ModeTransitionController.vue)
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

## Icons

UnoCSS preset-icons — prefix format: `i-{collection}-{icon}`
- `i-lucide-*` — UI icons (e.g. `i-lucide-mail`)
- `i-simple-icons-*` — Brand icons (e.g. `i-simple-icons-github`)

## Architecture Patterns

- **Astro owns layout**, Vue components are interactive islands with `client:load` (above-fold) or `client:visible` (below-fold)
- **Images in Vue**: Process via `getImage()` in parent `.astro` file, pass optimized data as props — Vue cannot use `<Image>` directly
- **GSAP lifecycle**: Always use `useGsapContext` composable — creates in `onMounted`, reverts in `onUnmounted`. ScrollTrigger is registered centrally in `useGsapContext`; do **not** call `gsap.registerPlugin(ScrollTrigger)` in individual components. Exception: `Hero.vue` manages GSAP context manually because the `clear` command needs to kill and rebuild the entry timeline.
- **Dual theme**: `data-theme` attribute on `<html>` drives CSS custom properties in `global.css`
- **Content**: Edit YAML files in `src/data/` — no database, all static build-time
- **Mode state**: Nanostores `currentMode` atom shared across islands, persisted to `localStorage`
- **Nanostores in Vue**: Use `@nanostores/vue`'s `useStore(atom)` to get a reactive ref — do **not** call `atom.get()` directly in Vue components
- **Pre-hydration**: `Layout.astro` contains an `is:inline` script that runs synchronously before hydration to avoid FOUC — reads `localStorage`, sets `data-theme`, stores initial state in `window.__INITIAL_MODE__` / `window.__FAVICONS__` / `window.__TITLES__`
- **Hydration strategy**: `client:load` for above-fold / critical interaction (ModeToggle, Hero, MasonryGallery); `client:visible` for below-fold sections (ExperienceTimeline, SkillsGrid, ProjectCards, SectionNav)
- **Batch image processing**: `index.astro` uses `import.meta.glob(..., { eager: true })` + `getImage()` to optimize gallery photos, passing results as props to Vue. Missing/failed images are skipped with a warning.
- **YAML imports**: `@rollup/plugin-yaml` (registered in `astro.config.ts`) allows direct `import` of `.yaml` files as objects. `env.d.ts` contains the necessary TypeScript module declaration.
- **Composables lifecycle**: All composables create resources in `onMounted` and clean up in `onUnmounted` — follow this pattern for new composables.

## Code Style

- **Prettier**: `singleQuote: true`, `semi: true`, `printWidth: 100`, `trailingComma: 'all'`, `tabWidth: 2`
- **ESLint**: `vue/multi-word-component-names: off` — single-word Vue component names are allowed
- **Astro inline scripts** (`**/*.astro/*.{js,ts}`): `no-var`, `no-empty`, `@typescript-eslint/no-unused-vars` are all **off** (pre-hydration scripts need `var` for hoisting)

## Git Hooks

- **pre-commit**: Husky + lint-staged — auto-runs `eslint --fix` and `prettier --write` on staged files

<!-- MANUAL ADDITIONS START -->

## Workflow

- When designing or implementing frontend work, use the `frontend-aesthetics-enforcer` subagent to review visual quality and avoid generic AI-style aesthetics.

<!-- MANUAL ADDITIONS END -->
