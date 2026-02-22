## ADDED Requirements

### Requirement: Clear command registration
The terminal SHALL recognize `clear` as a valid command (case-sensitive).

#### Scenario: Clear command is recognized
- **WHEN** the user types "clear" and presses Enter
- **THEN** the command is recognized and the clear sequence is triggered

### Requirement: Clear terminal content
Upon execution, the clear command SHALL animate all existing terminal body content (prompt lines, content boxes, command history) sliding upward and fading out, simulating a terminal clear operation.

#### Scenario: Content slides up and disappears
- **WHEN** the clear command is executed
- **THEN** all visible content within the terminal body animates upward (y offset) while fading to opacity 0 over approximately 0.3 seconds

### Requirement: Replay entry animation
After the terminal content has been cleared, the clear command SHALL replay the full 5-phase entry animation sequence (terminal fade-in skipped since terminal is already visible):
1. `$ whoami` types out character-by-character
2. Content box appears with avatar, name typing, title, and intro
3. `$ contact --list` types out
4. Social links appear sequentially

The replay SHALL use the same timing and easing as the original entry animation.

#### Scenario: Animation replays at original speed
- **WHEN** the clear animation begins replaying
- **THEN** the whoami typing, content reveal, contact typing, and social link stagger animations play with the same duration and easing as the initial page load animation

#### Scenario: State is fully reset before replay
- **WHEN** the clear command triggers a replay
- **THEN** all animation-related Vue refs (`whoamiChars`, `nameChars`, `contactChars`, `animationDone`) are reset to their initial values (0 or false), and all animated elements are set back to hidden via `gsap.set()` with `autoAlpha: 0`

### Requirement: Command history cleared on clear
The clear command SHALL remove any existing command history output before replaying the animation. After replay completes, the terminal SHALL return to idle state with a fresh input line.

#### Scenario: No command history after clear
- **WHEN** the clear command finishes replaying the entry animation
- **THEN** no previous command history lines are visible, and the terminal shows a fresh `$ █` input prompt in idle state
