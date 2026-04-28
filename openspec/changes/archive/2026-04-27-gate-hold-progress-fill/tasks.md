## 1. Animation State

- [x] 1.1 Import `Animated` from `react-native` in `gate.tsx`
- [x] 1.2 Add `const fillAnim = useRef(new Animated.Value(0)).current` to the component
- [x] 1.3 Create a `fillWidth` interpolation: `fillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })`

## 2. Hold Logic Update

- [x] 2.1 In `startHold`: start `Animated.timing(fillAnim, { toValue: 1, duration: HOLD_MS, useNativeDriver: false })` alongside the existing `setTimeout`
- [x] 2.2 In `cancelHold`: stop the animation with `fillAnim.stopAnimation()` and reset with `fillAnim.setValue(0)` alongside the existing `clearTimeout`

## 3. Button Layout Restructure

- [x] 3.1 Wrap the hold button content in an outer `View` (not `Pressable`) with `overflow: 'hidden'`, `borderRadius: 20`, `width: '100%'`, `height: 72`, mint background, and card shadow
- [x] 3.2 Add an `Animated.View` as the first child — absolutely positioned (`position: 'absolute'`, `left: 0`, `top: 0`, `bottom: 0`), width set to `fillWidth`, background `theme.colors.mintDark`
- [x] 3.3 Move the `Pressable` (with `onPressIn`/`onPressOut`, icon, and label) as the second child — absolutely positioned to fill the container (`inset: 0` equivalent), transparent background, so it renders above the fill and receives all touches

## 4. Verification

- [x] 4.1 Run `npx tsc --noEmit` — confirm no type errors
- [x] 4.2 Run `npm test` — confirm no regressions
- [ ] 4.3 Verify on simulator: hold button shows fill growing left-to-right over 3s, resets on release
