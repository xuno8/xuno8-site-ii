### Requirement: SVG favicon rendered on page load
The system SHALL render the developer mode SVG favicon (code bracket `</>` icon) in the browser tab on initial page load.

#### Scenario: Developer mode favicon on page load
- **WHEN** a user visits the site
- **THEN** the browser tab SHALL display a code bracket (`</>`) SVG icon

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
- **THEN** the favicon `<link>` element SHALL be populated with the developer icon by the inline pre-hydration script before any Vue island hydrates
