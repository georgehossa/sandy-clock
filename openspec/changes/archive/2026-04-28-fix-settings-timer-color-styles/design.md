## Context

`settings.tsx` currently renders TIMER options as capsule pills in a `ScrollView` (horizontal scroll, `borderRadius: 9999`, `paddingHorizontal: 14`, `paddingVertical: 10`). The Pencil design shows them as equal-width rectangular tiles in a static row (no scroll needed — only 4 options). COLOR swatches are 36×36 with a `borderWidth: 2` active indicator that visually shrinks the swatch; the design uses 48×48 with a ring-outside pattern.

## Goals / Non-Goals

**Goals:**
- Match TIMER section layout exactly: 4 equal-width tiles, horizontal row, no scroll, gap 10, height 56, cornerRadius 16
- Match active tile: `$mint` bg, white number (Inter 18/600), semi-white "min" (`#FFFFFFCC`, 10px/500)
- Match inactive tile: `$bg-secondary` bg, `$font-secondary` number (Inter 18/500), `$font-tertiary` "min" (10px)
- Match COLOR swatches: 48×48 circles, gap 16, active indicator as a 48×48 transparent outer wrapper with 2.5px `$mint` stroke + 36×36 mint inner circle at offset (6, 6)

**Non-Goals:**
- No changes to SOUND, LANGUAGE, ABOUT sections
- No behavior, store, or navigation changes

## Decisions

### D1: Timer tiles as `flex: 1` children in a `View` row (not ScrollView)

**Decision:** Replace `<ScrollView horizontal>` with a plain `<View style={{ flexDirection: 'row', gap: 10 }}>`. Each `<Pressable>` gets `flex: 1` so all 4 tiles share equal width.

**Rationale:** The design shows 4 fixed tiles that fit the screen width with no overflow. `flex: 1` on each tile automatically distributes space equally — no width calculation needed.

---

### D2: Active swatch — transparent outer wrapper with stroke + inner circle

**Decision:** When a swatch is active, wrap it in a `View` (48×48, transparent bg, `borderRadius: 24`, `borderWidth: 2.5`, `borderColor: theme.colors.mint`) with the actual color circle (36×36, `borderRadius: 18`, `backgroundColor: color`) positioned absolutely at `{ top: 6, left: 6 }` inside it.

When inactive, render a plain `View` (48×48, `borderRadius: 24`, `backgroundColor: color`).

**Rationale:** Using `borderWidth` on the colored circle itself pushes the border inward, visually shrinking the swatch. The ring-outside pattern uses a larger transparent wrapper, so the inner circle stays 36×36 and the mint ring appears outside it — matching the Pencil design exactly (`c1w` node: 48×48 transparent with mint stroke; `c1` child: 36×36 mint fill at x:6, y:6).

**Implementation:** Conditional render in JSX — inactive path is a simpler `View`, active path is the wrapper+inner approach.
