# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

## How to add a changeset

When you make changes that should be included in the next release, run:

```bash
bunx changeset
```

This will prompt you to:
1. Choose the type of change:
   - **patch**: Bug fixes, small improvements
   - **minor**: New features, backwards compatible
   - **major**: Breaking changes
2. Write a summary of the changes

## Release Process

1. **Create PR with changes** + changeset file
2. **PR gets reviewed and merged** to main
3. **`.github/workflows/publish.yaml`** opens or updates the `chore(release): version packages` PR, which bumps `package.json`, writes `CHANGELOG.md` and deletes the consumed changesets
4. **When that PR is merged**, the same workflow tests, packs and publishes to npm with trusted publishing (OIDC), then tags `vX.Y.Z` and creates the GitHub release

Never edit the `version` in `package.json` by hand, and never run `changeset version` or `changeset publish` locally: the Version Packages PR is the only path to npm.

A PR merged without a changeset releases nothing. The Changeset Status workflow comments on every PR to say whether it has one.

## If a release half-fails

The publish job publishes to npm first, then pushes the `vX.Y.Z` tag and creates the GitHub release. If npm succeeded but the tag or release did not, re-running the workflow does nothing: the version is already on npm, so there is nothing left to publish. Finish it by hand from the release commit on `main`:

```bash
gh release create vX.Y.Z --target <release commit sha> --title vX.Y.Z --notes-file <the X.Y.Z section of CHANGELOG.md>
```

If npm failed, fix the cause and re-run the failed jobs; nothing was published, so the run is safe to repeat.
