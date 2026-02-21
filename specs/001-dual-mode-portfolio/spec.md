# Feature Specification: Dual-Mode Portfolio Website

**Feature Branch**: `001-dual-mode-portfolio`
**Created**: 2026-02-21
**Status**: Draft
**Input**: User description: "Build a dual-mode personal portfolio website that serves as both a professional software engineering resume and a photography gallery. The site features a prominent toggle switch that seamlessly transitions between a 'Developer Mode' and a 'Photographer Mode'. Developer Mode displays work experience, skills, and projects in a structured, high-density layout. Photographer Mode transforms the interface into a minimalist, immersive gallery using a masonry layout for viewing high-quality images. The transition between these modes must feature smooth, engaging animations to provide a unique user experience without page reloads."

## Clarifications

### Session 2026-02-21

- Q: What is the expected scale of the photography gallery? → A: Medium scale (20-50 photographs), using lazy loading for performance.
- Q: Which mode's information should SEO meta / Open Graph link previews display? → A: Fixed to Developer Mode professional information (name, title, skills summary).
- Q: How should Developer Mode content data (experience, projects, skills) be provided? → A: Separate structured YAML data files that the site reads and renders.
- Q: Where should the mode toggle switch be positioned? → A: Fixed in the top navigation bar, always visible while scrolling.
- Q: Should users be able to navigate between photos within the lightbox? → A: Yes, support in-lightbox navigation via arrow keys, swipe gestures, and on-screen buttons.
- Q: The site should be deployed to which platform? → A: Vercel, using official `@astrojs/vercel` adapter.
- Q: Which CSS approach should be used for styling? → A: UnoCSS (Attributify mode), atomic utility-first with on-demand generation.
- Q: Should Developer Mode include contact information? → A: Yes, a shared footer with email link and social media icons (GitHub, LinkedIn, etc.) visible in both modes.
- Q: Which format should structured data files use? → A: YAML, unified across all content types for readability and consistency.
- Q: Should Developer Mode provide in-page section navigation? → A: Yes, a side floating dot indicator showing current section, clickable to jump between sections. Hidden in Photographer Mode.
- Q: How should photography images be stored and optimized? → A: In-repo under `src/assets/`, using Astro built-in `astro:assets` for build-time optimization (auto-generate WebP/AVIF, responsive sizes).
- Q: Which animation technology should be used for mode transitions? → A: GSAP (GreenSock), as mandated by Constitution Principle III. CSS transitions only for simple hover/focus states.
- Q: Should the photography gallery support categorization or filtering? → A: No. Flat gallery — all photos in a single masonry layout, no categories or filter UI.
- Q: How should Developer Mode and Photographer Mode differ visually? → A: Dual-tone theme — Developer Mode uses a light/neutral palette; Photographer Mode switches to a dark background to showcase photography.
- Q: Should Developer Mode include a Hero section at the top? → A: Yes. Hero with name, professional title, short intro (1-2 sentences), and optional avatar or decorative visual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Developer Profile (Priority: P1)

A visitor arrives at the portfolio website and sees the Developer Mode by default. They first see a Hero section with the site owner's name, professional title, and a short introduction. Scrolling further, they browse through work experience timeline, technical skills grouped by category, and featured software projects with descriptions and links. The layout is structured and information-dense, resembling a polished digital resume.

**Why this priority**: The developer profile is the core professional presence. Most visitors will arrive looking for engineering credentials, making this the foundational content of the site.

**Independent Test**: Can be fully tested by navigating to the site and verifying all developer content sections render correctly with structured layout, delivering a complete professional resume experience.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the site for the first time, **When** the page loads, **Then** the Developer Mode is displayed by default with a Hero section (name, title, intro) and all professional sections visible.
2. **Given** a visitor is viewing Developer Mode, **When** they scroll through the page, **Then** they see work experience, skills, and projects sections in a structured, information-dense layout.
3. **Given** a visitor is viewing the projects section, **When** they interact with a project entry, **Then** they can see the project description and navigate to external links (e.g., live demo, source repository).

---

### User Story 2 - Switch Between Modes (Priority: P1)

A visitor notices the prominent toggle switch on the page. They click it, and the entire interface smoothly transforms from the structured developer layout into an immersive photography gallery. The transition is animated and visually engaging — elements fade, slide, or morph rather than abruptly swapping. The gallery displays photographs in a masonry layout that adapts to the viewport. Clicking the toggle again reverses the transition back to Developer Mode.

**Why this priority**: The mode-switching experience is the defining feature of this portfolio. Without this, the site is a standard resume page. The smooth transition is what makes it memorable and showcases the owner's creative range.

**Independent Test**: Can be fully tested by clicking the toggle switch and verifying the animation plays smoothly, the layout transforms to a masonry photo gallery, and no page reload occurs.

**Acceptance Scenarios**:

