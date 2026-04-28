## ADDED Requirements

### Requirement: Settings Screen uses design token background color
The Settings Screen SHALL use `theme.colors.bgPrimary` (`#F5F0EB`) as the full-screen background.

#### Scenario: Background matches design
- **WHEN** the Settings Screen renders
- **THEN** the root view background is `#F5F0EB`

### Requirement: Settings Screen header shows back button, title, and gear icon
The Settings Screen header SHALL display a `<` back chevron on the left, the title "Settings" using Inter 24px weight-600 in `theme.colors.fontPrimary` centered, and a gear icon on the right — all in a single horizontal row.

#### Scenario: Header renders three elements
- **WHEN** the Settings Screen renders
- **THEN** a back chevron, "Settings" title, and gear icon are visible in the header row

#### Scenario: Back button navigates back
- **WHEN** the user taps the back chevron
- **THEN** `router.back()` is called

### Requirement: TIMER section shows horizontal pill duration buttons
The Settings Screen TIMER section SHALL display a horizontal scrollable row of pill-shaped duration buttons showing the durations `[5, 10, 15, 25, 30]` minutes. The active selection SHALL use `theme.colors.mint` background with `theme.colors.fontPrimary` text; inactive pills SHALL use `theme.colors.bgSecondary` background with `theme.colors.fontSecondary` text.

#### Scenario: Active duration pill is highlighted
- **WHEN** a duration is selected and the Settings Screen renders
- **THEN** the corresponding pill button has `theme.colors.mint` background

#### Scenario: Inactive duration pills are muted
- **WHEN** a duration pill is not selected
- **THEN** it has `theme.colors.bgSecondary` background and `theme.colors.fontSecondary` text

#### Scenario: All 5 durations are shown
- **WHEN** the TIMER section renders
- **THEN** pills for 5, 10, 15, 25, and 30 minutes are all visible

### Requirement: COLOR section shows circular swatches in a horizontal row
The Settings Screen COLOR section SHALL display circular color swatches (36×36) in a horizontal row, one per palette color. The active swatch SHALL display a ring/border indicator.

#### Scenario: Active swatch has ring indicator
- **WHEN** a color swatch is selected
- **THEN** it displays a 2px ring border using `theme.colors.fontPrimary`

### Requirement: SOUND section shows options in a rounded card
The Settings Screen SOUND section SHALL render sound options inside a rounded card (cornerRadius 16, background `theme.colors.bgSecondary`), each row showing an icon and label. The active option shows a checkmark.

#### Scenario: Active sound option shows checkmark
- **WHEN** a sound is selected and the SOUND section renders
- **THEN** the active row displays a checkmark icon in `theme.colors.mint`

#### Scenario: Sound card uses rounded corners
- **WHEN** the SOUND section card renders
- **THEN** the container has `borderRadius: 16`

### Requirement: Section labels use uppercase spaced typography
Section labels (TIMER, COLOR, SOUND) SHALL use `theme.colors.fontTertiary`, font size 12, weight 600, and `letterSpacing: 1.5`.

#### Scenario: Section label typography matches design
- **WHEN** any section label renders
- **THEN** it uses color `#9AADA5`, fontSize 12, fontWeight `'600'`, and letterSpacing 1.5

## MODIFIED Requirements

### Requirement: Settings Screen respects device safe area insets
The Settings Screen SHALL apply `useSafeAreaInsets()` top inset to the header area and bottom inset to the scroll content padding, ensuring no content is occluded by the notch, Dynamic Island, or home indicator on any iOS device.

#### Scenario: Header clears the notch
- **WHEN** the Settings Screen renders on a notched iPhone
- **THEN** the back chevron, "Settings" title, and gear icon are fully visible below the Dynamic Island / notch

#### Scenario: Scroll content clears the home indicator
- **WHEN** the Settings Screen renders on an iPhone with a home indicator
- **THEN** the last item in the scroll view can be scrolled fully above the home indicator without being obscured
