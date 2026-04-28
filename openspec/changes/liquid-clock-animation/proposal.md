## Why

The hourglass animation currently renders sand as pie-sector wedges that grow/shrink from the center of each chamber. This looks geometric and angular rather than natural. The fill should look like liquid with a flat horizontal surface that rises and falls, matching the physical metaphor of a liquid timer. Additionally, the hourglass frame (pill outline and cutout circles) renders behind the liquid fill, so the liquid can visually overlap the frame edges. The frame should render on top of the liquid containers to create a proper "liquid inside a glass vessel" appearance.

## What Changes

- **Replace pie-sector sand fill with horizontal liquid fill**: Instead of a wedge anchored at 6 o'clock, the fill in each chamber should be a flat horizontal level that drops (top chamber) and rises (bottom chamber) as the timer progresses. The fill should clip to the circular chamber bounds.
- **Fix frame z-order**: The hourglass frame (pill outline, cutout circle rims) should render on top of the liquid bodies, so the liquid appears contained inside the glass vessel rather than painted over it.
- **Replace glitter particles with liquid-appropriate effects**: The current sand glitter (tiny sparkling dots) should be replaced or adapted to suit a liquid aesthetic — e.g., subtle surface highlights, translucency, or gentle wave motion on the liquid surface.
- **Adapt fall stream to liquid pour**: The current 6-dot particle stream should become a continuous liquid pour (a smooth, narrow stream) instead of discrete sand grains.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `hourglass-component`: Sand fill changes to liquid fill with horizontal level, frame z-order inverted so frame renders on top of liquid, particle effects adapted to liquid aesthetic, fall stream becomes liquid pour.

## Impact

- `components/Hourglass/SandBody.tsx`: Complete rewrite — pie-sector path replaced with horizontal-clip-to-circle fill.
- `components/Hourglass/FallStream.tsx`: Rewrite — discrete particles replaced with continuous stream shape.
- `components/Hourglass/GlitterField.tsx`: Rewrite or removal — sand glitter replaced with liquid surface effects.
- `components/Hourglass/Hourglass.tsx`: Drawing order changes — frame layers moved after liquid layers in the Skia canvas.
- `components/Hourglass/geometry.ts`: May need new helpers for horizontal clipping math (circle-line intersection for liquid level).
