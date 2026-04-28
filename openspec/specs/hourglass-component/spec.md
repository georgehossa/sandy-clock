## ADDED Requirements

### Requirement: Hourglass pill body uses sage gradient fill
The Hourglass pill body rectangle SHALL use a vertical linear gradient from `#BFE0D4` (top) to `#9ECABC` (bottom) as its fill, matching the Pencil design.

#### Scenario: Pill body renders with gradient
- **WHEN** the Hourglass canvas renders
- **THEN** the pill body shape uses a linear gradient fill from `#BFE0D4` to `#9ECABC`

### Requirement: Hourglass cutout circles use sage fill
The top and bottom cutout ellipses inside the Hourglass pill SHALL use `#79B3A2` as their fill color.

#### Scenario: Cutout ellipses render with correct color
- **WHEN** the Hourglass canvas renders
- **THEN** both the top and bottom cutout ellipses have fill color `#79B3A2`

### Requirement: Sand fill uses theme sand-orange color by default
When no preset color is armed, the sand fill SHALL use `theme.colors.sandOrange` (`#D98B5C`) instead of the previous idle grey (`#CBD5E1`).

#### Scenario: Default sand color is sand-orange
- **WHEN** the Hourglass renders with no armed preset
- **THEN** the sand fill color is `#D98B5C`

### Requirement: Hourglass canvas background is transparent
The Hourglass Skia Canvas SHALL use a transparent background so the screen's `theme.colors.bgPrimary` shows through.

#### Scenario: Canvas background is transparent
- **WHEN** the Hourglass renders on the Timer Screen
- **THEN** the canvas has no opaque background fill; the parent screen background is visible

### Requirement: PALETTE colors in presets match Pencil color swatch design
The `PALETTE` in `state/presets.ts` SHALL be updated to include the colors visible in the Settings screen color swatch row: mint-green (`#B0D4C8`), sand-orange (`#D98B5C`), slate-blue (`#7B9EC4`), mauve (`#B87BA8`), warm-grey (`#9AADA5`), deep-teal (`#2D3B36`).

#### Scenario: PALETTE contains design swatch colors
- **WHEN** `PALETTE` is accessed from `state/presets.ts`
- **THEN** it contains exactly the six color values shown in the Settings screen color swatch row
