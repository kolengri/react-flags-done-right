# Publishing the Package

## Before Publishing

1. Make sure all flags are generated:

   ```bash
   bun run build
   ```

2. Update version in `package.json`:

   ```bash
   npm version patch  # or minor, major
   ```

3. Test the package locally:
   ```bash
   npm pack
   # This creates a .tgz file you can test in another project
   ```

## Publishing to npm

```bash
npm publish
```

## Package Structure

The package includes:

- `dist/components/Flag.tsx` - Main Flag component
- `dist/components/flags/*.tsx` - All flag components (404 flags)
- `dist/components/flags/index.ts` - Auto-generated flag loaders mapping
- `dist/index.ts` - Package entry point
- `README.md` - Documentation

## Important Notes

- The package exports TypeScript source files from `dist/` directory
- Files are copied from `src/` to `dist/` during build process
- Consumers' bundlers will handle compilation
- Lazy loading works because all flag components are separate files
- The `dist/` directory structure is preserved in the package

