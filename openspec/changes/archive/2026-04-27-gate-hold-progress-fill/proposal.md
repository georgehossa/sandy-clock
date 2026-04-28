## Why

The hold button on the Parent Gate screen currently gives no visual feedback during the 3-second hold — it just changes to a darker tint on press. Users have no way to know how much longer they need to hold, making the interaction feel broken or unresponsive. A animated progress fill that sweeps across the button over 3 seconds gives clear, satisfying feedback and matches modern timebar UX patterns.

## What Changes

- While the user holds the button, a fill layer animates from left to right across the button over `HOLD_MS` (3000ms) using `Animated.Value`
- If the user releases before 3 seconds, the fill resets instantly to zero
- If the fill completes (reaches 100%), `passGate()` is called — same as the existing `setTimeout` behavior
- The fill color is `theme.colors.mintDark` layered over the existing `theme.colors.mint` button background, clipped to the button's border radius
- The existing `setTimeout`-based logic remains as the authoritative gate trigger; the animation is purely visual and driven in parallel

## Capabilities

### New Capabilities
_(none — enhancement to existing gate-hold interaction)_

### Modified Capabilities
_(no spec-level behavior change — hold-3s mechanic unchanged; visual feedback added)_

## Impact

- `app/(parent)/gate.tsx` — animation logic added; no behavior changes
- Uses React Native's built-in `Animated` API — no new dependencies
