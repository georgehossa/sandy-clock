## ADDED Requirements

### Requirement: Top chamber is full at rest
When the timer is not running, the top chamber SHALL render completely full and the bottom chamber SHALL render completely empty.

#### Scenario: Idle state shows full top chamber
- **WHEN** the app launches and `runState` is `idle` or `armed`
- **THEN** the top chamber renders as a completely filled circle

#### Scenario: Idle state shows empty bottom chamber
- **WHEN** the app launches and `runState` is `idle` or `armed`
- **THEN** the bottom chamber renders with no visible liquid fill

#### Scenario: After finishing a run the orientation is reversed
- **WHEN** the timer finishes (`runState` transitions to `finished`)
- **THEN** `sandTop` toggles so the next armed state shows the opposite chamber full

### Requirement: `sandTop` canonical initial value is `true`
The persisted store field `sandTop` SHALL default to `true` (liquid in top chamber). All rehydration reset paths for idle, armed, and stale-run states SHALL restore `sandTop` to `true`.

#### Scenario: Cold boot with no prior state
- **WHEN** the app is launched for the first time with no persisted store
- **THEN** `sandTop` is `true` and the top chamber renders full

#### Scenario: Cold boot after stale run
- **WHEN** the app launches with a persisted `runState: running` whose elapsed time exceeds the duration
- **THEN** `sandTop` is reset to `true` and the top chamber renders full

#### Scenario: Cold boot with idle or armed state
- **WHEN** the app launches with a persisted `runState` of `idle` or `armed`
- **THEN** `sandTop` is reset to `true` and the top chamber renders full
