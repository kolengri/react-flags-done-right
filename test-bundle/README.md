# Bundle Analysis Tests

This directory contains tests to verify tree-shaking and lazy loading functionality.

## Quick Test

Run the analysis script:

```bash
chmod +x analyze-bundle.sh
./analyze-bundle.sh
```

## Manual Testing

### 1. Test with Bun Build

```bash
# Install dependencies
bun install

# Build with only 3 flags
bun build ./test-app.tsx --outdir=dist-3 --target=browser --minify

# Build with 10 flags
bun build ./test-app-all.tsx --outdir=dist-10 --target=browser --minify

# Compare sizes
du -sh dist-3/*.js
du -sh dist-10/*.js
```

### 2. Check Bundle Contents

```bash
# Search for unused flags in bundle
grep -r "Ad\|Andorra" dist-3/*.js

# If nothing found, tree-shaking works!
```

### 3. Test Lazy Loading in Browser

1. Start dev server:

   ```bash
   bun run dev
   ```

2. Open browser DevTools → Network tab

3. Filter by "JS"

4. Load different flags and watch for:
   - New chunk files being loaded
   - Each flag should load as a separate chunk
   - Only loaded flags should appear in network requests

### 4. Use Bundle Analyzer (if available)

For more detailed analysis, you can use webpack-bundle-analyzer or similar tools.

## Expected Results

✅ **Tree-shaking works if:**

- Bundle with 3 flags is smaller than bundle with 10 flags
- Unused flags are NOT found in the bundle
- Bundle size grows proportionally with number of flags used

✅ **Lazy loading works if:**

- Each flag loads as a separate chunk
- Flags load on-demand (not all at once)
- Network tab shows separate requests for each flag

## Troubleshooting

If tree-shaking doesn't work:

- Check that flags are imported dynamically (using `lazy()`)
- Verify that bundler supports tree-shaking
- Check that unused exports are not imported

If lazy loading doesn't work:

- Verify that `React.lazy()` is used correctly
- Check that dynamic imports are not being bundled together
- Ensure Suspense boundaries are set up correctly