1. **Given** a visitor is in Developer Mode, **When** they click the mode toggle, **Then** the interface transitions to Photographer Mode with a smooth animation (no page reload).
2. **Given** the transition animation is playing, **When** the visitor observes the screen, **Then** elements animate fluidly (fade, slide, or morph) rather than appearing/disappearing abruptly.
3. **Given** a visitor is in Photographer Mode, **When** they click the mode toggle again, **Then** the interface transitions back to Developer Mode with an equally smooth animation.
4. **Given** a visitor switches modes rapidly (e.g., double-clicking the toggle), **When** the system processes the input, **Then** it handles the interruption gracefully without visual glitches or broken states.

---

### User Story 3 - Browse Photography Gallery (Priority: P2)

A visitor in Photographer Mode browses through the photography gallery. Images are displayed in a masonry layout that showcases photographs at high quality. The visitor can click on an image to view it in a larger, immersive lightbox view with details about the photograph.

**Why this priority**: Once the mode switch works, the gallery itself needs to be compelling. A well-designed masonry layout with lightbox viewing is essential for the photography content to have impact.

**Independent Test**: Can be fully tested by switching to Photographer Mode, scrolling through the masonry gallery, clicking images to open lightbox views, and verifying image quality and layout responsiveness.

**Acceptance Scenarios**:

1. **Given** a visitor is in Photographer Mode, **When** the gallery loads, **Then** photographs are displayed in a masonry layout that fills the viewport attractively.
2. **Given** a visitor sees the gallery, **When** they click on a photograph, **Then** a lightbox overlay opens showing the image at a larger size with optional caption/metadata.
3. **Given** a visitor has a lightbox open, **When** they click the next/previous arrows or press arrow keys, **Then** the lightbox navigates to the adjacent photograph without closing.
4. **Given** a visitor has a lightbox open on a mobile device, **When** they swipe left or right, **Then** the lightbox navigates to the adjacent photograph.
5. **Given** a visitor has a lightbox open, **When** they close it (click outside, press Escape, or click a close button), **Then** they return to the gallery view without losing their scroll position.
6. **Given** a visitor is browsing on a mobile device, **When** they view the gallery, **Then** the masonry layout adapts to the smaller viewport and images remain visually appealing.

---

### User Story 4 - Responsive Experience Across Devices (Priority: P2)

A visitor accesses the portfolio from various devices — desktop, tablet, and mobile. Both Developer Mode and Photographer Mode adapt to the screen size, maintaining usability and visual quality. The toggle switch remains accessible regardless of device.

**Why this priority**: A portfolio must look professional on any device. Recruiters may browse on phones, and photography enthusiasts may use tablets. Both modes need to work well across breakpoints.

**Independent Test**: Can be fully tested by resizing the browser window or using device emulation to verify both modes render correctly across standard breakpoints (mobile, tablet, desktop).

**Acceptance Scenarios**:

1. **Given** a visitor is on a mobile device, **When** they view Developer Mode, **Then** the layout adjusts to a single-column format that remains readable and navigable.
2. **Given** a visitor is on a tablet, **When** they view Photographer Mode, **Then** the masonry gallery adjusts its column count to fit the viewport.
3. **Given** any viewport size, **When** the visitor looks for the mode toggle, **Then** the toggle is prominently visible and easily tappable/clickable.

---

### User Story 5 - Persistent Mode Preference (Priority: P3)

A returning visitor who previously selected Photographer Mode comes back to the site. The site remembers their last-used mode and loads it by default, avoiding a jarring experience of always starting in Developer Mode.

**Why this priority**: This is a polish feature that improves repeat visitor experience but is not essential for the core value proposition.

**Independent Test**: Can be fully tested by selecting a mode, closing the browser tab, returning to the site, and verifying the previously selected mode loads.

**Acceptance Scenarios**:

1. **Given** a visitor selects Photographer Mode, **When** they return to the site in a new session, **Then** Photographer Mode loads by default.
2. **Given** a first-time visitor with no stored preference, **When** they visit the site, **Then** Developer Mode loads as the default.

---

### Edge Cases

