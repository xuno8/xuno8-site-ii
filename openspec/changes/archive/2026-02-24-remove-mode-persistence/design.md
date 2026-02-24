## Context

The site uses a dual-mode architecture (developer / photographer) with mode state managed by a Nanostores atom in `src/stores/mode.ts`. Currently, mode is persisted to `localStorage` under the key `portfolio-mode` and restored on page load via two mechanisms:

1. A synchronous pre-hydration `<script is:inline>` in `Layout.astro` that reads `localStorage`, sets `data-theme`, and stores the value in `window.__INITIAL_MODE__`
2. The `getInitialMode()` function in `mode.ts` that reads `window.__INITIAL_MODE__` first, then falls back to `localStorage`

This persistence is being removed — mode always starts as `'developer'`.

## Goals / Non-Goals

**Goals:**
- Remove all `localStorage` read/write for mode persistence
- Remove `window.__INITIAL_MODE__` since it only existed to pass the stored mode to the Nanostores init
- Simplify the pre-hydration script and store initialization
- Keep runtime mode switching (favicon, title, theme) fully functional

**Non-Goals:**
- Changing how `window.__FAVICONS__` or `window.__TITLES__` work — runtime toggle still needs these
- Removing the pre-hydration script entirely — it still sets the developer favicon and title before hydration
- Altering the dual-mode toggle UX

## Decisions

### Decision 1: Hardcode initial mode in store

**Choice:** Replace `getInitialMode()` with a direct `atom<Mode>('developer')` initialization.

**Rationale:** The function only existed to read persisted state. With persistence removed, there's no branching logic needed — the initial value is always `'developer'`.

**Alternative considered:** Keeping `getInitialMode()` as a single-line function returning `'developer'`. Unnecessary indirection for a constant value.

### Decision 2: Keep pre-hydration script for favicon/title

**Choice:** Keep the `<script is:inline>` block but remove the `localStorage` read and `window.__INITIAL_MODE__` assignment. The script still sets `data-theme="developer"`, the developer favicon, and the developer title.

**Rationale:** Although `data-theme="developer"` is already the server-rendered default in the `<html>` tag, the script still needs to set the favicon `href` and `document.title` before hydration to avoid a flash of missing favicon or incorrect title.

### Decision 3: Remove localStorage write from mode listener

**Choice:** Remove the `localStorage.setItem` call from `currentMode.listen()` in `mode.ts`. Keep the favicon and title update logic in the same listener.

**Rationale:** The listener callback handles three concerns: persistence, favicon update, and title update. Only persistence is being removed.

## Risks / Trade-offs

- **[Users lose mode memory]** → Accepted. This is the explicit goal of the change. Users who previously bookmarked the photographer view will now always land on developer mode.
- **[Pre-hydration script still runs]** → Minimal cost. The script is tiny and still serves a purpose (favicon + title). No performance concern.
