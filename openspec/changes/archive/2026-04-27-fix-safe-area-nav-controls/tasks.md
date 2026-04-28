## 1. Feature Flag Infrastructure

- [x] 1.1 Create `lib/flags.ts` exporting `SHOW_CONTROLS: boolean` read from `Constants.expoConfig?.extra?.showControls ?? false`
- [x] 1.2 Add `"extra": { "showControls": false }` to the `expo` object in `app.json`

## 2. Timer Screen Safe Area

- [x] 2.1 Import `useSafeAreaInsets` from `react-native-safe-area-context` in `app/(kid)/index.tsx`
- [x] 2.2 Apply `paddingTop: insets.top` to the root view (replacing the hardcoded `paddingTop: theme.spacing.xs`)
- [x] 2.3 Apply `paddingBottom: insets.bottom` to the controls bar container when `SHOW_CONTROLS` is true, or to the root view bottom padding when false

## 3. Timer Screen Controls Flag

- [x] 3.1 Import `SHOW_CONTROLS` from `@/lib/flags` in `app/(kid)/index.tsx`
- [x] 3.2 Wrap the entire controls bar `<View>` in `{SHOW_CONTROLS && ...}` so it is conditionally rendered
- [x] 3.3 When `SHOW_CONTROLS` is false, ensure the root view bottom padding still uses `insets.bottom` so the hourglass/prompt don't crowd the home indicator

## 4. Settings Screen Safe Area

- [x] 4.1 Import `useSafeAreaInsets` from `react-native-safe-area-context` in `app/(parent)/settings.tsx`
- [x] 4.2 Apply `paddingTop: insets.top` to the `ScrollView`'s `contentContainerStyle` (or header `View`) so the header clears the notch
- [x] 4.3 Apply `paddingBottom: Math.max(insets.bottom, theme.spacing.xl)` to the `ScrollView`'s `contentContainerStyle` so scroll content clears the home indicator

## 5. Verification

- [ ] 5.1 Run `npx expo start` on iPhone simulator with Dynamic Island (e.g., iPhone 15 Pro) — verify Timer Screen nav bar and controls bar are fully visible
- [ ] 5.2 Verify Timer Screen with `showControls: false` — controls bar is absent, hourglass fills center
- [ ] 5.3 Verify Timer Screen with `showControls: true` (set in `app.config.js`) — controls bar appears above home indicator
- [ ] 5.4 Verify Settings Screen — header clears notch, last scroll item clears home indicator
- [x] 5.5 Run `npm test` and confirm no regressions
