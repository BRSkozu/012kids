/**
 * Generate sitemap.xml and feed.xml (RSS) from article data
 * Run as part of prebuild step
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');

const SITE_URL = 'https://012.kids';

const STAGE_LABELS = {
  '0stage': '0歳（新生児〜1歳未満）',
  'pre': '1〜3歳（未就学児前期）',
  'early': '3〜6歳（未就学児後期）',
  'mid': '6〜9歳（小学校低学年）',
  'upper': '9〜12歳（小学校高学年）',
};

const CATEGORY_LABELS = {
  development: '発達・成長',
  nutrition: '食事・栄養',
  education: '学び・教育',
  health: '健康・医療',
  mental: 'こころ・メンタル',
  digital: 'デジタル・メディア',
  social: '社会性・コミュニケーション',
  lifestyle: '生活・暮らし',
  pregnancy: '妊娠・出産',
};

// Collect all article slugs and dates from MDX frontmatter
function getArticles() {
  const articles = [];
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(catDir, file), 'utf-8');
      const slug = content.match(/slug:\s*['"]?([^\s'"]+)/)?.[1] || file.replace('.mdx', '');
      const title = content.match(/title:\s*['"](.+?)['"]/)?.[1] || slug;
      const excerpt = content.match(/excerpt:\s*['"](.+?)['"]/)?.[1] || '';
      const publishedAt = content.match(/publishedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] || '2026-01-01';
      const updatedAt = content.match(/updatedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] || publishedAt;
      const tagsSection = content.match(/tags:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/);
      const tags = tagsSection
        ? tagsSection[1].match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, '')) || []
        : [];
      const stage = content.match(/stage:\s*['"]?([^\s'"]+)/)?.[1] || '';
      const catMatches = content.match(/categories:\s*\n((?:\s+-\s+.+\n?)*)/);
      const articleCategories = catMatches
        ? catMatches[1].match(/- (\S+)/g)?.map((m) => m.replace('- ', '')) || []
        : [cat];
      articles.push({ slug, title, excerpt, publishedAt, updatedAt, tags, stage, categories: articleCategories });
    }
  }
  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return articles;
}

function getTagsWithCounts(articles) {
  const counts = {};
  for (const a of articles) {
    for (const t of a.tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSitemap(articles) {
  const today = new Date().toISOString().slice(0, 10);
  // Latest article updatedAt — used as lastmod for index pages that list articles
  const latestUpdate = articles
    .map((a) => a.updatedAt)
    .sort()
    .reverse()[0] || today;

  const latestByStage = {};
  const latestByCategory = {};
  const latestByTag = {};
  for (const a of articles) {
    if (a.stage) {
      const cur = latestByStage[a.stage];
      if (!cur || a.updatedAt > cur) latestByStage[a.stage] = a.updatedAt;
    }
    for (const c of a.categories || []) {
      const cur = latestByCategory[c];
      if (!cur || a.updatedAt > cur) latestByCategory[c] = a.updatedAt;
    }
    for (const t of a.tags || []) {
      const cur = latestByTag[t];
      if (!cur || a.updatedAt > cur) latestByTag[t] = a.updatedAt;
    }
  }

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: latestUpdate },
    { loc: '/articles', priority: '0.9', changefreq: 'daily', lastmod: latestUpdate },
    { loc: '/search', priority: '0.7', changefreq: 'weekly', lastmod: latestUpdate },
    // Index pages
    { loc: '/age-guide', priority: '0.8', changefreq: 'weekly', lastmod: latestUpdate },
    { loc: '/category', priority: '0.8', changefreq: 'weekly', lastmod: latestUpdate },
    { loc: '/tag', priority: '0.6', changefreq: 'weekly', lastmod: latestUpdate },
    // Age guide pages
    ...['0stage', 'pre', 'early', 'mid', 'upper'].map((s) => ({
      loc: `/age-guide/${s}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: latestByStage[s] || latestUpdate,
    })),
    // Category pages
    ...['development', 'nutrition', 'education', 'health', 'mental', 'digital', 'social', 'lifestyle', 'pregnancy'].map((c) => ({
      loc: `/category/${c}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: latestByCategory[c] || latestUpdate,
    })),
    // Info pages
    { loc: '/experts', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { loc: '/about', priority: '0.5', changefreq: 'monthly', lastmod: today },
    { loc: '/editorial-policy', priority: '0.5', changefreq: 'monthly', lastmod: today },
    { loc: '/contact', priority: '0.3', changefreq: 'monthly', lastmod: today },
  ];

  const urls = staticPages.map(
    (p) =>
      `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  for (const a of articles) {
    // Add news:news extension for articles published in the last 2 days
    const isRecent = (Date.now() - new Date(a.publishedAt).getTime()) < 2 * 24 * 60 * 60 * 1000;
    const newsExt = isRecent
      ? `
    <news:news>
      <news:publication>
        <news:name>012.kids</news:name>
        <news:language>ja</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>`
      : '';
    urls.push(`  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
    <lastmod>${a.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${newsExt}
  </url>`);
  }

  // Tag pages (2+ articles)
  const tags = getTagsWithCounts(articles);
  for (const tag of tags) {
    urls.push(`  <url>
    <loc>${SITE_URL}/tag/${encodeURIComponent(tag)}</loc>
    <lastmod>${latestByTag[tag] || latestUpdate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>
`;
}

function generateRss(articles) {
  const items = articles.slice(0, 30).map(
    (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/articles/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${a.slug}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    </item>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>012.kids - 子育て・教育情報まとめ</title>
    <link>${SITE_URL}</link>
    <description>0歳から12歳の子どもに関わるすべての方に向けて、子育て・教育情報をまとめて紹介するサイト</description>
    <language>ja</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;
}

function generateLlmsFull(articles) {
  const lines = [
    '# 012.kids - 全記事一覧',
    '',
    `> このファイルはAI検索エンジン向けに全記事の要約を提供するものです。最終更新: ${new Date().toISOString().split('T')[0]}`,
    '',
    `全${articles.length}記事`,
    '',
  ];

  for (const a of articles) {
    const stageLabel = STAGE_LABELS[a.stage] || a.stage;
    const catLabels = a.categories.map((c) => CATEGORY_LABELS[c] || c).join('、');
    lines.push(`## ${a.title}`);
    lines.push('');
    lines.push(`- URL: ${SITE_URL}/articles/${a.slug}`);
    lines.push(`- 対象年齢: ${stageLabel}`);
    lines.push(`- カテゴリ: ${catLabels}`);
    lines.push(`- 公開日: ${a.publishedAt} / 更新日: ${a.updatedAt}`);
    lines.push(`- 概要: ${a.excerpt}`);
    lines.push('');
  }

  return lines.join('\n');
}

const articles = getArticles();
const tagCount = getTagsWithCounts(articles).length;
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), generateSitemap(articles));
console.log(`Generated sitemap.xml (${articles.length} articles + ${tagCount} tags + static pages)`);

fs.writeFileSync(path.join(PUBLIC, 'feed.xml'), generateRss(articles));
console.log(`Generated feed.xml (${Math.min(articles.length, 30)} items)`);

fs.writeFileSync(path.join(PUBLIC, 'llms-full.txt'), generateLlmsFull(articles));
console.log(`Generated llms-full.txt (${articles.length} articles)`);
