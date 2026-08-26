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
2. **iOS production build** with `--auto-submit`, delivered to App
   Store Connect / TestFlight. It is **not** released to the App Store
   — you still submit for review by hand.
3. **Android production build** (AAB) with `--auto-submit`, delivered
   to the Google Play **`internal` testing track**
   (`submit.production.android` in [eas.json](../eas.json)). It does
   **not** reach the public — promote internal → production in Play
   Console when you're happy with it.

Both platforms stop at "delivered, human publishes", so a merge can
never surprise real users.

The Android step carries `if: ${{ !cancelled() }}` so an iOS failure
doesn't withhold the Android release. It's `!cancelled()` rather than
`always()` on purpose: `always()` would also fire after someone
cancels the workflow, starting a build-and-submit they just asked to
stop.

## EAS configuration

### Versioning

Two different numbers travel with a release; don't conflate them.

- **`expo.version`** (`app.json` + `package.json`) — the marketing
  version users see. Bumped **manually, once per PR**, enforced by
  [check-version-bump.mjs](../scripts/check-version-bump.mjs).
- **`android.versionCode` / `ios.buildNumber`** — opaque store
  counters. These are **not in the repo**. `cli.appVersionSource` is
  set to `"remote"` in [eas.json](../eas.json), so EAS stores them
  server-side and `"autoIncrement": true` on the `production` profile
  bumps them on every build.

Removing them from `app.json` is deliberate. Under the previous
`local` source, EAS incremented the counter inside the CI runner's
throwaway checkout — never committed — so five consecutive iOS
releases all shipped `buildNumber: 2`. Full reasoning in
[ADR 0001](adr/0001-remote-app-version-source.md).

Read the current counters with:

```
eas build:version:get --platform android
eas build:version:get --platform ios
```

### Build image and CLI pin

The iOS build is pinned to `macos-sequoia-15.6-xcode-26.2` (Apple
requires Xcode 26+ for App Store submissions as of 2026-04-28).

The eas-cli major is pinned in both places — `eas-version: ^22.0.0` in
[release.yml](../.github/workflows/release.yml) and `cli.version:
">= 22.0.0"` in [eas.json](../eas.json). This pipeline publishes to two
stores unattended, and a CLI-version-dependent default (`appVersionSource`
silently defaulting to `local`) is precisely what caused the build-number
bug above.

## Required secrets and credentials

- `EXPO_TOKEN` GitHub repo secret — needed by the release workflow to
  authenticate with EAS.
- Apple App Store Connect API key — uploaded once via `eas credentials`
  (used by `--auto-submit`).
- Google Play service-account JSON — uploaded once via
  `eas credentials` (used by the Android `--auto-submit`).

## App config

`app.json` declares `ios.config.usesNonExemptEncryption: false` so
App Store Connect doesn't prompt the encryption-export-compliance
questions on every submission — the app is fully offline and uses no
encryption beyond standard HTTPS.
