## Why

Mode persistence via `localStorage` adds complexity (pre-hydration script reading stored values, fallback chains in store init) without meaningful benefit — the site should always start in developer mode. Removing it simplifies the initialization flow and eliminates a code path that exists only for cross-session memory.

## What Changes

- **Remove `localStorage` read/write** from `src/stores/mode.ts` — the store always initializes as `'developer'`
- **Remove `localStorage` read** from the pre-hydration script in `src/layouts/Layout.astro` — mode is always `'developer'`, no need to check stored value
- **Remove `window.__INITIAL_MODE__`** — no longer needed since mode is always `'developer'`; the store can hardcode its initial value
- **Simplify pre-hydration script** — still sets `data-theme="developer"`, favicon, and title, but without branching on a stored value

## Non-goals

- Removing the dual-mode system itself — developer/photographer toggle still works at runtime
- Changing favicon or title behavior — they still switch on mode toggle
- Removing `window.__FAVICONS__` or `window.__TITLES__` — runtime mode switching still needs these

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `mode-favicon`: Remove scenario for "persisted mode" favicon — favicon always starts as developer icon
- `mode-title`: No spec-level change needed — title behavior is unchanged (always starts as developer title, which was already the default)

## Impact

- `src/stores/mode.ts` — simplify `getInitialMode()`, remove `localStorage.setItem` listener
- `src/layouts/Layout.astro` — simplify pre-hydration inline script
- `openspec/specs/mode-favicon/spec.md` — remove persisted-mode scenario
