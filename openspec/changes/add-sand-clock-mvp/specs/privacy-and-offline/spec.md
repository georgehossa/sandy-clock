## ADDED Requirements

### Requirement: No network communication
The system SHALL NOT make any outbound network requests during normal app operation, and SHALL function fully with the device in airplane mode.

#### Scenario: Airplane mode parity
- **WHEN** the device is in airplane mode
- **THEN** every feature (preset selection, flip-to-start, run, finish tone, settings, language switching) works identically to online operation

#### Scenario: No network calls observed
- **WHEN** the app is exercised through a full user flow with a network proxy attached
- **THEN** no HTTP, HTTPS, or other outbound requests originate from the app

### Requirement: No analytics or tracking dependencies
The project SHALL NOT include any analytics, crash-reporting-with-PII, advertising, or user-tracking SDKs in `package.json`, native modules, or build configuration.

#### Scenario: Dependency audit clean
- **WHEN** `package.json` and the native module list are inspected
- **THEN** no entries match common analytics/tracking SDK names (e.g., firebase analytics, segment, mixpanel, amplitude, sentry-with-PII, facebook-sdk, branch, appsflyer, adjust)

### Requirement: Build-time guard against network APIs
The system SHALL include an automated check that fails the build if any source file under `app/`, `components/`, `hooks/`, or `state/` imports `fetch`, `XMLHttpRequest`, or any module from `expo-network` / `axios` / `@apollo/client`.

#### Scenario: Guard fails on accidental import
- **WHEN** a developer adds `import fetch from 'cross-fetch'` in a file under `app/`
- **THEN** the build (or CI) step fails with a clear message identifying the offending file

### Requirement: Permissions limited to motion sensors
The system SHALL request only motion-sensor access (iOS `NSMotionUsageDescription`, Android `<uses-feature android:name="android.hardware.sensor.accelerometer" />`) and SHALL NOT declare or request camera, microphone, location, contacts, photos, notifications, or background-execution permissions.

#### Scenario: iOS Info.plist
- **WHEN** the iOS build's `Info.plist` is inspected
- **THEN** `NSMotionUsageDescription` is present
- **AND** no other privacy-sensitive usage description keys are present

#### Scenario: Android manifest
- **WHEN** the Android build's `AndroidManifest.xml` is inspected
- **THEN** no permissions beyond motion-sensor feature declarations appear
