# Build and release pipeline

CI gates and the App Store / Play deployment flow. Top-level summary
lives in [CLAUDE.md](../CLAUDE.md#build--release-tldr).

## PR gate ([.github/workflows/pr.yml](../.github/workflows/pr.yml))

Runs on every PR targeting `main`. Two required jobs:

- **Type-check, test, lint** — `npx tsc --noEmit`, `npm test -- --ci`,
  `npm run lint`. The same gate listed in CLAUDE.md's conventions.
- **Version bump** — runs
  [scripts/check-version-bump.mjs](../scripts/check-version-bump.mjs)
  to fail unless `app.json`'s `expo.version` was raised above main's,
  and `package.json`'s `version` matches.

Both are required status checks in the `main` branch protection rule,
so a PR can't merge until they're green.

## Release pipeline ([.github/workflows/release.yml](../.github/workflows/release.yml))

Runs on every PR merge into `main` (`pull_request: closed` +
`if: merged == true`, so a PR closed without merging skips the build),
plus manual `workflow_dispatch`. Direct pushes to `main` (rare,
admin-only) do not auto-fire a release.

1. **Verify**: `npx tsc --noEmit`, `npm test -- --ci`, `npm run lint`.
   A failure in any of these blocks the release.
2. **iOS production build** with `--auto-submit` to App Store Connect.
3. **Android APK build** using the `preview` profile (sideloadable APK,
   distributable as a download / QR link from the EAS Build dashboard).

## EAS configuration

Build numbers auto-increment per platform via `"autoIncrement": true`
on the `production` build profile in [eas.json](../eas.json). The iOS
build is pinned to `macos-sequoia-15.6-xcode-26.2` (Apple requires
Xcode 26+ for App Store submissions as of 2026-04-28).

## Required secrets and credentials

- `EXPO_TOKEN` GitHub repo secret — needed by the release workflow to
  authenticate with EAS.
- Apple App Store Connect API key — uploaded once via `eas credentials`
  (used by `--auto-submit`).
- Google Play service-account JSON — currently unused (Android auto-
  submit is disabled in `eas.json` until Play residence verification
  completes); upload via `eas credentials` once ready.

## App config

`app.json` declares `ios.config.usesNonExemptEncryption: false` so
App Store Connect doesn't prompt the encryption-export-compliance
questions on every submission — the app is fully offline and uses no
encryption beyond standard HTTPS.
