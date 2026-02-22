## Why

The Hero terminal's blinking cursor at the bottom is purely decorative. Transforming it into a functional input line turns the terminal from a passive animation into an interactive experience — visitors can type commands and trigger visual effects, creating a memorable first impression that reinforces the developer persona.

## What Changes

- Replace the static final cursor (`$ █`) with a functional input line that captures keyboard input on desktop
- Add a hidden `<input>` element that activates on click/focus within the terminal area
- Implement the `clear` built-in command — wipes the terminal and replays the full entry animation sequence
- Unknown commands display `bash: <cmd>: command not found`
- Command history shows only the most recent command output; previous entries are removed when a new command executes
- All effects are confined within the terminal body (`overflow: hidden`)
- Desktop-only input; mobile retains the static blinking cursor

## Non-goals

- Mobile keyboard / touch input support
- Persistent command history or scrollback
- Additional commands beyond clear (for now)
- Sound effects or audio feedback

## Capabilities

### New Capabilities
- `terminal-interactive-input`: Keyboard input capture, command parsing, execution state machine, and command history rendering within the Hero terminal
- `terminal-command-clear`: Terminal clear and animation replay triggered by the `clear` command

### Modified Capabilities
- `terminal-hero`: The blinking cursor requirement changes — the final idle cursor becomes a functional input line on desktop, and the entry animation must support replay (for `clear` command)

## Impact

- **Code**: `src/components/developer/Hero.vue` — major changes to template, script, and styles
- **Dependencies**: No new dependencies; GSAP handles all animations
