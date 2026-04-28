## 1. FSM Guard Relocation

- [x] 1.1 Move vertical guard from `upright → candidate-flipped` entry to `candidate-flipped → flipped` confirmation in `hooks/flipFsm.ts`
- [x] 1.2 Change `VERTICAL_GUARD_NORMZ` threshold from 0.5 to 0.6 in `hooks/flipFsm.ts`
- [x] 1.3 When 400ms elapsed but `|normZ| >= 0.6`, remain in `candidate-flipped` instead of resetting (keep waiting for the phone to settle)

## 2. Sensor Sign Correction

- [x] 2.1 Split `computeNormYZ` in `hooks/useFlipDetector.ts` to accept a flag indicating whether sign correction is needed
- [x] 2.2 Pass `needsSignCorrection: false` from the DeviceMotion listener call site
- [x] 2.3 Pass `needsSignCorrection: true` from the Accelerometer fallback listener call site
- [x] 2.4 Verify FSM threshold signs are correct for the un-double-negated DeviceMotion values (normY ≈ -1 when upright, ≈ +1 when rotated 180°) and update FSM comments/constants accordingly

## 3. Default Preset Auto-Arm

- [x] 3.1 Change `initialPersisted` in `state/store.ts` to set `armedPresetId: '3'` and `runState: 'armed'`
- [x] 3.2 Bump persist `version` to 7 and update migration to reset to new defaults

## 4. Debug Overlay

- [x] 4.1 Wrap the debug `<Text>` in `app/(kid)/index.tsx` with `__DEV__` conditional so it only renders in development builds

## 5. Tests

- [x] 5.1 Update `__tests__/flip-detector.test.ts` to reflect the new guard placement (candidate entry without Z check, confirmation with Z check)
- [x] 5.2 Add test: flip fires when normZ spikes mid-rotation but settles below 0.6 after 400ms
- [x] 5.3 Add test: flip does NOT fire when normZ stays above 0.6 after 400ms (flat-on-table)
- [x] 5.4 Add test: FSM stays in `candidate-flipped` (keeps waiting) when time elapsed but phone still flat
- [x] 5.5 Manual verification on Android device: natural rotation gesture reliably starts timer
