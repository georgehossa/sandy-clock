## Requirements

### Requirement: Timer Screen uses design token colors
The Timer Screen SHALL use `theme.colors.bgPrimary` (`#F5F0EB`) as the full-screen background color.

#### Scenario: Background color matches design
- **WHEN** the Timer Screen renders
- **THEN** the root view background color is `#F5F0EB`

### Requirement: Timer Screen status bar is dark-content
The Timer Screen SHALL display a dark-content status bar (dark icons on light background).

#### Scenario: Status bar style is correct
- **WHEN** the Timer Screen is active
- **THEN** the status bar uses `dark-content` style

### Requirement: Timer Screen displays a controls bar with Reset, Play, and Stop buttons
The Timer Screen SHALL render a bottom controls bar containing three buttons: Reset (circular, secondary style), Play (larger circle, mint fill), and Stop (circular, secondary style), laid out horizontally with consistent gap.

#### Scenario: Controls bar renders three buttons
- **WHEN** the Timer Screen renders
- **THEN** a Reset button, Play button, and Stop button are visible in a horizontal row at the bottom of the screen

#### Scenario: Play button is visually prominent
- **WHEN** the controls bar renders
- **THEN** the Play button is larger than Reset and Stop (72×72 vs 56×56) and uses `theme.colors.mint` as its background

#### Scenario: Secondary buttons use bgSecondary fill
- **WHEN** the controls bar renders
- **THEN** Reset and Stop buttons use `theme.colors.bgSecondary` as their background color

### Requirement: Timer Screen Play button starts timer when armed
The Play button in the controls bar SHALL start the timer when `runState` is `armed`.

#### Scenario: Play starts countdown from armed state
- **WHEN** the user presses the Play button while `runState` is `armed`
- **THEN** the timer transitions to `running` state and the countdown begins

#### Scenario: Play is disabled when no preset selected
- **WHEN** no preset is armed
- **THEN** the Play button is visually disabled and does not respond to presses

### Requirement: Timer Screen uses Inter font for all text
The Timer Screen SHALL render all text using the Inter font family from `theme.font.family`.

#### Scenario: Prompt text uses Inter
- **WHEN** the Timer Screen renders any text element
- **THEN** the `fontFamily` style is `'Inter'`

### Requirement: Settings navigation icon uses theme color
The Timer Screen navigation bar SHALL show a settings gear icon using `theme.colors.fontPrimary` as its fill color.

#### Scenario: Gear icon color matches design
- **WHEN** the Timer Screen nav bar renders
- **THEN** the settings gear icon color is `#2D3B36`

### Requirement: 3-minute preset is auto-armed on fresh launch
The Timer Screen SHALL launch with the 3-minute preset armed by default when no persisted state exists.

#### Scenario: Persisted preset is preserved on relaunch
- **WHEN** the app is relaunched with previously persisted state that includes an armed preset
- **THEN** the persisted preset is used instead of the 3-minute default

### Requirement: Timer Screen respects device safe area insets
The Timer Screen SHALL apply `useSafeAreaInsets()` top inset to the nav bar padding and bottom inset to the controls area, ensuring no content is occluded by the notch, Dynamic Island, or home indicator on any iOS device.

#### Scenario: Nav bar clears the notch
- **WHEN** the Timer Screen renders on a notched iPhone (e.g., iPhone 14 Pro)
- **THEN** the settings gear icon is fully visible below the Dynamic Island / notch

#### Scenario: Controls area always clears the home indicator
- **WHEN** the Timer Screen renders on an iPhone with a home indicator
- **THEN** the controls bar bottom padding uses the safe area bottom inset (controls are always present, so the conditional `SHOW_CONTROLS ? 0 : insets.bottom` root padding is removed)

### Requirement: Controls bar always renders
The Reset, Play, and Stop control buttons SHALL always render. Controls are unconditionally present.

#### Scenario: Controls always visible
- **WHEN** the Timer Screen renders
- **THEN** the Reset, Play, and Stop buttons are visible regardless of any build configuration

### Requirement: Timer Screen prompt text does not reference rotation
The prompt shown below the hourglass SHALL NOT contain any reference to flipping or rotating the device.

#### Scenario: Idle prompt instructs user to select a preset
- **WHEN** the Timer Screen renders with no preset selected (`armedPresetId` is null)
- **THEN** the prompt text directs the user to select a duration

#### Scenario: Armed prompt instructs user to press Play
- **WHEN** a preset is selected and `runState` is `armed`
- **THEN** the prompt text indicates the user should press Play to start

#### Scenario: Running prompt shows in-progress message
- **WHEN** `runState` is `running`
- **THEN** the prompt text indicates the timer is running

#### Scenario: Finished prompt shows completion message
- **WHEN** `runState` is `finished`
- **THEN** the prompt text indicates the timer has finished

### Requirement: Keep-awake activates while timer is running
The Timer Screen SHALL activate keep-awake when `runState` transitions to `running` and deactivate it when the run ends, preventing the screen from sleeping mid-timer.

#### Scenario: Screen stays awake during run
- **WHEN** the user presses Play and `runState` becomes `running`
- **THEN** keep-awake is activated for the duration of the run

#### Scenario: Screen allows sleep after run ends
- **WHEN** `runState` transitions away from `running` (stop, finish, reset-then-stop)
- **THEN** keep-awake is deactivated
