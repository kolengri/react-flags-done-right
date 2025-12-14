#!/bin/bash

echo "🔍 Analyzing bundle size and tree-shaking..."
echo ""

# Test 1: Only 3 flags
echo "📦 Test 1: Building with only 3 flags (us, gb, fr)..."
bun build ./test-app.tsx --outdir=dist-test-3 --target=browser --minify
SIZE_3=$(du -sh dist-test-3/*.js | awk '{print $1}')
echo "   Bundle size: $SIZE_3"
echo ""

# Test 2: 10 flags
echo "📦 Test 2: Building with 10 flags..."
bun build ./test-app-all.tsx --outdir=dist-test-10 --target=browser --minify
SIZE_10=$(du -sh dist-test-10/*.js | awk '{print $1}')
echo "   Bundle size: $SIZE_10"
echo ""

# Test 3: Check if unused flags are in bundle
echo "🔍 Test 3: Checking if unused flags are included..."
echo "   Searching for 'Ad' flag (not used in tests)..."
if grep -r "Ad\|Andorra" dist-test-3/*.js 2>/dev/null | grep -v "node_modules" > /dev/null; then
  echo "   ❌ WARNING: Unused flag 'Ad' found in bundle!"
else
  echo "   ✅ Unused flags NOT found - tree-shaking works!"
fi
echo ""

# Test 4: Check for code splitting (lazy loading)
echo "🔍 Test 4: Checking for code splitting (lazy loading)..."
CHUNK_COUNT_3=$(ls -1 dist-test-3/*.js 2>/dev/null | wc -l | tr -d ' ')
CHUNK_COUNT_10=$(ls -1 dist-test-10/*.js 2>/dev/null | wc -l | tr -d ' ')
echo "   Chunks with 3 flags: $CHUNK_COUNT_3"
echo "   Chunks with 10 flags: $CHUNK_COUNT_10"
if [ "$CHUNK_COUNT_10" -gt "$CHUNK_COUNT_3" ]; then
  echo "   ✅ Code splitting detected - lazy loading works!"
else
  echo "   ⚠️  All code in one chunk - may need to check lazy loading"
fi
echo ""

echo "📊 Summary:"
echo "   - 3 flags bundle: $SIZE_3"
echo "   - 10 flags bundle: $SIZE_10"
echo ""
echo "✅ Analysis complete!"
