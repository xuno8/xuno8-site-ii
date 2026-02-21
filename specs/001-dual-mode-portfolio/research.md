# Research: Dual-Mode Portfolio Website

**Feature**: `001-dual-mode-portfolio` | **Date**: 2026-02-21

## 1. Astro + Vue 3 Integration

**Decision**: Use `@astrojs/vue` (v5.x) official integration with Islands Architecture.

**Rationale**: First-class Astro support, automatic SSR + selective hydration, powered by `@vitejs/plugin-vue`. Install via `npx astro add vue` for auto-configuration. All Vue islands must use `client:*` directives — `client:visible` as default per Constitution I, `client:load` only for above-the-fold critical interactions (mode toggle).

**Alternatives considered**:
- Manual Vite plugin config — rejected: less integrated, no auto-hydration support.
- React/Svelte islands — rejected: Constitution mandates Vue 3 with Composition API.

## 2. UnoCSS with Attributify Mode

**Decision**: Use `@unocss/astro` integration with `preset-attributify` + `preset-uno`.

**Rationale**: On-demand atomic CSS generation with zero runtime. Attributify mode improves HTML readability by allowing `bg="blue-400"` syntax instead of long class strings. Compatible with Astro's Vite pipeline. Import as `unocss/astro` (not `@unocss/astro`) in config.

**Vue SFC compatibility**: UnoCSS supports `scoped-vue` mode for injecting generated CSS into Vue SFC `<style scoped>` blocks, maintaining component isolation per Constitution II.

**Known issues**:
- Avoid `@apply` with `important` mode in scoped styles — use inline utilities instead.
- Dynamic class names in `<script>` require `safelist` entries.

**Alternatives considered**:
- Tailwind CSS — rejected: heavier, slower builds, no native attributify mode.
- Windi CSS — rejected: deprecated in favor of UnoCSS.

## 3. Nanostores for Global State

**Decision**: Use `nanostores` + `@nanostores/vue` for the mode toggle state.

**Rationale**: 286 bytes core, framework-agnostic, works across Astro/Vue boundaries. Vue integration via `useStore()` composable with full reactivity. Ideal for sharing a single `atom<'developer' | 'photographer'>` between multiple islands without prop drilling.

**Implementation pattern**:
- `src/stores/mode.ts` exports `currentMode` atom.
- Vue islands subscribe via `useStore(currentMode)`.
- Astro components read server-side value via `currentMode.get()`.
- Mode persistence: subscribe to changes, write to `localStorage`; on init, read from `localStorage` before first render.

**Alternatives considered**:
- Pinia — rejected: Vue-only, cannot share state with Astro components.
- Custom events — rejected: fragile, no reactivity, harder to test.
- Vuex — rejected: prohibited by Constitution II (composables preferred).

## 4. GSAP Animation Strategy

**Decision**: Use GSAP 3.14 with ESM tree-shakeable imports. Register ScrollTrigger and Flip plugins.

**Rationale**: Constitution III mandates GSAP for all non-trivial animations. ESM import (`import gsap from 'gsap'`) enables tree-shaking. `gsap.registerPlugin()` prevents plugins from being removed.

**Key plugins**:
- **ScrollTrigger**: Scroll-based reveal animations for developer sections and gallery items.
- **Flip**: Layout transition animations for mode switching — capture state before, apply changes, animate from previous state.

**Lifecycle management** (per Constitution III):
- Create GSAP instances in `onMounted()`.
- Kill all instances in `onUnmounted()` via `gsap.context().revert()`.
- Use `useGsapContext` composable to standardize create/destroy.
- `will-change` applied before animation, reset to `auto` after completion.
- Only animate `transform` and `opacity` (compositor-thread properties).

**Reduced motion** (per FR-010, Constitution III):
- Detect `prefers-reduced-motion` via `useReducedMotion` composable.
- When enabled: `gsap.to()` duration set to 0 (instant state change).

**Alternatives considered**:
- Motion One — rejected: less mature, no Flip equivalent.
- CSS animations — rejected: Constitution III prohibits for sequenced/scroll-driven animations.
- Anime.js — rejected: smaller community, less performant for complex timelines.

## 5. Masonry Layout Approach

**Decision**: CSS `columns` for layout structure + GSAP for scroll-reveal animations and mode-transition effects.

**Rationale**: CSS-column masonry provides native browser performance with zero JavaScript layout overhead. GSAP adds visual polish (staggered reveals via `ScrollTrigger.batch()`, Flip transitions during mode switch) without affecting layout computation. This hybrid approach delivers the best CLS score (pure CSS layout reserves space) while meeting Constitution V performance budgets.

