import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Article, ArticleMeta, ArticleReference, ContentCategory, AgeStage } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

interface ArticleFrontmatter {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  stage: AgeStage;
  categories: ContentCategory[];
  sourceName: string;
  references: ArticleReference[];
  perspectives: {
    positive: string;
    neutral: string;
    cautious: string;
  };
  score: {
    total: number;
    reliability: number;
    neutrality: number;
    freshness: number;
    ageRelevance: number;
    readability: number;
  };
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  tags: string[];
  relatedSlugs: string[];
}

// Cache for all articles (populated once at build time)
let articlesCache: Article[] | null = null;

function getAllMdxFiles(): string[] {
  const files: string[] = [];
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

async function processMarkdown(content: string): Promise<string> {
  const result = await remark().use(html, { sanitize: false }).process(content);
  return result.toString();
}

function parseArticle(filePath: string): ArticleMeta & { rawContent: string } {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const fm = data as ArticleFrontmatter;

  return {
    id: fm.id,
    slug: fm.slug,
    title: fm.title,
    excerpt: fm.excerpt,
    rawContent: content,
    stage: fm.stage,
    categories: fm.categories,
    source: {
      name: fm.sourceName,
      references: fm.references || [],
      perspectives: fm.perspectives,
    },
    score: fm.score,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt || fm.publishedAt,
    imageUrl: `/articles/${fm.slug}.jpg`,
    readingTime: fm.readingTime,
    tags: fm.tags || [],
    relatedArticleIds: fm.relatedSlugs || [],
  };
}

export function getAllArticlesSync(): Article[] {
  if (articlesCache) return articlesCache;

  const files = getAllMdxFiles();
  const articles = files.map((file) => {
    const parsed = parseArticle(file);
    return {
      ...parsed,
      content: parsed.rawContent, // raw markdown stored, rendered at page level
    } as Article;
  });

  // Resolve relatedSlugs to relatedArticleIds
  const slugToId = new Map(articles.map((a) => [a.slug, a.id]));
  for (const article of articles) {
    article.relatedArticleIds = article.relatedArticleIds
      .map((slugOrId) => slugToId.get(slugOrId) || slugOrId)
      .filter((id) => articles.some((a) => a.id === id || a.slug === id));
  }

  // Sort by publishedAt desc
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  articlesCache = articles;
  return articles;
}

export async function getArticleContentHtml(rawContent: string): Promise<string> {
  return processMarkdown(rawContent);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticlesSync().find((a) => a.slug === slug);
}

export function getArticlesByStage(stage: string): Article[] {
  return getAllArticlesSync().filter((a) => a.stage === stage);
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticlesSync().filter((a) => a.categories.includes(category as ContentCategory));
}

export function getFeaturedArticles(): Article[] {
  return [...getAllArticlesSync()].sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)).slice(0, 6);
}

export function getLatestArticles(count: number = 10): Article[] {
  return getAllArticlesSync().slice(0, count);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return getAllArticlesSync().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

// Strip content for client-side usage (keeps bundle small)
export function getAllArticlesMeta(): ArticleMeta[] {
  return getAllArticlesSync().map(({ content, ...meta }) => meta);
}

export function getAllSlugs(): string[] {
  return getAllArticlesSync().map((a) => a.slug);
}

export function getArticleCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of getAllArticlesSync()) {
    for (const cat of a.categories) {
      counts[cat] = (counts[cat] || 0) + 1;
    }
  }
  return counts;
}

export function getArticleCountByStage(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of getAllArticlesSync()) {
    counts[a.stage] = (counts[a.stage] || 0) + 1;
  }
  return counts;
}
