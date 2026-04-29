## Context

The app currently uses device rotation (flip detection) as the sole way to start a timer. The flip detection pipeline (`useFlipDetector` → `flipFsm`) subscribes to DeviceMotion/Accelerometer sensors, runs an FSM to detect 180° flips, and calls `store.start()` on a confirmed flip. A controls bar (Play/Stop/Reset) was built and is gated behind `SHOW_CONTROLS = false`.

This change removes the flip pipeline entirely and makes the controls bar the primary interaction model.

## Goals / Non-Goals

**Goals:**
- Controls bar is always rendered (no feature flag)
- Sensor subscriptions (DeviceMotion, Accelerometer) are never requested
- `useFlipDetector` and `flipFsm` are deleted from the codebase
- Keep-awake still activates during a run
- `sandTop` still toggles on timer completion (hourglass visuals remain correct)
- Prompt text reflects the new interaction model (no "flip" language)

**Non-Goals:**
- Changing the preset selection flow (`arm()` / preset buttons)
- Changing timer logic (`useTimer`, `finish()`, drift correction)
- Redesigning the controls bar layout or styling
- Removing `armedPresetId` or the `armed` RunState (preset must still be selected before Play works)

## Decisions

### Remove feature flag entirely (not just flip to true)
`SHOW_CONTROLS` was a build-time gate for an incomplete feature. Now that controls are the canonical interaction, the flag adds dead weight. **Decision**: delete `SHOW_CONTROLS` from `lib/flags.ts` and inline the controls unconditionally in the screen.

Alternative considered: set `showControls: true` in `app.json`. Rejected — the flag abstraction has no remaining purpose and leaving it creates confusion.

### Move keep-awake into the Timer Screen
Keep-awake was managed inside `useFlipDetector` because that hook already subscribed to store changes. With the hook deleted, keep-awake must move. **Decision**: handle it directly in `KidHome` via a `useEffect` that subscribes to `runState` — consistent with how other side-effects (audio session, finish tone) are managed there.

### Keep `armed` RunState and `armedPresetId`
The `armed` state still has meaning: a preset is selected and the Play button is active. Removing it would require restructuring the store and all consumers. **Decision**: no change to the state machine shape — only the flip path that called `store.start()` is removed.

### Keep `sandTop` toggle on `finish()`
Without physical device rotation, `sandTop` alternates each time a run completes, making the hourglass flip visually on each new run. This is the desired behavior for an hourglass metaphor even in a controls-only model. **Decision**: no change.

## Risks / Trade-offs

- **Sensor permissions lingering**: If the app was previously installed and granted motion permissions, those grants stay in the OS but are now unused. No action needed — unused permissions are harmless.
- **Test suite**: `__tests__/flip-detector.test.ts` is deleted. Coverage for store actions (`start`, `stop`, `reset`) remains via timer drift tests. No new tests are needed for this change — the controls were already exercised manually.
- **Prompt string drift**: `home.promptFlip` i18n key becomes orphaned. It should be removed to avoid translator confusion on future locale additions.
