## ADDED Requirements

### Requirement: Hidden input element for command capture
The terminal body SHALL contain a hidden `<input>` element (visually invisible via `opacity: 0; position: absolute`) that captures keyboard input on desktop viewports (>= 768px).

Clicking anywhere on the terminal body (outside of existing interactive elements such as links) SHALL focus the hidden input.

The input SHALL be disabled during effect execution and animation replay states.

#### Scenario: Clicking terminal focuses input
- **WHEN** the user clicks on the terminal body area (not on a social link or other interactive element) on a desktop viewport
- **THEN** the hidden input receives focus and the cursor begins accepting keyboard input

#### Scenario: Input is not activated on mobile
- **WHEN** the viewport width is less than 768px
- **THEN** the hidden input element is not rendered or is permanently disabled, and the static blinking cursor is displayed instead

### Requirement: Visible input line mirroring
The final prompt line SHALL display `$ ` followed by the current input text and a blinking block cursor (`█`). The displayed text SHALL update in real-time as the user types into the hidden input.

#### Scenario: Typed characters appear in prompt
- **WHEN** the user types "mat" into the hidden input
- **THEN** the final prompt line displays `$ mat█`

#### Scenario: Backspace removes characters
- **WHEN** the user presses Backspace
- **THEN** the last character is removed from the displayed input text

### Requirement: Command execution on Enter
Pressing Enter SHALL submit the current input text as a command. The system SHALL:
1. Clear the input field
2. Display the executed command as a prompt line (e.g., `$ clear`)
3. Execute the command handler if recognized
4. Display `bash: <command>: command not found` if not recognized

#### Scenario: Known command is executed
- **WHEN** the user types "clear" and presses Enter
- **THEN** the input clears and the clear command handler is triggered

#### Scenario: Unknown command shows error
- **WHEN** the user types "hello" and presses Enter
- **THEN** the input clears, `$ hello` appears as a history line, and `bash: hello: command not found` is displayed as output

#### Scenario: Empty input is ignored
- **WHEN** the user presses Enter with an empty input
- **THEN** nothing happens; no command history line is added

### Requirement: Terminal interaction state machine
The terminal SHALL maintain one of four states: `idle`, `typing`, `executing`, `animating`.

- `idle`: Input is enabled, cursor blinks, awaiting input
- `typing`: User is actively typing, cursor shows after text
- `executing`: Command submitted, processing
- `animating`: Visual effect or animation replay in progress, input disabled

#### Scenario: Input disabled during animation
- **WHEN** an animation replay (e.g., clear) is currently playing
- **THEN** keyboard input is ignored and the hidden input is disabled

#### Scenario: State returns to idle after effect
- **WHEN** a visual effect completes
- **THEN** the terminal state returns to `idle`, the input is re-enabled, and the cursor resumes blinking

### Requirement: Command history display
The terminal SHALL display only the most recent command's prompt line and output. When a new command is executed, any previous command history lines SHALL be removed before displaying the new command.

#### Scenario: Previous command output is replaced
- **WHEN** the user executes "bar" after previously executing "foo"
- **THEN** the "$ foo" prompt line and its output are removed, and "$ bar" with its output are displayed

#### Scenario: Command not found output is replaced by next command
- **WHEN** the user types "foo" (showing command not found) then types "clear"
- **THEN** the "$ foo" line and error message are removed, and the clear command executes
