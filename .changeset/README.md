# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

## How to add a changeset

When you make changes that should be included in the next release, run:

```bash
bun changeset
```

This will prompt you to:
1. Select which packages have changed (just select the main package)
2. Choose the type of change:
   - **patch**: Bug fixes, small improvements
   - **minor**: New features, backwards compatible
   - **major**: Breaking changes
3. Write a summary of the changes

## Release Process

1. **Create PR with changes** + changeset file
2. **PR gets reviewed and merged** to main
3. **Changesets bot** automatically creates a "Version Packages" PR
4. **When Version Packages PR is merged**, the package is automatically published to NPM

## Manual Release (if needed)

```bash
bun run release
```

This builds the package and publishes it to NPM.