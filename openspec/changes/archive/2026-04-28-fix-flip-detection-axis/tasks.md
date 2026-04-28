## 1. Update FSM Input Signal

- [x] 1.1 Rename `pitchDeg` parameter to `normY` in `MotionSample` type and update `computeFlipTransition` signature in `hooks/flipFsm.ts`
- [x] 1.2 Replace `FLIP_THRESHOLD_DEG = 150` / `UPRIGHT_THRESHOLD_DEG = 30` with `FLIP_THRESHOLD_NORMY = 0.7` / `UPRIGHT_THRESHOLD_NORMY = -0.7`
- [x] 1.3 Add `normZ` field to `MotionSample` and add verticality guard (`|normZ| < 0.5`) to the `upright → candidate-flipped` transition

## 2. Update Detector Hook

- [x] 2.1 Replace `tiltAngleDeg()` with `computeNormY()` in `hooks/useFlipDetector.ts` — computes `y / mag` with platform sign correction (`Platform.OS === 'android' ? -raw : raw`)
- [x] 2.2 Pass both `normY` and `normZ` from `computeNormY()` into the FSM sample
- [x] 2.3 Remove the now-unused `tiltAngleDeg` function and `RAD_TO_DEG` constant

## 3. Update Unit Tests

- [x] 3.1 Update existing `flipFsm` unit tests to pass `normY` / `normZ` floats instead of degree values
- [x] 3.2 Add test: horizontal rotation (normY stays near 0, normZ swings) does NOT fire `flip`
- [x] 3.3 Add test: flat face-down placement (|normZ| ≥ 0.5) does NOT fire `flip`

## 4. Update Spec

- [x] 4.1 In `openspec/changes/add-sand-clock-mvp/specs/flip-to-start/spec.md`, replace the "Flip detection thresholds" requirement text with the normY-based definition from this change's delta spec
