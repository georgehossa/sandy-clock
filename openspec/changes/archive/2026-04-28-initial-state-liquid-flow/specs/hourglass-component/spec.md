## MODIFIED Requirements

### Requirement: Fall stream is a continuous liquid pour
The fall stream between chambers SHALL render as a continuous narrow filled shape (not discrete particles) when the timer is running.

#### Scenario: Pour stream visible during running state
- **WHEN** the timer `runState` is `running`
- **THEN** a continuous narrow stream shape is visible connecting the top and bottom chambers through the neck zone

#### Scenario: Pour stream hidden when not running
- **WHEN** the timer `runState` is not `running`
- **THEN** no pour stream is rendered

#### Scenario: Pour stream has gentle width oscillation
- **WHEN** the pour stream renders during running state
- **THEN** the stream width oscillates subtly over time to create a flowing liquid appearance

#### Scenario: Pour stream opacity decreases as top chamber empties
- **WHEN** the timer is running and progressing from start to finish
- **THEN** the stream opacity is highest at the start (top full) and decreases toward the end (top nearly empty)

#### Scenario: Pour stream is rendered inside the Hourglass canvas
- **WHEN** the timer is running
- **THEN** the `FallStream` component is rendered as a child of the Hourglass `Canvas` between the liquid fills and surface effects

## ADDED Requirements

### Requirement: Store version migration resets to top-full initial state
On store version upgrade, the migration SHALL reset `sandTop` to `true` so that existing installs snap to the correct top-full visual on first launch.

#### Scenario: Store migrates from any prior version
- **WHEN** the persisted store version is older than the current version
- **THEN** the migration resets all persisted fields to `initialPersisted`, which includes `sandTop: true`
