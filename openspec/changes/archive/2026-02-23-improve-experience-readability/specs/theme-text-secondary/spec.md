## ADDED Requirements

### Requirement: Text secondary color token exists in both themes

The CSS custom property `--color-text-secondary` SHALL be defined in both `[data-theme="developer"]` and `[data-theme="photographer"]` theme blocks in `global.css`.

- Developer theme: `#a9b1d6`
- Photographer theme: `#c4b9a8`

#### Scenario: Developer theme provides text-secondary

- **WHEN** the document has `data-theme="developer"` on the `<html>` element
- **THEN** `--color-text-secondary` SHALL resolve to `#a9b1d6`

#### Scenario: Photographer theme provides text-secondary

- **WHEN** the document has `data-theme="photographer"` on the `<html>` element
- **THEN** `--color-text-secondary` SHALL resolve to `#c4b9a8`

### Requirement: Text secondary meets WCAG AA contrast on card background

The `--color-text-secondary` value SHALL achieve a contrast ratio of at least 4.5:1 against `--color-bg-card` in both themes.

#### Scenario: Developer contrast ratio

- **WHEN** `--color-text-secondary` (`#a9b1d6`) is rendered on `--color-bg-card` (`#292e42`)
- **THEN** the contrast ratio SHALL be at least 4.5:1

#### Scenario: Photographer contrast ratio

- **WHEN** `--color-text-secondary` (`#c4b9a8`) is rendered on `--color-bg-card` (`#252320`)
- **THEN** the contrast ratio SHALL be at least 4.5:1

### Requirement: Experience date text uses text-secondary and monospace

The date range text in the ExperienceTimeline component SHALL use `--color-text-secondary` for color and `--font-mono` for font-family.

#### Scenario: Date text styling

- **WHEN** the ExperienceTimeline component renders a date range (e.g., "Aug 2024 — Present")
- **THEN** the date text color SHALL be `var(--color-text-secondary)` and font-family SHALL be `var(--font-mono)`

### Requirement: Experience location text uses text-secondary with semibold weight

The location text in the ExperienceTimeline component SHALL use `--color-text-secondary` for color and `font-weight: 600` (semibold).

#### Scenario: Location text styling

- **WHEN** the ExperienceTimeline component renders a location (e.g., "Taipei, Taiwan")
- **THEN** the location text color SHALL be `var(--color-text-secondary)` and font-weight SHALL be 600
