## MODIFIED Requirements

### Requirement: Permissions limited to motion sensors and notifications
The system SHALL request only motion-sensor access (iOS `NSMotionUsageDescription`, Android `<uses-feature android:name="android.hardware.sensor.accelerometer" />`) and notification access (Android `POST_NOTIFICATIONS` for Android 13+), and SHALL NOT declare or request camera, microphone, location, contacts, photos, or background-execution permissions.

#### Scenario: iOS Info.plist
- **WHEN** the iOS build's `Info.plist` is inspected
- **THEN** `NSMotionUsageDescription` is present
- **AND** no other privacy-sensitive usage description keys are present besides notification-related keys

#### Scenario: Android manifest
- **WHEN** the Android build's `AndroidManifest.xml` is inspected
- **THEN** no permissions beyond motion-sensor feature declarations and `POST_NOTIFICATIONS` appear
