## MODIFIED Requirements

### Requirement: TIMER section displays equal-width rectangular tiles in a single row
The TIMER section SHALL render duration options as equal-width rectangular tiles (`flex: 1`) in a horizontal row with `gap: 10`, `height: 56`, `cornerRadius: 16` — no horizontal scrolling.

#### Scenario: Timer tiles share equal width
- **WHEN** the TIMER section renders
- **THEN** all duration tiles have equal width filling the available row width

#### Scenario: Inactive tile typography
- **WHEN** a duration tile is not active
- **THEN** it shows the number in Inter 18px/500 `$font-secondary` and "min" in 10px `$font-tertiary` on `$bg-secondary` background

#### Scenario: Active tile style
- **WHEN** a duration tile is active
- **THEN** it has `$mint` background, number in Inter 18px/600 white, "min" in 10px/500 `#FFFFFFCC`

### Requirement: COLOR section uses 48×48 swatches with ring-outside active indicator
The COLOR section SHALL render swatches as 48×48 circles with `gap: 16`. The active swatch SHALL display a 2.5px `$mint` border ring on a 48×48 transparent outer wrapper, with the 36×36 color circle inside it offset 6pt from the outer edges. Inactive swatches are plain 48×48 colored circles with no visible ring.

#### Scenario: Swatch size is 48×48
- **WHEN** the COLOR section renders
- **THEN** each swatch occupies a 48×48 area

#### Scenario: Active swatch ring is outside the color circle
- **WHEN** a swatch is active
- **THEN** a mint ring appears around the swatch without visually shrinking the color circle inside

#### Scenario: Inactive swatch has no ring
- **WHEN** a swatch is not active
- **THEN** no ring or border is visible on the swatch
