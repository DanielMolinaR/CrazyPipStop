# 1. Store build numbers on EAS, not in the repo

Date: 2026-08-26

## Status

Accepted.

## Context

Two different numbers travel with every release, and they are easy to
conflate:

- **`expo.version`** (`1.0.10`) — the marketing version users see in
  the store listing.
- **`android.versionCode` / `ios.buildNumber`** — opaque monotonic
  counters the stores use to tell uploads apart.

`eas.json` never set `cli.appVersionSource`, so eas-cli fell back to
its `local` default: EAS read the counters out of `app.json`, and with
`autoIncrement: true` it wrote the bumped value back to disk. In CI
that write lands in the runner's ephemeral checkout, which is
discarded. Nothing is ever committed, so every release run read the
same base value out of git and produced the same build number.

The EAS build history shows the result across five consecutive
production releases:

| Version | iOS buildNumber |
| ------- | --------------- |
| 1.0.5   | 2               |
| 1.0.6   | 2               |
| 1.0.7   | 2               |
| 1.0.8   | 2               |
| 1.0.9   | 2               |

Nobody noticed, because App Store Connect only requires `buildNumber`
to be unique *within a marketing version*, and
[check-version-bump.mjs](../../scripts/check-version-bump.mjs) forces a
new `expo.version` on every PR. So `2` was always fresh, and the bug
stayed invisible.

Android has no such escape hatch: `versionCode` must be unique for the
entire lifetime of the app, regardless of `versionName`. Enabling
Android auto-submit would therefore have turned a dormant bug into a
hard failure on the second release. An earlier attempt to silence the
related build error by pinning `android.versionCode: 1` and setting
`autoIncrement: false` made it strictly worse — every Android build
would have shipped versionCode `1`.

## Decision

Set `cli.appVersionSource: "remote"` in [eas.json](../../eas.json) with
`autoIncrement: true` on the `production` profile. EAS stores both
counters server-side and increments them per build. `versionCode` and
`buildNumber` are removed from `app.json` entirely — under remote
sourcing they are ignored.

`expo.version` is unaffected and remains a deliberate manual bump
enforced per-PR by `check-version-bump.mjs`.

The remote counters were seeded to `10` for both platforms via
`eas build:version:set`, clearing the legacy `1`/`2` range by a wide
margin so the first automated release could not collide with anything
already uploaded.

## Alternatives considered

**Keep `local`, bump by hand.** Set the counters in `app.json` with
`autoIncrement: false` and raise them in every PR. Consistent with how
the repo already treats `expo.version`, and the numbers stay visible in
git history. Rejected: it adds a second mandatory manual bump per PR
per platform, and forgetting it is silently punished by a rejected
upload *after* a successful build. It would also need
`check-version-bump.mjs` extended to police it.

**Keep `local`, have CI commit the bump back.** Makes auto-increment
work under local sourcing. Rejected: the release job would need write
access to a protected branch (a PAT or bot token that bypasses branch
protection), and concurrent releases would race on the same file.

## Consequences

- The counters are no longer visible in the repo. A reader looking for
  `versionCode` will not find one — this ADR is the explanation.
- Their state lives on EAS servers, which makes this decision awkward
  to reverse: reverting to `local` means reading the current remote
  values and transcribing them back into `app.json` before the next
  build.
- Read the current values with
  `eas build:version:get --platform android`.
- The real proof the bug is dead is not this release but the one after
  it: build numbers must differ between two consecutive releases. A
  single successful release proves nothing, since the old config also
  succeeded on any given single release.
