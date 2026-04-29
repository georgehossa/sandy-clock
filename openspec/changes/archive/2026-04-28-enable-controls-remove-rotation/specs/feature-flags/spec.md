## REMOVED Requirements

### Requirement: SHOW_CONTROLS defaults to false
**Reason**: Controls are now always rendered; the flag is retired.
**Migration**: Remove `SHOW_CONTROLS` from `lib/flags.ts`. If `lib/flags.ts` has no remaining exports, delete the file and remove all imports.

### Requirement: app.json declares showControls in extra
**Reason**: The `showControls` extra field is no longer read by any code.
**Migration**: Remove the `showControls` field from the `extra` block in `app.json`.
