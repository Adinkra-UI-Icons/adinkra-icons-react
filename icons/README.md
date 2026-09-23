# SVG source artwork

Place the existing Adinkra SVG files here, directly in this folder. Originals are the source of truth; generated React files are not edited by hand.

- Use descriptive filenames: `sankofa.svg` produces `AdSankofa`; `gye-nyame.svg` produces `AdGyeNyame`.
- Every SVG must have a `viewBox`. Keep original geometry and attribution.
- For monochrome icons that should inherit CSS color, use `currentColor` for fills/strokes. The generator maps this collection’s black fills to `currentColor` and preserves `fill="none"`.
- Review source titles, descriptions, IDs, embedded styles, and export artifacts before adding artwork. Prefer self-contained paths without external assets.
- Record approved symbol spellings, meanings, attribution and artwork licensing alongside the collection before release.

Imported 49 individual SVGs from the supplied Google Drive collection on 2026-09-23. The combined `0-AdinkraSans-All_Icons.svg` sheet is excluded. Source files are preserved unchanged; no sample drawings are shipped as Adinkra symbols. See `sources.json` for file provenance.
