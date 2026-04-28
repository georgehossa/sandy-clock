## Why

Neither screen uses safe area insets, so content clips into the notch and home indicator on notched/Dynamic Island iPhones. Additionally, the settings navigation from the Timer Screen bypasses direct routing (goes through the parent gate instead of directly), and the control buttons (Reset/Play/Stop) were shipped unconditionally — they need to sit behind a feature flag so the primary flip-to-start UX remains the default.

## What Changes

- Apply `useSafeAreaInsets` to both the Timer Screen and Settings Screen so nav bar and controls bar are always clear of the notch/status bar and home indicator
- Fix the Timer Screen nav gear icon to navigate directly to `/(parent)/settings` (skipping the gate) when a feature flag `SHOW_CONTROLS` is enabled, keeping the gate flow intact for production
- Add a `SHOW_CONTROLS` feature flag (env-based boolean in `lib/flags.ts`) that gates the Reset/Play/Stop controls bar on the Timer Screen — off by default, on in development
- When `SHOW_CONTROLS` is off, the Timer Screen reverts to the flip-only interaction with no controls bar visible

## Capabilities

### New Capabilities
- `feature-flags`: A `lib/flags.ts` module exporting boolean feature flags read from Expo `Constants.expoConfig.extra`; initially exposes `SHOW_CONTROLS`

### Modified Capabilities
- `timer-screen`: Safe area insets applied; controls bar gated by `SHOW_CONTROLS` flag; nav bar correctly clears the status bar area
- `settings-screen`: Safe area insets applied to header and scroll content so nothing clips under notch or home indicator

## Impact

- `lib/flags.ts` — new file
- `app.json` — add `extra.showControls` boolean field
- `app/(kid)/index.tsx` — wrap root with safe area padding, gate controls bar on flag
- `app/(parent)/settings.tsx` — apply safe area top/bottom padding
- No breaking changes to store, navigation structure, or existing behavior
