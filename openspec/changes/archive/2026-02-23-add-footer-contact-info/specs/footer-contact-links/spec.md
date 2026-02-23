## ADDED Requirements

### Requirement: Footer SHALL display social media icon links
Footer SHALL render icon links for each entry in `site.yaml` `socialLinks` array (GitHub, LinkedIn, Instagram). Each link SHALL open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

#### Scenario: All social links rendered
- **WHEN** the page loads
- **THEN** Footer displays clickable icon links for GitHub, LinkedIn, and Instagram, each pointing to the corresponding URL from `site.yaml`

#### Scenario: Links open in new tab
- **WHEN** user clicks a social link icon
- **THEN** the link opens in a new browser tab

### Requirement: Footer SHALL display an email link
Footer SHALL render an email icon link using the `email` field from `site.yaml` with a `mailto:` href. The email link SHALL be visually consistent with social icon links.

#### Scenario: Email link rendered
- **WHEN** the page loads
- **THEN** Footer displays a clickable email icon link with `href="mailto:{email}"`

#### Scenario: Email link opens mail client
- **WHEN** user clicks the email icon
- **THEN** the system opens the default mail client with the email address pre-filled

### Requirement: Contact links SHALL support dual themes
All contact link icons in the Footer SHALL use CSS custom properties for coloring, adapting to both developer and photographer themes via the `data-theme` attribute.

#### Scenario: Developer theme styling
- **WHEN** `data-theme="developer"` is set on `<html>`
- **THEN** contact icons use the developer theme's text-muted color, with hover transitioning to the primary accent color

#### Scenario: Photographer theme styling
- **WHEN** `data-theme="photographer"` is set on `<html>`
- **THEN** contact icons use the photographer theme's text-muted color, with hover transitioning to the primary accent color

### Requirement: Contact links SHALL have accessible labels
Each contact icon link SHALL include an `aria-label` attribute with the platform name (e.g., "GitHub", "LinkedIn", "Instagram", "Email") for screen reader accessibility.

#### Scenario: Screen reader announces link purpose
- **WHEN** a screen reader focuses on a contact icon link
- **THEN** it announces the platform name (e.g., "GitHub")
