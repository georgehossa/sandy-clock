# Sand Clock

A free, ad-free, offline kids sand-clock timer for iOS and Android.

- Pick 3 / 5 / 10 / 15 minutes.
- Press Play to start.
- Glittery animated sand falls. A short tone plays when it's done.
- Parents configure colors and finish tone behind a parent gate.

## Download (Android APK)

No Google Play account required.

1. Go to [Releases](https://github.com/jorgeossa/sand-clock/releases) and download the latest `.apk`.
2. On your Android device, open the downloaded file.
3. If prompted, tap **Settings → Allow from this source**, then return and tap **Install**.

> **iOS:** This build is Android-only. iOS requires a paid Apple Developer account
> ($99/yr), which is out of scope for this free project.

## Build from source

    npm install
    npx expo start

Then press `i` (iOS Simulator) or `a` (Android emulator), or scan the QR with
Expo Go.

> **Audio assets are not yet included.** See `assets/audio/SOURCES.md` and add
> three CC0 clips before running on device.

## Privacy

Sand Clock collects nothing. The app works fully offline.

- No analytics SDKs, no crash reporting with PII, no ads, no IAP.
- No accounts and no network calls of any kind.
- No motion sensors or device orientation tracking.

A build-time guard (`scripts/check-no-network.ts`, run via `npm test`) fails
the build if any source file under `app/`, `components/`, `hooks/`, `state/`,
or `lib/` imports `fetch`, `XMLHttpRequest`, `expo-network`, `axios`, or
`@apollo/client`.

## Project layout

    app/
      _layout.tsx           Root nav, i18n init
      (kid)/index.tsx       Kid home: presets + hourglass
      (parent)/gate.tsx     Parent gate (3s long-press OR tap-the-7)
      (parent)/settings.tsx Preset colors + tone + language + about
    components/
      Hourglass/            Skia canvas: sand body, fall stream, glitter
      PresetButton.tsx
    hooks/
      useTimer.ts           Drift-free progress from Date.now() deltas
    lib/
      i18n.ts               i18n-js init + locale resolution
      audio.ts              expo-audio wrapper, single-shot finish tone
      deviceTier.ts         RAM-based perf tier
      useReduceMotion.ts
    state/
      presets.ts            Fixed preset / palette / tone constants
      store.ts              Zustand store + AsyncStorage persistence
    locales/
      en.json, es.json
    scripts/
      check-no-network.ts   Build-time privacy guard

## Specs

See `openspec/changes/add-sand-clock-mvp/` for the full proposal, design,
per-capability specs, and task list.
