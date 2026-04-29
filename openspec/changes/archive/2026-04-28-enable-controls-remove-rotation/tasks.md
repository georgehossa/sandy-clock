## 1. Delete Flip Detection Code

- [x] 1.1 Delete `hooks/flipFsm.ts`
- [x] 1.2 Delete `hooks/useFlipDetector.ts`
- [x] 1.3 Delete `__tests__/flip-detector.test.ts`

## 2. Remove Feature Flag

- [x] 2.1 Remove `SHOW_CONTROLS` export from `lib/flags.ts`; delete `lib/flags.ts` if no other exports remain
- [x] 2.2 Remove `showControls` field from the `extra` block in `app.json`

## 3. Update Timer Screen

- [x] 3.1 Remove `useFlipDetector` import and call from `app/(kid)/index.tsx`
- [x] 3.2 Remove `SHOW_CONTROLS` import and the `{SHOW_CONTROLS && ...}` gate — render controls unconditionally
- [x] 3.3 Fix root view `paddingBottom`: always apply `insets.bottom` (remove the `SHOW_CONTROLS ? 0 : insets.bottom` ternary)
- [x] 3.4 Remove the `__DEV__ && flipDebug` debug overlay block from the nav bar
- [x] 3.5 Add keep-awake `useEffect` in `KidHome`: activate on `runState === 'running'`, deactivate on exit

## 4. Update Prompt Strings

- [x] 4.1 Update or replace `home.promptFlip` i18n key with a "press Play to start" message in all locale files
- [x] 4.2 Remove any remaining references to `home.promptFlip` key from the codebase
- [x] 4.3 Update `home.promptArm` (or equivalent) so the idle/armed prompt does not mention rotating the device
