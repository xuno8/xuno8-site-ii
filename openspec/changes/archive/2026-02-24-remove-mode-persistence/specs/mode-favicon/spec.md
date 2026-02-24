## REMOVED Requirements

### Requirement: SVG favicon rendered on page load
**Reason**: Mode persistence is being removed. The favicon no longer needs to consider a persisted mode — it always starts as the developer icon. The existing "Developer mode favicon on first visit" scenario already covers the correct behavior. The "Photographer mode favicon from persisted mode" scenario is no longer valid.
**Migration**: The favicon on load is always the developer icon. No persisted-mode branching needed.

## MODIFIED Requirements

### Requirement: SVG favicon rendered on page load
The system SHALL render the developer mode SVG favicon (code bracket `</>` icon) in the browser tab on initial page load.

#### Scenario: Developer mode favicon on page load
- **WHEN** a user visits the site
- **THEN** the browser tab SHALL display a code bracket (`</>`) SVG icon

### Requirement: No flash of incorrect favicon
The favicon SHALL be set before the page's first paint via a synchronous inline script, preventing any visible flash of a wrong or missing icon.

#### Scenario: Pre-hydration favicon
- **WHEN** the page HTML is loaded
- **THEN** the favicon `<link>` element SHALL be populated with the developer icon by the inline pre-hydration script before any Vue island hydrates
