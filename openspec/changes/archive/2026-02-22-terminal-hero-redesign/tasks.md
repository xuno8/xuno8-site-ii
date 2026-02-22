## 1. Astro Layer — Image Processing & Props Wiring

- [x] 1.1 Process `ryou.png` via `getImage()` in `src/pages/index.astro` and pass optimized avatar data (src, width, height) as props to Hero component
- [x] 1.2 Pass `site.socialLinks` and `site.email` as props to Hero component in `src/pages/index.astro`

## 2. Hero Component — Terminal Frame Structure

- [x] 2.1 Rewrite `Hero.vue` template: add terminal window frame with title bar (traffic-light dots, `tim@xuno8: ~` title text)
- [x] 2.2 Add `$ whoami` command prompt section containing avatar + name + title + intro, laid out with CSS flexbox (side-by-side on desktop, stacked on mobile)
- [x] 2.3 Add `$ contact --list` command prompt section containing social links with SVG icons + labels and email link
- [x] 2.4 Add blinking cursor element (`█`) at the bottom of the terminal output
- [x] 2.5 Update Hero component props interface to accept `socialLinks: SocialLink[]`, `email: string`, and avatar image data

## 3. Hero Component — Styling

- [x] 3.1 Style terminal frame: border, border-radius, multi-layer box-shadow (deep shadow + cyan outline + diffuse glow), title bar gradient background
- [x] 3.2 Style title bar: traffic-light dots with correct colors and subtle glow on close dot, muted monospace title text
- [x] 3.3 Style avatar: 80px desktop / 64px mobile, border-radius 8px, gradient border (cyan→purple via background-clip), layered box-shadow glow, hover scale+rotate effect
- [x] 3.4 Style name typography: JetBrains Mono 500, 32px/28px, letter-spacing 0.05em, faint purple text-shadow
- [x] 3.5 Style title typography: Figtree 400, 16px/15px, uppercase, accent color
- [x] 3.6 Style intro text: Figtree 400, 15px/14px, opacity 0.9, line-height 1.7
- [x] 3.7 Style command prompts: JetBrains Mono 500, 15px, accent color, subtle text-shadow glow
- [x] 3.8 Style social links: icon + label layout, horizontal row (desktop) / vertical stack (mobile), hover state with background highlight and left border accent
- [x] 3.9 Style blinking cursor: accent color, CSS `steps()` animation with 1.2s cycle
- [x] 3.10 Add responsive breakpoint styles: terminal padding, avatar size, layout direction, social link flow, title bar simplification on mobile
- [x] 3.11 Apply desktop terminal offset: `transform: translateX(-10px)` on the terminal container (desktop only)

## 4. Hero Component — Animation

- [x] 4.1 Implement 5-phase GSAP timeline using `useGsapContext`: terminal fade-in → `$ whoami` typing → content block reveal → avatar/name/title/intro staggered entrance → `$ contact --list` typing + links reveal
- [x] 4.2 Implement typing effect via reactive `maxChars` ref with computed substring for `$ whoami`, name, and `$ contact --list` text
- [x] 4.3 Add `prefers-reduced-motion` check: skip all animations and show content immediately when reduced motion is preferred; cursor displays statically without blinking

## 5. Footer Simplification

- [x] 5.1 Modify `src/components/shared/Footer.astro`: remove social links icons and email link, keep only copyright line (`© {year} Tim Lin`)

## 6. Verification

- [x] 6.1 Verify desktop layout: terminal frame renders with offset, avatar left-aligned, social links horizontal, all typography specs match
- [x] 6.2 Verify mobile layout: terminal full-width, avatar centered, social links stacked, padding reduced
- [x] 6.3 Verify animation sequence plays correctly and completes within 3 seconds
- [x] 6.4 Verify reduced motion: all content visible immediately, no animations, cursor static
- [x] 6.5 Verify social links open in new tab with correct URLs and accessible labels
- [x] 6.6 Run `npm run build` to confirm no build errors
