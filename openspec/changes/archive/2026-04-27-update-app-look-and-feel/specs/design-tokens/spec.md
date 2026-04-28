## ADDED Requirements

### Requirement: Theme token module exists
The system SHALL provide a `lib/theme.ts` module that exports a `theme` object containing all design token namespaces: `colors`, `font`, `spacing`, `radius`, and `shadow`.

#### Scenario: Token module is importable
- **WHEN** any screen or component imports `{ theme } from '@/lib/theme'`
- **THEN** `theme.colors`, `theme.font`, `theme.spacing`, `theme.radius`, and `theme.shadow` are all defined and non-null

### Requirement: Color tokens match Pencil design variables
The system SHALL define color tokens that match the Pencil design file variables exactly.

#### Scenario: Background colors are defined
- **WHEN** `theme.colors` is accessed
- **THEN** `bgPrimary` equals `#F5F0EB`, `bgSecondary` equals `#E8E3DD`

#### Scenario: Brand colors are defined
- **WHEN** `theme.colors` is accessed
- **THEN** `mint` equals `#B0D4C8`, `mintDark` equals `#7DBAA8`, `sandOrange` equals `#D98B5C`, `sandDark` equals `#C47A4E`, `cutoutBg` equals `#79B3A2`

#### Scenario: Typography colors are defined
- **WHEN** `theme.colors` is accessed
- **THEN** `fontPrimary` equals `#2D3B36`, `fontSecondary` equals `#6B7E76`, `fontTertiary` equals `#9AADA5`

### Requirement: Typography tokens define Inter font family and standard sizes
The system SHALL define typography tokens specifying Inter as the primary font family and a scale of font sizes and weights matching the Pencil design.

#### Scenario: Font family token is defined
- **WHEN** `theme.font.family` is accessed
- **THEN** it equals `'Inter'`

#### Scenario: Font sizes cover all design usages
- **WHEN** `theme.font.size` is accessed
- **THEN** it contains at minimum: `xs` (12), `sm` (14), `md` (16), `lg` (20), `xl` (24)

### Requirement: Spacing, radius, and shadow tokens are defined
The system SHALL provide numeric spacing, border radius, and shadow preset tokens.

#### Scenario: Spacing tokens are accessible
- **WHEN** `theme.spacing` is accessed
- **THEN** it contains at minimum `xs` (8), `sm` (16), `md` (24), `lg` (32), `xl` (48)

#### Scenario: Radius tokens are accessible
- **WHEN** `theme.radius` is accessed
- **THEN** it contains at minimum `sm` (12), `md` (28), `lg` (36), `full` (9999)

#### Scenario: Shadow tokens are accessible
- **WHEN** `theme.shadow` is accessed
- **THEN** it contains at minimum a `card` preset with `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, and `elevation` properties
