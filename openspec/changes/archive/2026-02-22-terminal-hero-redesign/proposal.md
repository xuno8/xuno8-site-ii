## Why

The developer Hero section is visually plain — a standard name/title/intro layout with a fade-in animation. It lacks personality and does not convey a "developer" identity. Social links and contact info are buried in the footer, missing the opportunity for immediate engagement. Redesigning the Hero with a terminal-window theme creates a distinctive first impression that aligns with the developer mode's Tokyo Night aesthetic.

## What Changes

- Wrap the entire Hero section in a terminal window frame (title bar with traffic-light dots, border, shadow/glow)
- Introduce a `$ whoami` / `$ contact --list` command-line narrative to structure the content
- Add avatar (`ryou.png`) with a gradient border and subtle glow treatment
- Move social links (GitHub, LinkedIn, Instagram) and email into the Hero section with icon + label format
- Replace the simple GSAP fade-in with a multi-phase typing animation sequence (terminal boots → command types → content reveals → cursor blinks)
- Use `JetBrains Mono` as the primary display font for the name and terminal elements
- Simplify the Footer by removing social links and email (since they now live in Hero)
- Add a persistent blinking cursor animation at the end of the terminal output

## Non-goals

- Not building an interactive/functional terminal (no user input, no `help` command)
- Not changing the photographer mode Hero or any photographer-mode components
- Not modifying the site's color palette or theme system
- Not adding sound effects
- Not changing any content text (name, title, intro remain the same)

## Capabilities

### New Capabilities

- `terminal-hero`: Terminal-themed Hero section with window frame, typing animations, avatar display, and inline social/contact links

### Modified Capabilities

_None — the existing Hero has no formal spec. The footer social link removal is a layout concern handled in the design._

## Impact

- **Components**: `src/components/developer/Hero.vue` — full rewrite of template and animation logic
- **Components**: `src/components/shared/Footer.astro` — remove social links and email, keep copyright only
- **Page**: `src/pages/index.astro` — pass avatar image data and social links as props to Hero
- **Assets**: `src/assets/images/ryou.png` — processed via `getImage()` in index.astro
- **Data**: `src/data/site.yaml` — no changes needed (already has socialLinks and email)
- **Styles**: May add terminal-specific CSS custom properties or keyframe animations to `global.css`
- **Dependencies**: No new npm packages required (GSAP TextPlugin is part of the existing GSAP install)
