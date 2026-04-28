## MODIFIED Requirements

### Requirement: Settings Screen does not show a standalone COLOR section
The Settings Screen SHALL NOT render a separate COLOR section. Color is intrinsic to each preset tile.

#### Scenario: No COLOR section visible
- **WHEN** the Settings Screen renders
- **THEN** no "COLOR" label, swatch row, or color selection UI is visible

### Requirement: Each timer tile background uses the preset's assigned color
Each timer tile in the TIMER section SHALL use the preset's assigned color (`presetColors[id]`) as its full background fill, regardless of whether it is the active preset. The tile text (number + "min") SHALL use `theme.colors.fontPrimary` in all states.

#### Scenario: Tile background shows preset color
- **WHEN** the TIMER section renders
- **THEN** each tile's background color matches `presetColors[id]` for that preset (not `$bg-secondary`)

#### Scenario: Active tile has a border ring indicator
- **WHEN** a timer tile is the currently armed preset
- **THEN** a 2px `$font-primary` border ring is visible on the tile

#### Scenario: Inactive tile has no border ring
- **WHEN** a timer tile is not the currently armed preset
- **THEN** no border ring is visible on the tile

### Requirement: DEFAULT_PRESET_COLORS matches Pencil design values
The default sand color per preset SHALL match the Pencil design timer tile colors exactly.

#### Scenario: Preset colors match design
- **WHEN** the store initializes with default values
- **THEN** `presetColors` maps: 5 min → `#E8945A`, 10 min → `#7B9ACC`, 15 min → `#C47EA0`, 25 min → `#B0D4C8`, 30 min → `#9AADA5`

### Requirement: Sand color changes automatically when a timer preset is selected
When the user selects a timer preset (in Settings or on the Timer Screen), the hourglass sand color SHALL immediately reflect that preset's color.

#### Scenario: Sand color matches armed preset
- **WHEN** a preset is armed via `arm(id)`
- **THEN** the hourglass sand color uses `presetColors[id]` for that preset
