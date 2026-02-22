## MODIFIED Requirements

### Requirement: Entry animation sequence
The Hero SHALL play a 5-phase GSAP animation sequence on load:
1. Terminal window fades in (0.4s)
2. `$ whoami` types out character-by-character (0.4s)
3. Content block border appears (instant via call)
4. Avatar fades in + name types out + title/intro slide in (variable, name-length dependent)
5. `$ contact --list` types out + social links fade in sequentially (0.4s typing + staggered reveals)

Total animation duration SHALL complete within 3 seconds (varies slightly based on name length).

All animated elements (content box, avatar, title, intro, contact box, social links) SHALL be rendered in the DOM at all times. GSAP SHALL control their visibility via `autoAlpha` (combined `opacity` + `visibility`), with initial state set to invisible via `gsap.set()` at mount time.

The animation SHALL NOT use Vue reactive flags (`v-if`) to control element visibility during the animation sequence. Vue reactive refs SHALL only be used for typewriter text state (`whoamiChars`, `nameChars`, `contactChars`, `animationDone`).

#### Scenario: Animation plays on first load
- **WHEN** the page loads with motion enabled
- **THEN** the 5-phase animation sequence plays in order, completing within 3 seconds, with no layout shift or jank during element reveals

#### Scenario: Animation skipped with reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all content appears immediately without any animation; GSAP sets all elements to `autoAlpha: 1` and typewriter refs to their full length values

#### Scenario: No flash of unstyled content
- **WHEN** the page loads and JavaScript has not yet executed
- **THEN** animated elements SHALL be hidden via CSS defaults (`opacity: 0`) to prevent content flash before GSAP initializes

#### Scenario: Elements are non-interactive while hidden
- **WHEN** animated elements are in their initial hidden state (`autoAlpha: 0`)
- **THEN** they SHALL have `visibility: hidden` (managed by GSAP's `autoAlpha`), preventing click/focus interaction before they are revealed
