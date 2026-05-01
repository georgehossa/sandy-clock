## ADDED Requirements

### Requirement: Timer Screen Play button starts timer when armed
The Play button in the controls bar SHALL start the timer when `runState` is `armed`.

#### Scenario: Play starts countdown from armed state
- **WHEN** the user presses the Play button while `runState` is `armed`
- **THEN** the timer transitions to `running` state and the countdown begins

#### Scenario: Play is disabled when no preset selected
- **WHEN** no preset is armed
- **THEN** the Play button is visually disabled and does not respond to presses

## MODIFIED Requirements

### Requirement: Timer Screen prompt text does not reference rotation
The prompt shown below the hourglass SHALL NOT contain any reference to flipping or rotating the device.

#### Scenario: Armed prompt instructs user to press Play
- **WHEN** a preset is selected and `runState` is `armed`
- **THEN** the prompt text indicates the user should press Play to start

#### Scenario: Idle prompt instructs user to select a preset
- **WHEN** the Timer Screen renders with no preset selected (`armedPresetId` is null)
- **THEN** the prompt text directs the user to select a duration

#### Scenario: Running prompt shows in-progress message
- **WHEN** `runState` is `running`
- **THEN** the prompt text indicates the timer is running and shows remaining time

#### Scenario: Finished prompt shows completion message
- **WHEN** `runState` is `finished`
- **THEN** the prompt text indicates the timer has finished

## REMOVED Requirements

### Requirement: Flip gesture starts timer
**Reason**: Flip gesture has been removed in favor of tap-based controls.
**Migration**: Users now press the Play button to start the timer. No gesture-based activation remains.

### Requirement: Mid-run flip resets and restarts timer
**Reason**: Flip gesture has been removed. Reset is now only available via the Reset button.
**Migration**: Press the Reset button to stop and reset the timer.
