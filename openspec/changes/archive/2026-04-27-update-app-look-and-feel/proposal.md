## Why

The current app uses a yellow-50 (`#FFFBEB`) background, hardcoded Tailwind-adjacent colors, and no custom typography — giving it a generic look that doesn't match the polished sand-clock design. A dedicated Figma/Pencil design now exists for the app with a cohesive visual identity (muted sage greens, warm off-white, Inter font, sand-orange accent) that should be reflected in the code.

## What Changes

- Introduce a centralized design token file (`lib/theme.ts`) with colors, typography, spacing, and shadow values derived from the Pencil design
- Replace all hardcoded color hex strings across screens and components with theme tokens
- Replace system font stack with **Inter** (via `expo-font` / `@expo-google-fonts/inter`) on text elements where the design specifies it
- Restyle the **Timer Screen** (kid index): background → `#F5F0EB`, status bar → dark-content, controls bar with Reset/Play/Stop button layout matching the design
- Restyle the **Settings Screen** (parent settings): header with back + title + gear, timer duration pills, color swatches row, and sound options list card — all matching the Pencil design
- Restyle the **Hourglass** component: pill body colors → sage gradient (`#BFE0D4` → `#9ECABC`), cutout fill → `#79B3A2`, sand-orange accent → `#D98B5C`
- Restyle **PresetButton** to match the pill-shaped duration option style in Settings
- Update splash/icon background from `#FDE047` to `#F5F0EB` to match the new palette

## Capabilities

### New Capabilities
- `design-tokens`: Centralized theme file (`lib/theme.ts`) exporting colors, typography, spacing, and shadow constants used app-wide

### Modified Capabilities
- `timer-screen`: Visual reskin of the main kid screen to match Pencil Timer Screen design
- `settings-screen`: Visual reskin of the parent settings screen to match Pencil Settings Screen design
- `hourglass-component`: Color and proportion updates to the Skia canvas hourglass to match the new palette

## Impact

- `lib/theme.ts` — new file, no breaking changes to logic
- `app/(kid)/index.tsx` — style changes only, no behavior changes
- `app/(parent)/settings.tsx` — style changes only, no behavior changes
- `components/Hourglass/Hourglass.tsx`, `SandBody.tsx`, `FallStream.tsx` — color prop changes
- `state/presets.ts` — `PALETTE` colors updated to match design swatches
- `app.json` — splash/background color update
- `package.json` — adds `@expo-google-fonts/inter` and `expo-font`
