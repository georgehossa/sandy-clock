## Context

The hourglass component renders inside a Skia `<Canvas>` using painter's order (first drawn = backmost layer). Currently:

```
  CURRENT Z-ORDER (back to front)
  ────────────────────────────────
  0. Pill outer shadow  (BoxShadow)
  1. Pill body          (RoundedRect with gradient)
  2. Top cutout circle  (#79B3A2 dark sage)
  3. Top sand body      (pie-sector Path)
  4. Bottom cutout      (#79B3A2 dark sage)
  5. Bottom sand body   (pie-sector Path)
  6. Glitter field      (shimmer particles)
  7. Fall stream        (6 animated dots)
```

The sand fill uses pie-sector wedges (angular, radiating from center) and the frame elements (pill, cutouts) render behind the fill. The result is the fill paints over the frame edges rather than appearing contained inside the vessel.

The geometry system defines two circular chambers: `topCY`/`botCY` centers with `circleR` radius for the cutout bowls and a smaller `sandR` for the fill inset.

## Goals / Non-Goals

**Goals:**
- Liquid-style horizontal fill level that rises/falls with timer progress
- Frame renders on top of liquid so liquid appears contained inside glass
- Continuous liquid pour stream instead of discrete particle dots
- Liquid-appropriate visual effects (surface highlights, subtle wave)
- Maintain performance across device tiers (high/mid/low RAM)
- Preserve reduce-motion accessibility support

**Non-Goals:**
- Physics-based fluid simulation
- Changing the pill shape, cutout dimensions, or overall geometry
- Changing the color palette or preset color system
- Adding new Skia dependencies (use existing @shopify/react-native-skia APIs)

## Decisions

### 1. Liquid fill via circle-rect intersection clipping

**Decision**: Replace the pie-sector `Path` in `SandBody.tsx` with a clipped filled region. For a given liquid level `y`, construct a Skia `Path` that represents the intersection of the circular chamber with a horizontal half-plane (everything below `y` for the fill).

**How it works geometrically:**

```
       ┌─────────────────┐
       │     empty        │
       │                  │
  ─ ─ ─├──────────────────┤─ ─ ─  liquid level (y)
       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
       │▓▓▓▓ liquid ▓▓▓▓▓│
       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
       └─────────────────┘
            circle

  Path = arc from left intersection to right intersection (bottom arc)
       + line from right to left (the flat liquid surface)
       + close
```

For a circle centered at `(cx, cy)` with radius `r`, and a liquid level at height `levelY`:

1. Compute the vertical offset: `dy = levelY - cy`
2. If `dy >= r`: chamber is empty (level is below the circle). Draw nothing.
3. If `dy <= -r`: chamber is full (level is above the circle). Draw a full circle.
4. Otherwise: compute horizontal half-chord `dx = sqrt(r^2 - dy^2)`. The intersection points are `(cx - dx, levelY)` and `(cx + dx, levelY)`. Draw an arc from left to right along the bottom of the circle, then a straight line back across the top (the liquid surface).

**Level mapping from progress:**

- Top chamber: liquid level drops from top of circle to bottom as progress goes 0→1.
  `levelY = topCY - circleR + 2*circleR * progress` (level descends)
- Bottom chamber: liquid level drops from bottom of circle to top as progress goes 0→1 (liquid rises from below).
  `levelY = botCY + circleR - 2*circleR * progress` (level ascends = liquid fills up)

**Rationale**: This approach uses only Skia `Path` primitives (moveTo, lineTo, arcTo) already available in the codebase. No clipping masks or shader programs needed. The math is straightforward circle-line intersection.

**Alternatives considered**:
- *Clip rect + circle mask*: Would require `<Group clip={...}>` nesting. More compositing overhead and harder to add surface effects to the clipped edge.
- *Shader-based fill*: Maximum visual fidelity but requires GLSL, harder to debug, and overkill for this use case.

### 2. Frame z-order: draw frame elements after liquid

**Decision**: Restructure the canvas drawing order so the frame (pill body, cutout rims) renders on top of liquid fills.

```
  NEW Z-ORDER (back to front)
  ───────────────────────────
  0. Pill outer shadow
  1. Top liquid body        (horizontal fill path)
  2. Bottom liquid body     (horizontal fill path)
  3. Liquid surface effects (highlights, wave)
  4. Fall stream            (continuous pour)
  5. Pill body              (gradient, acts as the glass frame)
  6. Top cutout circle      (the "window" into the top chamber)
  7. Bottom cutout circle   (the "window" into the bottom chamber)
```

The pill body gradient paints over the liquid, then the cutout circles punch visual "windows" through the pill to reveal the liquid beneath. This creates the effect of liquid visible through glass openings.

