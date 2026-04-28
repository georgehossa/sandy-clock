## Context

The Pencil design timer section shows 4 tiles (3, 5, 10, 15 min), each with its preset color as the full tile background fill and `$font-primary` text. The currently-armed preset (15 min in the design) uses `$mint` as its color — which is simply its assigned preset color, not a special "selected" state color. Selection is communicated through a border ring, not a background change.

Our app has 5 presets (5, 10, 15, 25, 30 min). We map the Pencil colors to our presets and add two extras following the same palette progression.

**Pencil tile colors (source of truth):**
| Tile | Color | Hex |
|------|-------|-----|
| t1 (3 min → our 5 min) | Sand orange | `#E8945A` |
| t2 (5 min → our 10 min) | Slate blue | `#7B9ACC` |
| t3 (10 min → our 15 min) | Mauve/pink | `#C47EA0` |
| t4 (15 min → our 25 min) | Mint | `#B0D4C8` |
| (extra → our 30 min) | Warm grey | `#9AADA5` |

## Goals / Non-Goals

**Goals:**
- Update `DEFAULT_PRESET_COLORS` in `state/presets.ts` to the Pencil hex values
- Update `PALETTE` to remove the old palette entries and keep only the 5 preset colors (or simplify — these are now fixed, not user-selectable)
- Remove the COLOR section from `settings.tsx`
- Change each timer tile background from `$bg-secondary`/`$mint` to `presetColors[id]` always
- Use `$font-primary` for all tile text (number + "min") in all states
- Show a 2px `$font-primary` border on the active tile as the selection indicator

**Non-Goals:**
- No user color customization UI
- No Hourglass changes
- No navigation changes

## Decisions

### D1: Tile background = preset color always (no bg-secondary fallback)

**Decision:** Every tile shows `presetColors[id]` as its background, regardless of active/inactive state. Active state adds a `borderWidth: 2`, `borderColor: theme.colors.fontPrimary` ring.

**Rationale:** This matches the Pencil design exactly. The color IS the tile identity. Using `$bg-secondary` for inactive would hide the color information and break the direct color→sand mapping.

---

### D2: All tile text in `$font-primary` regardless of active state

**Decision:** Number (18px/500) and "min" (10px/regular) both use `theme.colors.fontPrimary` on all tiles in all states. No white text.

**Rationale:** The Pencil design shows `$font-primary` text on all colored tiles (including the mint t4 tile). White text was previously used for the mint "active" tile when it was the only colored tile — that no longer applies.

---

### D3: Store version bump to v3 to reset persisted presetColors

**Decision:** Bump `version` in `store.ts` from `2` to `3` and update the `migrate` function to return `{ ...initialPersisted }` for any version < 3, resetting to the new `DEFAULT_PRESET_COLORS`.

**Rationale:** Users with persisted v2 store data have the old palette colors. Without a migration, their hourglass would show stale colors that don't match the tile backgrounds in Settings.

---

### D4: Simplify `PALETTE` to just the 5 preset colors

**Decision:** Replace the current `PALETTE` object with a mapping keyed by `PresetId`, matching `DEFAULT_PRESET_COLORS` exactly. Remove `PALETTE_COLORS` array export (no longer needed since color is not user-selectable).

**Rationale:** `PALETTE_COLORS` was only used by `settings.tsx` for the swatch picker, which is being removed. Keeping a free-floating palette object with 6 arbitrary colors serves no purpose.
