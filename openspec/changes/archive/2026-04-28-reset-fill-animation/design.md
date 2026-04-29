## Context

`useTimer` returns a `number` (JS-thread RAF loop → `useState`). Every frame, `topFraction = 1 - timerProgress` drives `SandBody` via a re-render. When `reset()` fires, `startedAt` changes → `rawProgress` snaps to ~0 → `topFraction` snaps to ~1 in a single render. The snap is instant and jarring.

The animation must interpolate `topFraction` from its pre-reset value to 1 over ~700ms without changing the timer itself or any other component's API.

## Goals / Non-Goals

**Goals:**
- Animate top chamber from current fill level → full over 700ms on mid-run reset
- Ease-out cubic curve (fast rise that slows at the top)
- Hide the pour stream while the fill animation is active
- No changes to `SandBody`, `FallStream`, or `LiquidSurface` prop signatures

**Non-Goals:**
- Animating the bottom chamber separately (it mirrors `1 - effectiveTopFraction` automatically)
- Animating the initial load or first play
- Reanimated UI-thread animation (JS-thread RAF is sufficient for a one-shot effect)

## Decisions

### 1. `effectiveTopFraction` overrides `topFraction` during reset

Introduce a nullable state `resetFillValue: number | null` in `Hourglass`:

```ts
const effectiveTopFraction = resetFillValue !== null ? resetFillValue : topFraction;
```

- **Normal operation**: `resetFillValue = null` → `effectiveTopFraction = topFraction`. Zero extra renders, zero performance cost.
- **During reset**: RAF loop updates `resetFillValue` each frame → drives the animation.
- **On completion**: `setResetFillValue(null)` → falls back to `topFraction` (already ~1 by then).

All downstream components (`SandBody`, `FallStream`, `LiquidSurface`) receive `effectiveTopFraction` unchanged — no prop signature changes needed.

**Alternative considered**: Reanimated `SharedValue` + `useDerivedValue` piped into each component. Rejected — requires refactoring `SandBody` to compute its path inside a worklet, which is a large change for a one-shot animation.

### 2. Reset detected by comparing `startedAt` across renders

`startedAt` changes only when `reset()` or `start()` fires. By checking `startedAt !== prevStartedAtRef.current && runState === 'running'`, we isolate mid-run resets precisely.

`prevTopFractionRef` stores the last rendered `topFraction`. On the reset render, this ref still holds the pre-reset value (it's updated at the END of the effect, after the "from" value is captured).

### 3. Custom RAF animation loop, not `Animated` API

A plain `requestAnimationFrame` loop calling `setResetFillValue` is used rather than `Animated.timing` + `addListener` because:
- `addListener` on `Animated.Value` fires on every frame and calls `setState`, causing an extra re-render per frame on top of the timer's own RAF. With a custom loop the two RAF callbacks can be called within the same frame, React batches them.
- The easing function (`1 - (1 - t)³`) is trivially implemented inline.
- `Animated` adds no value here — there are no native-thread benefits for a state-driven value.

### 4. Pour stream hidden during fill animation

Pass `running={runState === 'running' && resetFillValue === null}` to `FallStream`. The stream disappears for 700ms during the fill, which is visually appropriate (liquid is flowing INTO the top, not falling down).

## Risks / Trade-offs

- [Double RAF] During the 700ms animation, two RAF loops run concurrently (timer + reset). React should batch the resulting `setState` calls within a single frame, but worst-case is ~2× renders for 700ms. Acceptable for a one-shot effect.
- [Timing jitter] If `prevTopFractionRef` is stale by one render cycle, the "from" value could be slightly off. At 60fps this is ≤16ms of timer progress — visually imperceptible.
