/**
 * Generate individual OGP images for each article
 * Creates 1200x630 images with premium design:
 *   - Stage-colored gradient accent bar & decorative shapes
 *   - Category icon + stage badge
 *   - Smart Japanese text wrapping
 *   - Logo composite & site branding
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
  '0stage': { r: 255, g: 179, b: 179, hex: '#FFB3B3', dark: '#E08080', light: '#FFF0F0' },
  pre:      { r: 255, g: 217, b: 160, hex: '#FFD9A0', dark: '#D4A050', light: '#FFF8ED' },
  early:    { r: 255, g: 250, b: 160, hex: '#FFFAA0', dark: '#C8B840', light: '#FFFEF0' },
  mid:      { r: 168, g: 230, b: 207, hex: '#A8E6CF', dark: '#5CB88A', light: '#EEFAF4' },
  upper:    { r: 160, g: 196, b: 255, hex: '#A0C4FF', dark: '#5080D0', light: '#EEF4FF' },
};

const STAGE_LABELS = {
  '0stage': '0〜2歳',
  pre: '3〜5歳',
  early: '6〜8歳',
  mid: '9〜10歳',
  upper: '11〜12歳',
};

const STAGE_NAMES = {
  '0stage': '0 Stage',
  pre: 'Pre Stage',
  early: 'Early Stage',
  mid: 'Mid Stage',
  upper: 'Upper Stage',
};

const CATEGORY_LABELS = {
  development: { icon: '🌱', label: '発達・成長' },
  nutrition:   { icon: '🍎', label: '食育・栄養' },
  education:   { icon: '📚', label: '教育・学習' },
  health:      { icon: '🏥', label: '健康・医療' },
  mental:      { icon: '💚', label: 'メンタル・心理' },
  digital:     { icon: '💻', label: 'デジタル・メディア' },
  social:      { icon: '🌍', label: '社会・環境' },
  lifestyle:   { icon: '🏠', label: '暮らし・家計' },
  pregnancy:   { icon: '🤱', label: '妊娠・出産' },
};

// --------------- Japanese text wrapping ---------------

// Characters that should not start a new line (kinsoku-shori)
const NO_START = new Set('、。！？）」】』〉》≫ー…・：；');
// Characters after which it's good to break
const BREAK_AFTER = new Set('、。！？：；）」】』〉》・');
// Particles that are good break-before points
const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'と', 'の', 'も', 'へ', 'や', 'か'];

function wrapJapanese(text, maxChars) {
  if (text.length <= maxChars) return [text];

  const lines = [];
  let remaining = text;

  while (remaining.length > 0 && lines.length < 3) {
    if (remaining.length <= maxChars) {
      lines.push(remaining);
      break;
    }

    // Try to find a good break point within the allowed range
    let breakAt = -1;

    // Strategy 1: break after punctuation
    for (let i = Math.min(remaining.length - 1, maxChars - 1); i >= maxChars - 6 && i >= 0; i--) {
      if (BREAK_AFTER.has(remaining[i])) {
        breakAt = i + 1;
        break;
      }
    }

    // Strategy 2: break before a particle (if preceded by kanji/kana)
    if (breakAt === -1) {
      for (let i = Math.min(remaining.length - 1, maxChars); i >= maxChars - 5 && i >= 1; i--) {
        if (PARTICLES.includes(remaining[i]) && !PARTICLES.includes(remaining[i - 1])) {
          breakAt = i;
          break;
        }
      }
    }

    // Strategy 3: break at maxChars but avoid kinsoku
    if (breakAt === -1) {
      breakAt = maxChars;
      // Don't break if next char shouldn't start a line
      while (breakAt < remaining.length && NO_START.has(remaining[breakAt])) {
        breakAt++;
      }
    }

    lines.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt);
  }

  return lines.slice(0, 3);
}

// --------------- Article parsing ---------------

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

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// --------------- OGP image generation ---------------

async function generateOgpImage(article, logoBuffer) {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const sc = STAGE_COLORS[article.stage] || STAGE_COLORS['0stage'];
  const stageLabel = STAGE_LABELS[article.stage] || '0〜12歳';
  const stageName = STAGE_NAMES[article.stage] || '0 Stage';
  const catInfo = CATEGORY_LABELS[article.category] || CATEGORY_LABELS.development;

  // Title text lines (smart wrapped)
  const titleLines = wrapJapanese(article.title, 18);
  const titleFontSize = titleLines.some(l => l.length > 16) ? 40 : 44;
  const titleLineHeight = titleFontSize + 16;
  const titleStartY = 255;

  const titleSvgLines = titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${titleStartY + i * titleLineHeight}" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif" font-size="${titleFontSize}" font-weight="700" fill="#2d2a26" letter-spacing="0.5">${escapeXml(line)}</text>`
    )
    .join('\n');

  // Stage badge width (dynamic)
  const stageBadgeText = `${stageName}｜${stageLabel}`;
  const stageBadgeWidth = stageBadgeText.length * 14 + 32;

  // Category label width
  const catLabelText = catInfo.label;
  const catBadgeWidth = catLabelText.length * 14 + 28;

  const svgOverlay = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Stage color gradient for top bar -->
        <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${sc.hex}" />
          <stop offset="100%" stop-color="${sc.dark}" />
        </linearGradient>
        <!-- Subtle background pattern -->
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="${sc.hex}" opacity="0.12" />
        </pattern>
      </defs>

      <!-- Background pattern -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />

      <!-- Top accent bar (gradient) -->
      <rect x="0" y="0" width="${WIDTH}" height="14" fill="url(#topBar)" />

      <!-- Left accent stripe -->
      <rect x="0" y="14" width="6" height="${HEIGHT - 14}" fill="${sc.hex}" opacity="0.6" />

      <!-- Decorative circles (right side) -->
      <circle cx="1060" cy="120" r="80" fill="${sc.hex}" opacity="0.10" />
      <circle cx="1120" cy="220" r="50" fill="${sc.hex}" opacity="0.15" />
      <circle cx="1020" cy="280" r="30" fill="${sc.hex}" opacity="0.20" />
      <circle cx="1100" cy="350" r="65" fill="${sc.dark}" opacity="0.08" />

      <!-- Stage badge -->
      <rect x="80" y="140" width="${stageBadgeWidth}" height="40" rx="20" fill="${sc.hex}" />
      <rect x="80" y="140" width="${stageBadgeWidth}" height="40" rx="20" fill="white" opacity="0.3" />
      <text x="${80 + stageBadgeWidth / 2}" y="166" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="17" font-weight="700" fill="#2d2a26">${escapeXml(stageBadgeText)}</text>

      <!-- Category badge -->
      <rect x="${80 + stageBadgeWidth + 12}" y="144" width="${catBadgeWidth}" height="32" rx="16" fill="white" stroke="${sc.dark}" stroke-width="1.5" opacity="0.9" />
      <text x="${80 + stageBadgeWidth + 12 + catBadgeWidth / 2}" y="166" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="15" fill="#555">${escapeXml(catLabelText)}</text>

      <!-- Title -->
      ${titleSvgLines}

      <!-- Bottom separator -->
      <line x1="80" y1="530" x2="900" y2="530" stroke="${sc.hex}" stroke-width="2" opacity="0.5" />

      <!-- Site name -->
      <text x="80" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#E07830">012</text>
      <text x="128" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#2d2a26">.kids</text>

      <!-- Tagline -->
      <text x="80" y="596" font-family="'Noto Sans JP', sans-serif" font-size="14" fill="#999">0-12歳の子育て・教育情報まとめ</text>

      <!-- Right side tagline -->
      <text x="1120" y="590" text-anchor="end" font-family="'Noto Sans JP', sans-serif" font-size="13" fill="#bbb" letter-spacing="1">子育ての「？」をゼロに。</text>

      <!-- Bottom accent line -->
      <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#topBar)" />
    </svg>
  `;

  // Create base with warm cream background
  const base = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: { r: 255, g: 252, b: 248 },
    },
  });

  // Prepare composites
  const composites = [
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    },
  ];

  // Add logo if available
  if (logoBuffer) {
    composites.push({
      input: logoBuffer,
      top: 538,
      left: 1040,
    });
  }

  await base
    .composite(composites)
    .png({ quality: 85 })
    .toFile(path.join(OGP_DIR, `${article.slug}.png`));
}

async function main() {
  const force = process.argv.includes('--force');

  // Ensure output directory
  fs.mkdirSync(OGP_DIR, { recursive: true });

  // Prepare logo (resize to 72x72)
  let logoBuffer = null;
  if (fs.existsSync(LOGO)) {
    logoBuffer = await sharp(LOGO)
      .resize(72, 72, { fit: 'contain', background: { r: 255, g: 252, b: 248, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const articles = getArticles();
  let generated = 0;
  let skipped = 0;

  for (const article of articles) {
    const outputPath = path.join(OGP_DIR, `${article.slug}.png`);
    // Skip if already exists (unless --force)
    if (!force && fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    await generateOgpImage(article, logoBuffer);
    generated++;
    if (generated % 100 === 0) {
      console.log(`  ... ${generated} generated`);
    }
  }

  console.log(`✓ OGP images: ${generated} generated, ${skipped} skipped (${articles.length} total)`);
  if (!force && skipped > 0) {
    console.log(`  Tip: use --force to regenerate all images`);
  }
}

main().catch(console.error);
