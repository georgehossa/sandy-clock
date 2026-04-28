## ADDED Requirements

### Requirement: 3-minute preset is auto-armed on fresh launch
The Timer Screen SHALL launch with the 3-minute preset armed by default when no persisted state exists. The user SHALL NOT be required to select a preset before rotating the phone.

#### Scenario: Fresh install shows armed state
- **WHEN** the app is launched for the first time (no persisted state)
- **THEN** the 3-minute preset is armed and the prompt text indicates the phone is ready to rotate

#### Scenario: Persisted preset is preserved on relaunch
- **WHEN** the app is relaunched with previously persisted state that includes an armed preset
- **THEN** the persisted preset is used instead of the 3-minute default

### Requirement: Flip detection uses vertical guard only at confirmation
The flip FSM SHALL NOT check the vertical guard (`|normZ|` threshold) when entering the `candidate-flipped` state. The vertical guard SHALL only be checked when confirming the flip after the debounce period.

#### Scenario: Candidate-flipped entered without vertical guard
- **WHEN** normY crosses the flip threshold (-0.7) regardless of normZ value
- **THEN** the FSM transitions from `upright` to `candidate-flipped`

#### Scenario: Flip confirmed only when phone has settled vertically
- **WHEN** the FSM is in `candidate-flipped` and 400ms have elapsed with sustained normY
- **AND** `|normZ|` is below 0.6
- **THEN** the FSM fires the `flip` event and transitions to `flipped`

#### Scenario: Flip blocked when phone is flat after debounce
- **WHEN** the FSM is in `candidate-flipped` and 400ms have elapsed with sustained normY
- **AND** `|normZ|` is 0.6 or above (phone is flat on a surface)
- **THEN** the FSM SHALL NOT fire the `flip` event and SHALL remain in `candidate-flipped`

#### Scenario: Natural rotation gesture succeeds despite mid-rotation normZ spike
- **WHEN** the user rotates the phone 180 degrees in the portrait plane (like a real hourglass)
- **AND** normZ spikes above 0.6 during mid-rotation but settles below 0.6 after rotation completes
- **THEN** the flip is detected and the timer starts

### Requirement: Vertical guard threshold is 0.6
The flip FSM SHALL use 0.6 as the vertical guard threshold for `|normZ|`, allowing phones held at up to approximately 37 degrees from vertical to pass the guard.

#### Scenario: Phone tilted 30 degrees from vertical passes guard
- **WHEN** the phone is held at approximately 30 degrees from vertical after rotation (`|normZ| ≈ 0.5`)
- **THEN** the vertical guard passes and the flip is confirmed

#### Scenario: Phone nearly flat on surface is blocked
- **WHEN** the phone is placed flat on a surface after rotation (`|normZ| ≈ 0.9`)
- **THEN** the vertical guard blocks and the flip is not confirmed

### Requirement: Sensor sign correction is per sensor path
The sign correction for Android SHALL only be applied to the Accelerometer fallback path. The DeviceMotion path SHALL NOT apply sign correction since expo-sensors normalizes Android values to match iOS convention in native code.

#### Scenario: DeviceMotion path on Android uses raw values
- **WHEN** the DeviceMotion sensor is active on Android
- **THEN** no sign inversion is applied to the Y or Z values

#### Scenario: Accelerometer fallback on Android applies sign correction
- **WHEN** the Accelerometer fallback is active on Android
- **THEN** Y and Z values are multiplied by -1 to match iOS convention

### Requirement: Debug overlay is only visible in development builds
The normY and FSM state debug text on the Timer Screen SHALL only render when `__DEV__` is `true`.

#### Scenario: Debug text hidden in production
- **WHEN** the app is running in a production build (`__DEV__` is `false`)
- **THEN** no debug text (normY value, FSM state) is rendered on the Timer Screen

#### Scenario: Debug text visible in development
- **WHEN** the app is running in a development build (`__DEV__` is `true`)
- **THEN** the normY value and FSM state are displayed in the nav bar area
