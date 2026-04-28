## ADDED Requirements

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
