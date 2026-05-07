#!/usr/bin/env node
/**
 * Prebuild script: reads MDX files and generates src/data/articles.ts
 * with article metadata (no content body) for client-side usage.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateAllArticles } from './validate-articles.mjs';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'articles.ts');

function getAllMdxFiles() {
  const files = [];
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const mdxFiles = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    for (const file of mdxFiles) {
      files.push(path.join(catDir, file));
    }
  }
  return files;
}

function parseArticle(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);
  return data;
}

function computeRelatedIds(target, allArticles, max = 6) {
  const targetCategories = new Set(target.categories || []);
  const targetTags = new Set(target.tags || []);

  const scored = [];
  for (const a of allArticles) {
    if (a.id === target.id) continue;
    let score = 0;
    if (a.stage === target.stage) score += 2;
    const sharedCats = (a.categories || []).filter((c) => targetCategories.has(c)).length;
    score += sharedCats * 3;
    const sharedTags = (a.tags || []).filter((t) => targetTags.has(t)).length;
    score += sharedTags * 1;
    if (score > 0) scored.push({ id: a.id, score, total: a.score?.total ?? 0 });
  }
  scored.sort((x, y) => y.score - x.score || y.total - x.total);
  return scored.slice(0, max).map((s) => s.id);
}

function generateOutput(articles) {
  const sortedArticles = articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Build slug-to-id map for resolving relatedSlugs
  const slugToId = new Map(sortedArticles.map((a) => [a.slug, a.id]));

  const articleEntries = sortedArticles.map((a) => {
    const explicitIds = (a.relatedSlugs || [])
      .map((s) => slugToId.get(s) || s)
      .filter((id) => sortedArticles.some((art) => art.id === id || art.slug === id));

    let relatedIds = explicitIds;
    if (relatedIds.length < 6) {
      const seen = new Set([a.id, ...relatedIds]);
      const auto = computeRelatedIds(a, sortedArticles, 6 - relatedIds.length + 3)
        .filter((id) => !seen.has(id))
        .slice(0, 6 - relatedIds.length);
      relatedIds = [...relatedIds, ...auto];
    }

    return `  {
    id: ${JSON.stringify(a.id)},
    slug: ${JSON.stringify(a.slug)},
    title: ${JSON.stringify(a.title)},
    excerpt: ${JSON.stringify(a.excerpt)},
    content: '',
    stage: ${JSON.stringify(a.stage)},
    categories: ${JSON.stringify(a.categories)},
    source: {
      name: ${JSON.stringify(a.sourceName)},
      references: ${JSON.stringify(a.references || [], null, 6).replace(/\n/g, '\n    ')},
      perspectives: ${JSON.stringify(a.perspectives || null, null, 6).replace(/\n/g, '\n    ')},
    },
    score: ${JSON.stringify(a.score || { reliability: 20, neutrality: 18, freshness: 15, ageRelevance: 12, readability: 8, total: 73 })},
    publishedAt: ${JSON.stringify(a.publishedAt)},
    updatedAt: ${JSON.stringify(a.updatedAt || a.publishedAt)},
    imageUrl: ${JSON.stringify(`/articles/${a.slug}.jpg`)},
    readingTime: ${a.readingTime},
    tags: ${JSON.stringify(a.tags || [])},
    relatedArticleIds: ${JSON.stringify(relatedIds)},
  }`;
  });

  return `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from content/articles/**/*.mdx by scripts/generate-articles.mjs
// Run: npm run prebuild
//
// NOTE: content is intentionally empty here to keep the client-side bundle small.
// Article detail pages render the full body via src/lib/articles.ts, which reads
// MDX directly on the server. This file is for client-side search/autocomplete only.

import { Article } from '@/types';

export const ARTICLES: Article[] = [
${articleEntries.join(',\n')}
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByStage(stage: string): Article[] {
  return ARTICLES.filter((a) => a.stage === stage);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.categories.includes(category as never));
}

export function getFeaturedArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)).slice(0, 6);
}

export function getLatestArticles(count: number = 10): Article[] {
  return ARTICLES.slice(0, count);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
`;
}

// Main
const files = getAllMdxFiles();
console.log(`Found ${files.length} MDX files`);

// prebuild時バリデーション: 論理矛盾チェック
console.log('🔍 記事バリデーション実行中...');
const { results: valResults, totalErrors, totalWarnings } = validateAllArticles();

if (totalErrors > 0) {
  for (const { relPath, errors } of valResults) {
    if (errors.length > 0) {
      console.log(`  📄 ${relPath}`);
      for (const err of errors) {
        console.log(`    ❌ ${err}`);
      }
    }
  }
  console.error(`\n🚨 ${totalErrors}件のエラーがあります。ビルド前に修正してください。`);
  process.exit(1);
}
if (totalWarnings > 0) {
  console.log(`  ⚠️  ${totalWarnings}件の警告があります（ビルドは続行）`);
}
console.log(`  ✅ ${files.length}件チェック完了 - エラーなし`);

const articles = files.map(parseArticle);
const output = generateOutput(articles);

fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
console.log(`Generated ${OUTPUT_FILE} with ${articles.length} articles`);
