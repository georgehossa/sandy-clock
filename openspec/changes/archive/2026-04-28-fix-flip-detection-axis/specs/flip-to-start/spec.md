## MODIFIED Requirements

### Requirement: Flip detection thresholds
The system SHALL recognize a "flip" when the normalized Y gravity component (`normY = y / |gravity|`) transitions from `normY ≤ −0.7` (portrait upright) to `normY ≥ +0.7` (portrait upside-down), the device is roughly vertical (`|normZ| < 0.5`), and the upside-down orientation is sustained for ≥ 400 ms. The system SHALL apply a platform sign correction so that the same physical gesture produces the same result on iOS and Android.

#### Scenario: Sustained portrait flip starts the run
- **WHEN** a preset is armed and the user rotates the device from portrait upright to portrait upside-down (like flipping a real sand clock) and holds it for at least 400 ms
- **THEN** the run state transitions from `armed` to `running`
- **AND** `startedAt = Date.now()` is recorded

#### Scenario: Horizontal rotation does not start the run
- **WHEN** the user rotates the device horizontally (landscape rotation, screen always facing them)
- **THEN** the run state remains `armed`
- **AND** no timer starts

#### Scenario: Brief flip is ignored
- **WHEN** the device briefly inverts and returns to upright in under 400 ms
- **THEN** the run state remains `armed`
- **AND** no timer starts

#### Scenario: Flat-on-table placement does not start the run
- **WHEN** the device is placed flat face-down on a table (normZ dominant)
- **THEN** the verticality guard (`|normZ| < 0.5`) prevents a flip from being recognized
- **AND** the run state remains unchanged
