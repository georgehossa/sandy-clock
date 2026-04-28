## Why

The TIMER and COLOR sections in `settings.tsx` don't match the Pencil design. The timer options are rendered as small capsule pills in a horizontal scroll, but the design shows equal-width rectangular cards arranged in a single horizontal row. The color swatches are 36×36 but the design uses 48×48, with the active indicator implemented as a border (which shrinks the visual circle) instead of a ring-outside pattern with a mint inner circle.

## What Changes

- **TIMER section**: Replace the horizontal `ScrollView` of capsule pills with a fixed horizontal row of equal-width rectangular cards (cornerRadius 16, height 56, flex:1 so they fill the row equally, gap 10). Each card stacks the number (18px/500, `$font-secondary`) and "min" label (10px, `$font-tertiary`) vertically centered. Active card uses `$mint` background with white number (18px/600) and semi-white "min" (`#FFFFFFCC`, 10px/500).
- **COLOR section**: Increase swatch size from 36×36 to 48×48 (borderRadius 24). Change the active indicator from a `borderWidth` outline to a ring-outside pattern: an outer wrapper (48×48, transparent bg, `$mint` stroke 2.5px, borderRadius 24) containing a 36×36 mint circle inside, offset 6pt from the outer edge. Inactive swatches are plain 48×48 colored circles with no border.
- Gap between swatches increases from 16 to match the design (`gap: 16`).

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(visual-only fix — no spec-level behavior changes)_

## Impact

- `app/(parent)/settings.tsx` — TIMER and COLOR section layout and style changes only
- No store, navigation, or behavior changes
