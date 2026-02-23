### Requirement: Document title reflects active mode on load
The system SHALL set `document.title` on page load to reflect the active mode.

#### Scenario: Developer mode title
- **WHEN** the page loads with developer mode active
- **THEN** `document.title` SHALL be `Tim Lin — Software Engineer`

#### Scenario: Photographer mode title
- **WHEN** the page loads with photographer mode active
- **THEN** `document.title` SHALL be `Tim Lin — Photographer`

### Requirement: Document title updates on mode toggle
The system SHALL update `document.title` immediately when the user toggles between modes.

#### Scenario: Switch to photographer mode
- **WHEN** the user switches mode from developer to photographer
- **THEN** `document.title` SHALL change to `Tim Lin — Photographer`

#### Scenario: Switch to developer mode
- **WHEN** the user switches mode from photographer to developer
- **THEN** `document.title` SHALL change to `Tim Lin — Software Engineer`

### Requirement: No flash of incorrect title
The document title SHALL be set before any Vue island hydrates, using the synchronous pre-hydration inline script.

#### Scenario: Pre-hydration title
- **WHEN** the page HTML is parsed
- **THEN** `document.title` SHALL already reflect the correct mode before hydration completes
