## ADDED Requirements

### Requirement: Bilingual catalog
The system SHALL ship complete English (`en`) and Spanish (`es`) string catalogs covering every user-facing text in the app, stored at `locales/en.json` and `locales/es.json`.

#### Scenario: No untranslated keys
- **WHEN** a build is produced
- **THEN** every key present in `en.json` exists in `es.json`
- **AND** every rendered string in the app resolves through the i18n layer (no hard-coded user-facing text)

### Requirement: Locale detection at launch
On first launch the system SHALL detect the device language via `expo-localization` and SHALL select `es` if the device's primary language code is `es`, otherwise SHALL select `en`.

#### Scenario: Spanish device gets Spanish UI
- **WHEN** the device's primary language is Spanish (any region)
- **AND** the user has not previously chosen a language override
- **THEN** the app renders all strings from `es.json`

#### Scenario: Other-language device gets English
- **WHEN** the device's primary language is neither `en` nor `es`
- **AND** the user has not previously chosen a language override
- **THEN** the app renders all strings from `en.json`

### Requirement: Manual language override
The system SHALL expose a language selector in parent settings with three options — `English`, `Español`, and `System default` — and the chosen value SHALL override device-locale detection until changed.

#### Scenario: Override persists
- **WHEN** the parent selects `English` on a Spanish-locale device
- **THEN** the app immediately re-renders all strings from `en.json`
- **AND** restarts continue to render `en.json` until the parent changes the choice

#### Scenario: System default returns to detection
- **WHEN** the parent selects `System default`
- **THEN** the app reverts to the device-locale detection rule
