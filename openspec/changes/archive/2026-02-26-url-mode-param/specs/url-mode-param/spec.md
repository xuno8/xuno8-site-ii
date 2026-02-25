## ADDED Requirements

### Requirement: URL parameter sets initial mode
The system SHALL read the `m` query parameter from the URL on page load to determine the initial mode. The value `p` SHALL map to `photographer` mode and `d` SHALL map to `developer` mode.

#### Scenario: Photographer mode via URL parameter
- **WHEN** a user visits the site with `?m=p` in the URL
- **THEN** the site SHALL initialize in `photographer` mode

#### Scenario: Developer mode via URL parameter
- **WHEN** a user visits the site with `?m=d` in the URL
- **THEN** the site SHALL initialize in `developer` mode

#### Scenario: No parameter defaults to developer
- **WHEN** a user visits the site without a `m` query parameter
- **THEN** the site SHALL initialize in `developer` mode

#### Scenario: Invalid parameter defaults to developer
- **WHEN** a user visits the site with `?m=x` (an unrecognized value)
- **THEN** the site SHALL initialize in `developer` mode

### Requirement: No flash of wrong mode
The URL parameter SHALL be parsed synchronously before first paint, ensuring the correct `data-theme`, favicon, and title are set without any visible flash of the wrong mode.

#### Scenario: Pre-hydration reads URL parameter
- **WHEN** the page HTML is loaded with `?m=p`
- **THEN** the `data-theme` attribute on `<html>` SHALL be `photographer` before any Vue island hydrates

### Requirement: Content display matches URL parameter before hydration
The `#developer-content` and `#photographer-content` elements' display state SHALL be set synchronously by an inline script after the DOM is ready but before Vue hydration, ensuring the correct content is visible without waiting for island hydration.

#### Scenario: Photographer content visible before hydration
- **WHEN** the page HTML is loaded with `?m=p`
- **THEN** `#developer-content` SHALL have `display: none` and `#photographer-content` SHALL have `display: ''` before any Vue island hydrates

#### Scenario: Developer content visible by default
- **WHEN** the page HTML is loaded without `?m=` parameter
- **THEN** `#developer-content` SHALL remain visible and `#photographer-content` SHALL remain `display: none` (SSR default)

### Requirement: Nanostores atom reflects URL parameter
The Nanostores `currentMode` atom SHALL be set to the mode derived from the URL parameter after module evaluation, ensuring all Vue islands receive the correct reactive mode value.

#### Scenario: Atom matches URL parameter
- **WHEN** the page loads with `?m=p`
- **THEN** the `currentMode` atom SHALL have the value `photographer` when Vue islands render

### Requirement: Mode-dependent islands avoid SSR hydration mismatch
The `ModeToggle` and `ModeTransitionController` components SHALL use `client:only="vue"` to render exclusively on the client, avoiding SSR hydration mismatch when the URL parameter changes the mode from the SSR default.

#### Scenario: ModeToggle renders correct state
- **WHEN** the page loads with `?m=p`
- **THEN** the ModeToggle SHALL display "Switch to developer mode" (indicating photographer is active), not the SSR-baked developer state
