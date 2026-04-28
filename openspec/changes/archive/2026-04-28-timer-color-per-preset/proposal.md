## Why

The current Settings screen separates TIMER and COLOR into two distinct sections, requiring the user to select a timer and then independently pick a color. The Pencil design makes color intrinsic to each preset: **the tile background itself is the preset's sand color** — no separate color picker needed. Selecting a timer tile immediately applies that color to the hourglass sand. The standalone COLOR section is removed entirely.

## What Changes

- **Remove** the standalone COLOR section (label, horizontal swatch ScrollView, all swatch styles and related imports) from `settings.tsx`
- **Change timer tile backgrounds** from `$bg-secondary` (inactive) / `$mint` (active) to each tile always showing its own preset color as the background fill
- **Update `DEFAULT_PRESET_COLORS`** in `state/presets.ts` to match the Pencil design colors exactly:
  - `5` min → `#E8945A` (sand orange)
  - `10` min → `#7B9ACC` (slate blue)
  - `15` min → `#C47EA0` (mauve/pink)
  - `25` min → `#B0D4C8` (mint — `$mint`)
  - `30` min → `#9AADA5` (warm grey — `$font-tertiary`)
- **Timer tile text**: all tiles use `$font-primary` (dark) for both number and "min" label. The selected (active) tile adds a subtle visual indicator — a 2px `$font-primary` ring/border — to show which preset is armed, without changing the background color
- **Ensure** the hourglass sand color updates reactively when a preset is selected — the `Hourglass` already reads `presetColors[armedPresetId]` from the store, so this works automatically
- **Remove** `setPresetColor`, `PALETTE_COLORS`, and `activePreset` from `settings.tsx` (no longer needed)

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
_(visual/UX-only change — store shape unchanged, Hourglass unchanged)_

## Impact

- `state/presets.ts` — update `DEFAULT_PRESET_COLORS` hex values to match Pencil design; bump store version for migration
- `app/(parent)/settings.tsx` — remove COLOR section; change tile background to preset color; update active indicator; remove unused imports/state
- `state/store.ts` — bump persist version so old `presetColors` values are reset to new defaults
- `components/Hourglass/Hourglass.tsx` — no changes (already reactive)
