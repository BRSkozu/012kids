#!/usr/bin/env node
/**
 * Publish draft articles by removing `draft: true` from frontmatter.
 * Selects articles balanced across categories, then runs build scripts.
 *
 * Usage:
 *   node scripts/publish-articles.mjs [--count N]
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');
const CATEGORIES = [
  'development',
  'digital',
  'education',
  'health',
  'lifestyle',
  'mental',
  'nutrition',
  'pregnancy',
  'social',
];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  let count = 10;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1], 10);
      if (isNaN(count) || count < 1) {
        console.error('Error: --count must be a positive integer');
        process.exit(1);
      }
    }
  }
  return { count };
}

// ---------------------------------------------------------------------------
// Discover draft articles
// ---------------------------------------------------------------------------
function getDraftFiles(category) {
  const catDir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) return [];

  return fs
    .readdirSync(catDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(catDir, f))
    .filter((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      return /^draft:\s*true\s*$/m.test(content);
    });
}

// ---------------------------------------------------------------------------
// Select articles balanced across categories (round-robin)
// ---------------------------------------------------------------------------
function selectBalanced(draftsByCategory, count) {
  const selected = [];
  // Shuffle each category's drafts for variety
  for (const cat of Object.keys(draftsByCategory)) {
    draftsByCategory[cat].sort(() => Math.random() - 0.5);
  }

  // Round-robin across categories
  const cats = CATEGORIES.filter((c) => draftsByCategory[c]?.length > 0);
  let round = 0;
  while (selected.length < count && cats.length > 0) {
    for (let i = cats.length - 1; i >= 0; i--) {
      if (selected.length >= count) break;
      const cat = cats[i];
      const drafts = draftsByCategory[cat];
      if (round < drafts.length) {
        selected.push({ category: cat, filePath: drafts[round] });
      } else {
        cats.splice(i, 1);
      }
    }
    round++;
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Publish a single article (remove draft: true line)
// ---------------------------------------------------------------------------
function publishArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updated = content.replace(/^draft:\s*true\n/m, '');
  fs.writeFileSync(filePath, updated, 'utf-8');
}

// ---------------------------------------------------------------------------
// Run build scripts
// ---------------------------------------------------------------------------
function runBuildScripts() {
  const scripts = [
    'node scripts/generate-articles.mjs',
    'node scripts/generate-sitemap-rss.mjs',
    'node scripts/generate-llms-txt.mjs',
  ];
  for (const cmd of scripts) {
    console.log(`  Running: ${cmd}`);
    try {
      execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    } catch (err) {
      console.warn(`  Warning: ${cmd} exited with error (continuing)`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const { count } = parseArgs();
  console.log(`\n=== Publish Articles ===`);
  console.log(`Target count: ${count}\n`);

  // Gather drafts per category
  const draftsByCategory = {};
  let totalDrafts = 0;
  for (const cat of CATEGORIES) {
    const drafts = getDraftFiles(cat);
    draftsByCategory[cat] = drafts;
    totalDrafts += drafts.length;
    console.log(`  ${cat}: ${drafts.length} drafts available`);
  }
  console.log(`  Total drafts: ${totalDrafts}\n`);

  if (totalDrafts === 0) {
    console.log('No draft articles found. Nothing to publish.');
    process.exit(0);
  }

  // Select balanced set
  const selected = selectBalanced(draftsByCategory, Math.min(count, totalDrafts));
  console.log(`Selected ${selected.length} articles to publish:\n`);

  // Publish each
  const publishedByCategory = {};
  for (const { category, filePath } of selected) {
    publishArticle(filePath);
    const fileName = path.basename(filePath);
    publishedByCategory[category] = (publishedByCategory[category] || 0) + 1;
    console.log(`  [${category}] ${fileName}`);
  }

  // Summary by category
  console.log(`\nPublished per category:`);
  for (const [cat, n] of Object.entries(publishedByCategory).sort()) {
    console.log(`  ${cat}: ${n}`);
  }

  // Run build scripts
  console.log(`\nRunning build scripts...`);
  runBuildScripts();

  console.log(`\nDone! Published ${selected.length} articles.\n`);
}

main();
