# Releasing Sand Clock

## Prerequisites

- EAS CLI installed: `npm install -g eas-cli`
- Expo account (free): https://expo.dev/signup
- Authenticated: `eas login`

## Build APK

```bash
# Build the APK (takes ~10 minutes on EAS cloud)
eas build --platform android --profile preview

# Download the APK from the build URL when complete
```

## Create GitHub Release

1. Go to GitHub → Releases → Draft new release
2. Tag: `v0.1.0` (or next version)
3. Title: `Sand Clock v0.1.0`
4. Attach the downloaded `.apk` file
5. Copy release notes from below
6. Publish release

## Release Notes Template

```markdown
## Sand Clock vVERSION

A free, ad-free, offline sand timer for kids.

### What's New
- First public release

### Install
1. Download the `.apk` below
2. Open on your Android device
3. Allow "Install from unknown source" if prompted
4. Enjoy!

### Permissions
- **Storage**: To save parent settings (colors, tone, language)

### Requirements
- Android 8.0+ (API 26+)

---
**Full source code**: https://github.com/jorgeossa/sand-clock
```

## Version Bump

After release, update version in:
- `package.json`
- `app.json`

Then commit: `git commit -m "chore(release): bump version to vX.Y.Z"`
