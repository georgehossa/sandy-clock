## Context

Greenfield repo (`openspec init` only) with no app code yet. This change establishes the Expo (React Native, TypeScript) project, the Skia-rendered hourglass, sensor-driven flip-to-start gesture, parent settings, bilingual UI, and bundled finish tones — together producing a free, offline, ad-free kids sand-clock app for iOS and Android.

Stakeholder: a single developer (the repo owner) targeting App Store + Google Play distribution. End users: parents (configure) and children ages 3–10 (operate).

Hard constraints set by the proposal: no network calls, no analytics, no IAP, no ads, no accounts, no permissions beyond motion sensors. Bilingual (en + es) at launch. <30 MB install size. 60 fps mid-tier devices.

## Goals / Non-Goals

**Goals:**
- Single TypeScript codebase shipping iOS + Android builds.
- 60 fps animated, glittery hourglass driven by elapsed-time interpolation (drift-free).
- Reliable rotate-to-start gesture across both OSes with intentional debounce.
- Offline-only, zero-telemetry posture verifiable by network inspection.
- Parent gate that resists toddler taps without frustrating adults.
- Bilingual (en / es) UI driven by device locale with manual override.
- Reproducible asset attribution for CC0 audio.

**Non-Goals:**
- Custom durations, multiple concurrent timers, cloud sync, accounts, parental dashboards.
- Tablet-tuned layouts (works, not optimized).
- Localizations beyond en/es.
- OTA update infrastructure (Expo EAS Update may be added post-launch).

## Decisions

### D1: Framework — Expo (React Native, SDK 50+) over Flutter / native
Single TS codebase, fast iteration, broad ecosystem, and the user's existing JS/TS familiarity. Skia closes the animation-perf gap with Flutter for our use case. Native (SwiftUI + Compose) doubles work for marginal gain.

### D2: Rendering — `@shopify/react-native-skia`
The hourglass + glitter particles need a per-frame imperative canvas. Skia's `useClock`/`Canvas` plus `useDerivedValue` give us 60 fps without bridge churn. Alternative `react-native-reanimated` + SVG can hit ~60 fps for simple shapes but degrades with hundreds of particles.

### D3: Timer — elapsed-time interpolation, not setInterval
A `useTimer` hook stores `startedAt` (ms epoch) and computes progress as `(now - startedAt) / durationMs` on every frame via Skia's clock. This avoids `setInterval` drift over a 15-minute run (target drift <100 ms). Background → foreground rehydrates progress from persisted `startedAt`.

### D4: Flip detection — `expo-sensors` `DeviceMotion`, pitch-threshold state machine
Subscribe at 30 Hz. Track quaternion-derived pitch. Transition to "flipped" when |pitch| ≥ 150° sustained for ≥400 ms; transition back when |pitch| ≤ 30° sustained for ≥400 ms. Debounce prevents accidental triggers during pickup. Mid-run flip = `running → idle → running` (reset, not pause). Alternative (`Accelerometer` only) is noisier and harder to threshold reliably.

### D5: Audio — `expo-audio` (the new module), single-shot
One sound object per tone, preloaded on settings change. Plays once at finish. Honors system mute; explicitly does **not** override silent mode (kid-safe default). `expo-av` is the older alternative; we pick `expo-audio` for SDK 50+ alignment and lighter footprint.

### D6: State — Zustand with AsyncStorage persist middleware
`store.ts` exposes `presets` (id → color), `tone` (id), and ephemeral `runState` (`idle | armed | running | finished`). Persisted slice = presets + tone only. Zustand chosen over Redux/Context for size and ergonomics; chosen over Jotai because the store is small and global-state shape is fixed.

### D7: Navigation — `expo-router` file-based routes
Route groups: `app/(kid)/` (home + run), `app/(parent)/` (gate, settings, about). Deep-linking unused. Keeps screen tree obvious and testable.

