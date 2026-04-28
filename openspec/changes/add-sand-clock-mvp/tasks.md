## 1. Project Bootstrap

- [x] 1.1 Initialize Expo TypeScript project (SDK 50+) at repo root, configured for iOS 15+ and Android API 26+
- [x] 1.2 Add ESLint + Prettier with the LazyVim-friendly config and a `lint` / `format` script
- [x] 1.3 Add Jest + `@testing-library/react-native` and a passing smoke test
- [x] 1.4 Configure `expo-router` with route groups `(kid)` and `(parent)`
- [x] 1.5 Add `app.json` icon, splash, bundle id (`com.<owner>.sandclock`), and orientation = portrait
- [x] 1.6 Add `.gitignore` entries for `node_modules`, `.expo`, `ios/`, `android/`, `dist/`

## 2. Dependencies & Native Configuration

- [x] 2.1 Install runtime deps: `@shopify/react-native-skia`, `expo-sensors`, `expo-audio`, `expo-haptics`, `expo-localization`, `expo-keep-awake`, `zustand`, `@react-native-async-storage/async-storage`, `i18n-js`, `react-native-device-info`
- [x] 2.2 Add `NSMotionUsageDescription` ("To start the timer when you flip the phone") to iOS via `app.json`
- [x] 2.3 Add Android `<uses-feature android:name="android.hardware.sensor.accelerometer" />` via `app.json`
- [x] 2.4 Confirm no analytics/tracking SDKs are present and document in `package.json` notes

## 3. State, Storage, and Locale Foundation

- [x] 3.1 Create `state/store.ts` Zustand store with `presets`, `tone`, `language`, `runState`, `armedPresetId`, `startedAt`
- [x] 3.2 Wire AsyncStorage persist middleware for `presets`, `tone`, `language` only (NOT `runState`)
- [x] 3.3 Seed default presets per spec: 3→`#7DD3FC`, 5→`#86EFAC`, 10→`#FDE047`, 15→`#FCA5A5`; default tone `magic-chime`; default language `system`
- [x] 3.4 Add `locales/en.json` and `locales/es.json` with all UI strings (home prompts, settings labels, tone names, privacy text, gate prompts)
- [x] 3.5 Add `lib/i18n.ts` initializing `i18n-js` from `expo-localization`, honoring user override (`en` / `es` / `system`)

## 4. Hourglass Rendering (Skia)

- [x] 4.1 Build `components/Hourglass/Hourglass.tsx` Skia canvas root sized for portrait
- [x] 4.2 Implement `SandBody` rendering top + bottom chambers with sand level interpolation from `useTimer`
- [x] 4.3 Implement `FallStream` thin particle column with gravity + jitter, rendered only while `runState === 'running'`
- [x] 4.4 Implement `GlitterField` particle system tinted by armed preset color, particle count by device tier (50 / 30 / 0)
- [x] 4.5 Detect device tier on mount via `react-native-device-info` `getTotalMemorySync()` and expose via context
- [x] 4.6 Honor `AccessibilityInfo.isReduceMotionEnabled()` — disable glitter, throttle level updates to 1 Hz, render fall stream as static column

## 5. Timer

- [x] 5.1 Implement `hooks/useTimer.ts` driving progress as `(now - startedAt) / durationMs` via Skia clock
- [ ] 5.2 Persist `startedAt` to AsyncStorage on each `running` transition; rehydrate on foreground
- [x] 5.3 Dispatch `finished` transition when progress ≥ 1, releasing keep-awake and triggering finish-tone playback
- [x] 5.4 Unit test: 15-min simulated run drift < 100 ms

## 6. Flip-to-Start Gesture

- [x] 6.1 Implement `hooks/useFlipDetector.ts` subscribing to `DeviceMotion` at 30 Hz, deriving pitch from quaternion
- [x] 6.2 Implement state machine: `upright → candidate (|pitch|≥150°) → flipped (held ≥400ms) → upright (|pitch|≤30° held ≥400ms)`
- [x] 6.3 Wire `flipped` event to `armed → running` transition; ignore when no preset is armed
- [x] 6.4 Wire mid-run flip to `running → idle → running` reset using same armed preset
- [x] 6.5 Fire `expo-haptics` light impact on flip-armed → flip-fired
- [x] 6.6 Engage `expo-keep-awake` on `running`, release on `finished` or background
- [x] 6.7 Unit test `useFlipDetector` against fixtures of mocked motion events (sustained flip, brief flip, no-arm flip)

## 7. Finish Tone

