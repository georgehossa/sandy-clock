## ADDED Requirements

### Requirement: Feature flag module exists
The system SHALL provide a `lib/flags.ts` module that exports boolean feature flag constants read from `Constants.expoConfig?.extra` at module load time.

#### Scenario: Module is importable
- **WHEN** any file imports `{ SHOW_CONTROLS } from '@/lib/flags'`
- **THEN** `SHOW_CONTROLS` is a `boolean` value (never `undefined` or `null`)

### Requirement: SHOW_CONTROLS defaults to false
The `SHOW_CONTROLS` flag SHALL default to `false` when `Constants.expoConfig?.extra?.showControls` is absent, `null`, or `undefined`.

#### Scenario: Flag is false when extra is not set
- **WHEN** `Constants.expoConfig?.extra?.showControls` is `undefined`
- **THEN** `SHOW_CONTROLS` equals `false`

#### Scenario: Flag reads true from app config
- **WHEN** `Constants.expoConfig.extra.showControls` is `true`
- **THEN** `SHOW_CONTROLS` equals `true`

### Requirement: app.json declares showControls in extra
The `app.json` SHALL include an `extra` object with a `showControls` boolean field set to `false` as the production default.

#### Scenario: app.json extra block exists
- **WHEN** the app bundle is built
- **THEN** `Constants.expoConfig.extra.showControls` resolves to `false` unless overridden
