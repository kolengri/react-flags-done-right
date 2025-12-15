import { $ } from "bun";
import { existsSync, statSync } from "fs";
import { cp, mkdir } from "fs/promises";
import { join, dirname } from "path";

const distDir = "./dist";
const srcDir = "./src";

// Clean dist directory
if (existsSync(distDir)) {
  await $`rm -rf ${distDir}`;
}
await mkdir(distDir, { recursive: true });

// Copy source files maintaining directory structure
const filesToCopy = [
  "components/Flag.tsx",
  "components/fallback.tsx",
  "components/skeleton.tsx",
  "components/flags",
  "index.ts",
];

console.log("📦 Copying source files to dist...");

for (const file of filesToCopy) {
  const srcPath = join(srcDir, file);
  const destPath = join(distDir, file);
  const destDir = dirname(destPath);

  if (!existsSync(destDir)) {
    await mkdir(destDir, { recursive: true });
  }

  if (existsSync(srcPath)) {
    const stats = statSync(srcPath);
    if (stats.isDirectory()) {
      await cp(srcPath, destPath, { recursive: true });
    } else {
      await cp(srcPath, destPath);
    }
    console.log(`  ✓ Copied ${file}`);
  } else {
    console.warn(`  ⚠ File not found: ${file}`);
  }
}

console.log("✅ Package build complete!");
console.log(`📁 Output directory: ${distDir}`);
