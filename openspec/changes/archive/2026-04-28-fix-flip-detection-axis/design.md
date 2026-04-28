## Context

The flip-to-start feature uses `hooks/useFlipDetector.ts` + `hooks/flipFsm.ts`. The detector computes a `tiltAngleDeg` from the Z component of `accelerationIncludingGravity` — essentially measuring how far the screen normal deviates from the gravity vector. This angle is ~0° when face-up flat and ~180° when face-down flat, and is ~90° for *any* portrait orientation (both right-side-up and upside-down). Consequently the FSM threshold of `|pitch| ≥ 150°` can only be reached by nearly laying the phone face-down, which is why rotating the phone horizontally (where Z swings through the gravity plane) accidentally triggers it.

The correct signal for a sand-clock flip is the **Y-axis gravity component**: when the phone is held upright in portrait the top of the phone points up, so gravity pulls along the −Y axis (`normY ≈ −1`). When flipped upside-down the bottom points up, `normY ≈ +1`. The motion between those two states is unambiguous.

```
SIGNAL COMPARISON
─────────────────────────────────────────────────────────
                  tiltAngleDeg (current)   normY (proposed)
─────────────────────────────────────────────────────────
Portrait upright       ≈ 90°                  ≈ −1.0
Mid-flip (landscape)   ≈ 90°                  ≈  0.0
Portrait upside-down   ≈ 90°                  ≈ +1.0  ✓
Flat face-up           ≈  0°                  ≈  0.0
Flat face-down         ≈180°                  ≈  0.0
─────────────────────────────────────────────────────────
```

## Goals / Non-Goals

**Goals:**
- Detect portrait → portrait-upside-down rotation reliably (the sand-clock gesture).
- Ignore flat-on-table orientations (no accidental triggers when the phone is set down).
- Keep the existing FSM state machine structure (`upright → candidate-flipped → flipped → candidate-upright`) and timings (400 ms hold).
- Preserve cross-platform behaviour on iOS and Android.

**Non-Goals:**
- Support landscape-held use.
- Change the haptic, keep-awake, or store integration.
- Alter the 400 ms debounce timing.

## Decisions

### Decision 1: Use normalized Y as the primary flip signal

**Chosen**: Replace `tiltAngleDeg` with `normY = y / mag` where `(x, y, z)` is `accelerationIncludingGravity` and `mag = √(x²+y²+z²)`.

**Rationale**: `normY` maps cleanly to the user's intent. Portrait upright → `normY ≈ −1`; portrait upside-down → `normY ≈ +1`. No ambiguity.

**Alternatives considered**:
- *Quaternion/attitude from DeviceMotion*: More accurate, but DeviceMotion's `attitude` is not always available (Expo Go, some Android builds fall back to Accelerometer). `accelerationIncludingGravity` is the lowest common denominator already used.
- *Keeping Z-angle*: Does not distinguish the two portrait orientations; ruled out.

---

### Decision 2: Add a verticality guard (`|normZ| < 0.5`)

**Chosen**: Only allow a `flipped` transition when `|normZ| < 0.5` (phone is not lying flat).

**Rationale**: When the phone is flat on a table `normY ≈ 0`, so a flat phone cannot accidentally fire `normY ≥ +0.7`. But if someone sets the phone down with a slight tilt, the guard ensures we don't count "resting face-down" as a flip event. `|normZ| < 0.5` means the screen normal makes > 60° with gravity — i.e., the phone is more vertical than horizontal.

**Alternatives considered**:
- *No guard*: `normY` alone is sufficient in practice, but the guard is cheap and adds robustness.
- *Require `|normY| > 0.85`*: Higher threshold reduces false positives at extreme tilt angles but makes the gesture harder to trigger when the user holds the phone at a natural (slightly tilted) angle.

---

### Decision 3: Express FSM thresholds in normY units, keep same constants names

**Chosen**: Replace the degree-based `FLIP_THRESHOLD_DEG = 150` / `UPRIGHT_THRESHOLD_DEG = 30` with `FLIP_THRESHOLD_NORMY = 0.7` / `UPRIGHT_THRESHOLD_NORMY = -0.7` and pass `normY` (a float −1…+1) as `pitchDeg` (rename parameter to `normY` or `signal`).

Approximate equivalences:
```
Old 150° (Z-tilt)  ≈  normY > +0.7  (sin 45° ≈ 0.7, phone past ~45° upside-down)
Old  30° (Z-tilt)  ≈  normY < −0.7  (phone more than ~45° upright)
```

**Rationale**: Keeps the FSM logic minimal — only the input signal and threshold constants change.

---

### Decision 4: Y-axis sign normalization for cross-platform

**Chosen**: Detect platform at runtime and negate Y on Android if needed, OR test both platforms empirically and use a single sign convention.

Per expo-sensors docs and community reports, `accelerationIncludingGravity` returns gravity in **opposite signs on iOS vs Android**: on iOS a face-up phone has `z ≈ −9.8`; on Android `z ≈ +9.8`. The Y axis follows the same inversion. The existing code used `Math.abs(z)` to paper over this. The new code should handle it explicitly:

```
normY_raw = y / mag
// iOS:     portrait-upright → normY_raw ≈ −1  (correct)
// Android: portrait-upright → normY_raw ≈ +1  (inverted — needs flip)
```

Strategy: use `Platform.OS === 'android' ? -normY_raw : normY_raw`. This is explicit, testable, and avoids runtime sensor probing.

## Risks / Trade-offs

- **Android sign assumption** → If a specific Android OEM inverts the convention again, detection breaks silently. Mitigation: log `normY` in debug output (already wired via `setDebug`) so QA can verify on device.
- **Oblique holders** → A user who habitually holds their phone at 30° tilt will have `normY ≈ −0.87` upright and `≈ +0.87` flipped — both well within the ±0.7 thresholds. No issue.
- **Existing unit tests** → `flipFsm` tests pass degree-based pitch values. They will need to be updated to pass normY floats. The FSM logic is unchanged, only the input domain.

## Migration Plan

1. Update `flipFsm.ts`: rename `pitchDeg` → `normY`, replace degree constants with normY constants, add verticality guard parameter.
2. Update `useFlipDetector.ts`: replace `tiltAngleDeg` with `computeNormY` (which handles platform sign), pass `normY` + `normZ` to FSM.
3. Update `flipFsm` unit tests.
4. Manual device test: iOS + Android, confirm portrait flip triggers, horizontal rotation does not.
5. Update `specs/flip-to-start/spec.md` thresholds.
