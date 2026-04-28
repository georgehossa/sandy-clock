## 1. Update Preset Colors (state/presets.ts)

- [x] 1.1 Update `DEFAULT_PRESET_COLORS` to Pencil design values: `'5': '#E8945A'`, `'10': '#7B9ACC'`, `'15': '#C47EA0'`, `'25': '#B0D4C8'`, `'30': '#9AADA5'`
- [x] 1.2 Remove the `PALETTE` object and `PALETTE_COLORS` array export (no longer used — color is fixed per preset)
- [x] 1.3 Remove the `import { theme } from '@/lib/theme'` line if it was only used for PALETTE (check and remove if unused)

## 2. Bump Store Version (state/store.ts)

- [x] 2.1 Remove the `PALETTE_COLORS` import from `store.ts`
- [x] 2.2 Remove the `PALETTE_COLORS.includes(color)` guard in `setPresetColor` (or simplify: always allow setting any hex string)
- [x] 2.3 Bump `version` from `2` to `3` and update `migrate` to reset to `{ ...initialPersisted }` for any prior version, so old persisted colors are replaced with new defaults

## 3. Settings Screen — Remove COLOR Section

- [x] 3.1 Remove the entire `{/* COLOR Section */}` JSX block from `settings.tsx`
- [x] 3.2 Remove `PALETTE_COLORS` and `setPresetColor` from imports and store selectors in `settings.tsx`
- [x] 3.3 Remove the `activePreset` derived variable from `settings.tsx`
- [x] 3.4 Remove unused styles: `swatchRow`, `swatch`, `swatchRingOuter`, `swatchRingInner`

## 4. Settings Screen — Timer Tile Reskin

- [x] 4.1 Change each timer tile background from the conditional `[styles.timerTile, isActive && styles.timerTileActive]` to always use `[styles.timerTile, { backgroundColor: presetColors[id] }]`
- [x] 4.2 Add active indicator: apply `isActive && styles.timerTileSelected` style which adds `borderWidth: 2`, `borderColor: theme.colors.fontPrimary`
- [x] 4.3 Update `timerNumber` text color to `theme.colors.fontPrimary` for all states (remove `timerNumberActive` override or set it to the same color)
- [x] 4.4 Update `timerUnit` text color to `theme.colors.fontPrimary` for all states (remove `timerUnitActive` override)
- [x] 4.5 Remove `timerTileActive`, `timerNumberActive`, `timerUnitActive` styles (replaced by `timerTileSelected` border ring)
- [x] 4.6 Add `presetColors` to the `useSandClockStore` selectors in `settings.tsx`

## 5. Verification

- [x] 5.1 Run `npx tsc --noEmit` — confirm no type errors (especially around removed `PALETTE_COLORS`)
- [x] 5.2 Run `npm test` — confirm no regressions
- [x] 5.3 Verify on simulator: each tile shows its preset color as background, active tile has a dark border ring, hourglass sand changes color when selecting a different preset
