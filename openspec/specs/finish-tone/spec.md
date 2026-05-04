## ADDED Requirements

### Requirement: Three bundled finish tones
The system SHALL bundle exactly three finish tones — "Bubble Pop" (kid-playful), "Magic Chime" (kid-gentle), and "Soft Bell" (neutral) — each shipped as an audio asset under `assets/audio/`.

#### Scenario: Tones available offline
- **WHEN** the app runs with no network access
- **THEN** all three tones are playable from local bundled assets

### Requirement: Tone selection and persistence
The system SHALL allow a parent (after passing the parent gate) to choose exactly one of the three tones as the active finish tone, and SHALL persist the choice in local storage. The default on first launch SHALL be "Magic Chime".

#### Scenario: Default tone on first launch
- **WHEN** the app starts for the first time after install
- **THEN** the active tone is "Magic Chime"

#### Scenario: Selection persists across restarts
- **WHEN** a parent selects "Soft Bell" in settings and closes the app
- **AND** the app is reopened later
- **THEN** the active tone remains "Soft Bell"

### Requirement: Tone preview in settings
The system SHALL play the selected tone once when a parent taps a tone option in settings, allowing audition before commit.

#### Scenario: Tap previews the tone
- **WHEN** the parent taps the "Bubble Pop" option in settings
- **THEN** the tone plays once at standard playback volume
- **AND** the option becomes the active selection

### Requirement: Single-shot playback at finish
The system SHALL play the active tone exactly once when `runState` transitions to `finished`, and SHALL NOT loop or replay.

#### Scenario: Play once at finish
- **WHEN** the sand fully empties from the upper chamber
- **THEN** the active tone plays exactly once
- **AND** no further audio plays unless the user starts a new run

### Requirement: Audio length and loudness
Each bundled tone SHALL be ≤ 2.0 seconds long and SHALL be loudness-normalized to within ±1 LUFS of the others.

#### Scenario: Length bound
- **WHEN** any of the three audio files is inspected
- **THEN** its duration is ≤ 2.0 seconds

### Requirement: Respect system mute, do not override silent mode
The system SHALL honor the device system mute / silent switch and SHALL NOT configure the audio session to override silent mode.

#### Scenario: Silent mode suppresses the tone
- **WHEN** the device is in silent mode and a run finishes
- **THEN** no audio is played
- **AND** the visual `finished` state still renders normally

### Requirement: Asset attribution
Each bundled tone SHALL have a corresponding entry in `assets/audio/SOURCES.md` recording: source URL, author handle, license (CC0 or equivalent), download date, and the local filename.

#### Scenario: SOURCES.md complete
- **WHEN** any tone is added or replaced under `assets/audio/`
- **THEN** `assets/audio/SOURCES.md` contains a matching entry with all five fields above
