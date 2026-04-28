## 1. TIMER Section — Layout

- [x] 1.1 Replace the `<ScrollView horizontal>` wrapping the timer pills with a plain `<View>` using `flexDirection: 'row'` and `gap: 10`
- [x] 1.2 Remove the `pillRow` style (no longer needed for a ScrollView contentContainerStyle)
- [x] 1.3 Update the `pill` style: remove `paddingHorizontal`, `paddingVertical`, `minWidth`, `borderRadius: theme.radius.full`; add `flex: 1`, `height: 56`, `borderRadius: 16`, `alignItems: 'center'`, `justifyContent: 'center'`

## 2. TIMER Section — Typography

- [x] 2.1 Update `pillNumber` style: fontSize 18, fontWeight '500' (`Inter_400Regular` family map entry — use `regular` family, weight '500' override), color `theme.colors.fontSecondary`
- [x] 2.2 Update `pillNumberActive` style: color `white` (`theme.colors.white`), fontWeight '600'
- [x] 2.3 Update `pillUnit` style: fontSize 10, color `theme.colors.fontTertiary`
- [x] 2.4 Update `pillUnitActive` style: color `'#FFFFFFCC'`, fontWeight '500'

## 3. COLOR Section — Swatch Size & Active Indicator

- [x] 3.1 Update `swatch` style: width 48, height 48, borderRadius 24 (remove old 36×36 values)
- [x] 3.2 Remove the `swatchActive` style (border-inset approach no longer used)
- [x] 3.3 Update the swatch JSX render: when `isActive`, render a `View` outer wrapper (48×48, transparent bg, `borderRadius: 24`, `borderWidth: 2.5`, `borderColor: theme.colors.mint`, `alignItems/justifyContent: center`) containing a `View` inner circle (36×36, `borderRadius: 18`, `backgroundColor: c`); when not active, render a plain `Pressable`-wrapped `View` (48×48, `borderRadius: 24`, `backgroundColor: c`)
- [x] 3.4 Ensure the `onPress` handler (`setPresetColor`) is on the outer `Pressable` in both the active and inactive cases
- [x] 3.5 Update `swatchRow` gap from `theme.spacing.sm` (16) — verify it already matches design gap 16, adjust if needed

## 4. Verification

- [x] 4.1 Run `npx tsc --noEmit` — confirm no type errors
- [x] 4.2 Run `npm test` — confirm no regressions
- [ ] 4.3 Verify on simulator: timer tiles are equal-width rectangles, active tile is mint with white text, color swatches are 48×48 with ring-outside active indicator
