# Architecture review against React Icons

Reviewed on 2026-09-23 using the linked upstream source. This is an independent package for one Adinkra collection, not a fork or an addition to the `react-icons` npm package.

| Area            | React Icons                                                  | This package                                                                                         |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Source pipeline | SVGs from multiple collections become generated icon modules | 49 original SVGs become generated TSX through SVGR                                                   |
| Runtime         | `GenIcon` builds SVG elements through a shared `IconBase`    | Direct SVG components with forwarded refs                                                            |
| Imports         | Named exports by collection                                  | Root named exports and individual icon entry points                                                  |
| Distribution    | ESM, CommonJS, TypeScript declarations                       | ESM, CommonJS, declarations for both module formats                                                  |
| React           | Peer dependency                                              | Peer dependency, explicitly supporting React 18 and 19                                               |
| Color           | `currentColor` and color/style props                         | Black source fills (`black`, `#000`, `rgb(0,0,0)`) become `currentColor`; standard color/style props |
| Sizing          | `size` prop, default `1em`                                   | Standard `width`/`height` props, default `1em`                                                       |
| Global defaults | `IconContext`                                                | CSS inheritance; no context API currently                                                            |
| Licensing       | Collection license metadata is included in release artifacts | Provenance is recorded; code/artwork licensing remains a release prerequisite                        |

A single package is appropriate for this collection. Upstream's multi-collection fetchers, manifests, and workspace structure solve a larger aggregation problem. Keep the source artwork separate from generated code and add infrastructure as concrete needs emerge.

The public API is inspired by React Icons but is not a drop-in replacement. In particular, do not document `size` or `IconContext` until those APIs exist. Artwork names keep their source spelling and the `Sans` suffix to preserve a future distinction between styles.

## Build and checks

- Every generated component uses the shared `IconProps` type from `src/types.ts`, so the public type and the components cannot drift apart. The generator fails if SVGR's output changes shape, rather than silently skipping a transform.
- Referenced SVG IDs (gradients, clip paths, `<use>`) are prefixed with the component name. Unreferenced IDs are removed. Colours other than black are kept and reported as warnings.
- ESM output preserves per-icon module boundaries, so a root import of one icon is the same size as its direct import (about 1.3 KB minified with React external for `AdAbanSans`). This is a fixture measurement, not a size guarantee for every icon.
- CommonJS output remains bundled to avoid `require()` pointing at ESM `.js` files.
- Sourcemaps are not published, since the generated sources they reference are not part of the package.
- `typesVersions` maps `icons/*` for TypeScript consumers that use classic `node10` resolution, which ignores `exports`.
- Tests render all exported icons in ESM and CommonJS and compare root and per-icon output.
- A package smoke check creates and installs the actual tarball, checks both import formats, compiles consumers with NodeNext and node10 resolution, and compares root and direct bundle sizes. The temporary consumer uses the installed development React peer.
- CI covers Node 22/24 and React 18/19, including matching React type packages.

Publication still requires approved code/artwork licensing, attribution review, npm name/account ownership, and a final release version. The release guard checks the license placeholder and presence of artwork; it does not verify ownership or rights automatically.
