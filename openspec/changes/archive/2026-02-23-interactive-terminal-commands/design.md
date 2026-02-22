## Context

The Hero component (`src/components/developer/Hero.vue`) renders a terminal-style introduction with a 5-phase GSAP animation sequence. After the animation completes, a static blinking cursor (`$ █`) sits at the bottom. This change transforms that cursor into a functional command input line supporting the `clear` command and extensible for future commands.

The component currently manages animation state via Vue refs (`whoamiChars`, `nameChars`, `contactChars`, `animationDone`) and a single GSAP timeline created inside `useGsapContext`. All animated elements use `autoAlpha` for FOUC prevention.

## Goals / Non-Goals

**Goals:**
- Allow desktop users to type commands into the terminal's final prompt line and execute them with Enter
- Implement the `clear` command with GSAP-driven animation replay
- Keep command history minimal (only show the most recent command output)
- Support animation replay via the `clear` command

**Non-Goals:**
- Mobile keyboard / touch input
- Command history scrollback or persistence
- Tab completion or command hints
- Additional commands beyond `clear`

## Decisions

### 1. Input capture via hidden `<input>` element

**Decision**: Use an `opacity: 0; position: absolute` input field inside the terminal body. Clicking anywhere on the terminal focuses it. The visible prompt line mirrors the input's value via a Vue ref.

**Rationale**: A hidden input provides native text editing (backspace, cursor movement) without reimplementing keyboard handling. The alternative — listening to `keydown` on the terminal div — would require manual handling of character insertion, deletion, modifier keys, and IME composition. The hidden input approach is simpler and more robust.

**Alternative considered**: `contenteditable` div — rejected because it introduces complex cursor management and HTML sanitization concerns with no benefit for single-line command input.

### 2. State machine for terminal interaction

**Decision**: Use a reactive `terminalState` ref with four states: `idle`, `typing`, `executing`, `animating`.

```
idle → typing (on first keypress)
typing → executing (on Enter)
executing → animating (effect starts)
animating → idle (effect completes)
```

During `executing` and `animating` states, the input is disabled to prevent command stacking.

The `clear` command has a special flow: `executing` → resets all animation refs → rebuilds and plays the GSAP timeline → `idle` on timeline complete.

**Rationale**: Explicit states prevent race conditions (e.g., typing during an effect) and make the component's behavior predictable.

### 3. Animation replay for `clear` command

**Decision**: Extract the current GSAP timeline creation into a reusable function. The `clear` command will:
1. Animate existing terminal content sliding up and fading out
2. Reset all Vue refs (`whoamiChars`, `nameChars`, `contactChars`, `animationDone`, etc.) to initial values
3. Re-run `gsap.set()` to hide all animated elements
4. Rebuild and play the entry animation timeline

**Rationale**: The existing animation logic is already well-structured as a linear sequence. Extracting it into a function allows replay without duplicating code. GSAP's `context.revert()` cleans up existing animations before rebuilding.

### 4. Command output rendering

**Decision**: Command output (e.g., `bash: foo: command not found`) is rendered as a reactive object holding the latest prompt + output. When a new command is entered, the previous output is replaced.

**Rationale**: Keeping only the latest command output prevents the terminal from growing unbounded and keeps the layout stable.

### 5. Desktop-only input

**Decision**: The interactive input activates only on viewports >= 768px. On mobile, the original static blinking cursor remains unchanged. Detection uses `window.matchMedia('(min-width: 768px)')` checked at mount time.

**Rationale**: Mobile virtual keyboards would obscure the terminal and disrupt the page layout. The effort to optimize mobile input UX is out of scope for this change.

## Risks / Trade-offs

- **[Focus management]** Clicking the terminal to focus the hidden input may interfere with social link clicks inside the terminal body. → Mitigation: Only focus the input when clicking outside interactive elements (links, buttons). Use `e.target` check in the click handler.
- **[Clear command complexity]** Replaying the entry animation requires careful state reset. If any ref is missed, the replay will be visually broken. → Mitigation: Centralize all state reset in a single `resetTerminalState()` function.
