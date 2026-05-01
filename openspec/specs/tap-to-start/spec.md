## Requirements

### Requirement: Play button starts timer when armed
The Play button SHALL start the timer countdown when `runState` is `armed` and a preset is selected.

#### Scenario: Play starts countdown
- **WHEN** the user presses the Play button while `runState` is `armed`
- **THEN** `runState` transitions to `running` and the countdown begins

#### Scenario: Play is disabled when no preset armed
- **WHEN** no preset is armed (`armedPresetId` is null)
- **THEN** the Play button is visually disabled (reduced opacity) and pressing it has no effect

#### Scenario: Play shows start icon when armed
- **WHEN** `runState` is `armed`
- **THEN** the Play button displays a play/start icon

#### Scenario: Play shows pause icon when running
- **WHEN** `runState` is `running`
- **THEN** the Play button displays a pause icon

### Requirement: Stop button stops running timer
The Stop button SHALL stop the timer and return to `armed` state, preserving the selected preset.

#### Scenario: Stop halts countdown
- **WHEN** the user presses the Stop button while `runState` is `running`
- **THEN** `runState` transitions to `armed` and the countdown stops

#### Scenario: Stop is disabled when not running
- **WHEN** `runState` is not `running`
- **THEN** the Stop button is visually disabled (reduced opacity) and pressing it has no effect

### Requirement: Reset button resets timer to initial state
The Reset button SHALL reset the timer to `idle` state with no preset armed.

#### Scenario: Reset clears selection
- **WHEN** the user presses the Reset button
- **THEN** `runState` transitions to `idle`, `armedPresetId` becomes null, and the hourglass returns to its initial full-top state

#### Scenario: Reset triggers fill animation on mid-run reset
- **WHEN** the user presses Reset while `runState` is `running`
- **THEN** the reset fill animation plays (top chamber animates to full over ~700ms) before settling to `idle`

### Requirement: Timer prompts guide tap interaction
All on-screen prompts SHALL guide the user to use tap controls, never referencing device rotation or flipping.

#### Scenario: Idle prompt selects preset
- **WHEN** `runState` is `idle`
- **THEN** the prompt text reads "Pick a time!" (or equivalent i18n string)

#### Scenario: Armed prompt presses Play
- **WHEN** `runState` is `armed`
- **THEN** the prompt text reads "Press Play to start!" (or equivalent i18n string)

#### Scenario: Running prompt shows progress
- **WHEN** `runState` is `running`
- **THEN** the prompt text shows the remaining time (e.g., "2:30 left")

#### Scenario: Finished prompt shows completion
- **WHEN** `runState` is `finished`
- **THEN** the prompt text reads "Time's up!" (or equivalent i18n string)
