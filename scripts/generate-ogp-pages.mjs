/**
 * Generate OGP images for category and age-guide pages
 * Creates 1200x630 images matching the article OGP design system
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OGP_DIR = path.join(PUBLIC, 'ogp');
const LOGO = path.join(PUBLIC, 'logo-badge.png');

const STAGE_COLORS = {
  '0stage': { hex: '#FFB3B3', dark: '#E08080' },
  pre:      { hex: '#FFD9A0', dark: '#D4A050' },
  early:    { hex: '#FFFAA0', dark: '#C8B840' },
  mid:      { hex: '#A8E6CF', dark: '#5CB88A' },
  upper:    { hex: '#A0C4FF', dark: '#5080D0' },
};

const STAGES = [
  { id: '0stage', label: '0 Stage', range: '0〜2歳', desc: '授乳・離乳食・発達発育・睡眠・保育' },
  { id: 'pre',    label: 'Pre Stage', range: '3〜5歳', desc: '幼児教育・遊び・ことば・しつけ・幼稚園' },
  { id: 'early',  label: 'Early Stage', range: '6〜8歳', desc: '小学校入学・読み書き・算数・生活習慣' },
  { id: 'mid',    label: 'Mid Stage', range: '9〜10歳', desc: '理科・社会・英語・習い事・友達関係' },
  { id: 'upper',  label: 'Upper Stage', range: '11〜12歳', desc: '受験・自主学習・メンタル・デジタルリテラシー' },
];

const CATEGORIES = [
  { id: 'development', icon: '🌱', label: '発達・成長', color: '#5CB88A', colorLight: '#EEFAF4', desc: '運動発達、認知発達、言語発達、社会性発達' },
  { id: 'nutrition',   icon: '🍎', label: '食育・栄養', color: '#E07830', colorLight: '#FFF8ED', desc: '離乳食、アレルギー対応、好き嫌い克服、給食' },
  { id: 'education',   icon: '📚', label: '教育・学習', color: '#5080D0', colorLight: '#EEF4FF', desc: '早期教育、公教育、家庭学習法、習い事選び' },
  { id: 'health',      icon: '🏥', label: '健康・医療', color: '#E05050', colorLight: '#FFF0F0', desc: '予防接種、かかりやすい病気、歯科・眼科' },
  { id: 'mental',      icon: '💚', label: 'メンタル・心理', color: '#4CAF50', colorLight: '#F0FFF0', desc: '不登校・いじめ対応、自己肯定感、メンタルケア' },
  { id: 'digital',     icon: '💻', label: 'デジタル・メディア', color: '#7B68EE', colorLight: '#F0EEFF', desc: 'スクリーンタイム管理、プログラミング教育' },
  { id: 'social',      icon: '🌍', label: '社会・環境', color: '#20B2AA', colorLight: '#F0FFFF', desc: 'SDGs教育、多様性・インクルーシブ教育' },
  { id: 'lifestyle',   icon: '🏠', label: '暮らし・家計', color: '#D4A050', colorLight: '#FFF8ED', desc: '教育費、共働き、時短術、ライフスタイル' },
  { id: 'pregnancy',   icon: '🤱', label: '妊娠・出産', color: '#E08080', colorLight: '#FFF0F0', desc: '妊娠経過、出産準備、産後ケア' },
];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function getArticleCountByCategory() {
  const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
  const counts = {};
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    counts[cat] = files.length;
  }
  return counts;
}

function getArticleCountByStage() {
  const CONTENT_DIR = path.join(ROOT, 'content', 'articles');
  const counts = {};
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(catDir, file), 'utf-8');
      const stage = raw.match(/stage:\s*['"]?(\w+)/)?.[1] || '';
      if (stage) counts[stage] = (counts[stage] || 0) + 1;
    }
  }
  return counts;
}

async function generateCategoryOgp(cat, articleCount, logoBuffer) {
  const WIDTH = 1200;
  const HEIGHT = 630;

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${cat.color}" />
          <stop offset="100%" stop-color="${cat.color}" stop-opacity="0.6" />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.2" fill="${cat.color}" opacity="0.08" />
        </pattern>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />
      <rect x="0" y="0" width="${WIDTH}" height="14" fill="url(#topBar)" />
      <rect x="0" y="14" width="6" height="${HEIGHT - 14}" fill="${cat.color}" opacity="0.5" />

      <!-- Large decorative circles -->
      <circle cx="1000" cy="150" r="120" fill="${cat.color}" opacity="0.06" />
      <circle cx="1080" cy="300" r="80" fill="${cat.color}" opacity="0.10" />
      <circle cx="950" cy="380" r="50" fill="${cat.color}" opacity="0.12" />

      <!-- Category badge -->
      <rect x="80" y="160" width="220" height="52" rx="26" fill="${cat.color}" />
      <text x="190" y="193" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="22" font-weight="700" fill="white">${escapeXml(cat.label)}</text>

      <!-- Title -->
      <text x="80" y="290" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif" font-size="48" font-weight="700" fill="#2d2a26" letter-spacing="1">${escapeXml(cat.label)}</text>
      <text x="80" y="340" font-family="'Noto Sans JP', sans-serif" font-size="20" fill="#666" letter-spacing="0.5">の記事一覧</text>

      <!-- Description -->
      <text x="80" y="400" font-family="'Noto Sans JP', sans-serif" font-size="18" fill="#888">${escapeXml(cat.desc)}</text>

      <!-- Article count -->
      <rect x="80" y="440" width="${String(articleCount).length * 22 + 100}" height="44" rx="22" fill="${cat.colorLight}" stroke="${cat.color}" stroke-width="1.5" />
      <text x="${80 + (String(articleCount).length * 22 + 100) / 2}" y="468" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="600" fill="${cat.color}">${articleCount}件の記事</text>

      <!-- Bottom separator -->
      <line x1="80" y1="530" x2="900" y2="530" stroke="${cat.color}" stroke-width="2" opacity="0.4" />

      <!-- Site name -->
      <text x="80" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#E07830">012</text>
      <text x="128" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#2d2a26">.kids</text>
      <text x="80" y="596" font-family="'Noto Sans JP', sans-serif" font-size="14" fill="#999">0-12歳の子育て・教育情報まとめ</text>

      <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#topBar)" />
    </svg>
  `;

  const base = sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: { r: 255, g: 252, b: 248 } },
  });

  const composites = [{ input: Buffer.from(svg), top: 0, left: 0 }];
  if (logoBuffer) composites.push({ input: logoBuffer, top: 538, left: 1040 });

  await base.composite(composites).png({ quality: 85 }).toFile(path.join(OGP_DIR, 'categories', `${cat.id}.png`));
}

async function generateStageOgp(stage, articleCount, logoBuffer) {
  const WIDTH = 1200;
  const HEIGHT = 630;
  const sc = STAGE_COLORS[stage.id];

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${sc.hex}" />
          <stop offset="100%" stop-color="${sc.dark}" />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.2" fill="${sc.hex}" opacity="0.10" />
        </pattern>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />
      <rect x="0" y="0" width="${WIDTH}" height="14" fill="url(#topBar)" />
      <rect x="0" y="14" width="6" height="${HEIGHT - 14}" fill="${sc.hex}" opacity="0.5" />

      <!-- Large decorative circles -->
      <circle cx="1020" cy="140" r="110" fill="${sc.hex}" opacity="0.10" />
      <circle cx="1100" cy="280" r="70" fill="${sc.dark}" opacity="0.08" />
      <circle cx="960" cy="350" r="45" fill="${sc.hex}" opacity="0.15" />

      <!-- Stage badge -->
      <rect x="80" y="140" width="280" height="52" rx="26" fill="${sc.hex}" />
      <rect x="80" y="140" width="280" height="52" rx="26" fill="white" opacity="0.25" />
      <text x="220" y="173" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="22" font-weight="700" fill="#2d2a26">${escapeXml(stage.label)}｜${escapeXml(stage.range)}</text>

      <!-- Title -->
      <text x="80" y="280" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif" font-size="46" font-weight="700" fill="#2d2a26" letter-spacing="1">${escapeXml(stage.range)}の</text>
      <text x="80" y="340" font-family="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif" font-size="46" font-weight="700" fill="#2d2a26" letter-spacing="1">子育て・教育情報</text>

      <!-- Description -->
      <text x="80" y="400" font-family="'Noto Sans JP', sans-serif" font-size="18" fill="#888">${escapeXml(stage.desc)}</text>

      <!-- Article count -->
      <rect x="80" y="440" width="${String(articleCount).length * 22 + 100}" height="44" rx="22" fill="white" stroke="${sc.dark}" stroke-width="1.5" />
      <text x="${80 + (String(articleCount).length * 22 + 100) / 2}" y="468" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="600" fill="${sc.dark}">${articleCount}件の記事</text>

      <!-- Bottom separator -->
      <line x1="80" y1="530" x2="900" y2="530" stroke="${sc.hex}" stroke-width="2" opacity="0.4" />

      <!-- Site name -->
      <text x="80" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#E07830">012</text>
      <text x="128" y="568" font-family="'Inter', 'Noto Sans JP', sans-serif" font-size="26" font-weight="700" fill="#2d2a26">.kids</text>
      <text x="80" y="596" font-family="'Noto Sans JP', sans-serif" font-size="14" fill="#999">0-12歳の子育て・教育情報まとめ</text>

      <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#topBar)" />
    </svg>
  `;

  const base = sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: { r: 255, g: 252, b: 248 } },
  });

  const composites = [{ input: Buffer.from(svg), top: 0, left: 0 }];
  if (logoBuffer) composites.push({ input: logoBuffer, top: 538, left: 1040 });

  await base.composite(composites).png({ quality: 85 }).toFile(path.join(OGP_DIR, 'stages', `${stage.id}.png`));
}

async function main() {
  fs.mkdirSync(path.join(OGP_DIR, 'categories'), { recursive: true });
  fs.mkdirSync(path.join(OGP_DIR, 'stages'), { recursive: true });

  let logoBuffer = null;
  if (fs.existsSync(LOGO)) {
    logoBuffer = await sharp(LOGO)
      .resize(72, 72, { fit: 'contain', background: { r: 255, g: 252, b: 248, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const catCounts = getArticleCountByCategory();
  const stageCounts = getArticleCountByStage();

  for (const cat of CATEGORIES) {
    await generateCategoryOgp(cat, catCounts[cat.id] || 0, logoBuffer);
  }
  console.log(`Generated ${CATEGORIES.length} category OGP images`);

  for (const stage of STAGES) {
    await generateStageOgp(stage, stageCounts[stage.id] || 0, logoBuffer);
  }
  console.log(`Generated ${STAGES.length} stage OGP images`);
}

main().catch(console.error);
