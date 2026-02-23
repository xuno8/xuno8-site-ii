## Context

The site uses a dual-mode architecture (developer / photographer) driven by a Nanostores atom (`currentMode`) and a `data-theme` attribute on `<html>`. The current `Layout.astro` has a pre-hydration inline script that reads the persisted mode from `localStorage` and sets `data-theme` before first paint. There is currently no favicon and the `<title>` is static.

## Goals / Non-Goals

**Goals:**
- Provide a mode-appropriate SVG favicon that switches instantly on mode toggle.
- Update `document.title` to match the active mode on both initial load and mode switch.
- Zero layout shift or flash of wrong icon on page load.

**Non-Goals:**
- PNG/ICO fallbacks for older browsers.
- Apple Touch or PWA manifest icons.
- Dynamic OG/SEO meta tags (remain static for crawlers).

## Decisions

### 1. Inline SVG data URI for favicon

**Choice:** Encode both SVG icons as data URIs and swap the `<link rel="icon">` href via JavaScript.

**Rationale:** SVG data URIs avoid extra network requests and are supported by all modern browsers. Since the icons are simple (< 1 KB each), embedding them as data URIs keeps the solution self-contained with no additional files in `public/`.

**Alternative considered:** Placing two `.svg` files in `public/` and switching the href path. This works but adds files and a network request on switch. The data URI approach is simpler for small icons.

### 2. Extend the existing pre-hydration script

**Choice:** Add favicon and title initialization directly in the existing `<script is:inline>` block in `Layout.astro`.

**Rationale:** This script already runs synchronously before hydration to set `data-theme`. Adding favicon/title logic here ensures the correct values are set before any paint, preventing flicker. No additional script tag or loading overhead.

### 3. Mode store listener for runtime updates

**Choice:** Add a `currentMode.listen()` callback in `mode.ts` (or a new small module) that updates `document.title` and the favicon `<link>` element whenever the mode changes.

**Rationale:** The store already has a listener pattern for persisting mode to `localStorage`. Adding favicon/title updates to the same pattern keeps runtime switching consistent and centralized.

**Alternative considered:** Handling updates in the `ModeToggle.vue` component. This would work but couples DOM-level concerns (favicon, title) to a specific Vue island, making it fragile if the toggle component changes.

### 4. Icon design

**Choice:**
- Developer: `</>` code bracket symbol — clean, universally recognized as "code."
- Photographer: Camera aperture/shutter blades — distinct from code, immediately associated with photography.

Both icons will use the respective theme's primary color from CSS custom properties, but since favicon SVGs cannot reference page CSS, the colors will be hardcoded in the SVG strings matching the theme palette.

## Risks / Trade-offs

- **[SVG favicon not supported in very old browsers]** → Acceptable; the site already requires modern browser features (Nanostores, CSS custom properties). The tab will simply show no favicon, which is the current state anyway.
- **[Hardcoded colors in SVG]** → If theme colors change, the SVG data URIs must be updated manually. Mitigation: colors are defined as constants alongside the SVGs for easy maintenance.
