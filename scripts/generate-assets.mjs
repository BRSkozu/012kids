/**
 * Generate OGP image, favicon, and optimized logo from logo-badge.png
 * Uses sharp (bundled with Next.js)
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const LOGO = path.join(PUBLIC, 'logo-badge.png');

async function main() {
  // 1. OGP image (1200x630) - logo centered on warm background
  const ogpWidth = 1200;
  const ogpHeight = 630;
  const logoForOgp = await sharp(LOGO)
    .resize(400, null, { fit: 'inside' })
    .toBuffer();
  const logoMeta = await sharp(logoForOgp).metadata();

  await sharp({
    create: {
      width: ogpWidth,
      height: ogpHeight,
      channels: 3,
      background: { r: 255, b: 240, g: 248 }, // warm cream #FFF8F0
    },
  })
    .composite([
      {
        input: logoForOgp,
        left: Math.round((ogpWidth - logoMeta.width) / 2),
        top: Math.round((ogpHeight - logoMeta.height) / 2 - 30),
      },
      {
        input: Buffer.from(
          `<svg width="${ogpWidth}" height="60">
            <text x="${ogpWidth / 2}" y="40" text-anchor="middle"
              font-family="sans-serif" font-size="24" fill="#888">
              0-12歳の子育て・教育情報まとめ
            </text>
          </svg>`
        ),
        left: 0,
        top: Math.round(ogpHeight / 2 + logoMeta.height / 2 - 10),
      },
    ])
    .png()
    .toFile(path.join(PUBLIC, 'ogp.png'));
  console.log('Created ogp.png');

  // 2. Favicon (32x32 PNG)
  await sharp(LOGO)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon.png'));
  console.log('Created favicon.png');

  // 3. Apple touch icon (180x180)
  await sharp(LOGO)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 248, b: 240, alpha: 1 } })
    .png()
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 4. Favicon ICO-like (16x16 PNG for fallback)
  await sharp(LOGO)
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon-16.png'));
  console.log('Created favicon-16.png');

  // 5. WebP optimized logo
  await sharp(LOGO)
    .webp({ quality: 85 })
    .toFile(path.join(PUBLIC, 'logo-badge.webp'));
  const webpStat = (await sharp(path.join(PUBLIC, 'logo-badge.webp')).metadata());
  console.log(`Created logo-badge.webp (${webpStat.width}x${webpStat.height})`);

  console.log('All assets generated!');
}

main().catch(console.error);
