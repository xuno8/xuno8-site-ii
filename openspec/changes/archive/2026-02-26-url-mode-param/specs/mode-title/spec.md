## MODIFIED Requirements

### Requirement: No flash of incorrect title
The document title SHALL be set before any Vue island hydrates, using the synchronous pre-hydration inline script.

#### Scenario: Pre-hydration title
- **WHEN** the page HTML is parsed
- **THEN** `document.title` SHALL already reflect the initial mode (determined by URL parameter or developer default) before hydration completes
