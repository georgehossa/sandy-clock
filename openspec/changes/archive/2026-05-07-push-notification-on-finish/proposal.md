## Why

When a child starts a timer and then switches to another app or locks the device, the only feedback on completion is an audio tone — which may be missed if the device is muted, at a distance, or the child is engaged elsewhere. Parents and kids have no reliable way to know the timer finished unless they are actively watching the app. A local notification ensures the finish event is always surfaced at the OS level, even when the app is backgrounded or the screen is off.

## What Changes

- Add **local push notifications** that fire when the timer reaches zero while the app is not in the foreground (backgrounded or screen locked).
- Schedule a notification at timer start using the exact remaining duration, and cancel it if the user stops/resets the timer before completion.
- The notification uses the preset name and a kid-friendly finish message (localized in EN/ES).
- Notification is **not** shown if the app is in the foreground (the existing confetti + tone experience is sufficient).
- **BREAKING**: The `privacy-and-offline` spec's permission requirement changes — the app will now declare notification permissions in addition to motion sensors.
- Add a parent-controlled toggle in Settings to enable/disable finish notifications (enabled by default).
- No network calls are introduced — `expo-notifications` uses only local/scheduled notifications, fully offline.

## Capabilities

### New Capabilities
- `finish-notification`: Local push notification fired when the timer completes while the app is backgrounded or the device is locked. Covers scheduling, cancellation, permission request flow, foreground suppression, and localized notification content.

### Modified Capabilities
- `privacy-and-offline`: The permissions requirement changes from "only motion sensors" to "motion sensors + notifications". The no-network and no-analytics requirements remain unchanged.
- `parent-settings`: A new toggle is added to the settings screen allowing parents to enable/disable finish notifications.

## Impact

- **New dependency**: `expo-notifications` (local-only usage, no push server).
- **Android manifest**: Adds `POST_NOTIFICATIONS` permission (Android 13+).
- **State store**: New `notificationsEnabled` boolean in persisted settings.
- **Timer hook / store**: Scheduling and cancellation logic tied to `runState` transitions.
- **Localization**: New strings in `en.json` and `es.json` for notification title/body and settings toggle label.
- **Build guard**: `scripts/check-no-network.ts` is unaffected — `expo-notifications` local scheduling does not use `fetch` or network APIs.
- **Settings screen**: New notification toggle row in the parent settings UI.
