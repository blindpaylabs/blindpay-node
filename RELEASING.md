# Releasing `@blindpay/node`

## Version source of truth

[Changesets](https://github.com/changesets/changesets). Each PR that changes the package adds a `.changeset/*.md` file (`bunx changeset`, or the file by hand) naming the bump: `patch` for fixes, `minor` for anything new (resources, methods, exports, optional fields, enum members), `major` for anything breaking. api-sync PRs write `.changeset/api-sync-<spec sha>.md` themselves. Never edit `version` in `package.json` by hand and never run `changeset version` / `changeset publish` locally. A merge without a changeset releases nothing.

## What a merge to `main` triggers

`.github/workflows/publish.yaml` (workflow "Publish") runs on every push to `main`:

1. `select-mode` decides between two modes.
2. **Changesets pending** (`version` job): opens or updates the PR "chore(release): version packages", which bumps `package.json`, writes `CHANGELOG.md` and deletes the consumed changesets.
3. **That PR merged** (`pack` then `publish` jobs): type-check, test, build and pack, then publish to npm with trusted publishing (OIDC, provenance), tag `vX.Y.Z` and create the GitHub release.

`main` has no required checks today, so check that the "Main" workflow is green on a PR before merging it. That includes api-sync's auto-merged PRs and the Version Packages PR. `pack` re-runs only check-types and tests.

## Secrets and OIDC

| What | Used by | Notes |
|---|---|---|
| npm trusted publisher for `@blindpay/node`, bound to `blindpaylabs/blindpay-node` + `publish.yaml` | `publish` job (`id-token: write`) | No npm token is used. Renaming `publish.yaml` breaks publishing until the trusted publisher is updated on npmjs.com by an npm org owner |
| `SDK_SYNC_PAT` | `version` job, `api-sync.yml` | A PAT, so the PRs it opens start workflows (a `GITHUB_TOKEN` push does not). Owned by a BlindPay org admin; when it expires, the `version` job fails with "SDK_SYNC_PAT is not set" or a 401 |
| `SLACK_WEBHOOK_URL` | `pipeline-alert.yml` | Failure alerts for API Sync, Publish and Main |
| `SNYK_TOKEN` | `snyk.yaml` | Dependency scan |

`NPM_TOKEN` and `NODE_AUTH_TOKEN` still exist as repo secrets but no workflow uses them; a repo admin can delete them.

## Re-running a stuck or failed release

- Publish run stuck in `queued` or failed for an infrastructure reason: Actions, then **Publish**, then **Run workflow** on `main` (`workflow_dispatch`), or `gh workflow run publish.yaml --ref main`. It picks the mode again from the state of `main`, and Changesets publishes only versions that are not on npm yet, so repeating it is safe.
- Only `main` can publish (`select-mode` is skipped on other refs).
- A failed `pack` (tests or build) needs a fix PR. Merge it, and the next push re-runs the flow.

## Verifying the published artifact

```bash
npm view @blindpay/node@X.Y.Z version dist.fileCount dist.attestations.provenance
mkdir /tmp/bp-smoke && cd /tmp/bp-smoke && npm init -y >/dev/null && npm install @blindpay/node@X.Y.Z
node -e "const b=require('@blindpay/node'); console.log(typeof b.BlindPay, b.ErrorCode.QUOTES_EXPIRED)"
node --input-type=module -e "import {BlindPay, verifyWebhook} from '@blindpay/node'; console.log(typeof BlindPay, verifyWebhook('{}', {}, 'whsec_x'))"
npx -y @arethetypeswrong/cli@0.18.5 --from-npm @blindpay/node@X.Y.Z
```

Expect `function QUOTES_EXPIRED`, `function false`, a provenance attestation, and "No problems found" from attw (6.2.0 onwards; 6.1.0 shows "Masquerading as CJS"). attw 0.18.2 and older crash on this package; use 0.18.5.

## Known traps

- `main` is unprotected and `allow_auto_merge` is on, so `gh pr merge --auto` in `api-sync.yml` merges without waiting for checks.
- Three Publish/Main runs from the 2026-11-11 GitHub incident are still `queued`. They don't block later runs.
- api-sync last ran on 2026-08-08. If blindpay-v2's `sdk-sync.yml` stops dispatching, drift only shows up in a manual `bun scripts/api-sync/index.ts --check --spec <current public spec>`.
- The Changesets CLI needs Node `^22.11 || >=24` locally. CI uses Node 24 for publishing.
