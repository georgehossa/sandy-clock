## MODIFIED Requirements

### Requirement: Timer Screen respects device safe area insets
The Timer Screen SHALL apply `useSafeAreaInsets()` top inset to the nav bar padding and bottom inset to the controls area, ensuring no content is occluded by the notch, Dynamic Island, or home indicator on any iOS device.

#### Scenario: Nav bar clears the notch
- **WHEN** the Timer Screen renders on a notched iPhone (e.g., iPhone 14 Pro)
- **THEN** the settings gear icon is fully visible below the Dynamic Island / notch

#### Scenario: Controls area clears the home indicator
- **WHEN** the Timer Screen renders on an iPhone with a home indicator
- **THEN** the bottom controls bar (or bottom padding when controls are hidden) sits above the home indicator

### Requirement: Controls bar is gated by SHOW_CONTROLS feature flag
The Reset, Play, and Stop control buttons SHALL only render when `SHOW_CONTROLS` is `true`. When `false`, the controls bar SHALL be entirely absent from the component tree.

#### Scenario: Controls hidden when flag is off
- **WHEN** `SHOW_CONTROLS` is `false`
- **THEN** no Reset, Play, or Stop buttons are rendered on the Timer Screen

#### Scenario: Controls visible when flag is on
- **WHEN** `SHOW_CONTROLS` is `true`
- **THEN** the Reset, Play, and Stop buttons are rendered in the controls bar at the bottom of the Timer Screen
