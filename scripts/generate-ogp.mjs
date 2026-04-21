/**
 * Generate OGP images (1200x630px) for each article.
 *
 * Reads article data from src/data/articles.ts, generates a clean
 * SVG-based OGP image per article, and writes PNG files to public/ogp/articles/.
 *
 * Usage:
 *   node scripts/generate-ogp.mjs           # incremental (skip existing)
 *   node scripts/generate-ogp.mjs --force   # regenerate all
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTICLES_TS = path.join(ROOT, 'src', 'data', 'articles.ts');
const OGP_DIR = path.join(ROOT, 'public', 'ogp', 'articles');

// ── Stage data (mirrored from src/data/stages.ts) ──────────────────────────

const STAGES = {
  '0stage': { color: '#FFB3B3', colorDark: '#E08080', ageRange: '0〜2歳', label: '0 Stage' },
  pre:      { color: '#FFD9A0', colorDark: '#D4A050', ageRange: '3〜5歳', label: 'Pre Stage' },
  early:    { color: '#FFFAA0', colorDark: '#C8B840', ageRange: '6〜8歳', label: 'Early Stage' },
  mid:      { color: '#A8E6CF', colorDark: '#5CB88A', ageRange: '9〜10歳', label: 'Mid Stage' },
  upper:    { color: '#A0C4FF', colorDark: '#5080D0', ageRange: '11〜12歳', label: 'Upper Stage' },
};

// ── Parse articles from the TypeScript file ─────────────────────────────────

function parseArticles() {
  const src = fs.readFileSync(ARTICLES_TS, 'utf-8');

  // Match each object literal inside the ARTICLES array.
  // We extract only the fields we need: slug, title, stage, categories.
  const articleRegex = /\{\s*\n\s*id:\s*"[^"]*",\s*\n\s*slug:\s*"([^"]*)",\s*\n\s*title:\s*"([^"]*)",[\s\S]*?stage:\s*"([^"]*)",\s*\n\s*categories:\s*\[([^\]]*)\]/g;
  const articles = [];
  let match;

  while ((match = articleRegex.exec(src)) !== null) {
    const slug = match[1];
    const title = match[2];
    const stage = match[3];
    const categoriesRaw = match[4];
    const categories = [...categoriesRaw.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    articles.push({ slug, title, stage, categories });
  }

  return articles;
}

// ── Japanese text wrapping ──────────────────────────────────────────────────

// Characters that must not begin a line (kinsoku-shori)
const NO_LINE_START = new Set('、。！？）」】』〉》≫ー…・：；');
// Characters after which we prefer to break
const BREAK_AFTER = new Set('、。！？：；）」】』〉》・');
// Particles that make good break-before points
const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'と', 'の', 'も', 'へ', 'や', 'か'];

function wrapJapanese(text, maxChars, maxLines = 2) {
  if (text.length <= maxChars) return [text];

  const lines = [];
  let remaining = text;

  while (remaining.length > 0 && lines.length < maxLines) {
    if (remaining.length <= maxChars) {
      lines.push(remaining);
      break;
    }

    let breakAt = -1;

    // Strategy 1: break after punctuation near the limit
    for (let i = Math.min(remaining.length - 1, maxChars - 1); i >= maxChars - 6 && i >= 0; i--) {
      if (BREAK_AFTER.has(remaining[i])) {
        breakAt = i + 1;
        break;
      }
    }

    // Strategy 2: break before a particle
    if (breakAt === -1) {
      for (let i = Math.min(remaining.length - 1, maxChars); i >= maxChars - 5 && i >= 1; i--) {
        if (PARTICLES.includes(remaining[i]) && !PARTICLES.includes(remaining[i - 1])) {
          breakAt = i;
          break;
        }
      }
    }

    // Strategy 3: break at maxChars, respecting kinsoku
    if (breakAt === -1) {
      breakAt = maxChars;
      while (breakAt < remaining.length && NO_LINE_START.has(remaining[breakAt])) {
        breakAt++;
      }
    }

    lines.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt);
  }

  // If there's leftover text beyond maxLines, truncate the last line
  if (remaining.length > 0 && lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (last.length + remaining.length > maxChars) {
      lines[maxLines - 1] = last.slice(0, maxChars - 1) + '…';
    } else {
      lines[maxLines - 1] = last + remaining;
    }
  }

  return lines;
}

// ── XML escaping ────────────────────────────────────────────────────────────

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Generate one OGP image ──────────────────────────────────────────────────

async function generateOgpImage(article) {
  const WIDTH = 1200;
  const HEIGHT = 630;

  const stageInfo = STAGES[article.stage] || STAGES['0stage'];
  const stageColor = stageInfo.color;
  const stageColorDark = stageInfo.colorDark;
  const ageRange = stageInfo.ageRange;
  const stageLabel = stageInfo.label;

  // Wrap the title into at most 2 lines, ~20 chars per line
  const titleLines = wrapJapanese(article.title, 20, 2);
  const fontSize = titleLines.some((l) => l.length > 18) ? 40 : 44;
  const lineHeight = fontSize + 18;

  // Vertically center the title block in the middle area
  const titleBlockHeight = titleLines.length * lineHeight;
  const titleStartY = 220 + (200 - titleBlockHeight) / 2 + fontSize;

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="600" y="${titleStartY + i * lineHeight}" text-anchor="middle" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="${fontSize}" font-weight="700" fill="#1F2439" letter-spacing="0.5">${escapeXml(line)}</text>`
    )
    .join('\n');

  // Stage badge dimensions
  const badgeText = `${stageLabel}｜${ageRange}`;
  const badgeWidth = badgeText.length * 13 + 36;
  const badgeX = (WIDTH - badgeWidth) / 2;

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${stageColor}" />
      <stop offset="100%" stop-color="${stageColorDark}" />
    </linearGradient>
  </defs>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="${WIDTH}" height="16" fill="url(#topBar)" />

  <!-- Subtle horizontal rule below bar -->
  <line x1="100" y1="56" x2="1100" y2="56" stroke="${stageColor}" stroke-width="1" opacity="0.4" />

  <!-- Stage badge (centered) -->
  <rect x="${badgeX}" y="80" width="${badgeWidth}" height="38" rx="19" fill="${stageColor}" opacity="0.85" />
  <text x="600" y="105" text-anchor="middle" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="16" font-weight="600" fill="#1F2439">${escapeXml(badgeText)}</text>

  <!-- Title text (centered) -->
  ${titleSvg}

  <!-- Bottom separator -->
  <line x1="200" y1="510" x2="1000" y2="510" stroke="${stageColor}" stroke-width="1.5" opacity="0.4" />

  <!-- Branding: 012.kids (bottom right) -->
  <text x="1120" y="580" text-anchor="end" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="22" font-weight="700">
    <tspan fill="#E07830">012</tspan><tspan fill="#1F2439">.kids</tspan>
  </text>

  <!-- Bottom accent bar -->
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#topBar)" />
</svg>`;

  // Create base image with warm background, composite SVG on top
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: { r: 255, g: 253, b: 247 }, // #FFFDF7
    },
  })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ quality: 85 })
    .toFile(path.join(OGP_DIR, `${article.slug}.png`));
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const force = process.argv.includes('--force');

  // Ensure output directory exists
  fs.mkdirSync(OGP_DIR, { recursive: true });

  // Parse articles
  const articles = parseArticles();
  console.log(`Found ${articles.length} articles in ${path.relative(ROOT, ARTICLES_TS)}`);

  if (articles.length === 0) {
    console.warn('No articles found. Check that src/data/articles.ts is populated.');
    process.exit(1);
  }

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const article of articles) {
    const outputPath = path.join(OGP_DIR, `${article.slug}.png`);

    // Skip if image already exists (unless --force)
    if (!force && fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    try {
      await generateOgpImage(article);
      generated++;
      if (generated % 50 === 0) {
        console.log(`  ... ${generated} generated so far`);
      }
    } catch (err) {
      errors++;
      console.error(`  Error generating OGP for "${article.slug}": ${err.message}`);
    }
  }

  console.log(
    `Done: ${generated} generated, ${skipped} skipped, ${errors} errors (${articles.length} total)`
  );
  if (!force && skipped > 0) {
    console.log('  Tip: use --force to regenerate all images');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
