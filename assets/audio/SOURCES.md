# Finish Tone Audio Sources

Each bundled tone in `assets/audio/` MUST have an entry below recording its
provenance. CC0 / Public Domain only.

> **Status: PLACEHOLDER.** The three audio files are not yet sourced. Until
> they are, the app cannot bundle audio and will fail to require the assets.
> Action: download a CC0 clip for each row, drop it into this folder under the
> exact filename, then fill in the metadata.

## Required files

### bubble-pop.m4a — kid-friendly playful

- **Source URL**: [https://pixabay.com/sound-effects/film-special-effects-bubble-pop-406640/](https://pixabay.com/sound-effects/film-special-effects-bubble-pop-406640/)
- **Author handle**: [dragon-studio-38165424](https://pixabay.com/users/dragon-studio-38165424/)
- **License**: CC0 / Public Domain
- **Download date**: 2026-04-28
- **Filename**: `bubble-pop.m4a`
- **Length**: ≤ 2.0 s
- **Loudness**: normalize to within ±1 LUFS of the others

### magic-chime.m4a — kid-friendly gentle sparkle (default)

- **Source URL**: [https://pixabay.com/sound-effects/film-special-effects-cute-chime-439613/](https://pixabay.com/sound-effects/film-special-effects-cute-chime-439613/)
- **Author handle**: [dragon-studio-38165424](https://pixabay.com/users/dragon-studio-38165424/)
- **License**: CC0 / Public Domain
- **Download date**: 2026-04-28
- **Filename**: `magic-chime.m4a`
- **Length**: ≤ 2.0 s

### soft-bell.m4a — neutral

- **Source URL**: [https://pixabay.com/sound-effects/film-special-effects-notification-bell-sound-376888/](https://pixabay.com/sound-effects/film-special-effects-notification-bell-sound-376888/)
- **Author handle**: [dragon-studio-38165424](https://pixabay.com/users/dragon-studio-38165424/)
- **License**: CC0 / Public Domain
- **Download date**: 2026-04-28
- **Filename**: `soft-bell.m4a`
- **Length**: ≤ 2.0 s

## Recommended sources

- https://pixabay.com/sound-effects/ (CC0)
- https://freesound.org/ (filter: license = CC0)

## Normalization

Use ffmpeg loudnorm to bring all three within ±1 LUFS, e.g.:

    ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -t 2 -c:a aac -b:a 128k output.m4a
