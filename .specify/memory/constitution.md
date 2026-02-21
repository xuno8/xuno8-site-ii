<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Performance & Optimization Standards
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md — ✅ no update needed
      (Constitution Check section is generic; principles apply at
      review time)
    - .specify/templates/spec-template.md — ✅ no update needed
      (spec template is technology-agnostic by design)
    - .specify/templates/tasks-template.md — ✅ no update needed
      (task phases are generic; principle-driven tasks handled
      during task generation)
  Follow-up TODOs: none
-->

# xuno8-site-ii Constitution

## Core Principles

### I. Astro-First Page Architecture

Every page MUST be an Astro component (`.astro`) that owns layout,
routing, and static content. Astro islands architecture MUST be used
to deliver zero-JS by default — interactive regions are explicitly
opted in via `client:*` directives.

- Pages (`src/pages/`) MUST be `.astro` files; Vue components MUST
  NOT be used as top-level routes.
- Static content (headings, text, images, navigation chrome) MUST
  remain in Astro markup to avoid shipping unnecessary JavaScript.
- `client:visible` is the default hydration directive for interactive
  islands unless a specific directive is justified (e.g.,
  `client:load` for above-the-fold critical interactions,
  `client:idle` for deferred non-critical widgets).
- Each page MUST declare its `<Layout>` wrapper; ad-hoc `<html>`
  trees are prohibited.

**Rationale**: Astro's static-first model minimizes client-side
JavaScript. Enforcing `.astro` pages ensures consistent hydration
boundaries and prevents accidental full-page SPA behavior.

### II. Vue Composition API Component Standard

All interactive components MUST be Vue 3 Single-File Components
(`.vue`) using `<script setup>` with the Composition API. Options API
usage is prohibited.

- Every `.vue` file MUST use `<script setup lang="ts">`.
- Props MUST be declared with `defineProps<T>()` using TypeScript
  interfaces; runtime-only prop declarations are prohibited.
- Emits MUST be declared with `defineEmits<T>()`.
- Composables (`use*` functions in `src/composables/`) MUST be used
  for shared stateful logic; Vuex/Pinia stores are not permitted
  unless explicitly approved per-feature.
- Components MUST follow single-responsibility: one component, one
  concern. A component exceeding 200 lines of template + script
  SHOULD be decomposed.
- Scoped styles (`<style scoped>`) MUST be used unless global styles
  are explicitly required and documented.

**Rationale**: `<script setup>` with TypeScript provides superior
type inference, smaller bundle output, and a consistent API surface.
Banning Options API eliminates style drift across contributors.

### III. GSAP Animation Performance

All animations MUST use GSAP (GreenSock Animation Platform). CSS
transitions are permitted only for simple state changes (hover,
focus) that do not require sequencing or scroll-driven triggers.

- GSAP instances MUST be created inside `onMounted()` and killed
  inside `onUnmounted()` (or via `onBeforeUnmount()`). Leaked
  tweens/timelines are a critical defect.
- `ScrollTrigger` instances MUST call `ScrollTrigger.kill()` on
  component teardown.
- Animations MUST target `transform` and `opacity` properties
  exclusively to stay on the compositor thread. Animating `width`,
  `height`, `top`, `left`, `margin`, or `padding` is prohibited
  unless a layout animation is explicitly justified and approved.
- `will-change` MUST be applied to animated elements; it MUST be
  removed or set to `auto` after the animation completes for
  long-lived elements.
- All scroll-driven animations MUST respect `prefers-reduced-motion`:
  when the user has reduced motion enabled, animations MUST be
  replaced with instant state changes or disabled entirely.
- GSAP `ticker` and custom `requestAnimationFrame` loops MUST NOT
  run when the component is off-screen or unmounted.

**Rationale**: GSAP offers sub-frame precision and GPU-composited
performance, but misuse (leaked instances, layout-triggering
properties) causes jank and memory leaks. Strict lifecycle and
property rules prevent these issues.

### IV. Image Optimization Standards

All images MUST be served in modern formats with responsive sizing.
No unoptimized raster images in production builds.

- Source images MUST be placed in `src/assets/images/` and imported
  via Astro's `<Image>` component or `getImage()` API for automatic
  optimization.
