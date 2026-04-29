## ADDED Requirements

### Requirement: Top chamber animates to full on mid-run reset
When the timer is reset while running, the top chamber fill level SHALL animate from its current level to completely full using an ease-out cubic curve over approximately 700ms.

#### Scenario: Top chamber rises on reset
- **WHEN** the user triggers a reset while `runState` is `running`
- **THEN** the top chamber liquid level visibly rises from its current fill level to completely full over ~700ms

#### Scenario: Bottom chamber drains on reset
- **WHEN** the reset fill animation is active
- **THEN** the bottom chamber liquid level descends from its current level to empty, mirroring the top chamber fill

#### Scenario: Fill animation uses ease-out curve
- **WHEN** the reset fill animation plays
- **THEN** the liquid rises quickly at first and slows as it approaches the top (ease-out cubic easing)

#### Scenario: Animation only triggers on mid-run reset
- **WHEN** the timer starts from `idle` or `armed` (not a mid-run reset)
- **THEN** no fill animation plays — the top chamber is already full at rest

#### Scenario: Pour stream hidden during fill animation
- **WHEN** the reset fill animation is active
- **THEN** the pour stream between chambers is not rendered

#### Scenario: Reduce-motion skips animation
- **WHEN** the OS reduce-motion accessibility setting is enabled
- **THEN** the top chamber snaps to full immediately on reset with no animation
