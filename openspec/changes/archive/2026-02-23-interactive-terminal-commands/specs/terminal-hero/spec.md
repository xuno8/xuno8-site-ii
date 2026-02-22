## MODIFIED Requirements

### Requirement: Blinking cursor
A block cursor character (`█`) SHALL blink at the bottom of the terminal output after all animations complete, using accent color with a 1.2-second cycle (0.6s visible, 0.6s hidden) via CSS `steps()` animation.

On desktop viewports (>= 768px), the final cursor SHALL be part of an interactive input line that accepts keyboard input. The cursor SHALL appear immediately after any typed text (e.g., `$ matrix█`).

On mobile viewports (< 768px), the cursor SHALL remain a static blinking element with no input functionality, matching the original behavior.

#### Scenario: Cursor blinks after animation on desktop
- **WHEN** the entry animation sequence completes on a desktop viewport
- **THEN** a cyan block cursor blinks with a 1.2s period at the input line, and the terminal accepts keyboard input

#### Scenario: Cursor blinks after animation on mobile
- **WHEN** the entry animation sequence completes on a mobile viewport
- **THEN** a cyan block cursor blinks with a 1.2s period at the last line of the terminal, with no input functionality

#### Scenario: Cursor does not blink with reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** the cursor is displayed statically without blinking

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

The entry animation sequence SHALL be replayable — triggered by the `clear` command — by resetting all animation state and rebuilding the GSAP timeline.

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

#### Scenario: Animation replays via clear command
- **WHEN** the `clear` command is executed
- **THEN** all animation state is reset and the entry animation sequence replays from the beginning (skipping Phase 1 terminal fade-in since the terminal is already visible)