- The `<img>` HTML tag MUST NOT be used directly; use Astro's
  `<Image>` or `<Picture>` components which handle format conversion
  (WebP/AVIF), `srcset` generation, and `width`/`height` attributes.
- Every image MUST have explicit `width` and `height` attributes (or
  `aspect-ratio` via CSS) to prevent Cumulative Layout Shift (CLS).
- Images below the fold MUST use `loading="lazy"` and
  `decoding="async"`.
- Above-the-fold hero/LCP images MUST use `loading="eager"`,
  `fetchpriority="high"`, and MUST be preloaded via
  `<link rel="preload">` in the page head when they are the Largest
  Contentful Paint element.
- SVG icons and logos MUST be inlined or used via an SVG sprite
  system; icon fonts are prohibited.
- Maximum image dimensions: source files MUST NOT exceed 4096px on
  the longest edge. Responsive `srcset` MUST provide at minimum
  three breakpoints (mobile, tablet, desktop).

**Rationale**: Unoptimized images are the primary cause of slow page
loads. Astro's built-in image pipeline automates format negotiation
and sizing, but only if images flow through the correct components.

### V. Performance Budgets & Web Vitals

Every page MUST meet Core Web Vitals thresholds as measured by
Lighthouse in a simulated mobile environment.

- **LCP** (Largest Contentful Paint): MUST be ≤ 2.5 seconds.
- **CLS** (Cumulative Layout Shift): MUST be ≤ 0.1.
- **INP** (Interaction to Next Paint): MUST be ≤ 200 milliseconds.
- Total page weight (transferred, compressed) MUST NOT exceed 500 KB
  for initial load on any page.
- JavaScript bundle size per island MUST NOT exceed 50 KB (gzipped).
  Islands exceeding this limit MUST be code-split or refactored.
- Third-party scripts MUST be loaded asynchronously and MUST NOT
  block the main thread for more than 50 ms.
- Font loading MUST use `font-display: swap` and MUST preload the
  primary font face.

**Rationale**: Web Vitals directly affect SEO ranking and user
experience. Setting numeric budgets makes violations objectively
detectable in CI and review.

## Performance & Optimization Standards

- Production builds MUST run `astro build` with default optimization
  (minification, tree-shaking, asset hashing) enabled.
- GSAP MUST be imported as a tree-shakeable ESM module; importing
  the full UMD bundle is prohibited.
- Unused Astro integrations and Vue plugins MUST be removed from
  `astro.config.*` and `package.json` before merging.
- `astro:assets` pipeline MUST be used for all static assets; manual
  `/public` directory placement is permitted only for files that
  require a stable URL (e.g., `robots.txt`, `favicon.ico`).
- CSS MUST be scoped or modular; global stylesheets MUST be limited
  to resets, typography tokens, and design-system custom properties.

## Development Workflow

- Component development MUST follow the Astro island boundary:
  build the static shell in `.astro` first, then extract interactive
  parts into `.vue` islands only when JavaScript is required.
- Pull requests that introduce a new Vue island MUST include a
  justification comment explaining why the interaction cannot be
  achieved with Astro alone or via CSS.
- Image assets added in a PR MUST pass through the `<Image>` /
  `<Picture>` component pipeline; direct `<img>` tags will be
  rejected in review.
- GSAP animation code MUST include cleanup logic visible in the same
  file; cleanup in a separate utility is prohibited to ensure
  co-location of create/destroy lifecycle.

## Governance

This constitution is the authoritative standard for the xuno8-site-ii
project. All code reviews and pull requests MUST verify compliance
with these principles.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and migration plan for existing
  code that may violate the new rule.
- **Versioning**: Constitution versions follow Semantic Versioning
  (MAJOR.MINOR.PATCH). MAJOR for principle removals or
  redefinitions, MINOR for new principles or material expansions,
  PATCH for clarifications and wording fixes.
- **Compliance Review**: Each pull request MUST include a
  self-assessment against the applicable principles. Reviewers MUST
  flag violations before approval.
- **Conflict Resolution**: If a principle conflicts with a
  third-party library requirement, the conflict MUST be documented
  in the PR description with a proposed exception. Exceptions
  require explicit approval.

**Version**: 1.0.0 | **Ratified**: 2026-02-21 | **Last Amended**: 2026-02-21
