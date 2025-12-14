# Example Usage

## Installation in Another Project

```bash
npm install react-flags-done-right
```

## Basic Example

```tsx
import { Suspense } from "react";
import { Flag } from "react-flags-done-right";

function MyApp() {
  return (
    <div>
      <h1>Country Flags</h1>
      <Suspense fallback={<div>Loading flags...</div>}>
        <Flag code="us" width={64} height={64} />
        <Flag code="gb" width={64} height={64} />
        <Flag code="fr" width={64} height={64} />
      </Suspense>
    </div>
  );
}
```

## With Vite/Webpack

The package exports TypeScript source files directly. Your bundler (Vite, Webpack, etc.) will handle the compilation and tree-shaking automatically.

## With Bun

Bun natively supports TypeScript, so no additional configuration is needed.

## Note

Since the package exports TypeScript source files, make sure your project's bundler is configured to handle `.ts` and `.tsx` files from `node_modules`.
