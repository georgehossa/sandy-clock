## ADDED Requirements

### Requirement: Sensor source
The system SHALL use `expo-sensors` `DeviceMotion` (subscribed at 30 Hz) as the sole source for flip-to-start detection and SHALL NOT request any other motion-related permissions.

#### Scenario: DeviceMotion subscription on home mount
- **WHEN** the kid home screen mounts and a preset is armable or armed
- **THEN** the system subscribes to `DeviceMotion` updates at 30 Hz

#### Scenario: Subscription cleanup
- **WHEN** the app moves to background or the run finishes and the home screen unmounts
- **THEN** the `DeviceMotion` subscription is removed within 1 second

### Requirement: Flip detection thresholds
The system SHALL recognize a "flip" when the device's pitch transitions from |pitch| ≤ 30° to |pitch| ≥ 150° and the new orientation is sustained for ≥ 400 ms.

#### Scenario: Sustained flip starts the run
- **WHEN** a preset is armed and the device is rotated to |pitch| ≥ 150° and held for at least 400 ms
- **THEN** the run state transitions from `armed` to `running`
- **AND** `startedAt = Date.now()` is recorded

#### Scenario: Brief flip is ignored
- **WHEN** the device briefly inverts and returns to upright in under 400 ms
- **THEN** the run state remains `armed`
- **AND** no timer starts

### Requirement: Mid-run flip resets and restarts
The system SHALL treat a flip occurring during `running` as a reset: the timer SHALL stop, the sand SHALL re-fill the upper chamber, and a fresh run SHALL start with the same armed preset.

#### Scenario: Mid-run flip restarts
- **WHEN** the user flips the device while the timer is running
- **THEN** within 500 ms the run state cycles `running → idle → running`
- **AND** the new run uses the same armed preset duration

### Requirement: Haptic confirmation on flip
The system SHALL emit a short haptic pulse (`expo-haptics` impact "light") at the moment a flip is recognized and the run starts.

#### Scenario: Flip start haptic
- **WHEN** a flip is recognized and the run transitions to `running`
- **THEN** a single light haptic impact fires

### Requirement: Keep-awake while running
The system SHALL prevent the device screen from sleeping (`expo-keep-awake`) while `runState === 'running'` and SHALL release the lock on `finished` or app background.

#### Scenario: Screen stays awake during a run
- **WHEN** a 10-minute run is in progress and the user does not interact
- **THEN** the screen remains on for the full duration

#### Scenario: Lock released after finish
- **WHEN** the run reaches `finished`
- **THEN** the keep-awake lock is released
- **AND** the device returns to its normal sleep behavior

### Requirement: No flip without armed preset
The system SHALL ignore flips when no preset is armed.

#### Scenario: Flip with nothing armed
- **WHEN** the user flips the device on the home screen with no preset selected
- **THEN** the run state remains `idle`
- **AND** no haptic, no audio, and no animation start
