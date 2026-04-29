## Why

When the user holds the reset button, the top chamber snaps back to full instantly — breaking the liquid illusion the hourglass has established. A quick animated fill (liquid rising into the top) makes the reset feel physical and consistent with the rest of the experience.

## What Changes

- **Reset fill animation**: when a mid-run reset is triggered, the top chamber animates from its current fill level back to full over ~700ms using an ease-out curve (fast start, slows as it approaches the top — like liquid filling a vessel).
- The bottom chamber mirrors the inverse: it drains back to empty over the same duration.
- The pour stream is hidden during the fill animation (no liquid is falling while the top is refilling).
- The animation only plays during a mid-run reset (`runState` stays `running`). Starting a fresh run from `idle`/`armed` does not animate (the top is already full).

## Capabilities

### New Capabilities

- `reset-fill-animation`: the animated top-chamber refill that plays when a mid-run reset occurs.

### Modified Capabilities

- `hourglass-component`: the `topFraction` driving the chamber fills must be interpolable — the reset animation overrides the timer-derived value during the ~700ms fill window.

## Impact

- `components/Hourglass/Hourglass.tsx` — introduces `effectiveTopFraction` that is normally derived from `timerProgress` but switches to an animated value during reset
- `hooks/useTimer.ts` — read-only; no changes needed
- `state/store.ts` — read-only; `startedAt` changes are used as the reset signal