- [ ] 7.1 Add three CC0 audio files under `assets/audio/` (`bubble-pop.m4a`, `magic-chime.m4a`, `soft-bell.m4a`), each ≤ 2.0s, normalized to within ±1 LUFS
- [x] 7.2 Create `assets/audio/SOURCES.md` with source URL, author, license, download date, filename for each tone
- [x] 7.3 Build `lib/audio.ts` preloading the active tone via `expo-audio`; reload on tone change
- [x] 7.4 Configure audio session to **respect** silent mode (do not override)
- [x] 7.5 Trigger single-shot playback on `finished`; ensure no replay/loop

## 8. Kid Home Screen

- [x] 8.1 Build `app/(kid)/index.tsx` with four big circular preset buttons (3 / 5 / 10 / 15), centered hourglass, gear icon top-right
- [x] 8.2 Tapping a preset arms it (visually highlights, store updates); only one armed at a time
- [x] 8.3 Show "Flip to start!" prompt (i18n key) when armed and not yet running
- [x] 8.4 Show finished state: gentle bounce on hourglass + tone fired by §7.5; clearing on next preset tap or flip-reset
- [x] 8.5 Add accessibility labels for VoiceOver/TalkBack on all controls and the hourglass progress

## 9. Parent Gate & Settings

- [x] 9.1 Build `app/(parent)/gate.tsx` with both modes: 3s long-press target and 3×3 digit grid with one "7"
- [x] 9.2 Reset gate-passed flag whenever app moves to background
- [x] 9.3 Build `app/(parent)/settings.tsx` with sections: preset rows w/ 6-color row picker, tone selector (3 radio + tap-to-preview), language toggle (English / Español / System default), About section
- [x] 9.4 About section renders i18n privacy statement: "We collect nothing. The app works fully offline." (and Spanish equivalent), plus app version from `expo-constants`
- [x] 9.5 Wire selections to Zustand store; verify persistence across force-kill

## 10. Privacy Build Guard

- [x] 10.1 Add `scripts/check-no-network.ts` that scans `app/`, `components/`, `hooks/`, `state/` for `fetch`, `XMLHttpRequest`, `expo-network`, `axios`, `@apollo/client` imports
- [x] 10.2 Wire the script into `npm test` and CI; failing build on any match
- [x] 10.3 Document the policy in `README.md` privacy section

## 11. Performance & Accessibility QA

- [ ] 11.1 Manual test on iPhone 12 + Pixel 6: confirm ≥58 fps average over a 5-min run (Hermes profiler / Flipper)
- [ ] 11.2 Manual test on Pixel 4a-class device: confirm ≥28 fps and no crashes on a 5-min run
- [ ] 11.3 iOS Accessibility Inspector pass: every control has a label, hourglass announces progress, reduce-motion behaves
- [ ] 11.4 Android Accessibility Scanner pass with no critical findings
- [ ] 11.5 Battery sanity check: < 3% drain over a 15-min run, screen on, default brightness
- [ ] 11.6 Airplane-mode end-to-end run on both platforms: every feature works

## 12. Localization Review

- [ ] 12.1 Inventory every rendered string and confirm all flow through `i18n-js`
- [ ] 12.2 Send `locales/es.json` to a native Spanish speaker for review; apply edits
- [ ] 12.3 Add lint rule or test verifying every key in `en.json` exists in `es.json`

## 13. Store Submission Prep

- [ ] 13.1 Configure EAS Build profiles (`development`, `preview`, `production`) in `eas.json`
- [ ] 13.2 Produce app icon and splash in both languages-neutral form
- [ ] 13.3 Capture screenshots (en + es) on iPhone 6.7", iPhone 5.5", Pixel 6, 7" tablet
- [ ] 13.4 Write store listings (en + es): name, subtitle, description, keywords, privacy URL pointing to a static page restating "We collect nothing"
- [ ] 13.5 Submit to TestFlight and Play internal track; collect feedback from ≥3 real-device sessions
- [ ] 13.6 Phased Play release (10% → 50% → 100%); standard App Store release after TestFlight sign-off

## 14. Verification Against Specs

- [ ] 14.1 Walk through every scenario in `specs/duration-presets/spec.md` on device and check off
- [ ] 14.2 Walk through every scenario in `specs/hourglass-animation/spec.md`
- [ ] 14.3 Walk through every scenario in `specs/flip-to-start/spec.md`
- [ ] 14.4 Walk through every scenario in `specs/finish-tone/spec.md`
- [ ] 14.5 Walk through every scenario in `specs/parent-settings/spec.md`
- [ ] 14.6 Walk through every scenario in `specs/localization/spec.md`
- [ ] 14.7 Walk through every scenario in `specs/privacy-and-offline/spec.md`
