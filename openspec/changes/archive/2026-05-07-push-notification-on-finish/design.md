## Context

Sandy Clock is a fully-offline React Native / Expo timer app for kids on Android. When the timer finishes, the app plays an audio tone and shows confetti — but only while the app is in the foreground. If the child switches to another app or locks the screen, there is no OS-level signal that time is up. The existing timer uses wall-clock deltas (`Date.now()`) and already detects background expiry on foreground resume, but there is no proactive notification.

The app has a strict no-network policy enforced by a build-time guard. `expo-notifications` local scheduling is fully offline and does not violate this constraint — it uses the OS alarm/scheduler, not a push server.

## Goals / Non-Goals

**Goals:**
- Fire a local notification when the timer finishes and the app is not in the foreground.
- Schedule the notification at timer start and cancel it on stop/reset so the OS handles exact timing.
- Provide a parent-controlled toggle to enable/disable notifications.
- Request `POST_NOTIFICATIONS` permission on Android 13+ with a graceful degradation path.
- Maintain zero network usage.

**Non-Goals:**
- Remote/server push notifications — this is local scheduling only.
- Notification sound customization (reuse the system default; the in-app finish tone is a separate experience).
- iOS support (the app is Android-only).
- Notification channels management beyond the single default channel.
- Background task execution — no `expo-task-manager`; the OS alarm scheduler fires the notification directly.

## Decisions

### 1. `expo-notifications` for local scheduling

**Choice**: Use `expo-notifications` with `scheduleNotificationAsync` using a `TimeIntervalTrigger`.

**Rationale**: It is the Expo-recommended API for local notifications, requires no bare-workflow ejection, works fully offline, and supports exact scheduling via Android alarm APIs. Alternatives like `react-native-push-notification` or `notifee` require manual native linking and are heavier.

**Alternative considered**: Using `expo-task-manager` with a background fetch to check timer state — rejected because it adds complexity, battery drain, and inexact timing. The OS alarm scheduler is both simpler and more precise.

### 2. Schedule at start, cancel on stop/reset

**Choice**: Schedule a notification with a delay equal to `durationMs` when `runState` transitions to `running`. Cancel via `cancelAllScheduledNotificationsAsync` when `runState` transitions to `armed` (stop/reset) or `idle`.

**Rationale**: This is the simplest approach — one schedule, one cancel. No need to track notification IDs across app restarts because `cancelAll` is safe to call idempotently. The notification fires at the exact time the timer would complete, independent of app state.

### 3. Foreground suppression via notification handler

**Choice**: Register a `setNotificationHandler` that returns `shouldShowAlert: false` when the app is in the foreground.

**Rationale**: When the app is active, the confetti + tone experience is the primary UX. A redundant notification banner would be distracting and confusing. Expo's notification handler provides a clean way to suppress display without canceling the schedule.

### 4. Permission request flow

**Choice**: Request `POST_NOTIFICATIONS` permission lazily on first timer start when notifications are enabled. If denied, the toggle remains on but notifications silently fail — no blocking modal.

**Rationale**: Kids use this app, and a blocking permission dialog mid-play is disruptive. Requesting on first start (not on app launch) means the parent sees the prompt in context. If denied, all other functionality continues normally. The parent can re-enable via Android system settings.

### 5. New `notificationsEnabled` setting in Zustand store

**Choice**: Add a `notificationsEnabled: boolean` field (default: `true`) to the persisted Zustand slice, controlled by a toggle in the parent settings screen.

**Rationale**: Consistent with existing settings architecture. Persisted via AsyncStorage. The toggle lives behind the parent gate, so kids cannot disable it. Bumping the store version and migrating from v9 to v10 with `notificationsEnabled: true` as default.

### 6. Notification content — localized, kid-friendly

**Choice**: Notification title: preset label (e.g., "3 minutes"). Body: a localized finish message (EN: "Time's up!", ES: "Se acabó el tiempo!"). No action buttons.

**Rationale**: Simple, clear, recognizable. The child or parent taps the notification to return to the app and see the finished state. No complex interaction needed.

## Risks / Trade-offs

- **[Android 13+ permission prompt]** → Users on Android 13+ see a runtime permission dialog the first time a timer starts with notifications enabled. Mitigation: the prompt is standard Android UX and non-blocking — denied permission degrades gracefully.
- **[Notification fires after app killed]** → If the user force-kills the app, the scheduled alarm may still fire (Android preserves scheduled alarms). The notification tapping will cold-launch the app. The existing `onRehydrateStorage` logic already handles stale runs, so this is safe.
- **[Store migration]** → Adding `notificationsEnabled` bumps the store version to 10. Mitigation: The migrate function defaults to `notificationsEnabled: true`, matching the implicit previous behavior of "no notification infrastructure."
- **[Privacy spec change]** → The `privacy-and-offline` spec's permission clause expands. Mitigation: The change is minimal (adding notification permission only) and the no-network/no-analytics requirements are unchanged.
