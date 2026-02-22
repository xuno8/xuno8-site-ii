## Context

The current developer Hero (`src/components/developer/Hero.vue`) is a simple layout: optional avatar + name + title + intro text, wrapped in a section with a decorative blur circle. It uses a basic GSAP fade-in animation. Social links and email live exclusively in the Footer.

The redesign wraps the Hero in a terminal window metaphor with a `$ whoami` / `$ contact --list` command-line narrative, adds the avatar (`ryou.png`), moves social/contact links into the Hero, and replaces the fade-in with a multi-phase typing animation sequence.

The site uses Astro 5 + Vue 3 islands. Images must be processed via `getImage()` in `.astro` files and passed as props. GSAP animations use the `useGsapContext` composable for lifecycle management. The developer theme uses Tokyo Night colors driven by CSS custom properties.

## Goals / Non-Goals

**Goals:**
- Create a terminal-themed Hero that conveys developer identity at first glance
- Deliver a multi-phase entry animation (terminal boot → typing → content reveal → cursor blink)
- Display avatar, social links (with icons), and email directly in the Hero
- Maintain accessibility (prefers-reduced-motion, semantic HTML, touch targets)
- Keep the component self-contained within the existing Astro/Vue island architecture

**Non-Goals:**
- No interactive/functional terminal (no user input handling)
- No changes to photographer mode
- No new npm dependencies
- No changes to the theme color system

## Decisions

### D1: Terminal frame implemented as CSS, not SVG

**Decision**: Build the terminal window frame (title bar, borders, shadow) using CSS with HTML divs, not SVG or canvas.

**Rationale**: CSS is simpler to maintain, responsive by default, and aligns with the existing styling approach. SVG would add complexity for no benefit since the frame is rectilinear. Box-drawing characters (`┌─┐│└┘`) for inner content boxes are rendered as styled text elements, not actual border drawings.

**Alternatives considered**:
- SVG frame: More control over path animations but overkill for a rectangular window
- Canvas: Unnecessary complexity, breaks SSR/SSG

### D2: Content boxes use CSS borders styled to look like box-drawing characters

**Decision**: Use CSS `border` with `border-color: var(--color-border)` and reduced opacity to evoke box-drawing character aesthetics, rather than actual Unicode box-drawing characters in the DOM.

**Rationale**: Real box-drawing characters are fragile across fonts and screen sizes. CSS borders achieve the same visual effect with reliable rendering. The `border-radius: 4px` with `opacity: 0.6` on borders creates the subtle terminal feel.

### D3: Typing animation via GSAP timeline with manual text reveal

**Decision**: Implement typing by animating a `maxChars` reactive ref that controls how many characters of each string are shown via computed substring, orchestrated in a GSAP timeline.

**Rationale**: GSAP's TextPlugin requires a separate registration and overwrites innerHTML. A reactive character count is simpler, works natively with Vue's reactivity, and gives precise control over timing within the GSAP timeline. The cursor position naturally follows the last visible character.

### D4: Props interface expansion — Hero receives social links and avatar data

**Decision**: Expand the Hero component's props to accept `socialLinks`, `email`, and processed avatar image data. The parent `.astro` file processes `ryou.png` via `getImage()` and passes the result.

**Rationale**: Follows the established pattern — Astro handles image optimization, Vue receives pre-processed data. Social link data already exists in `site.yaml`, just needs to be passed through.

### D5: Terminal window offset — CSS transform, not margin

**Decision**: Achieve the 20px left-of-center offset using `transform: translateX(-10px)` on the terminal container, not asymmetric margins.

**Rationale**: Transform doesn't affect layout flow, avoiding unexpected spacing issues with surrounding sections. The offset is purely visual.

### D6: Avatar shape — slightly rounded rectangle, not circle

**Decision**: Use `border-radius: 8px` with a cyan-to-purple gradient border and layered box-shadow glow.

**Rationale**: Circles are overused in portfolio sites. A subtle rounded rectangle is more distinctive and fits the terminal's rectilinear aesthetic. The gradient border uses the `background-clip` trick (padding-box for inner bg, border-box for gradient).

### D7: Footer simplified in-place, not extracted

**Decision**: Remove social links and email from `Footer.astro` directly, keeping only the copyright line. No new component needed.

**Rationale**: The footer becomes minimal (just `© 2026 Tim Lin`). Creating a separate component for one line would be over-engineering.

## Risks / Trade-offs

**[Risk] Typing animation feels slow on repeat visits** → The animation plays every page load. Mitigation: Keep total sequence under 3 seconds. Future enhancement (not in scope): detect return visitors via sessionStorage and skip to final state.

**[Risk] GSAP TextPlugin assumption** → We're NOT using TextPlugin, using manual character counting instead. No risk of missing plugin.

**[Risk] Box-drawing chars fallback** → We're using CSS borders, not Unicode chars. No font fallback risk.

**[Risk] Avatar image not found at build time** → `getImage()` will throw if `ryou.png` is missing from `src/assets/images/`. Mitigation: The file already exists at this path.

**[Trade-off] Terminal offset may look unintentional on very wide screens** → On screens >1440px, the 10px offset relative to center is barely noticeable. Acceptable — the effect is strongest at typical viewport widths (1024–1440px).

**[Trade-off] Mobile stacked layout loses some terminal "magic"** → On mobile, the terminal window fills the width and content stacks vertically. The typing animation still works, but the asymmetric offset is removed. Acceptable trade-off for usability.
