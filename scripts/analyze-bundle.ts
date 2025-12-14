import { $ } from "bun";
import { readdir, stat } from "fs/promises";
import { join } from "path";

console.log("🔍 Analyzing bundle size and tree-shaking...\n");

// Test 1: Only 3 flags
console.log("📦 Test 1: Building with only 3 flags (us, gb, fr)...");
await $`bun build ./test-bundle/test-app.tsx --outdir=dist-test-3 --target=browser --minify --splitting`.quiet();

const files3 = await readdir("./dist-test-3");
const jsFiles3 = files3.filter((f) => f.endsWith(".js"));
let totalSize3 = 0;

for (const file of jsFiles3) {
  const stats = await stat(join("./dist-test-3", file));
  totalSize3 += stats.size;
  console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
}

console.log(`   Total: ${(totalSize3 / 1024).toFixed(2)} KB\n`);

// Test 2: 10 flags
console.log("📦 Test 2: Building with 10 flags...");
await $`bun build ./test-bundle/test-app-all.tsx --outdir=dist-test-10 --target=browser --minify --splitting`.quiet();

const files10 = await readdir("./dist-test-10");
const jsFiles10 = files10.filter((f) => f.endsWith(".js"));
let totalSize10 = 0;

for (const file of jsFiles10) {
  const stats = await stat(join("./dist-test-10", file));
  totalSize10 += stats.size;
  console.log(`   - ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
}

console.log(`   Total: ${(totalSize10 / 1024).toFixed(2)} KB\n`);

// Test 3: Check for unused flags
console.log("🔍 Test 3: Checking if unused flags are included...");
// Get the main bundle file (not flag chunks)
const mainBundle3 =
  jsFiles3.find((f) => f.includes("test-app") && !f.match(/^[A-Z][a-z]+-/)) ||
  jsFiles3[0];
const bundleContent3 = await Bun.file("./dist-test-3/" + mainBundle3).text();

// Check for some flags that are NOT used in test-app.tsx
const unusedFlags = ["Ad", "Ae", "Af", "Ag", "Ai", "Al", "Am"];
let foundUnused = false;

for (const flag of unusedFlags) {
  if (
    bundleContent3.includes(`"${flag}"`) ||
    bundleContent3.includes(`'${flag}'`)
  ) {
    console.log(`   ❌ WARNING: Unused flag '${flag}' found in bundle!`);
    foundUnused = true;
  }
}

if (!foundUnused) {
  console.log("   ✅ Unused flags NOT found - tree-shaking works!\n");
} else {
  console.log(
    "   ⚠️  Some unused flags found - tree-shaking may not work perfectly\n"
  );
}

// Test 4: Check code splitting
console.log("🔍 Test 4: Checking for code splitting (lazy loading)...");
// Count flag chunks (files that match flag name pattern)
const flagChunks3 = jsFiles3.filter((f) =>
  /^[A-Z][a-z]+(-[A-Z][a-z]+)*-\w+\.js$/.test(f)
);
const flagChunks10 = jsFiles10.filter((f) =>
  /^[A-Z][a-z]+(-[A-Z][a-z]+)*-\w+\.js$/.test(f)
);

console.log(
  `   Total chunks with 3 flags: ${jsFiles3.length} (${flagChunks3.length} flag chunks)`
);
console.log(
  `   Total chunks with 10 flags: ${jsFiles10.length} (${flagChunks10.length} flag chunks)`
);

if (flagChunks10.length > flagChunks3.length) {
  console.log(
    `   ✅ Code splitting works! More flags = more chunks (${flagChunks3.length} → ${flagChunks10.length})\n`
  );
} else if (flagChunks3.length > 0) {
  console.log(`   ✅ Code splitting detected! Flags are in separate chunks\n`);
} else {
  console.log(
    "   ⚠️  No flag chunks found - check lazy loading implementation\n"
  );
}

// Summary
console.log("📊 Summary:");
console.log(`   - 3 flags bundle: ${(totalSize3 / 1024).toFixed(2)} KB`);
console.log(`   - 10 flags bundle: ${(totalSize10 / 1024).toFixed(2)} KB`);
console.log(
  `   - Size difference: ${((totalSize10 - totalSize3) / 1024).toFixed(2)} KB`
);
console.log(
  `   - Size per flag (approx): ${(
    (totalSize10 - totalSize3) /
    7 /
    1024
  ).toFixed(2)} KB\n`
);

// Test 5: Check if flags are loaded dynamically
console.log("🔍 Test 5: Checking for dynamic imports...");
const hasDynamicImport =
  bundleContent3.includes("import(") || bundleContent3.includes("lazy");
if (hasDynamicImport) {
  console.log("   ✅ Dynamic imports found - lazy loading should work!\n");
} else {
  console.log(
    "   ⚠️  No dynamic imports found - flags may be bundled together\n"
  );
}

console.log("✅ Analysis complete!");
console.log("\n💡 To test in browser:");
console.log("   1. Run: bun run dev");
console.log("   2. Open DevTools → Network tab");
console.log("   3. Filter by 'JS'");
console.log("   4. Load different flags and watch for separate chunk requests");
