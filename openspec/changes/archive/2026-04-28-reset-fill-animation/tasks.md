## 1. Add reset detection and animated state to Hourglass

- [x] 1.1 Subscribe to `startedAt` from the store in `Hourglass.tsx`
- [x] 1.2 Add `resetFillValue: number | null` state (initially `null`) and refs: `prevStartedAtRef`, `prevTopFractionRef`, `resetRAFRef`
- [x] 1.3 Add `useEffect` that detects mid-run resets (`startedAt !== prevStartedAtRef.current && runState === 'running'`), captures `fromFraction = prevTopFractionRef.current`, and launches the RAF fill animation
- [x] 1.4 Implement the RAF animation loop: ease-out cubic `1 - (1-t)³` over 700ms, calling `setResetFillValue` each frame and `setResetFillValue(null)` on completion
- [x] 1.5 Compute `effectiveTopFraction = resetFillValue !== null ? resetFillValue : topFraction` and replace all uses of `topFraction` in JSX with `effectiveTopFraction`
- [x] 1.6 Update `prevStartedAtRef.current` and `prevTopFractionRef.current` at the end of the effect
- [x] 1.7 Cancel any pending RAF on component unmount (cleanup in the effect)

## 2. Hide pour stream during fill animation

- [x] 2.1 Change `FallStream` `running` prop to `running={runState === 'running' && resetFillValue === null}` so the stream disappears while the top is refilling

## 3. Respect reduce-motion

- [x] 3.1 In the reset detection effect, check `reduceMotion`: if true, skip the RAF animation and set `resetFillValue(null)` immediately (let `topFraction` snap to 1 as normal)

## 4. Verify

- [x] 4.1 Hold reset at ~50% progress — top chamber rises smoothly back to full in ~700ms
- [x] 4.2 Pour stream disappears during fill and reappears once animation completes and timer resumes
- [x] 4.3 Fresh play from idle — no fill animation, top is immediately full
- [x] 4.4 Enable reduce-motion — reset snaps instantly with no animation
