## Why

The flip-to-start gesture, while playful, adds significant complexity: it requires motion sensor permissions, has inconsistent behavior across device models, and creates accessibility challenges for users with motor impairments. Simplifying to tap-based activation makes the app more reliable, accessible, and easier to understand for both children and parents.

## What Changes

- **BREAKING**: Remove the `flip-to-start` gesture entirely — delete `useFlipDetector` hook, unsubscribe from `DeviceMotion`, remove flip detection state machine.
- Add a prominent **Start** button on the timer screen that begins the countdown when a preset is armed.
- Replace the "Flip to start!" prompt with "Tap Start to begin!" and update all related i18n strings.
- Remove motion sensor permissions from iOS (`NSMotionUsageDescription`) and Android (`android.hardware.sensor.accelerometer` / `gyroscope` from `useFeatures`).
- Remove `expo-sensors` and `expo-haptics` dependencies (haptics were only used for flip feedback).
- Update hourglass animation: remove mid-run flip reset behavior; timer only resets via preset re-selection or natural completion.
- Update privacy stance: motion sensors are no longer used at all.

## Capabilities

### New Capabilities
- `tap-to-start`: Defines the tap-based timer activation — start button visibility, disabled states, haptics-free feedback, and lifecycle.

### Modified Capabilities
- `flip-to-start`: **Being removed entirely.** No longer a supported capability.
- `hourglass-animation`: Remove mid-run flip reset; timer now only resets on preset re-tap or finish.
- `timer-screen`: Add Start button; update prompts from flip-based to tap-based.
- `privacy-and-offline`: Remove motion sensor usage from privacy claims and permission manifests.

## Impact

- **Code**: Deletes `hooks/useFlipDetector.ts`, `lib/flipStateMachine.ts` (if exists), and all flip-related logic. Adds Start button component.
- **Dependencies (removed)**: `expo-sensors`, `expo-haptics`.
- **Permissions**: Removes iOS `NSMotionUsageDescription`; removes Android `android.hardware.sensor.accelerometer` and `android.hardware.sensor.gyroscope` from `useFeatures`.
- **i18n**: Updates `locales/en.json` and `locales/es.json` — replaces "flip" strings with "tap" equivalents.
- **Accessibility**: Improves — no motion gestures required, fully operable via screen reader.
- **Build size**: Slightly smaller (~50-100 KB) without sensor libraries.
