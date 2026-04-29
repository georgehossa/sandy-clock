## Context

The hourglass uses `sandTop: boolean` in the Zustand store to track which chamber holds the liquid. `false` = liquid in bottom, `true` = liquid in top. The initial state is `sandTop: false`, which means the app opens with the **bottom** chamber full — the wrong visual default for a timer the user is about to start.

The `FallStream` component (the animated pour stream between chambers) was built and tested but was removed from the render tree with the comment "Pour stream removed per design decision". It needs to be restored as the primary drain animation.

Current rendering in `Hourglass.tsx`:
- `topFraction = sandTop ? 1 - timerProgress : timerProgress`
- `sandTop=false, timerProgress=0` → `topFraction=0` → top empty, bottom full

## Goals / Non-Goals

**Goals:**
- Top chamber is full (bottom empty) on app launch and whenever the timer is at rest
- Liquid drains top → bottom when play is pressed, with visible pour stream
- Correct toggle behavior after each run (liquid alternates chambers)

**Non-Goals:**
- Redesigning the `FallStream` component shape or oscillation logic
- Changing timer duration, presets, or controls
- Adding new surface effects or particles

## Decisions

### 1. Flip the canonical initial `sandTop` value: `false → true`

**Decision**: Change `initialPersisted.sandTop` from `false` to `true`.

`sandTop=true` drives `topFraction = 1 - timerProgress`, which starts at 1 (top full) when `timerProgress=0`. At rest the top chamber renders completely filled. As the timer runs, `timerProgress` rises from 0→1, draining the top and filling the bottom — exactly the expected visual.

**Alternative considered**: Keep `sandTop=false` and invert the rendering logic. Rejected — it would require touching more rendering code and would make the existing `sandTop` semantics confusing.

### 2. Update all `sandTop = false` resets to `sandTop = true`

`onRehydrateStorage` in `store.ts` explicitly resets `sandTop = false` for idle/armed/stale-run states as a "safe default". Those resets must change to `sandTop = true` to match the new canonical initial state.

The cold-boot elapsed check also resets `sandTop = false`; this too must become `true`.

### 3. Bump store version to 9 and update migration

The `migrate` function resets to `initialPersisted` on version change. Since `initialPersisted.sandTop` will be `true`, the migration is automatic — the version bump is needed so persisted `sandTop: false` from older installs gets reset.

### 4. Re-enable `FallStream` in `Hourglass.tsx`

The component already exists and is feature-complete. Pass:
- `progress={timerProgress}` — raw 0→1 drain progress for opacity calculation (high opacity at start when top is full, fades as it empties)
- `running={runState === 'running'}` — stream only visible during active countdown
- `clockMs={clock.value}` — for width oscillation
- `reduceMotion` — for static fallback

The FallStream is the primary drain animation (oscillating narrow stream in the neck zone).

## Risks / Trade-offs

- [Persisted state] Existing installs with `sandTop: false` will see a one-time visual snap to the correct state on first launch after upgrade. → Mitigated by version bump triggering full migration to `initialPersisted`.
- [Stale rehydration logic] There are multiple `sandTop = false` assignments scattered in `onRehydrateStorage`. Missing one would cause the hourglass to flash the wrong state on cold boot. → Mitigation: treat all idle/armed/stale paths identically, reset to `true`.
