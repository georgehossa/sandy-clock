## ADDED Requirements

### Requirement: Two-chamber hourglass rendering
The system SHALL render a two-chamber hourglass as the central visual on the home and run screens, using a Skia canvas, scaled to fit portrait orientation.

#### Scenario: Hourglass present at idle and running
- **WHEN** the home screen is visible in `idle`, `armed`, `running`, or `finished` state
- **THEN** the Skia hourglass canvas is mounted and visible at center

### Requirement: Drift-free sand level interpolation
The system SHALL interpolate the upper-chamber sand level from 100% to 0% (and the lower chamber inversely) using elapsed wall-clock time `(now - startedAt) / durationMs`, computed each animation frame.

#### Scenario: Progress matches elapsed time
- **WHEN** a 3-minute run has been active for exactly 90 seconds
- **THEN** the upper-chamber sand level is 50% (±2%)
- **AND** the lower-chamber sand level is 50% (±2%)

#### Scenario: Drift bounded across long runs
- **WHEN** a 15-minute run completes naturally
- **THEN** the elapsed time at the `finished` transition is within 100 ms of 900 000 ms

### Requirement: Falling sand stream
The system SHALL render a thin column of sand particles falling from the upper to the lower chamber while `runState === 'running'`, with gravity and slight horizontal jitter.

#### Scenario: Stream visible while running
- **WHEN** a run is in progress with sand levels strictly between 0% and 100%
- **THEN** a vertical particle stream is rendered between the two chambers

#### Scenario: Stream absent at idle and finish
- **WHEN** `runState` is `idle`, `armed`, or `finished`
- **THEN** no falling stream particles are rendered

### Requirement: Glitter shimmer
The system SHALL render glitter particles within the sand mass of each chamber, with subtle alpha and scale shimmer at ~16 ms tick, tinted to the active preset color.

#### Scenario: Glitter tinted by preset
- **WHEN** the 5-minute preset (Mint Green by default) is armed and running
- **THEN** glitter particles are rendered tinted toward the preset's color

#### Scenario: Particle count by device tier
- **WHEN** the device tier is "high" (≥4 GB RAM)
- **THEN** up to 50 glitter particles per chamber are rendered
- **AND** when the tier is "mid" (2–4 GB), up to 30 particles per chamber
- **AND** when the tier is "low" (<2 GB), 0 glitter particles by default

### Requirement: Reduce-motion fallback
The system SHALL detect the OS reduce-motion setting and, when enabled, SHALL disable glitter shimmer and animate the sand level via discrete updates at most every 1 second, while preserving the visual affordance of falling sand.

#### Scenario: Reduce-motion enabled
- **WHEN** `AccessibilityInfo.isReduceMotionEnabled()` returns `true`
- **THEN** no glitter particles are rendered
- **AND** the sand level updates at most once per second
- **AND** the fall stream is rendered as a static thin column rather than animated particles

### Requirement: Frame-rate target and graceful degradation
The system SHALL target 60 fps on devices in the "high" or "mid" tiers and SHALL accept 30 fps on the "low" tier, without crashing or stalling on any supported device.

#### Scenario: Mid-tier sustains 60 fps
- **WHEN** running a 5-minute timer on an iPhone 12 or Pixel 6
- **THEN** average rendered FPS over the run is ≥58 fps

#### Scenario: Low-tier remains responsive
- **WHEN** running a 5-minute timer on a Pixel 4a–class device
- **THEN** the app does not crash or freeze
- **AND** rendered FPS is ≥28 fps on average