### D8: Parent gate — dual challenge
Long-press 3 s **or** tap-the-7 (a 3×3 grid of digits with one "7"). Long-press is fast for adults; tap-the-7 is the fallback when long-press is unintuitive. Both must succeed to enter `(parent)`. Reset on app background.

### D9: Localization — `expo-localization` + `i18n-js`
Detect device locale at launch (`Localization.getLocales()[0].languageCode`), default `en` if not `en|es`. Allow override in settings. String catalogs at `locales/en.json` and `locales/es.json`. Pluralization not required (text surface is tiny).

### D10: Reduce-motion fallback
On `AccessibilityInfo.isReduceMotionEnabled() === true`: disable glitter shimmer; sand still falls but as a single solid mass with discrete level updates every 1 s. Preserves the affordance without vestibular load.

### D11: Performance tiers
Detect device tier via `react-native-device-info` (`getTotalMemorySync()`):
- ≥4 GB → "high": 50 glitter particles per chamber, 60 fps target.
- 2–4 GB → "mid": 30 particles, 60 fps target.
- <2 GB → "low": 0 particles, 30 fps target (still glitters via 8-particle field if reduce-motion off and user re-enables).

### D12: Privacy posture — verifiable
- No analytics SDKs whatsoever in `package.json`.
- Add an automated test (`__tests__/no-network.test.ts`) that fails the build if `fetch`/`XMLHttpRequest`/`expo-network` are imported anywhere in `app/`, `components/`, `hooks/`, `state/`.
- Privacy text: "We collect nothing. The app works fully offline." Surfaced in About and store listing.

### D13: Asset attribution — `assets/audio/SOURCES.md`
Each tone file paired with: source URL, author handle, license (CC0), download date, and a short preview clip name. Required by store review and lawful CC0 use.

### D14: Build & distribution — EAS Build (managed) → store submission
EAS Build managed workflow for iOS + Android binaries. Internal testing via TestFlight and Play internal track. No EAS Update in v1 to keep posture tight.

## Risks / Trade-offs

- **Skia particle perf on low-end Android** → Tier-based particle count (D11) and reduce-motion fallback (D10).
- **Flip false positives during normal handling (e.g., child slipping the phone in/out of pocket)** → 400 ms threshold debounce + sustained-angle check (D4); add 250 ms haptic confirmation on flip-armed → flip-fired transition so kids learn the gesture.
- **Background termination losing run progress** → Persist `startedAt` to AsyncStorage on each state transition; rehydrate on foreground (D3). Acceptable: if OS hard-kills, we resume from `startedAt`; if device reboots, run is lost.
- **CC0 audio sources change or are taken down** → Keep originals committed under `assets/audio/`; `SOURCES.md` records provenance even if upstream disappears (D13).
- **Bilingual mismatch with copy review** → Keep English authoritative; send `es.json` to a native speaker before store submission. Track in tasks.
- **App size creep from Skia** → Skia adds ~3 MB iOS / ~6 MB Android; accept and monitor (<30 MB total). No Lottie unless needed.
- **Apple/Google "kids category" policy nuances** → File under "Education" or "Lifestyle"; do **not** check the "Made for Kids" / "Kids Category" if it triggers extra review burden in v1, since we collect nothing and have no chat/UGC. Revisit per latest policies during submission.

## Migration Plan

Greenfield — no existing app to migrate. Rollback = revert PR; no data to preserve. Distribution rollout: TestFlight + Play internal track first (≥3 real-device test sessions), then phased Play release (10% → 50% → 100%) and standard App Store release.

## Open Questions

- **Final app name + brand color** — placeholder "Sand Clock" until decided; affects icon, splash, and locales.
- **Apple Developer enrollment timing** — assume enrolled before EAS submit step; if not, ship Play Store first.
- **Tone preview UX** — preview on tap vs. on long-press (tap is more discoverable; long-press avoids accidental sound in quiet rooms). Default to **tap-to-preview** with a small speaker icon hint.
- **Color picker UX** — 6 swatches in a ring vs. a row. Default to **horizontal row** under the preset for proximity; revisit after first device test.
