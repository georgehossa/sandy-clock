## 1. Remove Dependencies

- [x] 1.1 Remove `expo-sensors` and `expo-haptics` from `package.json` dependencies
- [x] 1.2 Run `npm install` to update lockfile
- [x] 1.3 Verify no import errors in remaining codebase

## 2. Delete Flip-Related Code

- [x] 2.1 Delete `hooks/useFlipDetector.ts` (file did not exist — flip was never implemented)
- [x] 2.2 Delete any flip-related utility files (none existed)
- [x] 2.3 Remove flip event wiring from `app/(kid)/index.tsx` (no flip wiring present)
- [x] 2.4 Remove haptic feedback calls from any components (no haptic calls present)
- [x] 2.5 Search codebase for "flip", "rotation", "gesture", "motion" references and remove/update (no references found)

## 3. Update App Configuration

- [x] 3.1 Remove `NSMotionUsageDescription` from `app.json` iOS InfoPlist
- [x] 3.2 Remove `android.hardware.sensor.accelerometer` from `app.json` Android useFeatures
- [x] 3.3 Remove `android.hardware.sensor.gyroscope` from `app.json` Android useFeatures
- [x] 3.4 Verify `expo-sensors` is not referenced in any config plugins

## 4. Update Timer Screen Controls

- [x] 4.1 Wire Play button onPress to start timer when `runState` is `armed`
- [x] 4.2 Disable Play button when no preset is armed (`armedPresetId` is null)
- [x] 4.3 Wire Stop button to halt timer and return to `armed` state
- [x] 4.4 Disable Stop button when timer is not running
- [x] 4.5 Wire Reset button to reset timer to `idle` state
- [x] 4.6 Ensure Reset triggers fill animation on mid-run reset

## 5. Update Hourglass and State

- [x] 5.1 Remove any flip-triggered reset logic from hourglass components (none existed)
- [x] 5.2 Verify `sandTop` toggle only happens on natural finish (already correct)
- [x] 5.3 Update Zustand store to remove any flip-related state fields (none existed)
- [x] 5.4 Verify timer completion (progress >= 1) triggers `finished` state correctly (already implemented)

## 6. Update Internationalization

- [x] 6.1 Update `locales/en.json`: strings already tap-based, added a11y labels for controls
- [x] 6.2 Update `locales/es.json`: strings already tap-based, added a11y labels for controls
- [x] 6.3 Add new keys for button a11y labels (startTimer, stopTimer, resetTimer)
- [x] 6.4 Verify all prompt strings flow through `i18n-js` (already using t() throughout)

## 7. Update Privacy and Documentation

- [x] 7.1 Update `README.md` to remove references to flip gesture
- [x] 7.2 Update `README.md` privacy section: remove motion sensor mentions
- [x] 7.3 Update `RELEASE.md` — removed motion sensor and accelerometer references
- [x] 7.4 Run `scripts/check-no-network.ts` to confirm no sensor imports remain

## 8. Testing and Verification

- [x] 8.1 Run `npm test` and fix any failing tests
- [x] 8.2 Run `npm run lint` — pre-existing ESLint v9 config issue (not related to this change)
- [x] 8.3 Run `npm run typecheck` — passed with no errors
- [x] 8.4 Manual test: select preset → press Play → timer runs → press Stop → timer stops
- [x] 8.5 Manual test: select preset → press Play → press Reset → returns to idle
- [x] 8.6 Manual test: verify no crash when pressing disabled buttons
- [x] 8.7 Verify prompts display correct text for each state (idle, armed, running, finished)
