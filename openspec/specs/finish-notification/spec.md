## ADDED Requirements

### Requirement: Local notification on background timer completion
The system SHALL schedule a local notification when the timer starts (`runState` transitions to `running`) that fires after the preset duration elapses, notifying the user that the timer has finished even when the app is backgrounded or the device is locked.

#### Scenario: Notification fires when app is backgrounded
- **WHEN** the user starts a 3-minute timer and switches to another app
- **AND** 3 minutes elapse
- **THEN** a local notification appears in the system notification shade

#### Scenario: Notification fires when device is locked
- **WHEN** the user starts a 5-minute timer and locks the device screen
- **AND** 5 minutes elapse
- **THEN** a local notification appears on the lock screen

### Requirement: Notification scheduling uses exact timer duration
The system SHALL schedule the notification with a time interval equal to the armed preset's duration in seconds, using the OS alarm scheduler, so that the notification fires at the same moment the timer would visually complete.

#### Scenario: Notification timing matches timer duration
- **WHEN** the user starts a 10-minute timer at T=0
- **THEN** the system schedules a local notification to fire at T=600 seconds

### Requirement: Notification is cancelled on stop or reset
The system SHALL cancel all scheduled notifications when the user stops or resets the timer (`runState` transitions to `armed` or `idle`), preventing stale notifications from firing.

#### Scenario: Stop cancels the notification
- **WHEN** the user starts a 15-minute timer and presses Stop after 2 minutes
- **THEN** no notification fires at the 15-minute mark

#### Scenario: Reset cancels the notification
- **WHEN** the user starts a 5-minute timer and presses Reset after 1 minute
- **THEN** no notification fires at the 5-minute mark

### Requirement: Foreground suppression
The system SHALL suppress notification display when the app is in the foreground, since the in-app finish experience (confetti + tone) is the primary completion signal.

#### Scenario: No notification banner while app is active
- **WHEN** the timer finishes while the app is in the foreground and visible
- **THEN** no notification banner, sound, or alert is shown by the OS

#### Scenario: In-app experience is unaffected
- **WHEN** the timer finishes while the app is in the foreground
- **THEN** the confetti overlay and finish tone play as normal

### Requirement: Localized notification content
The notification SHALL display a title matching the preset label (e.g., "3 minutes" / "3 minutos") and a body with a kid-friendly finish message, localized in English and Spanish.

#### Scenario: English notification content
- **WHEN** the app language is English and the 3-minute timer finishes in the background
- **THEN** the notification title is "3 minutes" and the body is "Time's up!"

#### Scenario: Spanish notification content
- **WHEN** the app language is Spanish and the 5-minute timer finishes in the background
- **THEN** the notification title is "5 minutos" and the body is "Se acabó el tiempo!"

### Requirement: Notification permission request
The system SHALL request the `POST_NOTIFICATIONS` runtime permission (Android 13+) the first time a timer is started with notifications enabled. If the permission is denied, the system SHALL continue operating without notifications and SHALL NOT block any functionality.

#### Scenario: Permission requested on first timer start
- **WHEN** the user starts a timer for the first time after install on Android 13+
- **AND** notifications are enabled in settings
- **THEN** the system requests the `POST_NOTIFICATIONS` permission

#### Scenario: Denied permission degrades gracefully
- **WHEN** the user denies the notification permission
- **THEN** the timer starts and runs normally
- **AND** no notification fires at completion
- **AND** no error is shown to the user

#### Scenario: Permission not re-requested after denial
- **WHEN** the user previously denied the notification permission
- **AND** starts another timer
- **THEN** the system does not prompt for permission again (Android system behavior)

### Requirement: Notifications enabled by default
The system SHALL enable finish notifications by default on fresh install. The `notificationsEnabled` setting SHALL be `true` in the initial store state.

#### Scenario: Fresh install has notifications enabled
- **WHEN** the app is installed and launched for the first time
- **THEN** the `notificationsEnabled` setting is `true`

### Requirement: Notification tap returns to app
The system SHALL open the app and navigate to the timer screen when the user taps the notification.

#### Scenario: Tapping notification opens the app
- **WHEN** the user taps the finish notification from the notification shade
- **THEN** the app opens and the timer screen is visible with the `finished` state

### Requirement: No network usage for notifications
The system SHALL use only local notification scheduling (OS alarm scheduler). No remote push server, no network requests, and no third-party notification service SHALL be used.

#### Scenario: Notification works in airplane mode
- **WHEN** the device is in airplane mode and the timer finishes in the background
- **THEN** the local notification fires normally
