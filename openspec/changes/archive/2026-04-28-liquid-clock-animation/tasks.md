## 1. Geometry Helpers

- [x] 1.1 Add `liquidLevelY(chamber, progress, cy, r)` helper to `geometry.ts` that computes the Y coordinate of the liquid surface given timer progress
- [x] 1.2 Add `circleChordPath(cx, cy, r, levelY)` helper to `geometry.ts` that returns a Skia `Path` for the filled region of a circle below a horizontal line (circle-line intersection math with edge cases for full/empty)

## 2. Liquid Fill (SandBody replacement)

- [x] 2.1 Rewrite `SandBody.tsx` to use horizontal liquid level instead of pie-sector — build the fill path using `circleChordPath` with `sandR` radius
- [x] 2.2 Handle edge cases: full chamber renders complete circle, empty chamber renders nothing, near-full/near-empty avoid visual glitches (clamp `dy` values)
- [x] 2.3 Verify liquid fill color still reads from armed preset color (existing `sandColor` prop)

## 3. Liquid Pour Stream (FallStream replacement)

- [x] 3.1 Rewrite `FallStream.tsx` to render a single continuous narrow filled shape instead of 6 discrete particle circles
- [x] 3.2 Add subtle width oscillation using `sin(clockMs / period)` for flowing liquid feel
- [x] 3.3 Implement reduce-motion fallback: static narrow rectangle with no animation, slightly reduced opacity

## 4. Liquid Surface Effects (GlitterField replacement)

- [x] 4.1 Create a new `LiquidSurface.tsx` component that replaces `GlitterField.tsx`
- [x] 4.2 Implement surface highlight: semi-transparent lighter band near the liquid level (rendered on mid-tier and high-tier devices)
- [x] 4.3 Implement surface wave: animated sine-wave path at the liquid level (rendered on high-tier devices only)
- [x] 4.4 Gate effects by device tier using existing `deviceTier.ts` and reduce-motion hook — low-tier and reduce-motion get no effects

## 5. Frame Z-Order Fix

- [x] 5.1 Add cutout rim ring stroked circles (no fill, stroke color `#79B3A2`) drawn after liquid fills in `Hourglass.tsx`
- [x] 5.2 Tune rim ring stroke width (start at ~1.5-2px at 240px hourglass size, proportional to `circleR`)

## 6. Canvas Composition

- [x] 6.1 Update `Hourglass.tsx` drawing order: shadow → pill body → cutout circles → liquid fills → surface effects → pour stream → rim rings
- [x] 6.2 Replace `<GlitterField>` import with `<LiquidSurface>` in `Hourglass.tsx`
- [x] 6.3 Remove or archive `GlitterField.tsx` (no longer used)

## 7. Visual Verification

- [ ] 7.1 Test on Android device: liquid fill level animates correctly for all 4 presets
- [ ] 7.2 Verify rim rings are visible over liquid at various fill levels
- [ ] 7.3 Verify pour stream renders as continuous shape during running state
- [ ] 7.4 Verify surface effects respect device tier (wave on high, highlight on mid, nothing on low)
- [ ] 7.5 Verify reduce-motion disables wave and surface effects
