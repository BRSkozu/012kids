/**
 * Generate llms.txt and llms-full.txt for AI crawlers
 * Following the llms.txt standard: https://llmstxt.org/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');

const SITE_URL = 'https://012.kids';

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
      const tagsMatch = raw.match(/tags:\s*\[([^\]]+)\]/);
      const tags = tagsMatch
        ? tagsMatch[1].match(/['"]([^'"]+)['"]/g)?.map((t) => t.replace(/['"]/g, '')) || []
        : [];
      const catMatch = raw.match(/categories:\s*\[([^\]]+)\]/);
      const articleCategories = catMatch
        ? catMatch[1].match(/['"]([^'"]+)['"]/g)?.map((t) => t.replace(/['"]/g, '')) || []
        : [];

      // Extract markdown content (after frontmatter)
      const contentMatch = raw.match(/---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)/);
      const content = contentMatch ? contentMatch[2].trim() : '';

      articles.push({ slug, title, excerpt, stage, tags, categories: articleCategories, publishedAt, content });
    }
  }
  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return articles;
}

const STAGE_LABELS = {
  '0stage': '0〜2歳（乳児期）',
  'pre': '3〜5歳（幼児期）',
  'early': '6〜8歳（低学年）',
  'mid': '9〜10歳（中学年）',
  'upper': '11〜12歳（高学年）',
};

const CATEGORY_LABELS = {
  development: '発達・成長',
  nutrition: '食育・栄養',
  education: '教育・学習',
  health: '健康・医療',
  mental: 'メンタル・心理',
  digital: 'デジタル・メディア',
  social: '社会・環境',
  lifestyle: '暮らし・家計',
  pregnancy: '妊娠・出産',
};

function generateLlmsTxt(articles) {
  const lines = [];
  lines.push('# 012.kids');
  lines.push('');
  lines.push('> 0歳から12歳の子どもに関わるすべての方に向けて、公的機関や専門家の発信する子育て・教育情報をわかりやすくまとめて紹介するサイトです。');
  lines.push('');
  lines.push('## サイト概要');
  lines.push('');
  lines.push('012.kidsは、子育て・教育に関する公的機関や専門家の情報を中立的な立場でまとめた情報サイトです。');
  lines.push(`現在${articles.length}記事を掲載しています。`);
  lines.push('');
  lines.push('## 対象年齢');
  lines.push('');
  for (const [id, label] of Object.entries(STAGE_LABELS)) {
    const count = articles.filter((a) => a.stage === id).length;
    lines.push(`- [${label}](${SITE_URL}/age-guide/${id}): ${count}記事`);
  }
  lines.push('');
  lines.push('## カテゴリ');
  lines.push('');
  for (const [id, label] of Object.entries(CATEGORY_LABELS)) {
    const count = articles.filter((a) => a.categories.includes(id)).length;
    lines.push(`- [${label}](${SITE_URL}/category/${id}): ${count}記事`);
  }
  lines.push('');
  lines.push('## 主要ページ');
  lines.push('');
  lines.push(`- [トップページ](${SITE_URL}/)`);
  lines.push(`- [記事一覧](${SITE_URL}/articles)`);
  lines.push(`- [記事検索](${SITE_URL}/search)`);
  lines.push(`- [編集方針](${SITE_URL}/editorial-policy)`);
  lines.push(`- [サイトについて](${SITE_URL}/about)`);
  lines.push(`- [専門機関リンク集](${SITE_URL}/experts)`);
  lines.push('');
  lines.push('## 記事一覧');
  lines.push('');
  for (const a of articles) {
    const stageLabel = STAGE_LABELS[a.stage] || a.stage;
    lines.push(`- [${a.title}](${SITE_URL}/articles/${a.slug}): ${a.excerpt.slice(0, 80)}...  (${stageLabel})`);
  }
  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push(`- [サイトマップ](${SITE_URL}/sitemap.xml)`);
  lines.push(`- [RSSフィード](${SITE_URL}/feed.xml)`);
  lines.push(`- [詳細版 (llms-full.txt)](${SITE_URL}/llms-full.txt)`);
  lines.push('');
  return lines.join('\n');
}

function generateLlmsFullTxt(articles) {
  const lines = [];
  lines.push('# 012.kids - 全記事詳細データ');
  lines.push('');
  lines.push('> このファイルは AI / LLM が012.kidsの全コンテンツを効率的に読み取るための詳細版です。');
  lines.push('');
  lines.push(`総記事数: ${articles.length}`);
  lines.push(`最終更新: ${new Date().toISOString().split('T')[0]}`);
  lines.push(`サイトURL: ${SITE_URL}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const a of articles) {
    const stageLabel = STAGE_LABELS[a.stage] || a.stage;
    const catLabels = a.categories.map((c) => CATEGORY_LABELS[c] || c).join(', ');
    lines.push(`## ${a.title}`);
    lines.push('');
    lines.push(`URL: ${SITE_URL}/articles/${a.slug}`);
    lines.push(`対象年齢: ${stageLabel}`);
    lines.push(`カテゴリ: ${catLabels}`);
    lines.push(`タグ: ${a.tags.join(', ')}`);
    lines.push(`公開日: ${a.publishedAt}`);
    lines.push('');
    lines.push(`概要: ${a.excerpt}`);
    lines.push('');
    // Include full article content for AI consumption
    if (a.content) {
      lines.push(a.content);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

const articles = getArticles();

fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), generateLlmsTxt(articles));
console.log(`Generated llms.txt (${articles.length} articles)`);

fs.writeFileSync(path.join(PUBLIC, 'llms-full.txt'), generateLlmsFullTxt(articles));
console.log(`Generated llms-full.txt (full content for AI)`);
