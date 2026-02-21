# Data Model: Dual-Mode Portfolio Website

**Feature**: `001-dual-mode-portfolio` | **Date**: 2026-02-21

## Overview

All content is stored as YAML data files in `src/data/` and loaded at build time. TypeScript interfaces define the shape of each entity. There is no database — Astro reads YAML at build and generates static HTML.

## Entities

### SiteConfig

Site-wide metadata used for SEO, header, and footer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Site owner's full name |
| `title` | `string` | Yes | Professional title (e.g., "Senior Software Engineer") |
| `intro` | `string` | Yes | 1–2 sentence introduction for the Hero section |
| `avatar` | `string` | No | Relative path to avatar image in `src/assets/images/` |
| `email` | `string` | Yes | Contact email address |
| `socialLinks` | `SocialLink[]` | Yes | Social media profiles for footer |
| `seoDescription` | `string` | Yes | Meta description for SEO/OG tags |
| `seoKeywords` | `string[]` | No | Meta keywords |

**File**: `src/data/site.yaml`

### SocialLink

A social media profile link displayed in the footer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `platform` | `string` | Yes | Platform name: `"github"`, `"linkedin"`, `"twitter"`, etc. |
| `url` | `string` | Yes | Full URL to the profile |
| `label` | `string` | No | Accessible label (defaults to platform name) |

**Embedded in**: `SiteConfig.socialLinks`

### WorkExperience

A professional experience entry displayed in the Developer Mode timeline.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company` | `string` | Yes | Company or organization name |
| `role` | `string` | Yes | Job title / role |
| `startDate` | `string` | Yes | Start date in `YYYY-MM` format |
| `endDate` | `string \| "present"` | Yes | End date in `YYYY-MM` format, or `"present"` for current role |
| `description` | `string` | Yes | Responsibilities and achievements (supports Markdown) |
| `technologies` | `string[]` | No | Key technologies used in this role |

**File**: `src/data/experience.yaml` — array of entries, ordered newest-first.

**Ordering rule**: Entries are displayed in file order (newest first). No runtime sorting.

### Project

A software project entry displayed in the Developer Mode projects section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Project name |
| `description` | `string` | Yes | Brief description of the project |
| `technologies` | `string[]` | Yes | Technologies / frameworks used |
| `demoUrl` | `string` | No | URL to live demo |
| `repoUrl` | `string` | No | URL to source repository |
| `featured` | `boolean` | No | Whether to highlight this project (default: `false`) |

**File**: `src/data/projects.yaml` — array of entries, ordered by display priority.

### SkillCategory

A group of related technical skills.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | `string` | Yes | Category name (e.g., "Languages", "Frameworks", "Tools") |
| `skills` | `string[]` | Yes | List of skill names in this category |

**File**: `src/data/skills.yaml` — array of categories, ordered by display priority.

### Photograph

Metadata for a single photograph in the gallery.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | `string` | Yes | Relative path to source image in `src/assets/images/gallery/` |
| `alt` | `string` | Yes | Descriptive alt text (accessibility) |
| `caption` | `string` | No | Display caption shown in lightbox |
| `date` | `string` | No | Date taken in `YYYY-MM-DD` format |
| `location` | `string` | No | Location where the photo was taken |
| `camera` | `string` | No | Camera/lens information |
| `aspectRatio` | `number` | No | Width/height ratio for layout placeholder (calculated at build time if omitted) |

**File**: `src/data/photos.yaml` — array of entries, displayed in file order.

**Image loading**: The `src` path is resolved at build time via Astro's `import.meta.glob()` or dynamic import, then passed to `<Image>` component for optimization.

### Mode (runtime state)

Not stored in YAML — managed at runtime by Nanostores.

| Field | Type | Description |
|-------|------|-------------|
| `currentMode` | `'developer' \| 'photographer'` | Active display mode |

**Store**: `src/stores/mode.ts` — `atom<Mode>` initialized from `localStorage` or `'developer'` default.

**Persistence**: `localStorage` key `portfolio-mode`.

## Relationships

```text
SiteConfig
├── socialLinks: SocialLink[]     (1:N embedded)
│
WorkExperience[]                   (independent collection)
Project[]                          (independent collection)
SkillCategory[]                    (independent collection)
Photograph[]                       (independent collection)
│
Mode (runtime)
├── determines which content set is visible
├── drives data-theme attribute
└── persisted in localStorage
```

All content collections are independent — no foreign keys or cross-references between entities. The `Mode` runtime state determines which content set (Developer sections vs. Gallery) is visible on screen.

## Validation Rules

| Entity | Rule |
|--------|------|
| `WorkExperience.startDate` | Must be valid `YYYY-MM` format |
| `WorkExperience.endDate` | Must be valid `YYYY-MM` or literal `"present"` |
| `WorkExperience` ordering | `startDate` must be chronologically descending (newest first) in file |
| `Photograph.src` | Must reference an existing file in `src/assets/images/gallery/` |
| `Photograph.alt` | Must not be empty (accessibility requirement) |
| `SocialLink.platform` | Must be one of the supported platform identifiers |
| `SocialLink.url` | Must be a valid absolute URL |
| `SiteConfig.email` | Must be a valid email address format |
| `Project.demoUrl` / `repoUrl` | If provided, must be valid absolute URLs |

## State Transitions

### Mode State Machine

```text
┌─────────────┐   toggle()   ┌──────────────────┐
│  developer  │ ──────────── │  photographer    │
│  (default)  │ ◀──────────  │                  │
└─────────────┘   toggle()   └──────────────────┘
```

- Initial state: `developer` (FR-011), unless `localStorage` has stored preference.
- Transition trigger: user clicks ModeToggle (FR-003).
- Transition guard: debounced — if animation is in progress, subsequent toggle requests are queued, not stacked (FR-009).
- Side effects on transition: GSAP timeline plays, `data-theme` attribute swaps, `localStorage` updated.

### Lightbox State Machine

```text
┌──────────┐   click image    ┌─────────┐
│  closed  │ ─────────────── │  open   │
│          │ ◀─────────────  │ (index) │
└──────────┘   Esc/click-out  └─────────┘
                                │     ▲
                         next/  │     │  prev/
                         arrow  │     │  arrow
                                ▼     │
                              ┌─────────┐
                              │  open   │
                              │(index±1)│
                              └─────────┘
```

- Open: click on gallery image → lightbox opens at that index (FR-006).
- Navigate: arrow keys, swipe, or on-screen buttons cycle through photos (FR-006).
- Close: Escape key, close button, or click outside image (FR-012).
- On close: restore previous scroll position (FR-013).
