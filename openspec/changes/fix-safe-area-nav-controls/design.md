## Context

Both screens (`app/(kid)/index.tsx`, `app/(parent)/settings.tsx`) manually manage top/bottom padding with hardcoded `theme.spacing` values. On iPhone models with a notch or Dynamic Island, the status bar height is ~54pt; on home-indicator models it is ~34pt at the bottom. Neither is currently accounted for, causing content to render behind system chrome. Additionally, the Reset/Play/Stop controls bar was shipped unconditionally — the primary UX is flip-to-start, so the controls should only be visible when explicitly enabled (e.g., during development or for users who prefer tap controls).

## Goals / Non-Goals

**Goals:**
- Safe area padding on both screens via `useSafeAreaInsets` (dynamic, per-device)
- `lib/flags.ts` reads `Constants.expoConfig?.extra?.showControls` (boolean, defaults `false`) and exports `SHOW_CONTROLS`
- Timer Screen conditionally renders the controls bar based on `SHOW_CONTROLS`
- `app.json` `extra` block sets `showControls: false` (production default; can be overridden in `app.config.js` or `.env`)

**Non-Goals:**
- No changes to the flip gesture, timer logic, or store
- No dark mode, no new screens
- No runtime toggle (flag is read once at startup from Expo config)

## Decisions

### D1: `useSafeAreaInsets` hook on each screen, not `SafeAreaView`

**Decision:** Use the `useSafeAreaInsets()` hook from `react-native-safe-area-context` and apply `paddingTop` / `paddingBottom` as inline style overrides on the root `View`.

**Rationale:** `SafeAreaView` applies insets on all four sides and can conflict with `ScrollView` bottom padding. With the hook, each screen applies only the edges it cares about: Timer Screen needs top (nav bar) + bottom (controls bar); Settings Screen needs top (header) + bottom (scroll end). This gives precise control with no layout surprises.

**Alternatives considered:**
- `SafeAreaView` wrapper — simpler, but fights with ScrollView `contentContainerStyle` padding
- `contentStyle` on the Expo Router `Stack` — applies globally, can't be overridden per-screen for different top/bottom needs

---

### D2: Feature flag via `app.json` `extra` block, not a `.env` file

**Decision:** Store the flag as `expo.extra.showControls: false` in `app.json`. Read in `lib/flags.ts` via `Constants.expoConfig.extra`.

**Rationale:** Expo's `extra` block is the idiomatic way to pass build-time config to the app bundle without a native rebuild. It works in Expo Go, bare workflow, and EAS Build. A `.env` file would require `babel-plugin-transform-inline-environment-variables` — an extra dependency. The `app.json` approach is zero-dependency and already available via `expo-constants` (which is already in the project).

**Usage for local development:** Override in `app.config.js`:
```js
module.exports = ({ config }) => ({
  ...config,
  extra: { ...config.extra, showControls: true },
});
```

---

### D3: Controls bar hidden via conditional render (`SHOW_CONTROLS &&`), not CSS visibility

**Decision:** `{SHOW_CONTROLS && <View style={styles.controls}>…</View>}` — the entire controls bar is removed from the tree when the flag is off.

**Rationale:** Hiding with `opacity: 0` or `display: none` still occupies layout space and leaves inaccessible buttons. Removing from the tree is clean, avoids layout gaps at the bottom, and is the standard React Native pattern for conditional UI.

## Risks / Trade-offs

- **[Risk] `Constants.expoConfig` is `null` in some test environments** → Mitigation: `lib/flags.ts` uses optional chaining with `?? false` fallback, so tests never throw.
- **[Risk] Insets are `0` in Expo Go on Android** → Acceptable; Android handles insets differently and this primarily targets iOS notch/home-indicator devices.
- **[Risk] `app.config.js` override only works in bare/managed workflow with Metro; EAS Build requires proper env setup** → Mitigation: Document in the flags file comment; default `false` is always safe.

## Migration Plan

1. Add `lib/flags.ts`
2. Add `extra.showControls: false` to `app.json`
3. Update `app/(kid)/index.tsx`: import `useSafeAreaInsets`, apply top inset to nav bar, gate controls bar on `SHOW_CONTROLS`, apply bottom inset accordingly
4. Update `app/(parent)/settings.tsx`: import `useSafeAreaInsets`, apply top inset to header, apply bottom inset to scroll content padding

No data migration. No store changes. Rollback = revert two files.
