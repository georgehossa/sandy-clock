## Why

The flip detection system is unreliable on Android. The vertical guard (`|normZ| < 0.5`) blocks the rotation gesture mid-transition because `normZ` naturally spikes as the phone passes through horizontal during a real hourglass-style rotation. Users sometimes have to flip the phone on the Z axis (face-down) to trigger the timer instead of rotating it in-plane like a real sand clock. Additionally, the app requires users to select a preset before rotating, but the desired UX is to have the 3-minute timer armed by default so kids can just pick up the phone and rotate.

## What Changes

- **Move the vertical guard from FSM entry to confirmation**: Currently the guard blocks entry into `candidate-flipped`. It should instead block the final confirmation after the 400ms debounce, allowing the gesture to start mid-rotation and only checking verticality once the phone has settled.
- **Relax the vertical guard threshold from 0.5 to 0.6**: More forgiving for kids who hold the phone at slight angles after rotating.
- **Fix the sensor sign correction per path**: `computeNormYZ` applies a blanket `-1` sign on Android for both DeviceMotion and Accelerometer. DeviceMotion already normalizes signs in expo-sensors native code (`value - 2*gravity`), so the correction double-negates on that path. Split the correction so it only applies to the Accelerometer fallback.
- **Auto-arm the 3-minute preset on fresh launch**: Change the store's initial state so `armedPresetId` defaults to `'3'` and `runState` defaults to `'armed'`.
- **Gate the debug overlay behind `__DEV__`**: The normY/FSM state debug text on the kid screen should only render in development builds.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `timer-screen`: Default preset changes from none to 3-minute auto-armed; debug overlay gated behind `__DEV__`.
- `hourglass-component`: No spec-level changes (implementation only).

## Impact

- `hooks/flipFsm.ts`: FSM transition logic and thresholds change.
- `hooks/useFlipDetector.ts`: Sign correction split per sensor path.
- `state/store.ts`: Initial persisted state changes (armedPresetId, runState defaults).
- `app/(kid)/index.tsx`: Debug overlay conditionally rendered.
- `__tests__/flip-detector.test.ts`: Tests updated to reflect new guard placement.
