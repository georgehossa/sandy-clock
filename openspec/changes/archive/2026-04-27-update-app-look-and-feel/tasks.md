## 1. Dependencies & Font Setup

- [x] 1.1 Add `@expo-google-fonts/inter` and `expo-font` to `package.json` and run `npm install`
- [x] 1.2 Update `app/_layout.tsx` to load Inter font variants (Regular 400, SemiBold 600, Bold 700, ExtraBold 800) using `useFonts` from `@expo-google-fonts/inter`
- [x] 1.3 Extend `SplashScreen.preventAutoHideAsync()` guard in `_layout.tsx` to wait for `fontsLoaded` before hiding splash

## 2. Design Tokens

- [x] 2.1 Create `lib/theme.ts` with `theme.colors` containing all Pencil design variables: `bgPrimary`, `bgSecondary`, `mint`, `mintDark`, `sandOrange`, `sandDark`, `cutoutBg`, `fontPrimary`, `fontSecondary`, `fontTertiary`, `white`, `shadowColor`
- [x] 2.2 Add `theme.font` to `lib/theme.ts`: `family: 'Inter'`, and `size` object with `xs` (12), `sm` (14), `md` (16), `lg` (20), `xl` (24)
- [x] 2.3 Add `theme.font.weight` to `lib/theme.ts`: `regular` ('400'), `semibold` ('600'), `bold` ('700'), `extrabold` ('800')
- [x] 2.4 Add `theme.spacing` to `lib/theme.ts`: `xs` (8), `sm` (16), `md` (24), `lg` (32), `xl` (48)
- [x] 2.5 Add `theme.radius` to `lib/theme.ts`: `sm` (12), `md` (28), `lg` (36), `full` (9999)
- [x] 2.6 Add `theme.shadow` to `lib/theme.ts`: `card` preset with `shadowColor: '#2D3B3620'`, `shadowOffset: {x:0, y:4}`, `shadowOpacity: 1`, `shadowRadius: 12`, `elevation: 4`

## 3. Palette & Preset Data Update

- [x] 3.1 Update `PALETTE` in `state/presets.ts` to the six Pencil swatch colors: mint-green `#B0D4C8`, sand-orange `#D98B5C`, slate-blue `#7B9EC4`, mauve `#B87BA8`, warm-grey `#9AADA5`, deep-teal `#2D3B36`
- [x] 3.2 Update preset durations in `state/presets.ts` from `[3, 5, 10, 15]` to `[5, 10, 15, 25, 30]` minutes

## 4. Hourglass Component Reskin

- [x] 4.1 Update `Hourglass.tsx` canvas background to transparent (remove any opaque fill)
- [x] 4.2 Update pill body in `Hourglass.tsx` to use a vertical linear gradient from `#BFE0D4` to `#9ECABC` (use Skia `LinearGradient` shader)
- [x] 4.3 Update top and bottom cutout ellipse fill color to `#79B3A2` in `Hourglass.tsx`
- [x] 4.4 Update default/idle sand color in `SandBody.tsx` from `#CBD5E1` to `theme.colors.sandOrange` (`#D98B5C`)
- [x] 4.5 Update `FallStream.tsx` particle color to use `theme.colors.sandOrange`

## 5. Timer Screen Reskin

- [x] 5.1 Update `app/(kid)/index.tsx` root view background to `theme.colors.bgPrimary` (`#F5F0EB`)
- [x] 5.2 Update `StatusBar` style in `app/(kid)/index.tsx` to `dark-content`
- [x] 5.3 Update the settings gear icon color in the nav bar to `theme.colors.fontPrimary`
- [x] 5.4 Replace the bottom preset button row with a Controls bar containing Reset (56×56, `theme.colors.bgSecondary`, cornerRadius 28), Play (72×72, `theme.colors.mint`, cornerRadius 36), and Stop (56×56, `theme.colors.bgSecondary`, cornerRadius 28) buttons laid out horizontally with `gap: 32`
- [x] 5.5 Wire Reset button to the existing reset store action; wire Play/Stop to start/stop actions
- [x] 5.6 Apply Inter font (`theme.font.family`) to all text elements in `app/(kid)/index.tsx`
- [x] 5.7 Update all hardcoded color values in `app/(kid)/index.tsx` StyleSheet to use `theme.colors.*` tokens

## 6. Settings Screen Reskin

- [x] 6.1 Update `app/(parent)/settings.tsx` root view background to `theme.colors.bgPrimary`
- [x] 6.2 Replace current header with a three-element row: back chevron (left), "Settings" title (center, Inter 24px weight-600, `theme.colors.fontPrimary`), gear icon (right); wire back chevron to `router.back()`
- [x] 6.3 Replace current preset color-circle row with a TIMER section: uppercase label ("TIMER", size 12, weight 600, letterSpacing 1.5, `theme.colors.fontTertiary`) and horizontal scrollable row of pill buttons for durations `[5, 10, 15, 25, 30]` — active pill uses `theme.colors.mint` bg, inactive uses `theme.colors.bgSecondary`
- [x] 6.4 Update COLOR section label to match uppercase spaced typography spec; keep circular 36×36 swatches but add a 2px `theme.colors.fontPrimary` ring border on the active swatch
- [x] 6.5 Wrap SOUND options in a rounded card container: `borderRadius: 16`, background `theme.colors.bgSecondary`; add a checkmark icon (`lucide: check`) in `theme.colors.mint` on the active sound row
- [x] 6.6 Apply Inter font to all text in `app/(parent)/settings.tsx`
- [x] 6.7 Update all hardcoded color values in `app/(parent)/settings.tsx` StyleSheet to `theme.colors.*` tokens

## 7. App Config Update

- [x] 7.1 Update `app.json` splash `backgroundColor` from `#FDE047` to `#F5F0EB`
- [x] 7.2 Update `app.json` `backgroundColor` (if set) to `#F5F0EB`

## 8. Verification

- [ ] 8.1 Run `npx expo start` and verify Timer Screen renders with correct background, controls bar, and Hourglass colors on iOS simulator
- [ ] 8.2 Verify Settings Screen header, duration pills, color swatches, and sound card render correctly
- [ ] 8.3 Verify Inter font loads and renders on both screens (check no MISSING FONT warnings in Metro)
- [ ] 8.4 Verify Hourglass Skia canvas renders gradient pill, sage cutouts, and sand-orange sand
- [x] 8.5 Run existing tests (`npm test`) and confirm no regressions
