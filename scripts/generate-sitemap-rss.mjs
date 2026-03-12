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
      const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);
      const tags = tagsMatch
        ? tagsMatch[1].match(/['"]([^'"]+)['"]/g)?.map((t) => t.replace(/['"]/g, '')) || []
        : [];
      articles.push({ slug, title, excerpt, publishedAt, updatedAt, tags });
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
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/articles', priority: '0.9', changefreq: 'daily' },
    { loc: '/search', priority: '0.7', changefreq: 'weekly' },
    // Age guide pages
    { loc: '/age-guide/0stage', priority: '0.8', changefreq: 'weekly' },
    { loc: '/age-guide/pre', priority: '0.8', changefreq: 'weekly' },
    { loc: '/age-guide/early', priority: '0.8', changefreq: 'weekly' },
    { loc: '/age-guide/mid', priority: '0.8', changefreq: 'weekly' },
    { loc: '/age-guide/upper', priority: '0.8', changefreq: 'weekly' },
    // Category pages
    { loc: '/category/development', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/nutrition', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/education', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/health', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/mental', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/digital', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/social', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/lifestyle', priority: '0.8', changefreq: 'weekly' },
    { loc: '/category/pregnancy', priority: '0.8', changefreq: 'weekly' },
    // Info pages
    { loc: '/experts', priority: '0.6', changefreq: 'monthly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/editorial-policy', priority: '0.5', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.3', changefreq: 'monthly' },
  ];

  const urls = staticPages.map(
    (p) =>
      `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
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

const articles = getArticles();
const tagCount = getTagsWithCounts(articles).length;
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), generateSitemap(articles));
console.log(`Generated sitemap.xml (${articles.length} articles + ${tagCount} tags + static pages)`);

fs.writeFileSync(path.join(PUBLIC, 'feed.xml'), generateRss(articles));
console.log(`Generated feed.xml (${Math.min(articles.length, 30)} items)`);
