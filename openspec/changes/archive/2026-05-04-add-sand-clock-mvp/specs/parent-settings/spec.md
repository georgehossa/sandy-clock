## ADDED Requirements

### Requirement: Parent gate before settings
The system SHALL require a parent-gate challenge to be passed before exposing the settings screen, and SHALL reset the gate state whenever the app moves to background.

#### Scenario: Gate blocks direct entry
- **WHEN** the user taps the gear icon on the home screen
- **THEN** the system navigates to the parent-gate screen, not the settings screen

#### Scenario: Gate state resets on background
- **WHEN** the parent has just passed the gate and the app is moved to background, then reopened
- **THEN** the user must pass the gate again to reach settings

### Requirement: Dual-mode parent challenge
The parent gate SHALL offer two challenge modes — a 3-second long-press and a "tap the number 7" 3×3 digit grid — and the user SHALL pass either to proceed.

#### Scenario: Long-press passes
- **WHEN** the user holds a finger on the long-press target for ≥ 3 seconds
- **THEN** the gate is considered passed and the settings screen is shown

#### Scenario: Tap-the-7 passes
- **WHEN** the digit grid is shown and the user taps the cell containing "7"
- **THEN** the gate is considered passed and the settings screen is shown

#### Scenario: Wrong digit does not pass
- **WHEN** the user taps any cell that does not contain "7"
- **THEN** the gate remains unpassed
- **AND** the digit positions are reshuffled

### Requirement: Settings screen contents
The settings screen SHALL contain (a) a list of the four duration presets each with a six-color palette selector, (b) a tone selector with the three bundled tones, (c) a language toggle (en / es / system), and (d) an About section listing app version and privacy statement.

#### Scenario: All sections present
- **WHEN** the parent enters settings after passing the gate
- **THEN** the screen renders the four preset rows, the tone selector, the language toggle, and the About section, in that order

### Requirement: Privacy statement copy
The About section SHALL include the verbatim statement (translated for `es`): "We collect nothing. The app works fully offline." and SHALL NOT include any tracking-related copy.

#### Scenario: English privacy text
- **WHEN** the language is `en`
- **THEN** the About section shows "We collect nothing. The app works fully offline."

#### Scenario: Spanish privacy text
- **WHEN** the language is `es`
- **THEN** the About section shows the Spanish translation of the same statement

### Requirement: Settings persistence
All settings — preset colors, active tone, language override — SHALL be persisted in local storage and SHALL survive app restarts and OS-level app kills.

#### Scenario: Settings survive restart
- **WHEN** a parent changes the 3-minute preset color, switches tone to "Soft Bell", and sets language to `es`
- **AND** the app is force-killed and reopened
- **THEN** all three settings remain at the chosen values
