## ADDED Requirements

### Requirement: Icon dimmed at rest
Social link SVG icons SHALL display in `--color-text-muted` color at rest state, providing a clear visual distinction from the hover-active state.

#### Scenario: Icon resting color
- **WHEN** the social link is not hovered, focused, or active
- **THEN** the SVG icon color SHALL be `var(--color-text-muted)`

### Requirement: Unified hover brightening
On hover, all visual properties of the social link (icon color, text color, background, border, glow, transform) SHALL transition simultaneously using a single easing curve `cubic-bezier(0.22, 1, 0.36, 1)` with `0.2s` duration.

#### Scenario: Icon brightens on hover
- **WHEN** user hovers over a social link
- **THEN** the SVG icon color SHALL change to `var(--color-accent)`
- **AND** the icon SHALL display a dual-layer drop-shadow neon glow effect
- **AND** the icon SHALL scale to `1.1`

#### Scenario: Text brightens on hover
- **WHEN** user hovers over a social link
- **THEN** the text color SHALL change to `var(--color-accent-hover)`

#### Scenario: All transitions are synchronized
- **WHEN** user hovers over a social link
- **THEN** icon color, text color, background, border-color, transform, and filter SHALL all use `cubic-bezier(0.22, 1, 0.36, 1)` easing with `0.2s` duration

### Requirement: Hover spatial feedback
Social links SHALL translate horizontally by `2px` on hover, providing spatial feedback consistent with terminal command-selection behavior.

#### Scenario: Link translates on hover
- **WHEN** user hovers over a social link
- **THEN** the link SHALL apply `transform: translateX(2px)`

#### Scenario: Link returns to origin on unhover
- **WHEN** user moves cursor away from a hovered social link
- **THEN** the link SHALL smoothly transition back to `translateX(0)`

### Requirement: Hover border activation
The left border of social links SHALL change from transparent to accent color on hover.

#### Scenario: Border appears on hover
- **WHEN** user hovers over a social link
- **THEN** the `border-left-color` SHALL change to `var(--color-accent)`

### Requirement: Hover background gradient
On hover, social links SHALL display a horizontal gradient background that fades from stronger accent tint on the left to weaker tint on the right.

#### Scenario: Gradient background on hover
- **WHEN** user hovers over a social link
- **THEN** the background SHALL be a `linear-gradient(90deg)` from approximately 12% accent opacity to approximately 3% accent opacity

### Requirement: Stagger fade-in transition
Social links SHALL fade in smoothly when revealed by the stagger animation, instead of appearing instantly.

#### Scenario: Link fades in on reveal
- **WHEN** a social link becomes visible (`.link-visible` class applied)
- **THEN** the opacity SHALL transition from `0` to `1` using `0.3s` duration

### Requirement: Focus-visible state
Social links SHALL provide a visible focus indicator for keyboard navigation.

#### Scenario: Keyboard focus indicator
- **WHEN** a social link receives focus via keyboard navigation
- **THEN** the link SHALL display an outline of `2px solid var(--color-accent)` with `2px` offset
- **AND** the background SHALL show an accent tint

### Requirement: Active press feedback
Social links SHALL provide tactile feedback when clicked.

#### Scenario: Press effect on click
- **WHEN** user presses (mousedown/touch) on a social link
- **THEN** the link SHALL apply `transform: translateX(1px) scale(0.98)`
- **AND** the background accent tint SHALL intensify

### Requirement: Reduced motion support
All hover/focus/active animations SHALL be disabled when user prefers reduced motion.

#### Scenario: No animation with reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all transitions and transforms on social links SHALL be disabled
- **AND** hover/focus state changes SHALL still apply (colors, background) but without animation
