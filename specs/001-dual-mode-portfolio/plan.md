# Implementation Plan: Dual-Mode Portfolio Website

**Branch**: `001-dual-mode-portfolio` | **Date**: 2026-02-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dual-mode-portfolio/spec.md`

## Summary

Build a single-page portfolio website with two switchable display modes — Developer Mode (structured resume) and Photographer Mode (immersive masonry gallery). The site uses Astro SSG with Vue 3 interactive islands, UnoCSS (Attributify) for styling, Nanostores for cross-island state, and GSAP for all animations including the mode transition. A `data-theme` attribute on the root element drives the dual-tone color scheme. All content is sourced from YAML data files, and images are optimized at build time via `astro:assets`.

## Technical Context

**Language/Version**: TypeScript 5.x (via Astro 5.x)
**Primary Dependencies**: Astro 5.x, Vue 3 (`@astrojs/vue`), UnoCSS (`@unocss/astro` + `preset-attributify` + `preset-uno`), Nanostores (`nanostores` + `@nanostores/vue`), GSAP 3.14 (`gsap` — ScrollTrigger, Flip plugins)
**Storage**: N/A — static site; content from YAML data files; images from `src/assets/images/`
**Testing**: Vitest (unit), Playwright (e2e / visual regression)
**Target Platform**: Web — deployed to Vercel via `@astrojs/vercel` adapter
**Project Type**: Web (frontend-only static site)
**Performance Goals**: 60fps mode transitions, LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (Constitution V)
**Constraints**: <500KB initial page weight (compressed), <50KB per island (gzipped), Lighthouse accessibility ≥ 90 (Constitution V)
**Scale/Scope**: Single page, 20–50 photographs, ~6 content sections (Hero, Experience, Skills, Projects, Gallery, Footer)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **I. Astro-First Page Architecture** | ✅ Pass | `src/pages/index.astro` owns routing/layout. Vue components used only as interactive islands with `client:*` directives. Static content stays in Astro markup. |
| **II. Vue Composition API Standard** | ✅ Pass | All `.vue` files use `<script setup lang="ts">`, `defineProps<T>()`, `defineEmits<T>()`. Composables in `src/composables/`. Scoped styles used. |
| **III. GSAP Animation Performance** | ✅ Pass | GSAP for all mode transitions and scroll animations. CSS only for hover/focus. GSAP instances created in `onMounted()`, killed in `onUnmounted()`. `will-change` applied/removed properly. `prefers-reduced-motion` respected. Only `transform`/`opacity` animated. |
| **IV. Image Optimization Standards** | ✅ Pass | Images in `src/assets/images/`. Astro `<Image>` / `<Picture>` components used exclusively. Explicit `width`/`height`. `loading="lazy"` below fold, `loading="eager"` + `fetchpriority="high"` for hero LCP. No raw `<img>` tags. |
| **V. Performance Budgets & Web Vitals** | ✅ Pass | LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms targets set. <500KB page weight. <50KB per island. GSAP imported as tree-shakeable ESM. `font-display: swap` enforced. |

**Gate result: PASS — no violations. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-dual-mode-portfolio/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── data-schemas.ts  # TypeScript interfaces for YAML data contracts
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── assets/
│   └── images/
│       └── gallery/              # Photography source images (20-50)
├── components/
│   ├── developer/                # Developer Mode Vue islands
│   │   ├── Hero.vue              # Name, title, intro, avatar
│   │   ├── ExperienceTimeline.vue # Work experience entries
│   │   ├── SkillsGrid.vue        # Skills grouped by category
│   │   ├── ProjectCards.vue       # Featured project entries
│   │   └── SectionNav.vue         # Floating dot indicator
│   ├── photographer/             # Photographer Mode Vue islands
│   │   ├── MasonryGallery.vue     # CSS-column masonry + GSAP reveals
│   │   └── Lightbox.vue           # Full-screen image viewer
│   └── shared/                   # Cross-mode components
│       ├── ModeToggle.vue         # Toggle switch (primary interaction)
│       ├── Navbar.astro           # Fixed top navigation bar (static shell)
│       └── Footer.astro           # Shared footer (static shell)
├── composables/
│   ├── useGsapContext.ts          # GSAP lifecycle (create/kill)
│   ├── useModeTransition.ts       # GSAP timeline for mode switch
│   ├── useReducedMotion.ts        # prefers-reduced-motion detection
│   └── useLightbox.ts             # Lightbox state & navigation
├── data/
│   ├── site.yaml                  # Site-wide: name, title, intro, social links
│   ├── experience.yaml            # Work experience entries
│   ├── projects.yaml              # Software project entries
│   ├── skills.yaml                # Technical skills by category
│   └── photos.yaml                # Photo metadata (caption, date, location, camera)
├── layouts/
│   └── Layout.astro               # Base HTML shell, <head>, font preloads, SEO
├── pages/
│   └── index.astro                # Single page — assembles all sections
├── stores/
│   └── mode.ts                    # Nanostores atom: 'developer' | 'photographer'
├── styles/
│   └── global.css                 # Reset, typography tokens, CSS custom properties
├── types/
│   └── index.ts                   # Shared TypeScript interfaces
└── utils/
    └── data.ts                    # YAML loading helpers

tests/
├── e2e/
│   ├── mode-switch.spec.ts        # Mode toggle + animation
│   ├── gallery.spec.ts            # Masonry + lightbox
│   └── responsive.spec.ts         # Viewport breakpoints
└── unit/
    ├── stores/
    │   └── mode.test.ts           # Nanostores mode logic
    └── utils/
        └── data.test.ts           # YAML loading
```

**Structure Decision**: Single-project frontend layout following Astro conventions. No backend; all content is static YAML + images processed at build time. Vue components are interactive islands hydrated selectively. Test directory at root level, split into e2e (Playwright) and unit (Vitest).

## Complexity Tracking

No Constitution violations detected — this section is intentionally empty.
