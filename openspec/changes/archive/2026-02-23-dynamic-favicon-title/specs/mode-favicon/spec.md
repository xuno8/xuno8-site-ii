## ADDED Requirements

### Requirement: SVG favicon rendered on page load
The system SHALL render an SVG favicon in the browser tab on initial page load. The icon displayed SHALL correspond to the persisted mode (developer or photographer).

#### Scenario: Developer mode favicon on first visit
- **WHEN** a user visits the site for the first time (no persisted mode)
- **THEN** the browser tab SHALL display a code bracket (`</>`) SVG icon

#### Scenario: Photographer mode favicon from persisted mode
- **WHEN** a user visits the site with `localStorage` portfolio-mode set to `photographer`
- **THEN** the browser tab SHALL display a camera aperture SVG icon

### Requirement: Favicon switches on mode toggle
The system SHALL update the favicon immediately when the user toggles between developer and photographer modes.

#### Scenario: Switch from developer to photographer
- **WHEN** the user switches mode from developer to photographer
- **THEN** the favicon SHALL change from the code bracket icon to the camera aperture icon without a page reload

#### Scenario: Switch from photographer to developer
- **WHEN** the user switches mode from photographer to developer
- **THEN** the favicon SHALL change from the camera aperture icon to the code bracket icon without a page reload

### Requirement: Favicon uses theme-appropriate colors
Each favicon variant SHALL use colors that match its respective theme palette.

#### Scenario: Developer icon color
- **WHEN** developer mode is active
- **THEN** the favicon SHALL use the developer theme primary color

#### Scenario: Photographer icon color
- **WHEN** photographer mode is active
- **THEN** the favicon SHALL use the photographer theme primary color

### Requirement: No flash of incorrect favicon
The favicon SHALL be set before the page's first paint via a synchronous inline script, preventing any visible flash of a wrong or missing icon.

#### Scenario: Pre-hydration favicon
- **WHEN** the page HTML is loaded
- **THEN** the favicon `<link>` element SHALL be populated by the inline pre-hydration script before any Vue island hydrates
