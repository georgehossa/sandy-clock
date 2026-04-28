## Why

The flip-to-start gesture fires on the wrong physical motion: rotating the phone horizontally (landscape rotation) instead of the intended sand-clock flip (portrait upright → portrait upside-down). The root cause is that `tiltAngleDeg()` measures the angle between the screen's Z axis and gravity, which barely changes during a portrait-to-portrait flip. The timer should start when the device is turned upside-down like a real sand clock.

## What Changes

- Replace the Z-axis gravity angle calculation in `hooks/useFlipDetector.ts` and `hooks/flipFsm.ts` with a Y-axis normalized gravity signal that correctly distinguishes portrait-upright from portrait-upside-down.
- Add a "device is vertical" guard (|z|/mag < threshold) so flips only register when the phone is being held upright, not when it is lying flat on a table.
- Update the FSM thresholds to be expressed in terms of normalized Y (−1 to +1 range) rather than degrees of Z-tilt.
- Update the spec for `flip-to-start` to replace the ambiguous "pitch ≥ 150°" language with precise axis-based thresholds.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `flip-to-start`: Replace the `|pitch| ≤ 30° → |pitch| ≥ 150°` threshold definition with Y-normalized gravity thresholds (`normY ≤ −0.7` = upright, `normY ≥ +0.7` = flipped) and add the verticality guard (`|normZ| < 0.5`).

## Impact

- **Code**: `hooks/useFlipDetector.ts` (replace `tiltAngleDeg`), `hooks/flipFsm.ts` (update thresholds and input type), existing unit tests for `flipFsm`.
- **No new dependencies**: uses the same `accelerationIncludingGravity` data already subscribed to.
- **Cross-platform**: must verify Y-axis sign convention on both iOS and Android (expo-sensors may invert; add normalization if needed).
- **No API or UI changes**: the gesture contract (flip = start/reset) is unchanged; only the internal detection signal changes.
