## Context

The flip detection system uses a pure FSM (`flipFsm.ts`) fed by normalized accelerometer data from `useFlipDetector.ts`. The FSM transitions through `upright → candidate-flipped → flipped` states using normY (gravity along the phone's vertical axis) and a normZ vertical guard (prevents flat-on-table false positives).

Two problems exist:
1. The vertical guard blocks at FSM entry, but during a real hourglass rotation normZ spikes as the phone passes through horizontal. This makes detection unreliable.
2. On Android, `computeNormYZ` applies a blanket sign inversion for both DeviceMotion and Accelerometer sensor paths. DeviceMotion already normalizes signs in the expo-sensors native layer (`value - 2*gravity`), so the correction double-negates. This accidentally produces the same values the FSM expects (the errors cancel), but it's fragile and incorrect.

Additionally, the store initializes with no preset armed, requiring explicit selection before the timer can start.

## Goals / Non-Goals

**Goals:**
- Reliable rotation detection on Android devices for the natural "hourglass flip" gesture
- Preserve false-positive prevention for flat-on-table placement
- Correct sensor sign handling per sensor path (DeviceMotion vs Accelerometer)
- 3-minute preset auto-armed on fresh launch
- Debug overlay hidden in production builds

**Non-Goals:**
- Changing the 400ms debounce timing
- Changing re-flip-while-running behavior
- iOS-specific testing or changes (sensor path works correctly on iOS)
- Changing the hourglass visual component

## Decisions

### 1. Move vertical guard from entry to confirmation

**Decision**: Remove the `|normZ| < threshold` check from the `upright → candidate-flipped` transition. Add it to the `candidate-flipped → flipped` confirmation check (alongside the existing 400ms debounce).

**Rationale**: During a real rotation gesture, normZ spikes mid-transition as the phone passes through horizontal. By the time 400ms have elapsed with normY sustained, the phone has settled and normZ reflects the actual resting orientation. This preserves the flat-on-table guard while not blocking the legitimate gesture.

**Alternatives considered**:
- *Rolling average on normZ*: Adds complexity and latency. The debounce already provides a natural settling window.
- *Remove the guard entirely*: Loses flat-on-table protection. Kids might place phones face-down and trigger timers accidentally.

### 2. Relax vertical guard threshold from 0.5 to 0.6

**Decision**: Change `VERTICAL_GUARD_NORMZ` from 0.5 to 0.6.

**Rationale**: Kids hold phones at imprecise angles. A phone tilted ~37° from vertical produces `|normZ| ≈ 0.6`. The guard only needs to distinguish "held in hand" from "flat on a surface" (`|normZ| ≈ 0.9-1.0`). The 0.6 threshold is forgiving for in-hand use while still rejecting flat placement.

### 3. Split sign correction per sensor path

**Decision**: Pass a `needsSignCorrection` flag (or equivalent) from the sensor listener call site to `computeNormYZ`. Apply the Android `-1` sign only for the Accelerometer fallback path.

**Rationale**: expo-sensors DeviceMotion already normalizes Android values to match iOS convention via `value - 2*gravity` in native code. The Accelerometer path does not. Applying the correction blindly to both double-negates DeviceMotion. The current FSM accidentally compensates (it was tuned against the double-negated values), but after fixing the guard placement, the FSM thresholds and sign conventions need to be correct and documented.

**Important**: After removing the double-negation on DeviceMotion, the normY polarity on Android will change. The FSM's resting/flipped thresholds must be verified to match the corrected values. Current FSM assumes `normY ≈ +1` = resting; with correct signs on DeviceMotion, `normY ≈ -1` = phone upright (gravity pulling down). The FSM state names and threshold signs must be updated to reflect the true coordinate convention.

### 4. Auto-arm 3-minute preset

**Decision**: Change `initialPersisted` in `store.ts` to `armedPresetId: '3'` and `runState: 'armed'`. Bump the persist version to trigger migration for existing users.

**Rationale**: The target user is a child who picks up the phone and rotates. Requiring preset selection adds friction. 3 minutes is the shortest preset and a safe default. Parents can change the preset in settings.

### 5. Gate debug overlay behind `__DEV__`

**Decision**: Wrap the normY/FSM state `<Text>` in `app/(kid)/index.tsx` with `{__DEV__ && flipDebug && (...)}`.

**Rationale**: Useful during development, not needed in production. `__DEV__` is a standard React Native global that is `true` in dev builds and tree-shaken in production.

## Risks / Trade-offs

- **[Double-negation fix changes runtime behavior on Android]** → The FSM currently works "by accident" with double-negated values. Fixing the sign correction changes what normY values the FSM sees on Android via DeviceMotion. The FSM thresholds must be re-verified against correct values, and tests must cover both sensor paths. Requires real-device testing on Android.
- **[Relaxed guard may allow edge-case false positives]** → A phone propped at ~50° against something could pass the 0.6 guard. This is unlikely in the target use case (kids holding the phone). Mitigation: the 400ms debounce still requires sustained normY inversion.
- **[Store migration version bump]** → Existing users who had a preset selected will have their state reset to the new defaults. Acceptable since the app is pre-release.
- **[Cannot test sensors in iOS Simulator]** → Real-device Android testing is the verification path. The pure FSM remains fully testable in Jest with synthetic samples.
