#!/usr/bin/env node
/**
 * Strip the generic auto-generated "見解を比較" boilerplate from
 * the article body.
 *
 * The same exact text appears in 838+ articles, providing no per-article
 * value. The general E-E-A-T disclaimer it conveys belongs on the
 * editorial-policy page, not in every article.
 *
 * What this removes:
 *   - The "## 各機関の見解を比較" section
 *   - The same-text table (積極的 / 中立的 / 慎重派 with placeholder rows)
 *   - The "### 見解の詳細" subsection with the 3 paragraphs of placeholders
 *   - The trailing `---` delimiter
 *
 * It leaves untouched any article that does NOT contain the canonical
 * placeholder phrase ("公的機関のガイドラインや研究データに基づいた信頼性の高い情報です").
 *
 * Usage:
 *   node scripts/strip-boilerplate.mjs            # apply
 *   node scripts/strip-boilerplate.mjs --dry-run  # report only
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

const PLACEHOLDER_TEXT = '公的機関のガイドラインや研究データに基づいた信頼性の高い情報です';

function getAllMdxFiles() {
  const files = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter((d) =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory(),
  );
  for (const cat of categories) {
    const dir = path.join(CONTENT_DIR, cat);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mdx'))) {
      files.push(path.join(dir, f));
    }
  }
  return files;
}

/**
 * Strip the boilerplate block:
 *   - Starts at "## 各機関の見解を比較"
 *   - Ends at (and consumes) the next "---" delimiter on its own line
 *
 * Only strip when the placeholder phrase is present in the block; otherwise
 * we might destroy a manually-written 見解 section.
 */
function stripBoilerplate(content) {
  const startMarker = /^## 各機関の見解を比較\s*$/m;
  const match = startMarker.exec(content);
  if (!match) return { changed: false, content };

  const startIdx = match.index;
  // Find the end: first "---" line after startIdx, but only within a reasonable distance
  const tail = content.slice(startIdx);
  const endMatch = /^---\s*$/m.exec(tail);
  if (!endMatch) return { changed: false, content };

  const block = tail.slice(0, endMatch.index + endMatch[0].length);
  if (!block.includes(PLACEHOLDER_TEXT)) {
    // The 見解 section here is NOT the auto-generated boilerplate.
    return { changed: false, content };
  }

  // Remove the block and any leading/trailing blank lines around it
  const before = content.slice(0, startIdx);
  const afterStart = startIdx + block.length;
  let after = content.slice(afterStart);
  // Trim leading newlines from `after` to avoid stacking blank lines
  after = after.replace(/^\s*\n/, '\n');
  // Remove trailing blank lines from `before`
  const beforeTrimmed = before.replace(/\n+$/, '\n');

  return { changed: true, content: beforeTrimmed + after };
}

function run() {
  const files = getAllMdxFiles();
  let changedCount = 0;
  const changedFiles = [];

  for (const fp of files) {
    const raw = fs.readFileSync(fp, 'utf8');
    const { changed, content } = stripBoilerplate(raw);
    if (changed) {
      changedCount++;
      changedFiles.push(fp);
      if (!DRY_RUN) {
        fs.writeFileSync(fp, content, 'utf8');
      }
    }
  }

  console.log(`Scanned: ${files.length} files`);
  console.log(`Boilerplate found in: ${changedCount} files`);
  if (DRY_RUN) {
    console.log('(dry-run — no files written)');
    for (const f of changedFiles.slice(0, 10)) {
      console.log('  -', path.relative(path.join(__dirname, '..'), f));
    }
    if (changedFiles.length > 10) console.log(`  ... and ${changedFiles.length - 10} more`);
  } else {
    console.log(`✅ Stripped ${changedCount} files`);
  }
}

run();
