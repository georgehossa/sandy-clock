## ADDED Requirements

### Requirement: Liquid fill uses horizontal level
Each chamber's fill SHALL be rendered as a horizontal liquid level that intersects the circular chamber, creating a flat surface at the top of the liquid. The fill region SHALL be the area of the circle below the liquid level line.

#### Scenario: Top chamber drains as progress increases
- **WHEN** the timer progress goes from 0 to 1
- **THEN** the top chamber liquid level descends from the top of the circle to the bottom, reducing the visible liquid area

#### Scenario: Bottom chamber fills as progress increases
- **WHEN** the timer progress goes from 0 to 1
- **THEN** the bottom chamber liquid level descends from the bottom of the circle to the top, increasing the visible liquid area

#### Scenario: Liquid surface is flat and horizontal
- **WHEN** a chamber is partially filled (progress between 0 and 1 exclusive)
- **THEN** the top edge of the liquid is a straight horizontal line across the chamber

#### Scenario: Full chamber renders as complete circle
- **WHEN** a chamber is completely full (progress = 0 for top, progress = 1 for bottom)
- **THEN** the fill renders as a complete filled circle with no visible flat edge

#### Scenario: Empty chamber renders nothing
- **WHEN** a chamber is completely empty (progress = 1 for top, progress = 0 for bottom)
- **THEN** no fill is rendered for that chamber

### Requirement: Liquid fill is inset from cutout edge
The liquid fill SHALL use `sandR` (smaller than `circleR`) for clipping, maintaining a visible gap between the liquid edge and the cutout circle rim.

#### Scenario: Liquid does not touch cutout boundary
- **WHEN** a chamber contains liquid
- **THEN** the liquid fill boundary is inset from the cutout circle edge by `circleR - sandR`

### Requirement: Cutout rim rings render on top of liquid
Thin stroked circle rings at `circleR` radius SHALL render on top of the liquid fills in each chamber, creating the visual effect that the glass vessel rim sits over the liquid.

#### Scenario: Rim is visible over filled liquid
- **WHEN** a chamber contains liquid that reaches the cutout boundary area
- **THEN** the rim ring is drawn on top of the liquid, not behind it

#### Scenario: Rim ring uses cutout color
- **WHEN** the rim rings render
- **THEN** the stroke color matches the cutout circle color (`#79B3A2`)

### Requirement: Fall stream is a continuous liquid pour
The fall stream between chambers SHALL render as a continuous narrow filled shape (not discrete particles) when the timer is running.

#### Scenario: Pour stream visible during running state
- **WHEN** the timer `runState` is `running`
- **THEN** a continuous narrow stream shape is visible connecting the top and bottom chambers through the neck zone

#### Scenario: Pour stream hidden when not running
- **WHEN** the timer `runState` is not `running`
- **THEN** no pour stream is rendered

#### Scenario: Pour stream has gentle width oscillation
- **WHEN** the pour stream renders during running state
- **THEN** the stream width oscillates subtly over time to create a flowing liquid appearance

### Requirement: Liquid surface wave effect on high-tier devices
On high-tier devices (>= 4GB RAM), a subtle sine-wave path SHALL animate at the liquid surface level in each chamber, suggesting surface tension and gentle movement.

#### Scenario: Wave renders on high-tier device
- **WHEN** the device has >= 4GB RAM and reduce-motion is not active
- **THEN** a subtle animated wave line is visible at the liquid surface in each partially-filled chamber

#### Scenario: Wave hidden on mid-tier device
- **WHEN** the device has 2-4GB RAM
- **THEN** no wave animation is rendered (static highlight only)

#### Scenario: Wave hidden when reduce-motion is active
- **WHEN** the OS reduce-motion accessibility setting is enabled
- **THEN** no wave animation or surface effects are rendered

### Requirement: Liquid surface highlight on mid-tier and above
On mid-tier and high-tier devices, a semi-transparent lighter band SHALL render just below the liquid surface to suggest light catching the liquid.

#### Scenario: Highlight visible on mid-tier device
- **WHEN** the device has 2-4GB RAM and reduce-motion is not active
- **THEN** a static semi-transparent highlight band is visible near the liquid surface

#### Scenario: Highlight hidden on low-tier device
- **WHEN** the device has < 2GB RAM
- **THEN** no surface highlight is rendered

### Requirement: Liquid fill color matches armed preset
The liquid fill color SHALL use the armed preset's color from `DEFAULT_PRESET_COLORS`, falling back to `theme.colors.sandOrange` when no preset is armed.

#### Scenario: Liquid color matches preset
- **WHEN** the 5-minute preset is armed
- **THEN** the liquid fill color is `#7B9ACC` (slate blue)

#### Scenario: Default liquid color when no preset armed
- **WHEN** no preset is armed
- **THEN** the liquid fill color is `#D98B5C` (sand orange)

## MODIFIED Requirements

### Requirement: Sand fill uses theme sand-orange color by default
When no preset color is armed, the liquid fill SHALL use `theme.colors.sandOrange` (`#D98B5C`). The fill is rendered as a horizontal liquid level rather than a pie-sector wedge.

#### Scenario: Default liquid color is sand-orange
- **WHEN** the Hourglass renders with no armed preset
- **THEN** the liquid fill color is `#D98B5C`

## REMOVED Requirements

### Requirement: Glitter field sparkle particles
**Reason**: Sand glitter particles (tiny dots with pulsating opacity) do not suit the liquid aesthetic. Replaced by liquid surface effects (wave line, highlight band).
**Migration**: `GlitterField.tsx` is replaced by new liquid surface effect components. Device-tier gating logic is reused for the new effects.
