## Context

Sand Clock currently uses a `DeviceMotion`-based flip gesture (`useFlipDetector.ts`) to start and reset the timer. This requires `expo-sensors`, motion permissions on iOS, and creates accessibility barriers. The gesture is also inconsistent across Android devices.

## Goals / Non-Goals

**Goals:**
- Remove all motion sensor dependencies and code
- Add a clear, accessible tap-based Start button
- Maintain the playful, kid-friendly UX without the flip metaphor
- Update all i18n strings to reflect tap-based interaction
- Remove motion-related permissions from app manifests

**Non-Goals:**
- Changing the hourglass visual design (liquid fill remains)
- Changing preset durations or color system
- Adding new animations to replace the flip (keep it simple)
- Supporting both flip and tap (complete removal only)

## Decisions

**Decision: Remove flip gesture entirely (no fallback)**
- **Rationale**: Maintaining both gesture types adds complexity and the flip was always unreliable. A single, clear interaction model is better for kids.
- **Alternative considered**: Keep flip as optional via settings — rejected because it preserves the permission and code complexity we want to eliminate.

**Decision: Use existing Play button in controls bar as Start**
- **Rationale**: The timer screen already has a Play button in the bottom controls. Instead of adding a new Start button, we repurpose Play to also serve as the Start action when `runState` is `armed`.
- **Alternative considered**: Add a large central Start button above the hourglass — rejected because it crowds the visual and the controls bar already exists.

**Decision: Keep Stop and Reset buttons always visible**
- **Rationale**: The controls bar already renders unconditionally. Stop and Reset can be no-ops or disabled in certain states rather than hidden, maintaining UI stability.

**Decision: Remove expo-haptics along with expo-sensors**
- **Rationale**: Haptics were only used for flip feedback. No other haptic feedback is required in the tap-based flow.
- **Alternative considered**: Add haptic feedback on Start button press — rejected as unnecessary for MVP; can be added later if desired.

## Risks / Trade-offs

- **[Risk] Existing users expect flip gesture** → **Mitigation**: This is a breaking change for v0.1.0 users. Communicate clearly in release notes. The app is young enough that user base is small.
- **[Risk] Kids find tap less engaging than flip** → **Mitigation**: The hourglass animation itself is the primary delight; the activation method is secondary. If engagement drops, consider adding a celebratory animation on Start.
- **[Risk] Removing expo-sensors breaks any future feature needing sensors** → **Mitigation**: Sensors can be re-added later if a compelling use case emerges. For now, simplicity wins.

## Migration Plan

1. Remove `expo-sensors` and `expo-haptics` from `package.json`
2. Delete `hooks/useFlipDetector.ts` and any flip-related utility files
3. Remove `NSMotionUsageDescription` from iOS Info.plist
4. Remove `android.hardware.sensor.accelerometer` and `gyroscope` from Android useFeatures
5. Update `app/(kid)/index.tsx` to remove flip event wiring
6. Update Play button handler to start timer when `runState` is `armed`
7. Update i18n strings: replace "Flip to start!" with "Press Play to start!"
8. Update Zustand store: remove any flip-related state if present
9. Run privacy check script to confirm no sensor imports remain
