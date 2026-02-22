## ADDED Requirements

### Requirement: Terminal window frame
The Hero section SHALL be wrapped in a terminal window frame consisting of a title bar and a bordered content area.

The title bar SHALL display three colored dots (red `#ff5f57`, yellow `#febc2e`, green `#28c840`) on the left side and the text `tim@xuno8: ~` in JetBrains Mono at 13px in muted color (`--color-text-muted`).

The terminal frame SHALL have `border-radius: 12px`, a `1px solid var(--color-border)` border, and a multi-layer box-shadow (deep shadow + subtle cyan outline glow + diffuse atmospheric glow).

#### Scenario: Terminal frame renders on desktop
- **WHEN** the page loads at viewport width >= 768px
- **THEN** the terminal frame renders with max-width 720px, offset slightly left of center via `transform: translateX(-10px)`, with 48px internal padding

#### Scenario: Terminal frame renders on mobile
- **WHEN** the page loads at viewport width < 768px
- **THEN** the terminal frame renders at full width with 16px horizontal margin, no horizontal offset, and 24px internal padding

### Requirement: Command-line narrative structure
The Hero content SHALL be structured as terminal command output, using `$ whoami` to introduce the personal info section and `$ contact --list` to introduce the social links section.

Command prompt text SHALL be rendered in JetBrains Mono 500 at 15px in accent color (`--color-accent`) with a subtle text-shadow glow.

#### Scenario: Command prompts are visible
- **WHEN** the Hero section is fully loaded and animations complete
- **THEN** `$ whoami` appears above the personal info block and `$ contact --list` appears above the social links block

### Requirement: Avatar display
The Hero SHALL display the avatar image (`ryou.png`) at 80px × 80px on desktop and 64px × 64px on mobile, with `border-radius: 8px`.

The avatar SHALL have a gradient border (cyan `#7dcfff` to purple `#bb9af7` at 135deg) implemented via the background-clip technique, and a layered box-shadow glow.

#### Scenario: Avatar renders on desktop
- **WHEN** the page loads at viewport width >= 768px
- **THEN** the avatar renders left-aligned within the whoami content block, with the name and title positioned to its right

#### Scenario: Avatar renders on mobile
- **WHEN** the page loads at viewport width < 768px
- **THEN** the avatar renders centered above the name and title

#### Scenario: Avatar hover effect
- **WHEN** the user hovers over the avatar
- **THEN** the avatar scales to 1.05 and rotates 2deg with a bouncy easing, and glow intensity increases

### Requirement: Name typography
The name (`Tim Lin`) SHALL be rendered in JetBrains Mono 500 at 32px (desktop) / 28px (mobile) with letter-spacing `0.05em` and a faint purple text-shadow glow.

#### Scenario: Name renders with correct typography
- **WHEN** the Hero section is visible
- **THEN** the name text uses JetBrains Mono with 500 weight, primary text color (`--color-text`), and wide letter-spacing

### Requirement: Title typography
The title (`Full-Stack Software Engineer`) SHALL be rendered in Figtree 400 at 16px (desktop) / 15px (mobile) in accent color (`--color-accent`), with `text-transform: uppercase`.

#### Scenario: Title renders below name
- **WHEN** the Hero section is visible
- **THEN** the title appears 8px below the name in uppercase, accent-colored Figtree font

### Requirement: Intro text
The intro paragraph SHALL be rendered in Figtree 400 at 15px (desktop) / 14px (mobile) in primary text color at 0.9 opacity, with line-height 1.7.

#### Scenario: Intro renders below title
- **WHEN** the Hero section is visible
- **THEN** the intro paragraph appears 20px below the title with generous line-height for readability

### Requirement: Social links in Hero
The Hero SHALL display social links (GitHub, LinkedIn, Instagram) with SVG icons and text labels, plus an email link with a mail icon.

On desktop, social links SHALL be arranged in a horizontal row with 32px column gaps and 4px row gaps (using `gap: 4px 32px` to allow wrapping). On mobile, they SHALL stack vertically with 4px gaps.

Each link SHALL open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

#### Scenario: Social links render on desktop
- **WHEN** the page loads at viewport width >= 768px
- **THEN** GitHub, LinkedIn, and Instagram links render in a horizontal row with icons and labels, with the email link on a separate line below

#### Scenario: Social links render on mobile
- **WHEN** the page loads at viewport width < 768px
- **THEN** all social links and email render in a vertical stack

#### Scenario: Social link hover
- **WHEN** the user hovers over a social link
- **THEN** the link shows a subtle background highlight and a left border accent in cyan, with icon glow via drop-shadow filter

### Requirement: Blinking cursor
A block cursor character (`█`) SHALL blink at the bottom of the terminal output after all animations complete, using accent color with a 1.2-second cycle (0.6s visible, 0.6s hidden) via CSS `steps()` animation.

On desktop viewports (>= 768px), the final cursor SHALL be part of an interactive input line that accepts keyboard input. The cursor SHALL appear immediately after any typed text (e.g., `$ clear█`).

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

### Requirement: Footer simplification
The Footer SHALL be simplified to display only the copyright line (`© {year} Tim Lin`). Social links and email SHALL be removed from the Footer since they now appear in the Hero.

#### Scenario: Footer shows only copyright
- **WHEN** the page renders
- **THEN** the Footer contains only the copyright text, with no social link icons or email address

### Requirement: Accessibility
All interactive elements (social links, email link) SHALL have accessible labels. Social link icons SHALL have appropriate `aria-label` attributes. Touch targets SHALL be at least 44px in height on mobile.

#### Scenario: Screen reader announces social links
- **WHEN** a screen reader encounters the social links
- **THEN** each link is announced with its platform name (e.g., "GitHub", "LinkedIn")

#### Scenario: Touch targets are accessible on mobile
- **WHEN** the page is viewed on a touch device
- **THEN** all interactive links have a minimum touch target of 44px height
