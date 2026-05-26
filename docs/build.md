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
3. **Android production build** (AAB) — built but **not**
   auto-submitted. Download the resulting `.aab` from the
   [EAS Build dashboard](https://expo.dev/accounts/danimr/projects/CpsApp/builds)
   and upload it to Play Console manually (Internal testing →
   Create release → Upload). Auto-submit can be enabled later (see
   below).

### Future: enable Android auto-submit

When ready to flip Android from manual upload to fully automatic
submission:

1. Create a service account in Google Cloud, generate a JSON key,
   grant it release permissions in Play Console → API access.
2. Upload the JSON via `eas credentials` → Android → production.
3. Uncomment `submit.production.android` in [eas.json](../eas.json)
   (set `track: "internal"` initially) and add `--auto-submit` to
   the Android step in
   [release.yml](../.github/workflows/release.yml). ~10 lines of diff.

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
- Google Play service-account JSON — currently unused (Android is
  built but uploaded manually to Play Console). The release
  pipeline already builds a production AAB; whenever you're ready
  to switch to auto-submission, upload the JSON via
  `eas credentials` and follow the "Future: enable Android
  auto-submit" steps under [Release pipeline](#release-pipeline-githubworkflowsreleaseyml).

## App config

`app.json` declares `ios.config.usesNonExemptEncryption: false` so
App Store Connect doesn't prompt the encryption-export-compliance
questions on every submission — the app is fully offline and uses no
encryption beyond standard HTTPS.
