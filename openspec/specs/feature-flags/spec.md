## Requirements

### Requirement: Feature flag module exists
The system SHALL provide a `lib/flags.ts` module that exports boolean feature flag constants read from `Constants.expoConfig?.extra` at module load time.

#### Scenario: Module is importable
- **WHEN** any file imports from `'@/lib/flags'`
- **THEN** all exported constants are `boolean` values (never `undefined` or `null`)

