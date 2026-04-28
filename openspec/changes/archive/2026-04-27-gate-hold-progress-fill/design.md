## Context

The hold button in `gate.tsx` uses `onPressIn` → `setTimeout(passGate, 3000)` and `onPressOut` → `clearTimeout`. There is no progress indication. The button is a fixed-size `Pressable` (full-width, 72px tall, borderRadius 20) with a solid mint background.

## Goals / Non-Goals

**Goals:**
- Animate a left-to-right fill on the hold button over 3000ms using `Animated.timing`
- Reset the fill instantly on release
- Keep the existing `setTimeout` gate trigger unchanged (single source of truth for navigation)
- Clip the fill to the button's border radius so it doesn't bleed outside

**Non-Goals:**
- No haptic feedback (out of scope)
- No Skia/Reanimated dependency — use RN's built-in `Animated`
- No change to the tap-7 numpad or any other screen

## Decisions

### D1: `Animated.Value` + `Animated.timing` over Reanimated

**Decision:** Use React Native's built-in `Animated` API (`useRef(new Animated.Value(0))`) with a `timing` animation of 3000ms duration, `useNativeDriver: false` (required since we're animating `width` which is a layout property).

**Rationale:** The project has no Reanimated dependency. Adding it just for one animation would be disproportionate. RN's `Animated` is sufficient for a single linear fill. `useNativeDriver: false` means the animation runs on the JS thread — acceptable for a 3s slow fill where frame drops are imperceptible.

**Alternatives considered:**
- Reanimated `useSharedValue` + `withTiming` — more performant but adds a heavy dependency
- CSS-style `Animated.loop` — not applicable here

---

### D2: Fill layer as an absolutely positioned child `Animated.View` inside the button

**Decision:** The hold button becomes a `View` (not `Pressable`) acting as a layout container with `overflow: 'hidden'`. Inside: (1) an `Animated.View` fill layer absolutely positioned left, full height, width driven by `fillAnim.interpolate(0→1 to '0%'→'100%')`; (2) the `Pressable` covers the full button area and renders the icon + label on top.

**Layout structure:**
```
<View style={holdBtn}>           ← container, overflow:hidden, borderRadius:20
  <Animated.View style={fill} /> ← absolute, left:0, top:0, bottom:0, width: interpolated %
  <Pressable                     ← absolute inset 0, transparent bg
    onPressIn / onPressOut>
    <Ionicons /> <Text />
  </Pressable>
</View>
```

**Rationale:** `overflow: 'hidden'` on the outer container clips the fill to the border radius automatically. The `Pressable` must be on top (higher z-index / rendered after fill) to receive touch events.

---

### D3: Parallel `Animated.timing` + `setTimeout` — animation is display-only

**Decision:** Keep `holdTimerRef` with `setTimeout(passGate, HOLD_MS)` as the authoritative trigger. Start `Animated.timing` in parallel on `onPressIn`; call `Animated.timing.stop()` + `setValue(0)` on `onPressOut`.

**Rationale:** The `setTimeout` is already battle-tested. Tying navigation to animation completion (`.start(cb)`) would risk the animation never completing on slow devices or when `useNativeDriver: false` lags. Parallel approach is simpler and more robust.

## Risks / Trade-offs

- **[Risk] `useNativeDriver: false` may cause subtle jank on low-end devices** → Acceptable: the fill is a slow 3s linear animation with no complex transforms. The `deviceTier` detection already exists but is overkill here.
- **[Risk] `width` as interpolated percentage string requires a parent with known width** → The outer `View` has `width: '100%'` which provides that. RN handles percentage widths correctly for `Animated.View` children.
- **[Risk] Pressable above the fill may intercept gestures on the fill layer** → Non-issue: both layers occupy the same area; `Pressable` is on top and handles all touches.
