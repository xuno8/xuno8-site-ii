## MODIFIED Requirements

### Requirement: No flash of incorrect favicon
The favicon SHALL be set before the page's first paint via a synchronous inline script, preventing any visible flash of a wrong or missing icon.

#### Scenario: Pre-hydration favicon
- **WHEN** the page HTML is loaded
- **THEN** the favicon `<link>` element SHALL be populated with the icon matching the initial mode (determined by URL parameter or developer default) by the inline pre-hydration script before any Vue island hydrates
