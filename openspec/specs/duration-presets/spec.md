## ADDED Requirements

### Requirement: Fixed duration set
The system SHALL expose exactly four duration presets — 3, 5, 10, and 15 minutes — and SHALL NOT permit users to add, remove, or define custom durations.

#### Scenario: Home screen presents the four presets
- **WHEN** the kid home screen renders
- **THEN** the system displays four selectable controls labeled "3", "5", "10", and "15"
- **AND** no other duration controls are present

#### Scenario: Custom duration entry is impossible
- **WHEN** any user attempts to reach a duration-entry control through navigation, gestures, or settings
- **THEN** no such control exists in any screen of the app

### Requirement: Default preset color mapping
The system SHALL ship with a default color assigned to each preset: 3 min → Sky Blue (`#7DD3FC`), 5 min → Mint Green (`#86EFAC`), 10 min → Sunshine Yellow (`#FDE047`), 15 min → Coral Pink (`#FCA5A5`).

#### Scenario: First launch uses default colors
- **WHEN** the user opens the app for the first time after install
- **THEN** each preset control is rendered in its default color above
- **AND** the persisted preset color store contains the default mapping

### Requirement: Six-color palette for parent reassignment
The system SHALL allow a parent (after passing the parent gate) to reassign each preset's color to any of six palette colors: Sky Blue `#7DD3FC`, Mint Green `#86EFAC`, Sunshine Yellow `#FDE047`, Coral Pink `#FCA5A5`, Lavender `#C4B5FD`, Peach `#FDBA74`. Two presets MAY share the same color.

#### Scenario: Parent reassigns a preset color
- **WHEN** a parent in settings selects a different palette color for the 10-minute preset
- **THEN** the home screen 10-minute control immediately renders in the new color
- **AND** the choice is persisted across app restarts

#### Scenario: Two presets share a color
- **WHEN** a parent assigns the same palette color to the 5- and 10-minute presets
- **THEN** the system accepts the assignment and persists it without warning

### Requirement: Selection state and arming
The system SHALL allow exactly one preset to be selected ("armed") at a time on the home screen, and the armed preset SHALL determine the duration used by a subsequent flip-to-start.

#### Scenario: Selecting a preset arms it
- **WHEN** the child taps the 5-minute preset
- **THEN** the 5-minute control visually highlights with its color
- **AND** any previously armed preset is deselected
- **AND** the run state machine transitions to `armed` with `durationMs = 300000`

#### Scenario: No preset armed at launch
- **WHEN** the app first opens
- **THEN** no preset is armed
- **AND** flipping the device does not start a timer
