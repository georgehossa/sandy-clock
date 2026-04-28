## Context

The app currently has no centralized design system — all visual values (colors, font sizes, spacing) are hardcoded inline in each screen's `StyleSheet.create({})`. A Pencil design file now defines a cohesive visual identity: a warm off-white background (`#F5F0EB`), sage-green palette, Inter typeface, and sand-orange accent. There are two screens (Timer Screen, Settings Screen) and three Skia-rendered components (Hourglass hull, SandBody, FallStream) that need reskinning.

## Goals / Non-Goals

**Goals:**
- Create a single source of truth for design tokens (`lib/theme.ts`) covering colors, typography sizes, font weights, spacing units, border radii, and shadow presets
- Update all screens and components to consume tokens rather than hardcoded values
- Load Inter via `@expo-google-fonts/inter` and apply it to all text elements matching the design
- Match the Pencil Timer Screen and Settings Screen visually (layout, colors, typography, button styles)
- Update the Hourglass Skia canvas colors (hull gradient, cutout, sand-orange) to match the new palette

**Non-Goals:**
- No logic, timer behavior, flip gesture, or state changes
- No new screens or navigation changes
- No animation changes (Skia animations remain as-is)
- No dark mode (not in design scope)
- No changes to audio or sensor code

## Decisions

### D1: Centralized token file (`lib/theme.ts`) over per-component theme objects

**Decision:** Export a single flat `theme` object with sub-namespaces (`theme.colors`, `theme.font`, `theme.spacing`, `theme.shadow`, `theme.radius`).

**Rationale:** The app is small (2 screens, ~8 components). A flat module is simpler than a React context or styled-system and works with Skia (which can't consume React context). All files import directly: `import { theme } from '@/lib/theme'`.

**Alternatives considered:**
- React Context theme provider — overkill for 2 screens; Skia components can't use it
- Tailwind (NativeWind) — adds build complexity and Skia incompatibility
- CSS-in-JS (styled-components) — no benefit over StyleSheet at this scale

---

### D2: `@expo-google-fonts/inter` over bundling font files manually

**Decision:** Use the `@expo-google-fonts/inter` package with `useFonts` hook in the root `_layout.tsx`.

**Rationale:** Expo's Google Fonts packages handle asset bundling automatically with no manual linking. `SplashScreen.preventAutoHideAsync()` is already used, so we extend it until fonts load — zero UX impact.

**Alternatives considered:**
- Bundle `.ttf` files in `assets/fonts/` — works but requires manual `expo-font` config and file management
- System font (SF Pro / Roboto) — already in use; Inter is specified in the design

---

### D3: Skia color props passed as string constants from `theme.colors`, not via React context

**Decision:** Hourglass subcomponents (`SandBody`, `FallStream`, `GlitterField`) receive color as a prop or read from `theme.colors` directly. No context threading.

**Rationale:** Skia renders on a separate thread; React context reads happen on the JS thread and must be serialized. Passing explicit string props or importing the token module directly is the safest pattern.

---

### D4: Controls bar (Reset / Play / Stop) replaces bottom PresetButtons on Timer Screen

**Decision:** The Timer Screen bottom area is refactored to show three control buttons (Reset, Play, Stop) matching the Pencil design, while the preset duration selection moves to Settings.

**Rationale:** The Pencil design shows this layout clearly. The existing 4-button preset row doesn't appear in the Timer Screen design — preset selection is a settings concern.

**Note:** This is a layout change but not a behavior change — the existing store actions map cleanly to Reset/Play/Stop.

---

### D5: Settings duration options as pill buttons, not the current circular swatches

**Decision:** The TIMER section in Settings uses horizontal scrolling pill buttons (5, 10, 15, 25, 30 min) matching the Pencil design, replacing the current color-circle preset grid.

**Rationale:** Direct translation of the Pencil design. Duration and color are now separate rows in Settings.

## Risks / Trade-offs

- **[Risk] Inter font load delay on cold start** → Mitigation: Root layout already holds SplashScreen until ready; extend the same guard to `fontsLoaded`. Zero additional delay perceived by user.
- **[Risk] Skia color values must be valid hex strings** — passing a theme token that is `undefined` or `null` will crash the canvas render → Mitigation: All `theme.colors.*` values are statically typed as non-optional `string` in `lib/theme.ts`; TypeScript will catch missing values at compile time.
- **[Risk] Timer Screen layout refactor (controls bar) may break flip-gesture UX** → Mitigation: The flip gesture is sensor-driven and fully independent of the rendered layout; the only behavioral change is visual button placement. Existing `useFlipDetector` and store actions are untouched.
- **[Risk] Settings screen duration pill list differs from current preset model** (current: 3/5/10/15 min; design shows 5/10/15/25/30 min) → Mitigation: Align with the design values; update `PRESETS` array in `state/presets.ts` to match. This is a data-only change, no store shape change.

## Migration Plan

1. Add `@expo-google-fonts/inter` and ensure `expo-font` is present
2. Create `lib/theme.ts` with all token values
3. Update root `_layout.tsx` to load Inter and gate render behind `fontsLoaded`
4. Update `state/presets.ts` palette and preset durations
5. Update `app/(kid)/index.tsx` — Timer Screen reskin
6. Update `app/(parent)/settings.tsx` — Settings Screen reskin
7. Update Hourglass Skia components with new colors
8. Update `app.json` splash/background color
9. Run on simulator; verify both screens and Skia canvas render correctly

**Rollback:** All changes are purely visual. Rolling back is a git revert of the changed files. No migrations, no data format changes.

## Open Questions

- Should the preset durations change from `[3, 5, 10, 15]` to `[5, 10, 15, 25, 30]` as shown in the Settings design, or keep the existing durations and only restyle the buttons? → **Decision: match the design (5/10/15/25/30)** unless user specifies otherwise.
- The Settings screen design shows a `<` back button — the current parent gate flow doesn't have an explicit back button. Should navigation be added or just the icon rendered? → **Decision: render the back button and wire it to `router.back()`**.
