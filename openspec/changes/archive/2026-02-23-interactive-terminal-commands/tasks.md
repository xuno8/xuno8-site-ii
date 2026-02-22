## 1. Interactive Input Infrastructure

- [x] 1.1 Add hidden `<input>` element to Hero.vue template (inside terminal body, `opacity: 0; position: absolute`), rendered only on desktop (>= 768px). Add click handler on terminal body to focus the input (excluding clicks on links/buttons). Modify: `src/components/developer/Hero.vue`
- [x] 1.2 Add `terminalState` ref (`idle | typing | executing | animating`) and `inputText` ref. Wire hidden input's `v-model` to `inputText`. Disable input when state is `executing` or `animating`. Modify: `src/components/developer/Hero.vue`
- [x] 1.3 Replace static final cursor (`$ █`) with interactive input line that mirrors `inputText` — display `$ {{ inputText }}█`. Auto-focus input after entry animation completes (`animationDone` becomes true). Modify: `src/components/developer/Hero.vue`

## 2. Command Execution & History

- [x] 2.1 Add Enter key handler on hidden input: parse input text, clear input, dispatch to command handler or show `bash: <cmd>: command not found`. Add `commandHistory` reactive ref (stores prompt line + output). Modify: `src/components/developer/Hero.vue`
- [x] 2.2 Add command history rendering in template — between contact-box and input line. Clear previous history on each new command execution (keep only latest). Modify: `src/components/developer/Hero.vue`

## 3. Clear Command & Animation Replay

- [x] 3.1 Extract entry animation timeline creation into a reusable function (move from inline `useGsapContext` callback). Add `resetTerminalState()` function to reset all Vue refs (`whoamiChars`, `nameChars`, `contactChars`, `animationDone`, `showWhoamiCursor`, `showContactCursor`) and re-run `gsap.set()` on all animated elements. Modify: `src/components/developer/Hero.vue`
- [x] 3.2 Implement clear command handler: animate existing terminal content sliding up + fading out (0.3s), call `resetTerminalState()`, clear command history, rebuild and play entry timeline (skip Phase 1 terminal fade-in). Set terminal state to `idle` on timeline complete. Modify: `src/components/developer/Hero.vue`

## 4. Polish & Integration

- [x] 4.1 Add `position: relative` and `overflow: hidden` to `.terminal-body`. Modify: `src/components/developer/Hero.vue`
- [x] 4.2 Handle focus management edge cases: re-focus input after effect completes, prevent focus on mobile, handle blur gracefully (cursor stops blinking when terminal loses focus). Modify: `src/components/developer/Hero.vue`
- [x] 4.3 Verify reduced motion support: when `prefers-reduced-motion: reduce` is active, interactive input still works but `clear` command shows content immediately without replay animation. Modify: `src/components/developer/Hero.vue`
