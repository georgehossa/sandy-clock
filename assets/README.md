# Assets

This folder must contain four image files referenced by `app.json`:

- `icon.png` — 1024×1024 app icon
- `adaptive-icon.png` — 1024×1024 Android adaptive foreground
- `splash.png` — 1242×2436 (or larger) splash image
- `favicon.png` — 48×48 web favicon (optional)

These are not yet generated. Until they exist, `expo start` will warn but still
run on the simulator. Use any tool (e.g., `https://easyappicon.com/`) once a
final brand color/icon is decided.

Audio files belong under `assets/audio/`; see `assets/audio/SOURCES.md`.
