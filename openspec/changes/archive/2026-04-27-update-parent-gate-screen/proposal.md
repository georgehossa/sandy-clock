## Why

The Parent Gate screen still uses the old yellow-50 color palette, small bordered grid cells, and no back navigation — it's visually inconsistent with the redesigned Timer and Settings screens. A Pencil design now exists for the Parent Gate with the cohesive sage/mint theme.

## What Changes

- Restyle the gate screen to use `theme` design tokens (`bgPrimary`, `bgSecondary`, `mint`, `fontPrimary`, `fontSecondary`, etc.) and Inter font
- Add a header row with a back chevron (`router.back()`)
- Add a lock icon inside a circular badge above the title
- Increase the title to 30px / weight-700 centered
- Replace the hold-press target with a mint-filled rounded button (`$mint` bg) containing a hand icon + label text, with card shadow
- Replace the 3×3 digit grid with a 4-row numpad layout (1-2-3 / 4-5-6 / 7-8-9 / _-0-_) using 80×80 circular keys with `$bg-secondary` fill, no borders, gap 12
- Apply safe area insets (top for header, bottom for content)

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(no spec-level behavior changes — this is a visual-only reskin of the existing gate screen; the hold-3s and tap-7 mechanics remain identical)_

## Impact

- `app/(parent)/gate.tsx` — visual/style changes only, no behavior changes
- No changes to store, navigation flow, or other screens
