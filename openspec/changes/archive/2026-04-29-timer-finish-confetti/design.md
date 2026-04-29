## Context

The sand-clock app is a React Native (Expo) kid-friendly timer with an animated Skia hourglass. Timer state is managed via Zustand with a `runState` machine (`idle → armed → running → finished`). The finish transition already triggers a sound tone via the `useFinishTone` hook pattern. The project uses `@shopify/react-native-skia` for rendering and `react-native-reanimated` for UI-thread animations. A device-tier system and reduce-motion hook gate visual complexity.

The play button (80px circle, centered at the bottom of the screen) is the visual anchor. When the timer finishes, this button is visible and is the natural origin point for a celebration effect.

## Goals / Non-Goals

**Goals:**
- Create a visually delightful confetti burst when the timer finishes
- Originate particles from the play button area so the effect feels connected to the UI
- Zero new dependencies — use the existing Skia + Reanimated stack
- Respect reduce-motion and device-tier constraints
- Self-contained component that can be dropped into the timer screen

**Non-Goals:**
- Custom confetti shapes (e.g., stars, emojis) — simple colored rectangles/circles are sufficient for v1
- User-configurable confetti settings (colors, density, duration)
- Haptic feedback on confetti (the finish tone already provides feedback)
- Persisting or replaying the confetti animation

## Decisions

### 1. Rendering engine: Skia Canvas overlay

**Choice**: Render confetti as a full-screen `<Canvas>` overlay using `@shopify/react-native-skia`.

**Alternatives considered**:
- **React Native Animated API**: Limited to transforming RN views — poor performance with 30+ independent particles.
- **External library (`react-native-confetti-cannon`)**: Adds a dependency and uses JS-thread animations, inconsistent with the project's Skia-first approach.

**Rationale**: The project already renders complex Skia animations for the hourglass. A Skia canvas provides GPU-accelerated rendering of many particles without JS bridge overhead. Reanimated shared values drive particle positions on the UI thread.

### 2. Particle system: Pre-computed trajectories with Reanimated timing

**Choice**: On trigger, generate an array of particle configs (random angle, velocity, color, size, rotation) and animate a single shared `progress` value from 0→1. Each particle's position is derived from `progress` using `useDerivedValue`.

**Rationale**: A single timing driver is cheaper than N independent animations. Particle positions are pure functions of `(initialConfig, progress)`, making the system deterministic and easy to scale particle count by device tier.

### 3. Trigger pattern: Follow `useFinishTone` convention

**Choice**: The `ConfettiOverlay` component watches `runState` from the store. When it transitions to `'finished'`, it starts the animation. When `runState` leaves `'finished'` (reset/stop), particles are cleared.

**Rationale**: This is the exact same pattern used by `useFinishTone`. Keeps trigger logic co-located with the rendering component and avoids prop-drilling.

### 4. Origin point: Measure button layout

**Choice**: Use `onLayout` on the play button's parent `View` to capture its screen position, and pass the center coordinates to `ConfettiOverlay` as the emission origin.

**Alternative**: Hard-code the position based on screen dimensions.

**Rationale**: `onLayout` adapts to different screen sizes and safe-area insets without assumptions.

### 5. Device-tier adaptation

| Tier | Particle count | Animation |
|------|---------------|-----------|
| high | ~40 particles | Full physics with rotation |
| mid  | ~20 particles | Full physics, no rotation |
| low  | ~10 particles | Simplified arcs |

Reduce-motion enabled: No confetti rendered at all (component returns `null`).

## Risks / Trade-offs

- **[Performance on low-end devices]** → Mitigated by device-tier scaling and keeping particle count conservative. Worst case: drop to fewer particles or skip entirely on `low` tier.
- **[Overlay z-index blocking touches]** → The Canvas overlay must have `pointerEvents="none"` so it doesn't intercept taps on the play button underneath.
- **[Animation timing with tone]** → Confetti and tone trigger from the same state transition, so they naturally sync. No coordination needed.
- **[Memory from particle arrays]** → Particle configs are plain objects (no heavy allocations). Array is created once per trigger and garbage-collected on reset. Negligible impact.
