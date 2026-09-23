# Contributing

Thanks for helping with adinkra-icons-react.

## Setup

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run check
```

`npm run check` builds the package, type-checks it, runs the tests, and then installs a packed archive in a scratch project to verify ESM, CommonJS, TypeScript (NodeNext and node10) and tree-shaking.

To try the package in another app, run `npm pack` and install the resulting `.tgz`.

## Project layout

```text
icons/                 Source SVGs and provenance
scripts/generate.mjs   SVG to typed React components and export index
src/types.ts           Shared public prop type
src/icons/             Generated components (ignored by Git)
src/index.ts           Generated named exports (ignored by Git)
dist/                  ESM, CommonJS and TypeScript declarations
tests/                 Generator and built-package rendering checks
```

## Adding an icon

1. Put the SVG directly in `icons/`. The filename becomes the export: `GyeNyame-sans.svg` becomes `AdGyeNyameSans`.
2. The root `<svg>` needs a `viewBox`.
3. Run `npm run check`.

The generator maps black (`black`, `#000`, `#000000`, `rgb(0,0,0)`) to `currentColor`, keeps `fill="none"`, and warns about any other hard-coded colour because it will ignore CSS `color`. Unreferenced IDs are removed. Referenced IDs (gradients, clip paths, `<use>`) are prefixed with the component name; the same icon rendered twice still repeats them. `<style>` blocks are left untouched with a warning. Geometry is never optimised or changed. Generation fails on name collisions and on a missing viewBox.

Generated files in `src/` are not edited by hand.

## Design notes

See [the architecture review](docs/architecture.md) for the comparison with React Icons and the intentional API differences. CI checks Node.js 22 and 24 with React 18 and 19.

## Releasing

1. Choose and document the licence for both the package code and the artwork. `UNLICENSED` is a placeholder and blocks publishing.
2. Review symbol names, provenance and attribution, and confirm the npm package name.
3. Update the version, run `npm run check`, and inspect `npm pack --dry-run`.
4. From an authenticated maintainer account, run `npm publish --access public`.

Nothing publishes automatically. The combined all-icons SVG sheet is not part of the component collection.
