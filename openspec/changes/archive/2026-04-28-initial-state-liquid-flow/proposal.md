## Why

Currently the hourglass starts with an ambiguous or incorrect initial state — the top chamber is not visually full before the timer starts, which breaks the mental model of a sand/liquid timer. Users expect to see a full top chamber at rest and watch the liquid drain as the countdown runs.

## What Changes

- **Initial state**: Top chamber renders fully filled (progress = 0) before play is pressed; bottom chamber is empty.
- **Play trigger**: When the user presses play, liquid begins draining from the top chamber into the bottom chamber.
- **Drain animation**: A smooth animated transition shows the liquid level descending in the top chamber and rising in the bottom chamber as the timer counts down.
- **Pour stream**: The fall stream between chambers is only visible while the timer is `running` (already specced), but now it must begin precisely when play is pressed — no stream in the idle/ready state.

## Capabilities

### New Capabilities

- `initial-full-state`: Top chamber is fully filled and bottom is empty when the timer is in the `idle`/`ready` state (before play). This is the canonical at-rest visual.

### Modified Capabilities

- `hourglass-component`: Initial timer progress mapping changes — progress = 0 now means top is **full** (not empty). The drain animation must start from a full top chamber when play begins.

## Impact

- `components/Hourglass/Hourglass.tsx` — progress-to-fill mapping and initial state
- `components/Hourglass/SandBody.tsx` — level computation driven by progress
- `components/Hourglass/FallStream.tsx` — stream visibility tied strictly to `running` state
- `state/store.ts` — confirm `runState` idle/ready/running transitions are correct
