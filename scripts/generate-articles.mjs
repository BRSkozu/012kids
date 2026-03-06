#!/usr/bin/env node
/**
 * Prebuild script: reads MDX files and generates src/data/articles.ts
 * with article metadata (no content body) for client-side usage.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

function generateOutput(articles) {
  const sortedArticles = articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Build slug-to-id map for resolving relatedSlugs
  const slugToId = new Map(sortedArticles.map((a) => [a.slug, a.id]));

  const articleEntries = sortedArticles.map((a) => {
    const relatedIds = (a.relatedSlugs || [])
      .map((s) => slugToId.get(s) || s)
      .filter((id) => sortedArticles.some((art) => art.id === id || art.slug === id));

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
    score: ${JSON.stringify(a.score)},
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
  return [...ARTICLES].sort((a, b) => b.score.total - a.score.total).slice(0, 6);
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

const articles = files.map(parseArticle);
const output = generateOutput(articles);

fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
console.log(`Generated ${OUTPUT_FILE} with ${articles.length} articles`);
