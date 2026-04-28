## Context

The Parent Gate screen (`app/(parent)/gate.tsx`) still uses the pre-reskin yellow palette. All other screens now use the centralized `lib/theme.ts` design tokens and Inter font. The Pencil design shows a clean, vertically centered layout: back chevron header → lock badge → large title → mint hold button → numpad grid.

## Goals / Non-Goals

**Goals:**
- Match the Pencil Parent Gate Screen design exactly
- Use `theme.colors`, `theme.font`, `theme.spacing`, `theme.radius`, `theme.shadow` throughout
- Apply `useSafeAreaInsets` for notch/home indicator clearance
- Keep the hold-3s and tap-7 gate mechanics unchanged

**Non-Goals:**
- No behavior changes to the gate puzzle logic
- No new i18n keys (reuse existing `gate.*` translations)
- No store or navigation structure changes

## Decisions

### D1: Single-file reskin — no component extraction

**Decision:** All changes stay in `gate.tsx`. The numpad cells and hold button are simple enough to remain inline.

**Rationale:** The gate screen is self-contained (no shared components). Extracting a `NumpadKey` component adds indirection for 10 identical pressables.

---

### D2: Numpad layout as 4 rows (3-3-3-1) instead of current 3×3 wrapped grid

**Decision:** Replace `flexWrap: 'wrap'` grid with 4 explicit row `View`s matching the Pencil design: Row 1 (1,2,3), Row 2 (4,5,6), Row 3 (7,8,9), Row 4 (spacer, 0, spacer).

**Rationale:** The Pencil design uses a 4-row layout with the `0` key centered in the last row flanked by empty spacers. The current 3×3 grid can't express this — `flexWrap` puts all 9+1 cells into rows of 3 with `0` landing at bottom-left. Explicit rows give pixel-perfect control.

**Impact on shuffle logic:** `buildGrid()` currently shuffles all 9 cells randomly into a flat array. With a 4-row layout, the `0` key is always in position 10 (bottom center). The shuffled cells fill positions 1-9. The `7` target is somewhere among those 9 positions.

---

### D3: Ionicons for lock and hand icons

**Decision:** Use `Ionicons` from `@expo/vector-icons` (already a transitive dep, used on other screens) for the lock (`lock-closed-outline`) and hand (`hand-left-outline`) icons.

**Rationale:** Consistent with Timer and Settings screens which already use Ionicons. No additional dependency.

## Risks / Trade-offs

- **[Risk] Numpad key size 80×80 may crowd smaller phones (iPhone SE, 375pt wide)** → Mitigation: 3 keys × 80 + 2 gaps × 12 = 264pt < 375pt. Fits with ~55pt left-right margin per side. Acceptable.
- **[Risk] Shuffling only positions 1-9 (not 0) slightly changes the puzzle** → Acceptable: the puzzle is "tap the 7", not "find the 7 among 0-9". Keeping `0` fixed at the bottom matches standard numpad UX.
