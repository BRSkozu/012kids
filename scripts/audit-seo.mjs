#!/usr/bin/env node
/**
 * SEO Audit for 012.kids
 *
 * 実データ（GSC/GA4）なしでできる技術SEO監査:
 *   1. メタデータ網羅性（title/description/canonical）
 *   2. 構造化データ（JSON-LD）の使用状況
 *   3. 孤立記事（他記事から内部リンクされていない）の検出
 *   4. relatedSlugs の充実度
 *   5. 内部リンク密度（記事ごとの被リンク数）
 *   6. sitemap.xml と実コンテンツのカバレッジ照合
 *
 * Usage:
 *   node scripts/audit-seo.mjs            # 監査レポートを表示
 *   node scripts/audit-seo.mjs --json     # JSON 出力
 *   node scripts/audit-seo.mjs --strict   # 重大な指摘があれば exit 1
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const APP_DIR = path.join(ROOT, 'src', 'app');
const PUBLIC_DIR = path.join(ROOT, 'public');

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const STRICT = args.includes('--strict');

// ---------------------------------------------------------------------------
// Collect articles
// ---------------------------------------------------------------------------
function getAllArticles() {
  const articles = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter((d) =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory(),
  );
  for (const cat of categories) {
    const dir = path.join(CONTENT_DIR, cat);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    for (const f of files) {
      const fp = path.join(dir, f);
      const raw = fs.readFileSync(fp, 'utf8');
      const { data, content } = matter(raw);
      articles.push({
        category: cat,
        file: f,
        path: fp,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        relatedSlugs: data.relatedSlugs ?? [],
        tags: data.tags ?? [],
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        body: content,
      });
    }
  }
  return articles;
}

// ---------------------------------------------------------------------------
// 1. Find orphan articles
// ---------------------------------------------------------------------------
function findOrphans(articles) {
  const incoming = new Map();
  for (const a of articles) {
    incoming.set(a.slug, 0);
  }
  for (const a of articles) {
    for (const slug of a.relatedSlugs) {
      if (incoming.has(slug)) {
        incoming.set(slug, (incoming.get(slug) ?? 0) + 1);
      }
    }
    // Also count markdown body links of form /articles/<slug>
    const matches = a.body.matchAll(/\/articles\/([a-z0-9-]+)/g);
    for (const m of matches) {
      if (incoming.has(m[1])) {
        incoming.set(m[1], (incoming.get(m[1]) ?? 0) + 1);
      }
    }
  }
  const orphans = [...incoming.entries()]
    .filter(([_, count]) => count === 0)
    .map(([slug]) => slug)
    .sort();
  return { orphans, incoming };
}

// ---------------------------------------------------------------------------
// 2. relatedSlugs density
// ---------------------------------------------------------------------------
function checkRelatedSlugs(articles) {
  const empty = articles.filter((a) => a.relatedSlugs.length === 0);
  const lowCount = articles.filter((a) => a.relatedSlugs.length === 1);
  const goodCount = articles.filter((a) => a.relatedSlugs.length >= 2);
  return {
    empty: empty.map((a) => a.slug),
    lowCount: lowCount.map((a) => a.slug),
    goodCountPercent:
      articles.length === 0 ? 0 : Math.round((goodCount.length / articles.length) * 100),
  };
}

// ---------------------------------------------------------------------------
// 3. Check page metadata coverage
// ---------------------------------------------------------------------------
function findPageFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findPageFiles(full, results);
    } else if (e.name === 'page.tsx' || e.name === 'layout.tsx') {
      results.push(full);
    }
  }
  return results;
}

function checkMetadataCoverage() {
  const allFiles = findPageFiles(APP_DIR);
  const pageFiles = allFiles.filter((f) => f.endsWith('page.tsx'));
  const layoutFiles = allFiles.filter((f) => f.endsWith('layout.tsx'));

  // Pre-compute layout metadata coverage (for ancestor lookups).
  const layoutMetaMap = new Map();
  for (const file of layoutFiles) {
    const content = fs.readFileSync(file, 'utf8');
    layoutMetaMap.set(file, {
      hasMetadata:
        /export const metadata/.test(content) ||
        /export async function generateMetadata/.test(content),
      hasCanonical:
        /alternates:\s*\{[^}]*canonical/.test(content) || /canonical:/.test(content),
      hasOpenGraph: /openGraph:/.test(content),
    });
  }

  function ancestorLayoutsHave(file, key) {
    let dir = path.dirname(file);
    while (dir.startsWith(APP_DIR)) {
      const layout = path.join(dir, 'layout.tsx');
      if (layoutMetaMap.has(layout) && layoutMetaMap.get(layout)[key]) return true;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    return false;
  }

  const issues = [];
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);

    // Skip redirect-only pages (no metadata needed)
    if (/^\s*import\s+\{\s*redirect\s*\}/m.test(content) && /redirect\(/.test(content) && content.length < 600) {
      continue;
    }
    // Skip the root layout area (handled separately)
    if (rel === 'src/app/page.tsx') {
      // home page may rely on root layout metadata — fine
      continue;
    }

    const selfHasMetadata =
      /export const metadata/.test(content) ||
      /export async function generateMetadata/.test(content);
    const selfCanonical =
      /alternates:\s*\{[^}]*canonical/.test(content) || /canonical:/.test(content);
    const selfOpenGraph = /openGraph:/.test(content);
    // noindex pages don't need OG
    const isNoindex = /index:\s*false/.test(content);

    const hasMetadata = selfHasMetadata || ancestorLayoutsHave(file, 'hasMetadata');
    const hasCanonical = selfCanonical || ancestorLayoutsHave(file, 'hasCanonical');
    const hasOpenGraph = selfOpenGraph || ancestorLayoutsHave(file, 'hasOpenGraph');

    const fileIssues = [];
    if (!hasMetadata) fileIssues.push('no metadata');
    if (hasMetadata && !hasCanonical) fileIssues.push('missing canonical');
    if (hasMetadata && !hasOpenGraph && !isNoindex) fileIssues.push('missing openGraph');

    if (fileIssues.length > 0) {
      issues.push({ file: rel, issues: fileIssues });
    }
  }
  return { pageCount: pageFiles.length, issues };
}

// ---------------------------------------------------------------------------
// 4. Check JSON-LD usage
// ---------------------------------------------------------------------------
function checkStructuredData() {
  const pages = findPageFiles(APP_DIR);
  const withLd = [];
  const withoutLd = [];
  for (const file of pages) {
    if (file.endsWith('layout.tsx')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    if (/application\/ld\+json/.test(content) || /generateBreadcrumbLd|generateArticleLd/.test(content)) {
      withLd.push(rel);
    } else {
      withoutLd.push(rel);
    }
  }
  return { withLd, withoutLd };
}

// ---------------------------------------------------------------------------
// 5. Sitemap coverage check
// ---------------------------------------------------------------------------
function checkSitemap(articles) {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    return { exists: false, missingArticleSlugs: [] };
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const missing = [];
  for (const a of articles) {
    if (!xml.includes(`/articles/${a.slug}`)) {
      missing.push(a.slug);
    }
  }
  return { exists: true, missingArticleSlugs: missing, totalLocs: (xml.match(/<loc>/g) || []).length };
}

// ---------------------------------------------------------------------------
// Run audit
// ---------------------------------------------------------------------------
function run() {
  const articles = getAllArticles();
  const { orphans, incoming } = findOrphans(articles);
  const relSlugs = checkRelatedSlugs(articles);
  const meta = checkMetadataCoverage();
  const ld = checkStructuredData();
  const sitemap = checkSitemap(articles);

  // Top 5 most-linked articles (good cluster anchors)
  const topLinked = [...incoming.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, incoming: count }));

  const report = {
    summary: {
      articles: articles.length,
      orphans: orphans.length,
      pages: meta.pageCount,
      pagesWithMetadataIssues: meta.issues.length,
      pagesWithLd: ld.withLd.length,
      pagesWithoutLd: ld.withoutLd.length,
    },
    articles: {
      total: articles.length,
      orphans,
      relatedSlugsCoverage: relSlugs.goodCountPercent,
      relatedSlugsEmpty: relSlugs.empty,
      relatedSlugsLow: relSlugs.lowCount,
      topLinked,
    },
    pages: {
      metadataIssues: meta.issues,
      withoutLd: ld.withoutLd,
    },
    sitemap,
  };

  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }

  // Strict exit codes
  if (STRICT) {
    const fatal =
      meta.issues.some((x) => x.issues.includes('no metadata')) ||
      (sitemap.exists && sitemap.missingArticleSlugs.length > 0);
    if (fatal) {
      console.error('\n❌ SEO 監査で重大な指摘があります');
      process.exit(1);
    }
  }
}

function printReport(r) {
  const line = '─'.repeat(60);
  console.log('\n📊 012.kids SEO 監査レポート');
  console.log(line);
  console.log(`記事数: ${r.summary.articles}`);
  console.log(`ページ数（page.tsx等）: ${r.summary.pages}`);
  console.log(`孤立記事（被リンクなし）: ${r.summary.orphans}`);
  console.log(`relatedSlugs 2件以上: ${r.articles.relatedSlugsCoverage}%`);
  console.log(`メタデータ指摘あり: ${r.summary.pagesWithMetadataIssues}件`);
  console.log(`JSON-LD あり: ${r.summary.pagesWithLd} / なし: ${r.summary.pagesWithoutLd}`);

  if (r.sitemap.exists) {
    console.log(`sitemap.xml: ${r.sitemap.totalLocs} URL 登録`);
    if (r.sitemap.missingArticleSlugs.length > 0) {
      console.log(`  ⚠️  未登録記事: ${r.sitemap.missingArticleSlugs.length}件`);
    }
  } else {
    console.log('sitemap.xml: 未生成（npm run build で生成）');
  }

  if (r.articles.topLinked.length > 0) {
    console.log('\n🔗 内部被リンクが多い記事 TOP5（クラスタの核）');
    for (const t of r.articles.topLinked) {
      console.log(`  ${t.incoming.toString().padStart(3)} 件 ← ${t.slug}`);
    }
  }

  if (r.articles.orphans.length > 0) {
    console.log(`\n⚠️  孤立記事（${r.articles.orphans.length}件、最初の20件）:`);
    for (const slug of r.articles.orphans.slice(0, 20)) {
      console.log(`  - ${slug}`);
    }
    if (r.articles.orphans.length > 20) {
      console.log(`  ... 他 ${r.articles.orphans.length - 20} 件`);
    }
  }

  if (r.articles.relatedSlugsEmpty.length > 0) {
    console.log(
      `\n⚠️  relatedSlugs が空の記事: ${r.articles.relatedSlugsEmpty.length}件（最初の10件）`,
    );
    for (const slug of r.articles.relatedSlugsEmpty.slice(0, 10)) {
      console.log(`  - ${slug}`);
    }
  }

  if (r.pages.metadataIssues.length > 0) {
    console.log('\n⚠️  ページのメタデータ指摘:');
    for (const item of r.pages.metadataIssues) {
      console.log(`  ${item.file}: ${item.issues.join(', ')}`);
    }
  }

  if (r.pages.withoutLd.length > 0 && r.pages.withoutLd.length <= 10) {
    console.log('\nℹ️  JSON-LD 未設定ページ:');
    for (const f of r.pages.withoutLd) {
      console.log(`  - ${f}`);
    }
  }

  console.log('\n✅ 監査完了\n');
}

run();
