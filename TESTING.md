# Testing Tree-Shaking and Lazy Loading

This guide explains how to verify that the package correctly implements tree-shaking and lazy loading.

## Quick Test

Run the automated analysis:

```bash
bun run analyze
```

This will:

1. Build two test apps (one with 3 flags, one with 10 flags)
2. Compare bundle sizes
3. Check for unused flags in bundles
4. Verify code splitting
5. Check for dynamic imports

## Manual Testing Steps

### Step 1: Install Test Dependencies

```bash
cd test-bundle
bun install
```

### Step 2: Build Test Apps

```bash
# Build with only 3 flags
bun build ./test-app.tsx --outdir=dist-3 --target=browser --minify

# Build with 10 flags
bun build ./test-app-all.tsx --outdir=dist-10 --target=browser --minify
```

### Step 3: Compare Bundle Sizes

```bash
# Check sizes
du -sh dist-3/*.js
du -sh dist-10/*.js
```

**Expected:** Bundle with 10 flags should be larger, but not 10x larger (proportional growth indicates tree-shaking works).

### Step 4: Check for Unused Flags

```bash
# Search for flags NOT used in test-app.tsx
grep -r "Ad\|Ae\|Af" dist-3/*.js
```

**Expected:** No results (unused flags should not be in bundle).

### Step 5: Test Lazy Loading in Browser

1. Start dev server:

   ```bash
   cd test-bundle
   bun run dev
   ```

2. Open browser DevTools (F12)

3. Go to **Network** tab

4. Filter by **JS** files

5. Load the page - you should see:

   - Initial bundle loaded
   - **No flag chunks loaded yet** (they load on-demand)

6. Interact with the page to trigger flag rendering

7. Watch Network tab - you should see:
   - Separate chunk files for each flag
   - Chunks load only when flags are rendered
   - Each flag = separate network request

## Expected Results

### ⚠️ Important: Understanding Build vs Runtime

When using `bun build --splitting`, you may see that **all flag chunks are created** in the output directory, even for unused flags. This is **normal and correct**:

- **Build time**: Bun creates chunks for all possible dynamic imports
- **Runtime**: Browser only downloads chunks that are actually needed
- **Tree-shaking**: Happens at **runtime** (browser requests), not build time

### ✅ Tree-Shaking Works If:

- Flag chunks are **separate files** (not in main bundle)
- Main bundle is small (only Flag component + React)
- Each flag has its own chunk file
- Unused flags exist as files but are **NOT downloaded** by browser

### ✅ Lazy Loading Works If:

- Multiple chunk files are created (one per flag)
- **Network tab shows separate requests** when flags render
- Flags load on-demand (not all at once)
- Initial page load doesn't download all flag chunks
- Each flag click triggers a **new network request**

## Example Output

### Good Results:

```
📦 Test 1: Building with only 3 flags...
   Total: 45.23 KB

📦 Test 2: Building with 10 flags...
   Total: 52.18 KB

✅ Unused flags NOT found - tree-shaking works!
✅ Code splitting detected - lazy loading works!
```

### Bad Results (if tree-shaking doesn't work):

```
📦 Test 1: Building with only 3 flags...
   Total: 450.23 KB  ❌ Too large!

📦 Test 2: Building with 10 flags...
   Total: 451.18 KB  ❌ Almost same size (all flags included)

❌ WARNING: Unused flag 'Ad' found in bundle!
```

## Understanding the Results

### Why All Chunks Are Created

When you run `bun build --splitting`, you'll see that **all flag chunks are created** in the output directory, even for flags you don't use. This is normal and expected:

1. **Build Time**: Bun analyzes all possible dynamic imports and creates chunks for them
2. **Runtime**: Browser only requests chunks that are actually needed
3. **Tree-Shaking**: Works at the **request level**, not at the build level

### How to Verify It Actually Works

The real test is in the **browser at runtime**:

1. Build your app: `bun build --splitting`
2. Serve the files (e.g., `python -m http.server` in dist folder)
3. Open DevTools → Network tab
4. Load the page - you should see only the main bundle
5. Render a flag - you should see a **new network request** for that flag's chunk
6. Render another flag - **another separate request**

This proves that:

- ✅ Flags are loaded on-demand (lazy loading)
- ✅ Only needed flags are downloaded (tree-shaking at runtime)
- ✅ Each flag is a separate chunk (code splitting)

## Troubleshooting

### If tree-shaking doesn't work:

1. **Check imports**: Make sure flags are imported dynamically
2. **Check bundler**: Ensure your bundler supports tree-shaking (Vite, Webpack 5+, Rollup)
3. **Check exports**: Verify package.json exports are correct
4. **Check side effects**: Ensure package.json doesn't have `"sideEffects": true`

### If lazy loading doesn't work:

1. **Check React.lazy()**: Verify flags use `React.lazy()` correctly
2. **Check Suspense**: Ensure Suspense boundaries are set up
3. **Check bundler config**: Some bundlers need specific config for code splitting
4. **Check network**: Verify chunks are actually separate files

## Advanced: Using Webpack Bundle Analyzer

For more detailed analysis, you can use webpack-bundle-analyzer:

```bash
# In a webpack-based project
npm install --save-dev webpack-bundle-analyzer

# Add to webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

This will show a visual representation of what's in your bundle.

## Real-World Test

To test in a real project:

1. Create a new React project
2. Install the package: `npm install ./path/to/react-lazy-flags`
3. Use only 1-2 flags
4. Build the project
5. Check bundle size
6. Verify only used flags are included
