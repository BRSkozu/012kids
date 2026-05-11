#!/usr/bin/env node
/**
 * Strip the "## 各機関の見解を比較" / "### 見解の詳細" section from
 * the article body, regardless of whether the content is the auto-generated
 * placeholder or topic-specific text.
 *
 * Rationale:
 *   - Even when content is topic-specific, the same section structure
 *     repeats in every article and the "見解の詳細" subsection duplicates
 *     the table immediately above.
 *   - The 3-perspective information is preserved in the frontmatter
 *     `perspectives:` field and is rendered separately by the article
 *     page UI (more compactly).
 *
 * What this removes:
 *   - The "## 各機関の見解を比較" section
 *   - The 立場/機関/見解の要旨 table
 *   - The "### 見解の詳細" subsection with the 3 paragraph repeats
 *   - The trailing `---` delimiter
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
 * Strip the section: from "## 各機関の見解を比較" to the next "---" on
 * its own line. Removes everything in between regardless of content.
 */
function stripPerspectivesSection(content) {
  const startMarker = /^## 各機関の見解を比較\s*$/m;
  const match = startMarker.exec(content);
  if (!match) return { changed: false, content };

  const startIdx = match.index;
  const tail = content.slice(startIdx);
  const endMatch = /^---\s*$/m.exec(tail);
  if (!endMatch) return { changed: false, content };

  const block = tail.slice(0, endMatch.index + endMatch[0].length);
  const before = content.slice(0, startIdx);
  let after = content.slice(startIdx + block.length);

  after = after.replace(/^\s*\n/, '\n');
  const beforeTrimmed = before.replace(/\n+$/, '\n');

  return { changed: true, content: beforeTrimmed + after };
}

function run() {
  const files = getAllMdxFiles();
  let changedCount = 0;
  const changedFiles = [];

  for (const fp of files) {
    const raw = fs.readFileSync(fp, 'utf8');
    const { changed, content } = stripPerspectivesSection(raw);
    if (changed) {
      changedCount++;
      changedFiles.push(fp);
      if (!DRY_RUN) {
        fs.writeFileSync(fp, content, 'utf8');
      }
    }
  }

  console.log(`Scanned: ${files.length} files`);
  console.log(`見解 section found in: ${changedCount} files`);
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
