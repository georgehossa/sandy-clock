## 1. Store: flip initial `sandTop` to `true`

- [x] 1.1 Change `sandTop: false` to `sandTop: true` in `initialPersisted` inside `state/store.ts`
- [x] 1.2 Bump the store version constant from `8` to `9` (triggers migration reset for existing installs)
- [x] 1.3 Update all `state.sandTop = false` assignments in `onRehydrateStorage` to `state.sandTop = true` (covers idle/armed and stale-run cold-boot paths)

## 2. Hourglass: re-enable `FallStream`

- [x] 2.1 Restore the `FallStream` import in `components/Hourglass/Hourglass.tsx` (it is already imported but the JSX element was removed)
- [x] 2.2 Add the `<FallStream>` element back inside the `<Canvas>`, between the liquid fills (step 6) and the `LiquidSurface` (step 7), passing `progress={timerProgress}`, `running={runState === 'running'}`, `clockMs={clock.value}`, `color={sandColor}`, `geom={geom}`, and `reduceMotion={reduceMotion}`

## 3. Verify correct behavior end-to-end

- [x] 3.1 Launch the app — top chamber must render fully filled, bottom empty, no stream visible
- [x] 3.2 Press play — stream appears in the neck zone and the top chamber level descends smoothly
- [x] 3.3 Let the timer finish — liquid is now fully in the bottom chamber; stream disappears
- [x] 3.4 Press play again — stream reappears, bottom drains into top (correct reversal)
- [x] 3.5 Confirm reduce-motion path: stream is a static rect with fixed opacity, no oscillation