**Implementation**:
```css
.masonry-grid {
  columns: 3 280px;  /* 3 columns, min 280px each */
  column-gap: 1rem;
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}
```
- Responsive: column count adjusts naturally via `columns` shorthand.
- GSAP `ScrollTrigger.batch('.masonry-item', ...)` for staggered reveal.
- GSAP `Flip.from()` for mode transition animation.

**Alternatives considered**:
- Pure GSAP positioning — rejected: JavaScript layout overhead, worse CLS.
- Masonry.js — rejected: unnecessary dependency, heavier.
- CSS Grid `masonry` (experimental) — rejected: insufficient browser support.

## 6. Image Optimization Pipeline

**Decision**: Use Astro built-in `astro:assets` with `<Image>` / `<Picture>` components.

**Rationale**: Constitution IV mandates this pipeline. Build-time optimization auto-generates WebP/AVIF formats, responsive `srcset`, and enforces `width`/`height` for CLS prevention. No additional packages needed.

**Image storage**: `src/assets/images/gallery/` — source files ≤ 4096px longest edge (Constitution IV).

**Loading strategy**:
- Gallery images: `loading="lazy"` + `decoding="async"` (below fold).
- Hero avatar/visual: `loading="eager"` + `fetchpriority="high"` + `<link rel="preload">` (LCP element).
- Responsive breakpoints: 3 sizes minimum — 400px (mobile), 800px (tablet), 1200px (desktop).

**Alternatives considered**:
- Cloudinary/CDN — rejected: spec requires in-repo images, adds external dependency.
- Manual `<img>` tags — rejected: Constitution IV prohibits raw `<img>`.

## 7. Dual-Tone Theme Switching

**Decision**: Use `data-theme` attribute on `<html>` element with CSS custom properties.

**Rationale**: The `data-theme="developer"` / `data-theme="photographer"` attribute drives theme via CSS custom properties (e.g., `--color-bg`, `--color-text`). GSAP animates the visual transition while the attribute swap applies the new token values. This approach is compatible with UnoCSS's `@dark` variant and avoids class-name conflicts.

**Implementation**:
- Define theme tokens in `global.css` under `[data-theme="developer"]` and `[data-theme="photographer"]` selectors.
- GSAP timeline: fade out current content → swap `data-theme` attribute → fade in new content.
- No flash of wrong theme: server renders with `data-theme="developer"` (default), client-side reads localStorage before hydration.

**Alternatives considered**:
- CSS `prefers-color-scheme` — rejected: this is mode-based, not OS dark mode.
- Toggling CSS classes — rejected: `data-theme` is semantically clearer, avoids utility class conflicts.

## 8. Deployment Configuration

**Decision**: Vercel via `@astrojs/vercel` adapter.

**Rationale**: Spec clarification mandates Vercel. The adapter provides automatic CDN, preview deployments, and edge function support. Static output mode (`output: 'static'`) is sufficient since the site has no server-side rendering needs at request time.

**Alternatives considered**:
- Netlify — rejected: spec mandates Vercel.
- Cloudflare Pages — rejected: spec mandates Vercel.

## 9. SEO Strategy

**Decision**: Fixed meta tags in `Layout.astro` pointing to Developer Mode content.

**Rationale**: FR-016 requires SEO/OG data fixed to Developer Mode (name, title, skills summary) regardless of active mode. Since the site is statically generated, meta tags are baked into the HTML at build time. No dynamic meta tag swapping needed.

**Implementation**: `Layout.astro` reads `site.yaml` for name/title/intro and renders `<meta>` and `<meta property="og:*">` tags.

## 10. Mode Persistence

**Decision**: `localStorage` with pre-hydration script.

**Rationale**: FR-008 requires cross-session mode persistence. A small inline `<script>` in `Layout.astro` (before Vue hydrates) reads `localStorage` and sets `data-theme` + initializes the Nanostores atom. This prevents flash of wrong mode (SC-006).

**Implementation**:
- Inline script: `<script is:inline>` in `<head>` — reads `localStorage.getItem('portfolio-mode')`, sets `document.documentElement.dataset.theme`, and exposes value for Nanostores init.
- Nanostores: `currentMode` atom initialized from the pre-read value or defaults to `'developer'`.
- On toggle: `currentMode.listen()` writes to `localStorage`.
