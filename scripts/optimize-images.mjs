#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'photos');

// Max dimensions per filename pattern (order matters — first match wins)
const SIZE_RULES = [
  { pattern: /^worry-/,      maxW: 480,  maxH: 480  },
  { pattern: /^stage-icon-/, maxW: 256,  maxH: 256  },
  { pattern: /^seasonal-/,   maxW: 1600, maxH: 800  },
  { pattern: /^cat-/,        maxW: 800,  maxH: 600  },
  { pattern: /^stage-/,      maxW: 1600, maxH: 900  },  // stage- but not stage-icon-
  { pattern: /^hero-main/,   maxW: 1920, maxH: 1080 },
  { pattern: /^about-mission/, maxW: 1200, maxH: 800 },
  { pattern: /^texture-warm-bokeh/, maxW: 800, maxH: 800 },
];

function getMaxDimensions(filename) {
  for (const rule of SIZE_RULES) {
    if (rule.pattern.test(filename)) {
      return { maxW: rule.maxW, maxH: rule.maxH };
    }
  }
  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeImage(filePath) {
  const filename = path.basename(filePath);
  const rule = getMaxDimensions(filename);

  if (!rule) {
    console.log(`  SKIP  ${filename} (no matching rule)`);
    return { before: 0, after: 0 };
  }

  const originalStats = fs.statSync(filePath);
  const originalSize = originalStats.size;

  const metadata = await sharp(filePath).metadata();
  const { width, height } = metadata;

  const needsResize = width > rule.maxW || height > rule.maxH;

  // Read the file into a buffer so we can overwrite in-place
  const inputBuffer = fs.readFileSync(filePath);

  let pipeline = sharp(inputBuffer);

  if (needsResize) {
    pipeline = pipeline.resize({
      width: rule.maxW,
      height: rule.maxH,
      fit: 'inside',          // maintain aspect ratio, fit within box
      withoutEnlargement: true,
    });
  }

  const outputBuffer = await pipeline
    .webp({ quality: 80 })
    .toBuffer();

  fs.writeFileSync(filePath, outputBuffer);

  const newSize = outputBuffer.length;
  const saved = originalSize - newSize;
  const pct = originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : '0.0';

  const resizeNote = needsResize
    ? `${width}x${height} -> ${rule.maxW}x${rule.maxH} (fit inside)`
    : `${width}x${height} (no resize needed)`;

  console.log(
    `  ${saved >= 0 ? 'OK' : 'BIGGER'}  ${filename.padEnd(30)} ` +
    `${formatBytes(originalSize).padStart(10)} -> ${formatBytes(newSize).padStart(10)} ` +
    `(${saved >= 0 ? '-' : '+'}${formatBytes(Math.abs(saved))}, ${pct}%)  ${resizeNote}`
  );

  return { before: originalSize, after: newSize };
}

async function main() {
  console.log(`\nOptimizing images in ${PHOTOS_DIR}\n`);

  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(f => f.endsWith('.webp'))
    .sort();

  console.log(`Found ${files.length} .webp files\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const file of files) {
    const filePath = path.join(PHOTOS_DIR, file);
    const result = await optimizeImage(filePath);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.before > 0) processed++;
  }

  const totalSaved = totalBefore - totalAfter;
  const totalPct = totalBefore > 0 ? ((totalSaved / totalBefore) * 100).toFixed(1) : '0.0';

  console.log(`\n${'='.repeat(90)}`);
  console.log(`  Processed: ${processed} files`);
  console.log(`  Total before: ${formatBytes(totalBefore)}`);
  console.log(`  Total after:  ${formatBytes(totalAfter)}`);
  console.log(`  Saved:        ${formatBytes(totalSaved)} (${totalPct}%)`);
  console.log(`${'='.repeat(90)}\n`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
