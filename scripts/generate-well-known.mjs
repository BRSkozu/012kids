/**
 * Generate .well-known/ and api/ JSON endpoints for AI/MCP access
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
  '0stage': { label: '0 Stage', ageRange: '0〜2歳', description: '授乳・離乳食・発達発育・睡眠・保育に関する情報' },
  'pre': { label: 'Pre Stage', ageRange: '3〜5歳', description: '幼児教育・遊び・ことば・しつけ・幼稚園に関する情報' },
  'early': { label: 'Early Stage', ageRange: '6〜8歳', description: '小学校入学・読み書き・算数・生活習慣に関する情報' },
  'mid': { label: 'Mid Stage', ageRange: '9〜10歳', description: '理科・社会・英語・習い事・友達関係に関する情報' },
  'upper': { label: 'Upper Stage', ageRange: '11〜12歳', description: '受験・自主学習・メンタル・デジタルリテラシーに関する情報' },
};

const CATEGORY_INFO = {
  development: { label: '発達・成長', icon: '🌱', description: '運動発達、認知発達、言語発達、社会性発達、発達障害・グレーゾーン' },
  nutrition: { label: '食育・栄養', icon: '🍎', description: '離乳食、アレルギー対応、好き嫌い克服、学童期の食事、給食' },
  education: { label: '教育・学習', icon: '📚', description: '早期教育、公教育、家庭学習法、習い事選び、受験情報' },
  health: { label: '健康・医療', icon: '🏥', description: '予防接種、かかりやすい病気、歯科・眼科情報、応急処置' },
  mental: { label: 'メンタル・心理', icon: '💚', description: '不登校・いじめ対応、自己肯定感、親の関わり方、メンタルケア' },
  digital: { label: 'デジタル・メディア', icon: '💻', description: 'スクリーンタイム管理、安全なアプリ、プログラミング教育、SNSリテラシー' },
  social: { label: '社会・環境', icon: '🌍', description: 'SDGs教育、多様性・インクルーシブ教育、地域資源の活用' },
  lifestyle: { label: '暮らし・家計', icon: '🏠', description: '教育費、共働き、時短術、引越し、家族のライフスタイル' },
  pregnancy: { label: '妊娠・出産', icon: '🤱', description: '妊娠経過、出産準備、産後ケア、不妊治療、マタニティライフ' },
};

function getArticles() {
  const articles = [];
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(catDir, file), 'utf-8');
      const slug = raw.match(/slug:\s*['"]?([^\s'"]+)/)?.[1] || file.replace('.mdx', '');
      const title = raw.match(/title:\s*['"](.+?)['"]/)?.[1] || slug;
      const excerpt = raw.match(/excerpt:\s*['"](.+?)['"]/)?.[1] || '';
      const stage = raw.match(/stage:\s*['"]?([^\s'"]+)/)?.[1] || '';
      const publishedAt = raw.match(/publishedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] || '';
      const updatedAt = raw.match(/updatedAt:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] || publishedAt;
      const readingTime = parseInt(raw.match(/readingTime:\s*(\d+)/)?.[1] || '5', 10);
      const tagsSection = raw.match(/tags:\s*\n((?:\s+-\s*"[^"]+"\n?)+)/);
      const tags = tagsSection
        ? tagsSection[1].match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, '')) || []
        : [];
      const catMatch = raw.match(/categories:\s*\n((?:\s+-\s*\w+\n?)+)/);
      const articleCategories = catMatch
        ? catMatch[1].match(/- (\w+)/g)?.map((t) => t.replace('- ', '')) || []
        : [];
      const scoreMatch = raw.match(/score:\s*\n\s+total:\s*(\d+)/);
      const totalScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

      articles.push({
        slug, title, excerpt, stage, publishedAt, updatedAt,
        readingTime, tags, categories: articleCategories, totalScore,
      });
    }
  }
  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return articles;
}

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- Generate all endpoints ---

const articles = getArticles();
const now = new Date().toISOString();

// 1. .well-known/ai-plugin.json — AI plugin discovery manifest
const aiPlugin = {
  schema_version: 'v1',
  name: '012.kids',
  description: '0歳から12歳の子どもに関わるすべての方に向けた子育て・教育情報サイト。公的機関や専門家の発信する情報をわかりやすくまとめています。',
  url: SITE_URL,
  logo_url: `${SITE_URL}/icon-512.png`,
  contact_email: 'info@012.kids',
  legal_info_url: `${SITE_URL}/terms`,
  api: {
    type: 'static_json',
    endpoints: {
      site_info: `${SITE_URL}/api/v1/site-info.json`,
      articles: `${SITE_URL}/api/v1/articles.json`,
      categories: `${SITE_URL}/api/v1/categories.json`,
      stages: `${SITE_URL}/api/v1/stages.json`,
      tags: `${SITE_URL}/api/v1/tags.json`,
    },
  },
  ai_content: {
    llms_txt: `${SITE_URL}/llms.txt`,
    llms_full_txt: `${SITE_URL}/llms-full.txt`,
    rss_feed: `${SITE_URL}/feed.xml`,
    sitemap: `${SITE_URL}/sitemap.xml`,
  },
  capabilities: {
    content_types: ['articles', 'guides', 'references'],
    languages: ['ja'],
    topics: ['子育て', '教育', '発達', '健康', '栄養', 'メンタルヘルス'],
    age_range: { min: 0, max: 12, unit: 'years' },
  },
  updated_at: now,
};
writeJson(path.join(PUBLIC, '.well-known', 'ai-plugin.json'), aiPlugin);

// 2. api/v1/site-info.json — Site metadata
const siteInfo = {
  name: '012.kids',
  url: SITE_URL,
  description: '0歳から12歳の子どもに関わるすべての方に向けた子育て・教育情報サイト',
  language: 'ja',
  total_articles: articles.length,
  categories: Object.keys(CATEGORY_INFO).length,
  age_stages: Object.keys(STAGE_LABELS).length,
  editorial_policy: `${SITE_URL}/editorial-policy`,
  about: `${SITE_URL}/about`,
  updated_at: now,
  endpoints: {
    articles: `${SITE_URL}/api/v1/articles.json`,
    categories: `${SITE_URL}/api/v1/categories.json`,
    stages: `${SITE_URL}/api/v1/stages.json`,
    tags: `${SITE_URL}/api/v1/tags.json`,
    llms_txt: `${SITE_URL}/llms.txt`,
    llms_full_txt: `${SITE_URL}/llms-full.txt`,
    rss: `${SITE_URL}/feed.xml`,
    sitemap: `${SITE_URL}/sitemap.xml`,
  },
};
writeJson(path.join(PUBLIC, 'api', 'v1', 'site-info.json'), siteInfo);

// 3. api/v1/articles.json — Compact article index
const articlesIndex = {
  total: articles.length,
  updated_at: now,
  articles: articles.map((a) => ({
    slug: a.slug,
    url: `${SITE_URL}/articles/${a.slug}`,
    title: a.title,
    excerpt: a.excerpt,
    stage: a.stage,
    stage_label: STAGE_LABELS[a.stage]?.ageRange || a.stage,
    categories: a.categories,
    tags: a.tags,
    published_at: a.publishedAt,
    updated_at: a.updatedAt,
    reading_time_minutes: a.readingTime,
    quality_score: a.totalScore,
  })),
};
writeJson(path.join(PUBLIC, 'api', 'v1', 'articles.json'), articlesIndex);

// 4. api/v1/categories.json — Category reference with counts
const categoryCounts = {};
for (const a of articles) {
  for (const c of a.categories) {
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  }
}
const categoriesData = {
  total: Object.keys(CATEGORY_INFO).length,
  updated_at: now,
  categories: Object.entries(CATEGORY_INFO).map(([id, info]) => ({
    id,
    label: info.label,
    icon: info.icon,
    description: info.description,
    article_count: categoryCounts[id] || 0,
    url: `${SITE_URL}/category/${id}`,
  })),
};
writeJson(path.join(PUBLIC, 'api', 'v1', 'categories.json'), categoriesData);

// 5. api/v1/stages.json — Age stage reference with counts
const stageCounts = {};
for (const a of articles) {
  stageCounts[a.stage] = (stageCounts[a.stage] || 0) + 1;
}
const stagesData = {
  total: Object.keys(STAGE_LABELS).length,
  updated_at: now,
  stages: Object.entries(STAGE_LABELS).map(([id, info]) => ({
    id,
    label: info.label,
    age_range: info.ageRange,
    description: info.description,
    article_count: stageCounts[id] || 0,
    url: `${SITE_URL}/age-guide/${id}`,
  })),
};
writeJson(path.join(PUBLIC, 'api', 'v1', 'stages.json'), stagesData);

// 6. api/v1/tags.json — Tags with counts (2+ articles)
const tagCounts = {};
for (const a of articles) {
  for (const t of a.tags) {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  }
}
const tagsData = {
  total_unique: Object.keys(tagCounts).length,
  updated_at: now,
  tags: Object.entries(tagCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      count,
      url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
    })),
};
writeJson(path.join(PUBLIC, 'api', 'v1', 'tags.json'), tagsData);

// Summary
console.log(`Generated .well-known/ai-plugin.json`);
console.log(`Generated api/v1/site-info.json`);
console.log(`Generated api/v1/articles.json (${articles.length} articles)`);
console.log(`Generated api/v1/categories.json (${Object.keys(CATEGORY_INFO).length} categories)`);
console.log(`Generated api/v1/stages.json (${Object.keys(STAGE_LABELS).length} stages)`);
console.log(`Generated api/v1/tags.json (${tagsData.tags.length} tags with 2+ articles)`);
