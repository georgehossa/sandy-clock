## ADDED Requirements

### Requirement: Parent Gate Screen uses design token colors and Inter font
The Parent Gate Screen SHALL use `theme.colors.bgPrimary` as the background, `theme.colors.fontPrimary` for primary text, and Inter font family for all text elements.

#### Scenario: Background matches design
- **WHEN** the Parent Gate Screen renders
- **THEN** the root view background is `theme.colors.bgPrimary` (`#F5F0EB`)

#### Scenario: Title uses Inter font
- **WHEN** the title "Grown-ups only" renders
- **THEN** it uses Inter 30px weight-700 centered, in `theme.colors.fontPrimary`

### Requirement: Parent Gate Screen has a back chevron header
The Parent Gate Screen SHALL display a back chevron icon in a header row that navigates back when tapped.

#### Scenario: Back button navigates back
- **WHEN** the user taps the back chevron
- **THEN** `router.back()` is called

### Requirement: Parent Gate Screen shows a lock badge above the title
A circular badge (72×72, `theme.colors.bgSecondary` background, `theme.radius.lg` corner radius) SHALL display a lock icon (`theme.colors.mintDark`) above the title.

#### Scenario: Lock badge renders
- **WHEN** the Parent Gate Screen renders
- **THEN** a circular badge with a lock icon is visible above the title

### Requirement: Hold button uses mint fill with hand icon
The hold-to-unlock button SHALL use `theme.colors.mint` background, cornerRadius 20, card shadow, and contain a hand icon + label text in `theme.colors.fontPrimary`.

#### Scenario: Hold button visual style
- **WHEN** the hold button renders
- **THEN** it has `theme.colors.mint` background and card shadow

### Requirement: Numpad uses 4-row layout with circular keys
The numpad SHALL render in a 4-row layout (1-2-3 / 4-5-6 / 7-8-9 / _-0-_) with 80×80 circular keys using `theme.colors.bgSecondary` fill, no borders, and gap 12.

#### Scenario: Keys are circular and use bgSecondary
- **WHEN** the numpad renders
- **THEN** each key is 80×80 with `borderRadius: 40` and `theme.colors.bgSecondary` background with no visible border

#### Scenario: Numpad has 4 rows
- **WHEN** the numpad renders
- **THEN** it displays 4 rows: first three with 3 keys each, last row with 0 centered

### Requirement: Parent Gate Screen respects device safe area insets
The Parent Gate Screen SHALL apply `useSafeAreaInsets()` top inset to the header and bottom inset to the content area.

#### Scenario: Header clears the notch
- **WHEN** the gate renders on a notched iPhone
- **THEN** the back chevron is fully visible below the notch / Dynamic Island
