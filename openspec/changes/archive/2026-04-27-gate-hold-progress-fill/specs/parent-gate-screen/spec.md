## MODIFIED Requirements

### Requirement: Hold button displays an animated progress fill during hold
While the user holds the hold button, a fill layer SHALL animate from left (0%) to right (100%) across the button over `HOLD_MS` (3000ms). The fill color SHALL be `theme.colors.mintDark`, rendered above the base `theme.colors.mint` background and clipped to the button's border radius.

#### Scenario: Fill starts on press
- **WHEN** the user presses and holds the hold button
- **THEN** a `mintDark` fill layer begins animating from left to right over 3 seconds

#### Scenario: Fill resets on release
- **WHEN** the user releases the hold button before 3 seconds have elapsed
- **THEN** the fill layer resets instantly to 0% width (empty)

#### Scenario: Fill completes at 3 seconds
- **WHEN** the user holds for the full 3 seconds
- **THEN** the fill reaches 100% width and `passGate()` is called

#### Scenario: Fill is clipped to button border radius
- **WHEN** the fill layer is partially filled
- **THEN** the fill does not bleed outside the button's rounded corners
