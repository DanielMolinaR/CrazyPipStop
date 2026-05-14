// CI gate: enforces a manual version bump on every PR. Fails unless:
//   1. app.json's `expo.version` on this branch is strictly greater
//      than the version on the base branch, and
//   2. package.json's `version` matches app.json's (kept in sync so
//      the repo never disagrees with itself about the version).
//
// Together with branch protection on main, this blocks any merge that
// didn't bump the version.
//
// Usage: node scripts/check-version-bump.mjs [baseRef]
//   baseRef defaults to "main". The base branch must already be fetched
//   (the workflow runs `git fetch origin <baseRef>` first).

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const baseRef = process.argv[2] || 'main';

function parseVersion(raw, source) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(typeof raw === 'string' ? raw.trim() : '');
  if (!match) {
    console.error(`✗ Could not read a MAJOR.MINOR.PATCH version from ${source}: ${JSON.stringify(raw)}`);
    process.exit(1);
  }
  return match.slice(1, 4).map(Number);
}

function readVersion(json, source, extract) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    console.error(`✗ ${source} is not valid JSON`);
    process.exit(1);
  }
  return parseVersion(extract(parsed), source);
}

function compare(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

const appVersion = (j) => j?.expo?.version;
const pkgVersion = (j) => j?.version;

const headApp = readVersion(readFileSync('app.json', 'utf8'), 'app.json (this branch)', appVersion);
const headPkg = readVersion(readFileSync('package.json', 'utf8'), 'package.json (this branch)', pkgVersion);
const baseApp = readVersion(
  execSync(`git show origin/${baseRef}:app.json`, { encoding: 'utf8' }),
  `app.json (origin/${baseRef})`,
  appVersion,
);

const headAppStr = headApp.join('.');
const headPkgStr = headPkg.join('.');
const baseAppStr = baseApp.join('.');

if (compare(headApp, baseApp) <= 0) {
  console.error(
    `✗ app.json "expo.version" must be bumped above origin/${baseRef}.\n` +
      `    origin/${baseRef}: ${baseAppStr}\n` +
      `    this branch:      ${headAppStr}\n` +
      `  Raise "expo.version" in app.json to a value greater than ${baseAppStr}.`,
  );
  process.exit(1);
}

if (compare(headApp, headPkg) !== 0) {
  console.error(
    `✗ package.json "version" must match app.json "expo.version".\n` +
      `    app.json:     ${headAppStr}\n` +
      `    package.json: ${headPkgStr}\n` +
      `  Set "version" in package.json to ${headAppStr}.`,
  );
  process.exit(1);
}

console.log(`✓ version bumped to ${headAppStr} (app.json and package.json in sync, was ${baseAppStr} on ${baseRef})`);
process.exit(0);
