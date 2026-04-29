### Requirement: Confetti triggers on timer finish
The system SHALL display a confetti particle animation when the timer `runState` transitions to `finished`.

#### Scenario: Timer completes normally
- **WHEN** the timer progress reaches 100% and `runState` becomes `finished`
- **THEN** confetti particles SHALL burst from the play button area and animate upward/outward across the screen

#### Scenario: Timer finishes after app returns from background
- **WHEN** the app returns to foreground and the elapsed time exceeds the preset duration (causing immediate `finished` state)
- **THEN** confetti SHALL still trigger as normal

### Requirement: Confetti originates from play button
The confetti emission origin SHALL be the center of the play button at the bottom of the timer screen.

#### Scenario: Particles spread from button center
- **WHEN** confetti triggers
- **THEN** all particles SHALL originate from the measured center position of the play button and spread outward in random directions (upward-biased arc)

### Requirement: Confetti auto-dismisses
The confetti animation SHALL be self-terminating and not require user interaction to clear.

#### Scenario: Animation completes naturally
- **WHEN** the confetti animation has been playing for approximately 2-3 seconds
- **THEN** all particles SHALL have finished their trajectories and the overlay SHALL be cleared

#### Scenario: User resets timer before confetti finishes
- **WHEN** the user resets or stops the timer while confetti is still animating
- **THEN** the confetti SHALL immediately stop and be removed

### Requirement: Confetti respects reduce-motion
The confetti animation SHALL be disabled when the OS reduce-motion accessibility setting is enabled.

#### Scenario: Reduce-motion is active
- **WHEN** the timer finishes AND the device has reduce-motion enabled
- **THEN** no confetti animation SHALL be displayed

### Requirement: Confetti adapts to device tier
The system SHALL scale the number of confetti particles based on the detected device tier to maintain frame rate.

#### Scenario: High-tier device
- **WHEN** the device tier is `high`
- **THEN** the system SHALL render approximately 40 particles with full rotation

#### Scenario: Mid-tier device
- **WHEN** the device tier is `mid`
- **THEN** the system SHALL render approximately 20 particles

#### Scenario: Low-tier device
- **WHEN** the device tier is `low`
- **THEN** the system SHALL render approximately 10 particles with simplified trajectories

### Requirement: Confetti overlay does not block interaction
The confetti overlay SHALL not intercept touch events on underlying UI elements.

#### Scenario: User taps play button during confetti
- **WHEN** confetti is animating AND the user taps the play button
- **THEN** the tap SHALL pass through the confetti overlay and trigger the button action

### Requirement: No new dependencies
The confetti system SHALL be built using only existing project dependencies (`@shopify/react-native-skia` and `react-native-reanimated`).

#### Scenario: Dependency audit
- **WHEN** the confetti feature is implemented
- **THEN** `package.json` SHALL have no new entries in `dependencies` or `devDependencies` related to confetti or particle effects
