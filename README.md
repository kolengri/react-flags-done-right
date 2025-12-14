# react-flags-done-right

A React component library for country flags with lazy loading support using React Suspense.

## Features

- 🚀 **Lazy Loading**: Flags are loaded on-demand, reducing initial bundle size
- ⚡ **Suspense Support**: Built-in Suspense integration for smooth loading states
- 🎨 **SVG Flags**: High-quality SVG flag components
- 📦 **Tree-shakeable**: Only load the flags you actually use
- 🔧 **TypeScript**: Full TypeScript support
- 🎯 **400+ Flags**: Comprehensive collection of country and regional flags

## Installation

```bash
npm install react-flags-done-right
# or
yarn add react-flags-done-right
# or
pnpm add react-flags-done-right
# or
bun add react-flags-done-right
```

## Usage

### Basic Usage

```tsx
import { Suspense } from "react";
import { Flag } from "react-flags-done-right";

function App() {
  return (
    <div>
      <Flag code="us" width={64} height={64} />
      <Flag code="gb" width={64} height={64} />
      <Flag code="fr" width={64} height={64} />
    </div>
  );
}
```

### With Custom Fallback

```tsx
import { Suspense } from "react";
import { Flag } from "react-flags-done-right";

function App() {
  return (
    <div>
      <Flag
        code="us-ca"
        width={64}
        height={64}
        fallback={<div>Loading California flag...</div>}
      />
    </div>
  );
}
```

### Multiple Flags

```tsx
import { Suspense } from "react";
import { Flag } from "react-flags-done-right";

function FlagList() {
  const countries = ["us", "gb", "fr", "de", "jp"];

  return (
    <div>
      {countries.map((code) => (
        <Flag key={code} code={code} width={48} height={48} />
      ))}
    </div>
  );
}
```

## API

### `Flag` Component

The main component for rendering country flags.

#### Props

| Prop       | Type                      | Required | Default        | Description                                             |
| ---------- | ------------------------- | -------- | -------------- | ------------------------------------------------------- |
| `code`     | `string`                  | Yes      | -              | Country or region code (e.g., "us", "gb", "us-ca")      |
| `fallback` | `React.ReactNode`         | No       | `<Skeleton />` | Custom fallback component for Suspense                  |
| `...props` | `SVGProps<SVGSVGElement>` | No       | -              | All standard SVG props (width, height, className, etc.) |

#### Flag Codes

Flag codes follow the pattern:

- Country codes: ISO 3166-1 alpha-2 (e.g., `us`, `gb`, `fr`)
- Regional flags: `country-region` (e.g., `us-ca` for California, `gb-eng` for England)
- Special flags: Various special flags are also supported

## How It Works

The library uses React's `lazy()` and `Suspense` to enable code splitting. Each flag component is loaded only when it's first rendered, which means:

- Initial bundle size is minimal
- Flags are loaded on-demand
- Better performance for applications with many flags
- Automatic code splitting per flag

## Requirements

- React 18.0.0 or higher
- React DOM 18.0.0 or higher

## Credits

The flag SVG designs are based on [circle-flags](https://github.com/HatScripts/circle-flags) by [HatScripts](https://github.com/HatScripts), a collection of 400+ minimal circular SVG country, state and language flags.

## License

MIT