**Key insight**: The cutout circles are painted with an opaque color (`#79B3A2`). When drawn on top of the pill, they act as the visible bowl interiors. The liquid is behind them, and only visible where the cutout circles are — because the liquid fill extends to the full `circleR` and the cutout circle is the same radius, the liquid shows through exactly where the bowl is.

Wait — this won't work directly. If the cutout is opaque and drawn on top, it hides the liquid. We need the cutout to be a transparent window, or we need a different layering approach.

**Revised approach**:

```
  REVISED Z-ORDER (back to front)
  ────────────────────────────────
  0. Pill outer shadow
  1. Pill body              (gradient frame — the glass vessel)
  2. Top cutout circle      (dark sage — the bowl interior background)
  3. Top liquid body        (clipped to circleR, drawn ON TOP of cutout)
  4. Bottom cutout circle   (dark sage — bowl interior background)
  5. Bottom liquid body     (clipped to circleR, drawn ON TOP of cutout)
  6. Pill frame overlay     (just the border/rim of the pill, no fill)
  7. Liquid surface effects
  8. Fall stream
```

Actually, the simplest correct approach: keep the current layer order for cutouts and liquid, but add a **pill frame stroke overlay** on top of everything. This is a stroked (no-fill) version of the pill rounded rect that draws the glass rim over the liquid edges.

**Final approach**:

```
  FINAL Z-ORDER (back to front)
  ──────────────────────────────
  0. Pill outer shadow
  1. Pill body gradient      (filled, same as current)
  2. Top cutout circle       (dark sage background)
  3. Top liquid fill         (horizontal-level path, uses sandR for inset)
  4. Bottom cutout circle    (dark sage background)
  5. Bottom liquid fill      (horizontal-level path, uses sandR for inset)
  6. Liquid surface effects  (wave line, highlight)
  7. Fall stream             (continuous pour)
  8. Cutout rim rings        (stroked circles at circleR, on top of liquid)
```

The cutout rim rings are thin stroked circles (no fill) drawn on top of the liquid to give the appearance that the glass vessel rim sits over the liquid. The pill body itself already frames the overall shape. The rim rings create the "liquid is inside the glass bowl" illusion.

**Rationale**: Minimal change from current architecture. Only adds one new layer (rim rings) and reorders nothing else. The liquid fill already uses `sandR` (smaller than `circleR`), so there's a natural gap between liquid edge and cutout edge — the rim ring reinforces this boundary.

### 3. Liquid pour stream

**Decision**: Replace the 6 discrete particle dots in `FallStream.tsx` with a single narrow filled rectangle (or tapered path) connecting the two chambers. Optionally add a subtle width oscillation for a "flowing" feel.

```
  CURRENT (sand)           PROPOSED (liquid)

      .                      │
     .                       │
    .                        ┃  ← narrow filled rect
     .                       │    with subtle width
      .                      │    oscillation
     .                       │
```

**Implementation**: A single `<RoundedRect>` or `<Path>` centered at `geom.cx`, spanning from top chamber bottom to bottom chamber top. Width oscillates gently using `sin(clockMs / period)` between e.g. 2px and 4px.

**Rationale**: Liquid pours as a continuous stream, not discrete drops. A thin filled shape is simpler to render than 6 animated circles and looks more liquid-like.

### 4. Liquid surface effects

**Decision**: Replace the glitter field with two effects:

1. **Surface wave line**: A subtle sine-wave path drawn at the liquid level in each chamber. A thin, slightly lighter stroke that oscillates horizontally to suggest surface tension / gentle sloshing.

2. **Surface highlight**: A horizontal gradient or semi-transparent lighter band just below the liquid surface, suggesting light catching the liquid.

**Performance tiers**:
- High: wave animation + highlight
- Mid: static highlight only (no wave animation)
- Low / reduce-motion: no effects (flat fill only)

**Rationale**: Sand glitter (random sparkle dots) doesn't suit liquid. Surface tension and highlights are the natural visual cues for liquid in a container.

## Risks / Trade-offs

- **[Circle-line intersection math]** → Straightforward trigonometry, but edge cases at `dy ≈ ±r` (nearly empty/full) need care to avoid visual glitches. Mitigation: clamp values and handle the full/empty cases explicitly.
- **[Performance of wave animation]** → Sine wave path rebuilt every frame. Mitigation: keep the path simple (few segments), gate behind device tier, and use the existing `useClock()` UI-thread driver.
- **[Visual regression]** → The liquid look is fundamentally different from the current sand look. Cannot A/B test easily on a kids' app. Mitigation: manual visual review on device.
- **[Rim ring thickness]** → Too thick looks cartoonish, too thin is invisible. Will need visual tuning. Start with 1.5-2px stroke width at the 240px hourglass size.
