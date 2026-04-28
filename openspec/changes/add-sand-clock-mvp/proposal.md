## Why

Parents need a delightful, ad-free, zero-config visual timer that small kids (ages 3–10) can operate themselves to manage short activities (brushing teeth, tidy-up, focus blocks, calm-down). Existing timers are clinical, ad-laden, or too complex for children. Shipping a free cross-platform sand-clock app where the child starts a run by simply **rotating the device** turns a chore into play, while keeping parents in control of duration, color, and finish tone.

## What Changes

- Bootstrap a new Expo (React Native, TypeScript) project targeting iOS 15+ and Android 8+ (API 26+).
- Add a kid-facing home screen with four fixed duration presets: **3 / 5 / 10 / 15 minutes**, each themed with a color.
- Add a Skia-rendered hourglass with animated, glittery falling sand (60 fps target, 30 fps graceful degradation, reduce-motion fallback).
- Add a rotate-to-start gesture using `expo-sensors` `DeviceMotion`: device flip ≥150° held ≥0.4s starts the timer; flipping mid-run resets and restarts.
- Add a parent settings screen behind a parent gate (3-second hold or "tap the number 7" challenge) for assigning preset colors (from a 6-color palette) and choosing one of three bundled finish tones (two kid-friendly: "Bubble Pop", "Magic Chime"; one neutral: "Soft Bell").
- Add bundled CC0 audio assets with attribution captured in `assets/audio/SOURCES.md`.
- Add bilingual UI (English + Spanish) via `expo-localization` + i18n strings.
- Add persistent local settings storage (preset colors + selected tone) via `AsyncStorage`.
- Add accessibility labels (VoiceOver/TalkBack) and respect for reduce-motion.
- **No** network calls, analytics, accounts, ads, or IAP.

## Capabilities

### New Capabilities
- `duration-presets`: Defines the fixed 3/5/10/15-minute presets, the color palette, default-to-color mapping, and parent-edit rules.
- `hourglass-animation`: Defines the visual hourglass — sand level interpolation, falling stream, glitter particles, color theming, performance tiers, and reduce-motion behavior.
- `flip-to-start`: Defines the rotate-to-start gesture — sensor source, flip detection thresholds, debounce, mid-run reset, and `keepAwake` lifecycle.
- `finish-tone`: Defines the three bundled tones, selection persistence, preview behavior, and playback (single-shot, ≤2s, respects system mute, no silent-mode override).
- `parent-settings`: Defines the parent-gate challenge, settings screen content (preset colors, tone selection, About/privacy), and persistence.
- `localization`: Defines bilingual (en, es) string catalog, locale detection via `expo-localization`, and runtime switching.
- `privacy-and-offline`: Defines the no-network, no-analytics, no-permissions-beyond-motion stance and offline operation.

### Modified Capabilities
<!-- None: this is the initial change for a fresh repo. -->

## Impact

- **Code**: New Expo app skeleton; introduces `app/`, `components/Hourglass/`, `hooks/`, `state/`, `assets/audio/`, `locales/`.
- **Dependencies (new)**: `expo`, `expo-router`, `expo-sensors`, `expo-audio`, `expo-haptics`, `expo-localization`, `expo-keep-awake`, `@shopify/react-native-skia`, `zustand`, `@react-native-async-storage/async-storage`, `i18n-js`, dev: `jest`, `@testing-library/react-native`, `maestro` (CLI).
- **Permissions**: iOS `NSMotionUsageDescription`; Android motion sensors (no runtime permission required for accelerometer below SDK 31, but declare `<uses-feature>`).
- **Build/Distribution**: Apple Developer enrollment ($99/yr) and Google Play Console ($25 one-time) required for store distribution. TestFlight + internal Play track viable interim.
- **Performance budget**: cold start ≤2s mid-tier; sustained 60fps mid-tier; <3% battery per 15-min run; install size <30 MB.
- **Out of scope (v1)**: custom durations, multiple timers, cloud sync, parental dashboards, tablet-tuned layouts.
