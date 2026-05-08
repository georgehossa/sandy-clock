## 1. Dependencies and Configuration

- [x] 1.1 Install `expo-notifications` package and add it to `app.json` plugins if needed
- [x] 1.2 Configure the Android notification channel for finish notifications in app initialization
- [x] 1.3 Verify `POST_NOTIFICATIONS` permission is declared in the Android manifest after expo prebuild

## 2. Store Changes

- [x] 2.1 Add `notificationsEnabled: boolean` field to the `PersistedSlice` type in `state/store.ts` (default: `true`)
- [x] 2.2 Add `setNotificationsEnabled` action to the store
- [x] 2.3 Bump store version to 10 and update the `migrate` function to default `notificationsEnabled: true`
- [x] 2.4 Update `partialize` to include `notificationsEnabled` in persisted state

## 3. Notification Scheduling Logic

- [x] 3.1 Create `hooks/useFinishNotification.ts` hook that schedules a local notification when `runState` transitions to `running` using the preset duration as the time interval
- [x] 3.2 Implement cancellation logic: cancel all scheduled notifications when `runState` transitions to `armed` or `idle` (stop/reset)
- [x] 3.3 Add foreground suppression via `setNotificationHandler` that returns `shouldShowAlert: false` when app is active
- [x] 3.4 Add permission request logic: request `POST_NOTIFICATIONS` permission on first timer start when `notificationsEnabled` is `true`
- [x] 3.5 Guard scheduling behind `notificationsEnabled` — skip scheduling when the setting is `false`

## 4. Notification Content and Localization

- [x] 4.1 Add notification title/body strings to `locales/en.json` (title: preset label, body: "Time's up!")
- [x] 4.2 Add notification title/body strings to `locales/es.json` (title: preset label, body: "Se acabó el tiempo!")

## 5. Settings Screen Integration

- [x] 5.1 Add a notifications toggle row to the parent settings screen (`app/(parent)/settings.tsx`) between the tone selector and language toggle
- [x] 5.2 Wire the toggle to `notificationsEnabled` store value and `setNotificationsEnabled` action
- [x] 5.3 Add localized label strings for the notifications toggle in `en.json` and `es.json`

## 6. Timer Screen Integration

- [x] 6.1 Mount the `useFinishNotification` hook in the timer screen (`app/(kid)/index.tsx`) so scheduling is active during timer runs

## 7. Privacy Spec Alignment

- [x] 7.1 Update `scripts/check-no-network.ts` if needed — verify `expo-notifications` imports are not flagged by the network guard (they should not be, but confirm)

## 8. Testing and Verification

- [x] 8.1 Manually test: start timer, background app, verify notification fires at completion
- [x] 8.2 Manually test: start timer, stop/reset, verify no notification fires
- [x] 8.3 Manually test: disable notifications in settings, start timer, background app, verify no notification fires
- [x] 8.4 Manually test: foreground completion does not show a notification banner
- [x] 8.5 Verify app builds successfully with `npx expo prebuild` and no new network-guard violations
