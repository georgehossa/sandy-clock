## MODIFIED Requirements

### Requirement: Settings screen contents
The settings screen SHALL contain (a) a list of the four duration presets each with a six-color palette selector, (b) a tone selector with the three bundled tones, (c) a notifications toggle to enable/disable finish notifications, (d) a language toggle (en / es / system), and (e) an About section listing app version and privacy statement.

#### Scenario: All sections present
- **WHEN** the parent enters settings after passing the gate
- **THEN** the screen renders the four preset rows, the tone selector, the notifications toggle, the language toggle, and the About section, in that order

### Requirement: Settings persistence
All settings — preset colors, active tone, notifications enabled, language override — SHALL be persisted in local storage and SHALL survive app restarts and OS-level app kills.

#### Scenario: Settings survive restart
- **WHEN** a parent changes the 3-minute preset color, switches tone to "Soft Bell", disables notifications, and sets language to `es`
- **AND** the app is force-killed and reopened
- **THEN** all four settings remain at the chosen values

## ADDED Requirements

### Requirement: Notifications toggle in settings
The settings screen SHALL include a toggle labeled "Notifications" (localized) that controls whether finish notifications are scheduled. The toggle SHALL reflect the current `notificationsEnabled` store value and update it on change.

#### Scenario: Toggle reflects current state
- **WHEN** the parent opens settings and `notificationsEnabled` is `true`
- **THEN** the notifications toggle is in the ON position

#### Scenario: Toggle disables notifications
- **WHEN** the parent toggles notifications OFF
- **AND** a timer later finishes in the background
- **THEN** no local notification is shown

#### Scenario: Toggle enables notifications
- **WHEN** the parent toggles notifications ON
- **AND** a timer later finishes in the background
- **THEN** a local notification is shown (assuming permission is granted)
