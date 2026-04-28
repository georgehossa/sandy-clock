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

### Requirement: TIMER section displays equal-width rectangular tiles in a single row
The TIMER section SHALL render duration options as equal-width rectangular tiles (`flex: 1`) in a horizontal row with `gap: 10`, `height: 56`, `cornerRadius: 16` — no horizontal scrolling. Each tile's background SHALL be `presetColors[id]` in all states. All tile text (number + "min") SHALL use `$font-primary` in all states. The active tile SHALL show a 2px `$font-primary` border ring; inactive tiles have no border ring.

#### Scenario: Timer tiles share equal width
- **WHEN** the TIMER section renders
- **THEN** all duration tiles have equal width filling the available row width

#### Scenario: Tile background shows preset color
- **WHEN** the TIMER section renders
- **THEN** each tile's background color matches `presetColors[id]` for that preset (not `$bg-secondary`)

#### Scenario: Active tile has a border ring indicator
- **WHEN** a timer tile is the currently armed preset
- **THEN** a 2px `$font-primary` border ring is visible on the tile

#### Scenario: Inactive tile has no border ring
- **WHEN** a timer tile is not the currently armed preset
- **THEN** no border ring is visible on the tile

#### Scenario: All tile text uses `$font-primary`
- **WHEN** any duration tile renders
- **THEN** the number and "min" label are both in `$font-primary`, regardless of active state

### Requirement: DEFAULT_PRESET_COLORS matches Pencil design values
The default sand color per preset SHALL match the Pencil design timer tile colors exactly.

#### Scenario: Preset colors match design
- **WHEN** the store initializes with default values
- **THEN** `presetColors` maps: 3 min → `#E8945A`, 5 min → `#7B9ACC`, 10 min → `#C47EA0`, 15 min → `#C8A84A`

### Requirement: Sand color changes automatically when a timer preset is selected
When the user selects a timer preset, the hourglass sand color SHALL immediately reflect that preset's color.

#### Scenario: Sand color matches armed preset
- **WHEN** a preset is armed via `arm(id)`
- **THEN** the hourglass sand color uses `presetColors[id]` for that preset

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
