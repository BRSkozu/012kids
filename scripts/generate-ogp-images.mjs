/**
 * Generate individual OGP images for each article
 * Creates 1200x630 images with category color accent and title text
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
const OGP_DIR = path.join(PUBLIC, 'ogp', 'articles');
const LOGO = path.join(PUBLIC, 'logo-badge.png');

const STAGE_COLORS = {
  '0stage': { r: 255, g: 179, b: 179 },
  pre: { r: 255, g: 217, b: 160 },
  early: { r: 255, g: 250, b: 160 },
  mid: { r: 168, g: 230, b: 207 },
  upper: { r: 160, g: 196, b: 255 },
};

const STAGE_LABELS = {
  '0stage': '0-2歳',
  pre: '3-5歳',
  early: '6-8歳',
  mid: '9-10歳',
  upper: '11-12歳',
};

const CATEGORY_ICONS = {
  development: '🌱',
  nutrition: '🍎',
  education: '📚',
  health: '🏥',
  mental: '💚',
  digital: '💻',
  social: '🌍',
};

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
      const stage = content.match(/stage:\s*['"]?(\w+)/)?.[1] || '0stage';
      const catMatch = content.match(/categories:\s*\[([^\]]+)\]/)?.[1] || '';
      const firstCat = catMatch.match(/['"](\w+)['"]/)?.[1] || 'development';
      articles.push({ slug, title, stage, category: firstCat });
    }
  }
  return articles;
}

// Wrap text into lines that fit within maxWidth (approximate)
function wrapText(text, maxCharsPerLine) {
  const lines = [];
  let current = '';
  for (const char of text) {
    current += char;
    if (current.length >= maxCharsPerLine) {
      lines.push(current);
      current = '';
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3); // Max 3 lines
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function generateOgpImage(article) {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const stageColor = STAGE_COLORS[article.stage] || STAGE_COLORS['0stage'];
  const stageLabel = STAGE_LABELS[article.stage] || '0-12歳';

  // Title text lines
  const titleLines = wrapText(article.title, 20);
  const titleSvgLines = titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${220 + i * 60}" font-family="sans-serif" font-size="44" font-weight="bold" fill="#2d2a26">${escapeXml(line)}</text>`
    )
    .join('\n');

  const svgOverlay = `
    <svg width="${WIDTH}" height="${HEIGHT}">
      <!-- Top accent bar with stage color -->
      <rect x="0" y="0" width="${WIDTH}" height="8" fill="rgb(${stageColor.r},${stageColor.g},${stageColor.b})" />

      <!-- Stage badge -->
      <rect x="80" y="120" width="120" height="36" rx="18" fill="rgb(${stageColor.r},${stageColor.g},${stageColor.b})" />
      <text x="140" y="144" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#2d2a26">${stageLabel}</text>

      <!-- Title -->
      ${titleSvgLines}

      <!-- Site name at bottom -->
      <text x="80" y="560" font-family="sans-serif" font-size="22" fill="#999">012.kids</text>

      <!-- Subtitle -->
      <text x="80" y="590" font-family="sans-serif" font-size="16" fill="#bbb">子育て・教育情報まとめ</text>
    </svg>
  `;

  // Create base with warm background
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: { r: 255, g: 252, b: 248 },
    },
  })
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 80 })
    .toFile(path.join(OGP_DIR, `${article.slug}.png`));
}

async function main() {
  // Ensure output directory
  fs.mkdirSync(OGP_DIR, { recursive: true });

  const articles = getArticles();
  let generated = 0;

  for (const article of articles) {
    const outputPath = path.join(OGP_DIR, `${article.slug}.png`);
    // Skip if already exists (incremental build)
    if (fs.existsSync(outputPath)) continue;

    await generateOgpImage(article);
    generated++;
  }

  console.log(`Generated ${generated} new OGP images (${articles.length} total articles)`);
}

main().catch(console.error);
