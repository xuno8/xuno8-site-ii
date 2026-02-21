# Tasks: Dual-Mode Portfolio Website

**Input**: Design documents from `/specs/001-dual-mode-portfolio/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-schemas.ts, quickstart.md

**Tests**: Not included — no explicit test requirement in the feature specification. Add test tasks separately if TDD is desired.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Astro project, install all dependencies, create directory structure and configuration files.

- [x] T001 Initialize Astro project with TypeScript strict mode and install all dependencies per quickstart.md (Astro 5.x, @astrojs/vue, @astrojs/vercel, UnoCSS, Nanostores, GSAP, @rollup/plugin-yaml)
- [x] T002 Create source directory structure per plan.md: src/{assets/images/gallery, components/{developer,photographer,shared}, composables, data, layouts, pages, stores, styles, types, utils}
- [x] T003 [P] Configure astro.config.ts with Vue, UnoCSS (injectReset), and Vercel adapter integrations in astro.config.ts
- [x] T004 [P] Configure UnoCSS with preset-uno and preset-attributify in uno.config.ts
- [x] T005 [P] Configure tsconfig.json extending astro/tsconfigs/strict with path aliases (@/*, @data/*, @components/*) in tsconfig.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, utilities, stores, composables, layout shell, and shared components that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define TypeScript interfaces (SiteConfig, SocialLink, WorkExperience, Project, SkillCategory, Photograph, Mode) from contracts/data-schemas.ts in src/types/index.ts
- [x] T007 [P] Create YAML data loading helper functions (loadSiteConfig, loadExperience, loadProjects, loadSkills, loadPhotos) in src/utils/data.ts
- [x] T008 [P] Create starter YAML data files with sample content: site.yaml, experience.yaml, projects.yaml, skills.yaml, photos.yaml in src/data/
- [x] T009 [P] Create global.css with CSS reset, typography tokens, and dual-tone CSS custom properties (--color-bg, --color-text, etc.) under [data-theme="developer"] and [data-theme="photographer"] selectors in src/styles/global.css
- [x] T010 [P] Create Nanostores mode atom (atom<Mode> defaulting to 'developer') in src/stores/mode.ts
- [x] T011 [P] Create useGsapContext composable wrapping gsap.context() lifecycle (create in onMounted, revert in onUnmounted) in src/composables/useGsapContext.ts
- [x] T012 [P] Create useReducedMotion composable detecting prefers-reduced-motion media query in src/composables/useReducedMotion.ts
- [x] T013 Create base Layout.astro with HTML shell, <head>, SEO meta/OG tags from site.yaml, font preloads, global.css import, default data-theme="developer" attribute in src/layouts/Layout.astro
- [x] T014 [P] Create Navbar.astro static shell with fixed top positioning and slot for mode toggle in src/components/shared/Navbar.astro
- [x] T015 [P] Create Footer.astro rendering email link and social media icons from site.yaml in src/components/shared/Footer.astro
- [x] T016 Create index.astro page shell using Layout, Navbar, and Footer, with placeholder sections for developer and photographer content in src/pages/index.astro

**Checkpoint**: Foundation ready — verify `pnpm dev` starts without errors and base page renders with Navbar and Footer.

---

## Phase 3: User Story 1 — View Developer Profile (Priority: P1) 🎯 MVP

**Goal**: Display a complete, structured developer resume with Hero, Experience timeline, Skills grid, and Project cards. First-time visitors see this mode by default.

**Independent Test**: Navigate to the site, verify all developer content sections render correctly with structured layout, delivering a complete professional resume experience.

### Implementation for User Story 1

- [x] T017 [P] [US1] Create Hero.vue component displaying name, professional title, short intro, and optional avatar image (receives pre-optimized image data as prop from parent .astro file) in src/components/developer/Hero.vue
- [x] T018 [P] [US1] Create ExperienceTimeline.vue component rendering work experience entries (company, role, dates, description, technologies) in chronological layout in src/components/developer/ExperienceTimeline.vue
- [x] T019 [P] [US1] Create SkillsGrid.vue component displaying skills grouped by category in a grid layout in src/components/developer/SkillsGrid.vue
- [x] T020 [P] [US1] Create ProjectCards.vue component rendering project entries with title, description, technologies, and external links (demo/repo) in src/components/developer/ProjectCards.vue
- [x] T021 [US1] Create SectionNav.vue floating side dot indicator showing current section with click-to-scroll navigation, using GSAP ScrollTrigger for active section tracking in src/components/developer/SectionNav.vue
- [x] T022 [US1] Integrate all Developer Mode Vue islands into index.astro with client:visible directives (client:load for Hero as above-fold LCP element); process avatar image via getImage() and pass optimized data as prop to Hero.vue in src/pages/index.astro
- [x] T023 [US1] Add GSAP ScrollTrigger section reveal animations (fade-in + slide-up on scroll) to developer section components using useGsapContext composable

**Checkpoint**: Developer Mode fully functional — Hero, Experience, Skills, Projects, and SectionNav all render with scroll animations. This is the MVP.

---

## Phase 4: User Story 2 — Switch Between Modes (Priority: P1)

**Goal**: Implement the mode toggle switch and smooth GSAP-powered transition between Developer Mode and Photographer Mode without page reload.

**Independent Test**: Click the toggle switch, verify the animation plays smoothly, layout transforms between developer and photographer content, data-theme attribute swaps, and no page reload occurs.

### Implementation for User Story 2

- [x] T024 [US2] Create ModeToggle.vue toggle switch component reading/writing currentMode store, styled as a prominent switch in src/components/shared/ModeToggle.vue
- [x] T025 [US2] Create useModeTransition composable with sequenced GSAP timeline (fade out current content → at opacity 0 swap data-theme and toggle section visibility → fade in new content, ~600ms total) in src/composables/useModeTransition.ts
- [x] T026 [US2] Integrate ModeToggle into Navbar.astro with client:load directive for immediate interactivity in src/components/shared/Navbar.astro
- [x] T027 [US2] Implement mode-driven section visibility in index.astro — conditionally show developer sections vs photographer gallery based on currentMode store in src/pages/index.astro
- [x] T028 [US2] Wire useModeTransition into index.astro — subscribe to mode store changes, trigger sequenced GSAP timeline (fade → swap data-theme → fade) on mode change
- [x] T029 [US2] Implement debounce guard in useModeTransition — queue toggle requests while animation is in progress, prevent overlapping animations (FR-009)
- [x] T030 [US2] Apply reduced-motion fallback via useReducedMotion — set GSAP duration to 0 for instant state change when prefers-reduced-motion is active (FR-010)

**Checkpoint**: Mode toggle works with smooth animated transition. Rapid clicking handled gracefully. Reduced-motion users get instant switch.

---

## Phase 5: User Story 3 — Browse Photography Gallery (Priority: P2)

**Goal**: Display a masonry photography gallery in Photographer Mode with a full-screen lightbox viewer supporting keyboard, click, and swipe navigation.

**Independent Test**: Switch to Photographer Mode, scroll through the masonry gallery, click images to open lightbox, navigate between photos with arrows/keys/swipe, close lightbox, verify scroll position preserved.

### Implementation for User Story 3

- [x] T031 [P] [US3] Add 3–5 placeholder gallery images (diverse aspect ratios) for development in src/assets/images/gallery/
- [x] T032 [P] [US3] Create useLightbox composable managing lightbox state (isOpen, currentIndex, open, close, next, prev) with scroll position save/restore in src/composables/useLightbox.ts
- [x] T033 [US3] Create MasonryGallery.vue with CSS-columns layout (columns: 3 280px), receiving pre-optimized image data array as prop from parent .astro file, rendering with loading="lazy" in src/components/photographer/MasonryGallery.vue
- [x] T034 [US3] Create Lightbox.vue full-screen overlay with large image view, caption/metadata display (date, location, camera), and on-screen prev/next arrow buttons in src/components/photographer/Lightbox.vue
- [x] T035 [US3] Add keyboard navigation (ArrowLeft, ArrowRight for prev/next; Escape for close) and touch swipe gesture detection to Lightbox.vue
- [x] T036 [US3] Add GSAP ScrollTrigger.batch() staggered reveal animation to masonry gallery items using useGsapContext in MasonryGallery.vue
- [x] T037 [US3] Implement image error placeholder — show graceful fallback element when gallery images fail to load without breaking masonry layout (FR-014)
- [x] T038 [US3] Integrate Photographer Mode gallery into index.astro — batch-process gallery images via import.meta.glob() + getImage(), pass optimized image data array as prop to MasonryGallery.vue, mount with client:visible directive in src/pages/index.astro
- [x] T039 [US3] Implement scroll position preservation on lightbox close — save scrollY on open, restore on close (FR-013)

**Checkpoint**: Photography gallery fully functional — masonry layout, lightbox with navigation, scroll reveals, error handling, scroll position preserved.

---

## Phase 6: User Story 4 — Responsive Experience Across Devices (Priority: P2)

**Goal**: Ensure both Developer Mode and Photographer Mode adapt to mobile (375px+), tablet, and desktop (up to 2560px) viewports, maintaining usability and visual quality.

**Independent Test**: Resize browser or use device emulation to verify both modes render correctly across standard breakpoints.

### Implementation for User Story 4

- [x] T040 [P] [US4] Add responsive breakpoints to Developer Mode components — single-column layout on mobile, multi-column on tablet/desktop for ExperienceTimeline, SkillsGrid, and ProjectCards
- [x] T041 [P] [US4] Add responsive column count to MasonryGallery — 1 column mobile (<640px), 2 columns tablet (640–1024px), 3 columns desktop (>1024px) in src/components/photographer/MasonryGallery.vue
- [x] T042 [US4] Ensure ModeToggle has minimum 44px touch target and remains prominently visible at all viewport sizes in src/components/shared/ModeToggle.vue
- [x] T043 [US4] Ensure Lightbox is fully usable on mobile — appropriate image sizing, touch-friendly close/nav buttons, safe-area inset handling in src/components/photographer/Lightbox.vue

**Checkpoint**: Both modes usable from 375px to 2560px. Toggle accessible at all sizes. Gallery and lightbox work on mobile.

---

## Phase 7: User Story 5 — Persistent Mode Preference (Priority: P3)

**Goal**: Remember the user's last-selected mode in localStorage and restore it on return visits without a flash of the wrong mode.

**Independent Test**: Select Photographer Mode, close the tab, return to the site, verify Photographer Mode loads by default without Developer Mode flash.

### Implementation for User Story 5

- [x] T044 [US5] Implement localStorage persistence in mode store — read stored value on initialization, write to localStorage on every mode change (key: 'portfolio-mode') in src/stores/mode.ts
- [x] T045 [US5] Add pre-hydration inline script to Layout.astro <head> — reads localStorage before Vue hydrates, sets data-theme attribute and exposes window.__INITIAL_MODE__ for Nanostores init in src/layouts/Layout.astro

**Checkpoint**: Returning visitors see their preferred mode instantly. No flash of wrong mode.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, performance verification, and edge case handling across all stories.

- [x] T046 [P] Verify Lighthouse accessibility score ≥ 90 in both Developer and Photographer modes
- [x] T047 [P] Verify performance budgets — LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms, page weight <500KB compressed, each island <50KB gzipped
- [x] T048 Run quickstart.md verification checklist end-to-end (dev server, Vue rendering, UnoCSS attributify, GSAP animation, Nanostores sharing, Image optimization, theme switching, production build)
- [x] T049 Final edge case validation — rapid toggle stress test, minimum viewport (320px) graceful degradation, JS-disabled fallback (static developer content visible)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — no dependencies on other stories
- **US2 (Phase 4)**: Depends on Foundational (Phase 2) — benefits from US1 being complete (needs developer content to transition from), but can be started with placeholder content
- **US3 (Phase 5)**: Depends on Foundational (Phase 2) — no dependencies on other stories
- **US4 (Phase 6)**: Depends on US1, US2, US3 being complete (responsive tuning requires all components to exist)
- **US5 (Phase 7)**: Depends on Foundational (Phase 2) and US2 (needs mode toggle to test persistence)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Start after Phase 2 — completely independent
- **US2 (P1)**: Start after Phase 2 — best after US1 for realistic content transition
- **US3 (P2)**: Start after Phase 2 — completely independent
- **US4 (P2)**: Start after US1 + US2 + US3 — refines existing components
- **US5 (P3)**: Start after US2 — extends mode store with persistence

### Within Each User Story

- Components marked [P] within the same story can be created in parallel (different files)
- Integration tasks depend on component tasks completing first
- GSAP animation tasks depend on target components existing

### Parallel Opportunities

- T003, T004, T005: All config files in parallel
- T007, T008, T009, T010, T011, T012: Foundational utilities/stores/composables in parallel
- T014, T015: Shared static components in parallel
- T017, T018, T019, T020: All Developer Mode components in parallel
- T031, T032: Gallery image placeholders and lightbox composable in parallel
- T040, T041: Responsive breakpoints for developer and photographer components in parallel
- T046, T047: Lighthouse and performance audits in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all Developer Mode components together:
Task: "Create Hero.vue in src/components/developer/Hero.vue"
Task: "Create ExperienceTimeline.vue in src/components/developer/ExperienceTimeline.vue"
Task: "Create SkillsGrid.vue in src/components/developer/SkillsGrid.vue"
Task: "Create ProjectCards.vue in src/components/developer/ProjectCards.vue"

# Then sequentially:
Task: "Create SectionNav.vue" (needs section knowledge)
Task: "Integrate into index.astro" (needs all components)
Task: "Add ScrollTrigger animations" (needs integrated components)
```

