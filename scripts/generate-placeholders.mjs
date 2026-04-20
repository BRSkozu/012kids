#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'photos');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PHOTOS = [
  { name: 'hero-main.webp', w: 2520, h: 1080, color: '#F5D9B1', label: 'Hero — 親子の絵本タイム' },
  { name: 'cat-development.webp', w: 1920, h: 1080, color: '#A8E6CF', label: '発達・成長' },
  { name: 'cat-nutrition.webp', w: 1920, h: 1080, color: '#FFD9A0', label: '食育・栄養' },
  { name: 'cat-education.webp', w: 1920, h: 1080, color: '#FFFAA0', label: '教育・学習' },
  { name: 'cat-health.webp', w: 1920, h: 1080, color: '#FFB3B3', label: '健康・医療' },
  { name: 'cat-mental.webp', w: 1920, h: 1080, color: '#C8D1E8', label: 'メンタル・心理' },
  { name: 'cat-digital.webp', w: 1920, h: 1080, color: '#A0C4FF', label: 'デジタル・メディア' },
  { name: 'cat-social.webp', w: 1920, h: 1080, color: '#B8E6B8', label: '社会・環境' },
  { name: 'cat-lifestyle.webp', w: 1920, h: 1080, color: '#F5D9B1', label: '暮らし・家計' },
  { name: 'cat-pregnancy.webp', w: 1920, h: 1080, color: '#F3C4D0', label: '妊娠・出産' },
  { name: 'stage-0.webp', w: 1920, h: 1080, color: '#FFB3B3', label: '0〜2歳' },
  { name: 'stage-pre.webp', w: 1920, h: 1080, color: '#FFD9A0', label: '3〜5歳' },
  { name: 'stage-early.webp', w: 1920, h: 1080, color: '#FFFAA0', label: '6〜8歳' },
  { name: 'stage-mid.webp', w: 1920, h: 1080, color: '#A8E6CF', label: '9〜10歳' },
  { name: 'stage-upper.webp', w: 1920, h: 1080, color: '#A0C4FF', label: '11〜12歳' },
  { name: 'about-mission.webp', w: 1920, h: 1080, color: '#2D3047', label: 'ミッション' },
  { name: 'texture-warm-bokeh.webp', w: 1920, h: 1080, color: '#F5D9B1', label: 'ボケテクスチャ' },
];

async function createPlaceholder({ name, w, h, color, label }) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="30%" cy="40%">
        <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.6"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="48%" text-anchor="middle" font-size="48" fill="#1a1a2e" opacity="0.3" font-family="sans-serif">${label}</text>
    <text x="50%" y="56%" text-anchor="middle" font-size="28" fill="#1a1a2e" opacity="0.2" font-family="sans-serif">placeholder — 実際の写真に差し替え予定</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .webp({ quality: 60 })
    .toFile(path.join(OUT_DIR, name));

  console.log(`  ✅ ${name} (${w}×${h})`);
}

console.log('📸 プレースホルダー画像を生成中...');
for (const photo of PHOTOS) {
  await createPlaceholder(photo);
}
console.log(`\n✨ ${PHOTOS.length}枚のプレースホルダーを public/photos/ に生成しました`);
