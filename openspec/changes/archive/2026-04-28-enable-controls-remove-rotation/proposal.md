## Why

The flip-to-start gesture is unreliable and adds friction — users must hold the phone at a precise angle for the flip to register. Controls (Play, Stop, Reset) are already built but hidden behind a feature flag; making them the sole interaction model simplifies the UX and removes all accelerometer complexity.

## What Changes

- **BREAKING**: Device rotation (flip detection) is removed as an interaction mechanism. The `useFlipDetector` hook and `flipFsm` are deleted.
- The `SHOW_CONTROLS` feature flag is removed; controls are always rendered.
- The "rotate to start" prompt text and arming concept are replaced with control-driven equivalents.
- The `armedPresetId` concept may be simplified — selecting a preset is now just selection, not arming.
- Accelerometer/DeviceMotion sensor subscriptions are no longer requested at runtime.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `timer-screen`: Interaction model changes from flip-to-start to controls-only. The "armed" state and flip prompt are removed; Play/Stop/Reset are always visible and are the sole way to drive the timer.
- `feature-flags`: `SHOW_CONTROLS` flag is retired — controls are unconditionally rendered, so the flag module can be simplified or the flag removed entirely.

## Impact

- `hooks/useFlipDetector.ts` — deleted
- `hooks/flipFsm.ts` — deleted
- `__tests__/flip-detector.test.ts` — deleted
- `app/(kid)/index.tsx` — remove flip detector usage, remove `SHOW_CONTROLS` gate, update prompt strings
- `lib/flags.ts` — remove `SHOW_CONTROLS` export (or delete if no other flags exist)
- `state/store.ts` — review `armedPresetId` and whether arming state is still needed
- `openspec/specs/timer-screen/spec.md` — flip-detection requirements are superseded
- `openspec/specs/feature-flags/spec.md` — `SHOW_CONTROLS` requirement is superseded