- What happens when images fail to load in Photographer Mode? The gallery should display graceful placeholders and not break the masonry layout.
- How does the system handle the toggle during the transition animation? Rapid toggling should debounce the switch, not cause overlapping animations.
- What happens on extremely narrow viewports (< 320px)? The layout should degrade gracefully with a minimum supported width.
- What if a visitor has reduced-motion preferences enabled in their OS/browser? Transitions should respect `prefers-reduced-motion` and use instant or minimal animations.
- What happens when the site is accessed with JavaScript disabled? Core content (Developer Mode resume) should remain accessible as static content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display a Developer Mode with a Hero section (name, professional title, short intro, optional avatar) followed by sections for work experience, technical skills, and software projects.
- **FR-002**: The site MUST display a Photographer Mode with a masonry-layout photography gallery.
- **FR-003**: The site MUST feature a prominent toggle switch in a fixed top navigation bar that remains visible while scrolling, allowing users to switch between Developer Mode and Photographer Mode at any point on the page.
- **FR-004**: Mode transitions MUST be animated using GSAP (per Constitution Principle III) with smooth, visually engaging effects (fade, slide, morph, or equivalent). CSS transitions are only permitted for simple state changes (hover, focus).
- **FR-005**: Mode switching MUST NOT trigger a page reload; the transition must happen entirely within the current page.
- **FR-006**: The photography gallery MUST support a lightbox view for individual images with caption/metadata display and in-lightbox navigation (previous/next) via on-screen arrow buttons, keyboard arrow keys, and touch swipe gestures on mobile.
- **FR-007**: Both modes MUST be fully responsive across mobile (375px+), tablet, and desktop (up to 2560px) viewports.
- **FR-008**: The site MUST persist the user's last-selected mode preference across sessions using browser-local storage.
- **FR-009**: The toggle switch MUST handle rapid or repeated clicks gracefully without visual glitches or broken layout states.
- **FR-010**: The site MUST respect the user's `prefers-reduced-motion` accessibility setting by reducing or eliminating transition animations.
- **FR-011**: Developer Mode MUST be the default mode for first-time visitors with no stored preference.
- **FR-012**: The photography gallery lightbox MUST be closeable via close button, clicking outside the image, or pressing the Escape key.
- **FR-013**: After closing the lightbox, the user MUST return to their previous scroll position in the gallery.
- **FR-014**: Images that fail to load in the gallery MUST display a placeholder without breaking the masonry layout.
- **FR-015**: The photography gallery MUST support a curated collection of 20-50 photographs, using lazy loading to defer off-screen images until they approach the viewport.
- **FR-016**: The site MUST provide SEO meta tags and Open Graph data fixed to Developer Mode content (name, professional title, skills summary), regardless of the visitor's active mode.
- **FR-017**: All Developer Mode content (work experience, projects, skills) and Photographer Mode metadata (photo captions, metadata) MUST be sourced from separate structured YAML data files, not hardcoded in the layout or markup.
- **FR-018**: The site MUST display a shared footer in both modes containing an email link and social media icons (GitHub, LinkedIn, etc.) for visitor contact.
- **FR-019**: Developer Mode MUST display a floating side dot indicator that highlights the current section and allows clicking to smooth-scroll between sections (Experience, Skills, Projects). This indicator MUST be hidden in Photographer Mode.
- **FR-020**: The site MUST apply a dual-tone visual theme: Developer Mode uses a light/neutral color palette, and Photographer Mode switches to a dark background to maximize photographic impact. The theme transition MUST be part of the GSAP mode-switching animation.

### Key Entities

- **Mode**: The current display state of the site — Developer or Photographer. Determines which content set and layout style are active.
- **Project**: A software project entry containing title, description, technologies used, and external links (demo URL, repository URL).
- **Work Experience**: A professional experience entry containing company name, role title, duration, and description of responsibilities/achievements.
- **Skill**: A technical skill with a name and category grouping (e.g., Languages, Frameworks, Tools).
- **Photograph**: An image entry in the gallery containing source image, thumbnail, caption, and optional metadata (date, location, camera settings). The gallery is designed for a curated collection of 20-50 photographs displayed as a flat (uncategorized) masonry layout.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can switch between Developer Mode and Photographer Mode within 1 second, including the full transition animation completing.
- **SC-002**: The mode transition animation plays without dropped frames on standard consumer devices (maintaining smooth 60fps on mid-range hardware).
- **SC-003**: The photography gallery loads and displays all visible images within 3 seconds on a standard broadband connection.
- **SC-004**: Both modes are fully usable on viewports from 375px to 2560px wide without horizontal scrolling or content overflow.
- **SC-005**: 100% of lightbox interactions (open, close, navigate previous/next) function correctly across supported devices and input methods (mouse, keyboard, touch).
- **SC-006**: Returning visitors see their preferred mode within 1 second of page load without a visible flash of the alternate mode.
- **SC-007**: The site achieves a Lighthouse accessibility score of 90 or above in both modes.
- **SC-008**: Users with `prefers-reduced-motion` enabled experience no motion-based animations during mode transitions.

## Assumptions

- The site owner will provide their own work experience data, project details, skill lists, and photography images as content via structured YAML data files.
- Photography images are stored in-repo under `src/assets/` and processed at build time via Astro's `astro:assets` pipeline, which auto-generates optimized formats (WebP/AVIF) and responsive sizes. Photo metadata (captions, dates, etc.) is managed in structured YAML data files.
- The site behaves as a single-page application (no multi-page navigation required for the core experience).
- The portfolio is a public-facing site with no authentication or private sections.
- Content is static or managed externally; no CMS or admin panel is in scope.
- Browser support targets modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions).
- The site will be deployed to Vercel using the official `@astrojs/vercel` adapter, leveraging its CDN, preview deployments, and edge capabilities.
- Styling uses UnoCSS with Attributify mode for atomic, on-demand utility classes; Vue components use scoped styles where component-specific overrides are needed.