## Parallel Example: User Story 3

```bash
# Launch in parallel:
Task: "Add placeholder gallery images in src/assets/images/gallery/"
Task: "Create useLightbox composable in src/composables/useLightbox.ts"

# Then sequentially:
Task: "Create MasonryGallery.vue" (needs images)
Task: "Create Lightbox.vue" (needs useLightbox)
Task: "Add keyboard/swipe navigation"
Task: "Add ScrollTrigger reveals"
Task: "Add error placeholders"
Task: "Integrate into index.astro"
Task: "Implement scroll preservation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 — View Developer Profile
4. **STOP and VALIDATE**: Site renders a complete developer resume with scroll animations
5. Deploy/demo if ready — this is a functional portfolio

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Developer Profile) → Test independently → Deploy (MVP!)
3. Add US2 (Mode Switch) → Test toggle + animation → Deploy
4. Add US3 (Photography Gallery) → Test gallery + lightbox → Deploy
5. Add US4 (Responsive) → Test all breakpoints → Deploy
6. Add US5 (Persistence) → Test returning visitor flow → Deploy
7. Polish → Final validation → Production launch

### Parallel Team Strategy

With multiple developers after Foundational is complete:

- Developer A: US1 (Developer Profile) — then US4 (Responsive)
- Developer B: US2 (Mode Switch) + US5 (Persistence)
- Developer C: US3 (Photography Gallery)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No test tasks included — add separately if TDD approach is requested
- Sample YAML data in T008 should contain enough entries to test all layouts (≥2 experience entries, ≥3 skill categories, ≥3 projects, ≥3 photos)
