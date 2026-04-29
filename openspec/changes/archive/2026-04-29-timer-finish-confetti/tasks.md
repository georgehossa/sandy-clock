## 1. Particle System Core

- [x] 1.1 Create `components/ConfettiOverlay.tsx` with a full-screen Skia `<Canvas>` overlay (`pointerEvents="none"`, absolutely positioned)
- [x] 1.2 Define particle config type (position, velocity, angle, color, size, rotation) and a function to generate randomized particle arrays
- [x] 1.3 Implement particle position math: given `(initialConfig, progress 0→1)`, compute x/y with gravity, spread angle, and optional rotation

## 2. Animation Driver

- [x] 2.1 Add a Reanimated shared value `progress` (0→1) driven by `withTiming` (~2.5s duration, easing out)
- [x] 2.2 Use `useDerivedValue` to compute each particle's current position/opacity/rotation from `progress` and its initial config
- [x] 2.3 Render particles as Skia `RoundedRect` or `Circle` primitives with per-particle transforms

## 3. Trigger and Lifecycle

- [x] 3.1 Watch `runState` from the Zustand store — start animation on `finished`, clear particles on any other state transition
- [x] 3.2 Pass play button origin coordinates via `onLayout` measurement in `app/(kid)/index.tsx` to the overlay component

## 4. Accessibility and Performance

- [x] 4.1 Check `useReduceMotion()` — return `null` from `ConfettiOverlay` when reduce-motion is enabled
- [x] 4.2 Scale particle count by device tier using `detectDeviceTier()` (high: ~40, mid: ~20, low: ~10)

## 5. Integration

- [x] 5.1 Add `<ConfettiOverlay>` to `app/(kid)/index.tsx` as an overlay above the controls area
- [x] 5.2 Verify confetti does not block touch events on the play/reset button
- [x] 5.3 Test on device or simulator: confirm animation triggers on finish, clears on reset, and respects reduce-motion
