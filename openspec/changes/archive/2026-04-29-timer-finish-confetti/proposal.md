## Why

The timer finishing is the key celebratory moment for kids using the app, but currently the only feedback is a sound tone and a text label change. Adding a confetti burst from the play button creates a delightful visual reward that reinforces positive feelings about completing a timed activity.

## What Changes

- Add a confetti particle animation that triggers when the timer reaches `finished` state
- Confetti originates from the play button position and bursts upward/outward
- Built using the existing Skia canvas + Reanimated stack (no new dependencies)
- Respects reduce-motion accessibility setting (disabled when active)
- Adapts particle count based on device tier (high/mid/low)
- Confetti auto-dismisses after the animation completes (~2-3 seconds)

## Capabilities

### New Capabilities
- `confetti-celebration`: Skia-based confetti particle overlay that triggers on timer finish, originates from the button area, and respects accessibility/performance constraints

### Modified Capabilities

_None. Existing timer, hourglass, and finish-tone behavior remain unchanged._

## Impact

- **Components**: New `ConfettiOverlay` component added; `app/(kid)/index.tsx` updated to include the overlay
- **Performance**: Particle animation runs on UI thread via Reanimated shared values; particle count scaled by device tier to avoid frame drops on low-end devices
- **Accessibility**: Fully disabled when OS reduce-motion is enabled
- **Dependencies**: None added -- uses existing `@shopify/react-native-skia` and `react-native-reanimated`
