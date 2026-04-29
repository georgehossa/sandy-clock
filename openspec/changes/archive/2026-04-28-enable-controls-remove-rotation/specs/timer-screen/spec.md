## REMOVED Requirements

### Requirement: 3-minute preset is auto-armed on fresh launch
**Reason**: The "armed" concept (preset selected, waiting for flip) is replaced by explicit Play button press. A preset is still selected by default, but the prompt language no longer references rotation.
**Migration**: The `armedPresetId` defaults to `'3'` and `runState` defaults to `'armed'` in the store initial state — no migration needed. Update prompt strings only.

### Requirement: Flip detection uses vertical guard only at confirmation
**Reason**: Flip detection is removed entirely. The FSM and sensor subscriptions are deleted.
**Migration**: Delete `hooks/flipFsm.ts`, `hooks/useFlipDetector.ts`, and `__tests__/flip-detector.test.ts`.

### Requirement: Vertical guard threshold is 0.6
**Reason**: Flip detection is removed entirely.
**Migration**: No migration needed — remove with the flip detection code.

### Requirement: Sensor sign correction is per sensor path
**Reason**: Flip detection is removed entirely. No sensors are subscribed.
**Migration**: No migration needed — remove with the flip detection code.

### Requirement: Debug overlay is only visible in development builds
**Reason**: The debug overlay showed normY and FSM state from the flip detector. With flip detection removed, there is no debug data to display.
**Migration**: Remove the `__DEV__ && flipDebug` conditional block from the nav bar in `app/(kid)/index.tsx`.

## MODIFIED Requirements

### Requirement: Controls bar is gated by SHOW_CONTROLS feature flag
The Reset, Play, and Stop control buttons SHALL always render. The `SHOW_CONTROLS` flag is removed; controls are unconditionally present.

#### Scenario: Controls always visible
- **WHEN** the Timer Screen renders
- **THEN** the Reset, Play, and Stop buttons are visible regardless of any build configuration

### Requirement: Timer Screen respects device safe area insets
The Timer Screen SHALL apply `useSafeAreaInsets()` top inset to the nav bar padding and bottom inset to the controls area, ensuring no content is occluded by the notch, Dynamic Island, or home indicator on any iOS device.

#### Scenario: Nav bar clears the notch
- **WHEN** the Timer Screen renders on a notched iPhone (e.g., iPhone 14 Pro)
- **THEN** the settings gear icon is fully visible below the Dynamic Island / notch

#### Scenario: Controls area always clears the home indicator
- **WHEN** the Timer Screen renders on an iPhone with a home indicator
- **THEN** the controls bar bottom padding uses the safe area bottom inset (controls are always present, so the conditional `SHOW_CONTROLS ? 0 : insets.bottom` root padding is removed)

## ADDED Requirements

### Requirement: Timer Screen prompt text does not reference rotation
The prompt shown below the hourglass SHALL NOT contain any reference to flipping or rotating the device.

#### Scenario: Idle prompt instructs user to select a preset
- **WHEN** the Timer Screen renders with no preset selected (`armedPresetId` is null)
- **THEN** the prompt text directs the user to select a duration

#### Scenario: Armed prompt instructs user to press Play
- **WHEN** a preset is selected and `runState` is `armed`
- **THEN** the prompt text indicates the user should press Play to start

#### Scenario: Running prompt shows in-progress message
- **WHEN** `runState` is `running`
- **THEN** the prompt text indicates the timer is running

#### Scenario: Finished prompt shows completion message
- **WHEN** `runState` is `finished`
- **THEN** the prompt text indicates the timer has finished

### Requirement: Keep-awake activates while timer is running
The Timer Screen SHALL activate keep-awake when `runState` transitions to `running` and deactivate it when the run ends, preventing the screen from sleeping mid-timer.

#### Scenario: Screen stays awake during run
- **WHEN** the user presses Play and `runState` becomes `running`
- **THEN** keep-awake is activated for the duration of the run

#### Scenario: Screen allows sleep after run ends
- **WHEN** `runState` transitions away from `running` (stop, finish, reset-then-stop)
- **THEN** keep-awake is deactivated
