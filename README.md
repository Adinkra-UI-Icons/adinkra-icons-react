<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.png">
    <img src="./assets/logo.png" alt="Adinkra UI Icons" width="420">
  </picture>
</p>

<h1 align="center">adinkra-icons-react</h1>

<p align="center">
   Adinkra symbols as lightweight, typed React components.
</p>

- **Inherit your text colour.** Icons draw with `currentColor`, so they follow CSS `color`, dark mode and hover states.
- **Scale with your text.** Icons default to `1em` and take any `width`/`height`.
- **Tree-shakable.** Import only the symbols you use; the rest never reach your bundle.
- **Typed.** Full TypeScript support, and every icon forwards a `ref`.
- **Accessible.** Optional `title`, plus standard ARIA attributes.
- **Works everywhere.** ESM and CommonJS, React 18 and 19.

## Install

```sh
npm install adinkra-icons-react
```

React 18 or 19 is required (it is a peer dependency and is never bundled).

## Usage

```tsx
import { AdSankofaSans, AdGyeNyameSans } from "adinkra-icons-react";

export function Example() {
  return (
    <p>
      <AdSankofaSans /> Learn from the past
      <AdGyeNyameSans width={32} height={32} color="#8b4513" />
    </p>
  );
}
```

Icon names start with `Ad` followed by the symbol name and a `Sans` suffix, for example `AdSankofaSans`. See [all icons](#all-icons) below.

### Import a single icon

```tsx
import AdSankofaSans from "adinkra-icons-react/icons/AdSankofaSans";
```

### Colour and size

```tsx
<AdAkomaSans style={{ color: "crimson", fontSize: 48 }} />
<AdAkomaSans className="text-amber-500" width={24} height={24} />
```

## Accessibility

Decorative icons should be hidden from screen readers. Icons that carry meaning need a label:

```tsx
<AdSankofaSans aria-hidden="true" />

<AdSankofaSans title="Sankofa" role="img" />
<AdSankofaSans role="img" aria-label="Sankofa" />
```

When you use `title`, you can also pass `titleId` to link it with `aria-labelledby`. Give each instance its own unique ID.

## Props

Every icon accepts all standard SVG attributes (`className`, `style`, `width`, `height`, `color`, `onClick`, ARIA attributes and so on), a `ref` to the `<svg>` element, and:

| Prop      | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `title`   | `string` | Accessible name, rendered as an SVG `<title>` element. |
| `titleId` | `string` | ID for the `<title>`, used for `aria-labelledby`.      |

The props type is exported for your own components:

```tsx
import type { IconProps } from "adinkra-icons-react";
```

## All icons

<details>
<summary>Show all  components</summary>

|                         |                     |                       |
| ----------------------- | ------------------- | --------------------- |
| `AdAbanSans`            | `AdAbodeSantanSans` | `AdAbusuaPaSans`      |
| `AdAdinkraheneSans`     | `AdAgyinDawuruSans` | `AdAkofenaSans`       |
| `AdAkomaNtoasoSans`     | `AdAkomaSans`       | `AdAnanseNtontanSans` |
| `AdBeseSakaSans`        | `AdDameDameSans`    | `AdDenkyemSans`       |
| `AdDenkyemfunefuSans`   | `AdDuafeSans`       | `AdDwannimenSans`     |
| `AdEbanSans`            | `AdEpaSans`         | `AdEseNeTekremaSans`  |
| `AdFawohodieSans`       | `AdFihankraSans`    | `AdFofoSans`          |
| `AdGyawuAtikoSans`      | `AdGyeNyameSans`    | `AdHwemuDuaSans`      |
| `AdHyeWonhyeSans`       | `AdKradoSans`       | `AdKuntanKantanSans`  |
| `AdKurontiNeAkwamuSans` | `AdMakoNyinaaSans`  | `AdMateMasieSans`     |
| `AdMmereDaneSans`       | `AdMmraMuoSans`     | `AdMoNoYoSans`        |
| `AdMpatapoSans`         | `AdNkrabeaSans`     | `AdNkyimkyimSans`     |
| `AdNsaaSans`            | `AdNserewaSans`     | `AdNsorommaSans`      |
| `AdNyameBiWoSoroSans`   | `AdNyameDuaSans`    | `AdOheneAdwaSans`     |
| `AdOheneAniwaSans`      | `AdPempamsieSans`   | `AdSankofaDuaSans`    |
| `AdSankofaSans`         | `AdSesaWoSubanSans` | `AdWawaAbaSans`       |
| `AdWoforoDuaPaSans`     |                     |                       |

</details>

## Contributing

Want to add a symbol or work on the package? See [CONTRIBUTING.md](CONTRIBUTING.md).
