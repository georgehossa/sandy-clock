## 1. Imports & Safe Area

- [x] 1.1 Add imports for `Ionicons`, `useSafeAreaInsets`, and `theme` in `gate.tsx`
- [x] 1.2 Call `useSafeAreaInsets()` in the component and apply `paddingTop: insets.top` to the root view

## 2. Header

- [x] 2.1 Add a header row with a back chevron (`Ionicons` `chevron-back`, 24px, `theme.colors.fontPrimary`) that calls `router.back()` on press

## 3. Lock Badge & Title

- [x] 3.1 Add a circular badge (72×72, `theme.colors.bgSecondary`, borderRadius 36) containing a lock icon (`Ionicons` `lock-closed-outline`, 32px, `theme.colors.mintDark`) centered above the title
- [x] 3.2 Update the title to Inter 30px weight-700 centered, `theme.colors.fontPrimary`

## 4. Hold Button

- [x] 4.1 Restyle the hold button: `theme.colors.mint` background, borderRadius 20, 72px height, full width, `theme.shadow.card`, with a hand icon (`Ionicons` `hand-left-outline`, 22px) + label text (Inter 15px weight-600, `theme.colors.fontPrimary`), gap 10, centered content
- [x] 4.2 Remove the old yellow `holdActive` flash style — pressed state can use `opacity: 0.8` or `theme.colors.mintDark` background

## 5. Numpad

- [x] 5.1 Replace the 3×3 `flexWrap` grid with 4 explicit rows: Row 1 (1-2-3), Row 2 (4-5-6), Row 3 (7-8-9), Row 4 (spacer-0-spacer) — rows are horizontal `View`s with `gap: 12`, stacked vertically with `gap: 12`
- [x] 5.2 Update `buildGrid()` to return a 9-element array (digits 1-9 shuffled, with 7 always present) while `0` is rendered separately in Row 4
- [x] 5.3 Style each key: 80×80, `borderRadius: 40`, `theme.colors.bgSecondary`, no border, text in Inter 28px weight-700 `theme.colors.fontPrimary`
- [x] 5.4 Update the "Tap the number 7" label: Inter 15px weight-500, `theme.colors.fontSecondary`

## 6. Remaining Styles

- [x] 6.1 Update root background to `theme.colors.bgPrimary`
- [x] 6.2 Remove the `· · ·` separator (not in the Pencil design)
- [x] 6.3 Update wrong-answer text color to `theme.colors.sandDark` or keep a visible red — but use Inter font
- [x] 6.4 Apply `paddingBottom: insets.bottom` to the content area so numpad clears the home indicator

## 7. Verification

- [x] 7.1 Run `npx tsc --noEmit` and confirm no type errors
- [x] 7.2 Run `npm test` and confirm no regressions
- [ ] 7.3 Verify on iPhone simulator — header clears notch, numpad clears home indicator, hold button has mint fill with shadow
