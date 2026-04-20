#!/usr/bin/env node

/**
 * Sync MDX excerpts into src/data/articles.ts
 * Reads each MDX's frontmatter excerpt and updates the matching entry in articles.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');
const ARTICLES_FILE = path.join(__dirname, '..', 'src', 'data', 'articles.ts');

// Build slug -> excerpt map from MDX files
const excerptMap = new Map();

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) { scanDir(fullPath); continue; }
    if (!entry.name.endsWith('.mdx')) continue;

    const raw = fs.readFileSync(fullPath, 'utf-8');
    const slugMatch = raw.match(/^slug:\s*"?([^\s"]+)"?/m);
    const excerptMatch = raw.match(/^excerpt:\s*"(.+)"/m);
    if (slugMatch && excerptMatch) {
      excerptMap.set(slugMatch[1], excerptMatch[1]);
    }
  }
}

scanDir(CONTENT_DIR);
console.log(`Found ${excerptMap.size} MDX excerpts.`);

// Read and update articles.ts
let articlesContent = fs.readFileSync(ARTICLES_FILE, 'utf-8');

let replaced = 0;
// Match patterns like: slug: "xxx",\n    title: "yyy",\n    excerpt: "zzz",
const pattern = /slug: "([^"]+)",\n(\s+title: "[^"]+",\n\s+excerpt: ")([^"]+)(")/g;

articlesContent = articlesContent.replace(pattern, (match, slug, prefix, oldExcerpt, suffix) => {
  const mdxExcerpt = excerptMap.get(slug);
  if (mdxExcerpt && mdxExcerpt !== oldExcerpt) {
    replaced++;
    return `slug: "${slug}",\n${prefix}${mdxExcerpt.replace(/"/g, '\\"')}${suffix}`;
  }
  return match;
});

fs.writeFileSync(ARTICLES_FILE, articlesContent, 'utf-8');
console.log(`Updated ${replaced} excerpts in articles.ts`);
