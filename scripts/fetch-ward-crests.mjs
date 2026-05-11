#!/usr/bin/env node
/**
 * Fetch official ward crest SVGs from Wikipedia Commons.
 *
 * Tokyo 23区 each have an official 区章 (ward emblem) which is published
 * as a public symbol of the municipality. Wikipedia Commons hosts SVG
 * versions of most under PD-Japan-flag or similar public-domain tags.
 *
 * This script downloads all 23 SVGs into /public/ward-crests/ via
 * Wikipedia's Special:FilePath redirector (which is a stable URL).
 *
 * Usage:
 *   node scripts/fetch-ward-crests.mjs
 *
 * Notes:
 *   - The script tries multiple filename patterns (Symbol_of, Emblem_of,
 *     Flag_of) since Commons file naming varies per ward.
 *   - If a file already exists locally, it is skipped (use --force to
 *     overwrite).
 *   - The license notice is appended to public/ward-crests/LICENSE.md.
 *
 * License note:
 *   - Most 23区章 on Wikipedia Commons are tagged as PD-Japan-flag
 *     (public domain as Japanese governmental symbols).
 *   - Please verify the license on each Commons file page before
 *     production use. The script prints the source URL for each download.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'ward-crests');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');

// 23区 (slug, English name as used in Commons filename)
const WARDS = [
  ['chiyoda', 'Chiyoda'],
  ['chuo', 'Chuo'],
  ['minato', 'Minato'],
  ['shinjuku', 'Shinjuku'],
  ['bunkyo', 'Bunkyo'],
  ['taito', 'Taito'],
  ['sumida', 'Sumida'],
  ['koto', 'Koto'],
  ['shinagawa', 'Shinagawa'],
  ['meguro', 'Meguro'],
  ['ota', 'Ota'],
  ['setagaya', 'Setagaya'],
  ['shibuya', 'Shibuya'],
  ['nakano', 'Nakano'],
  ['suginami', 'Suginami'],
  ['toshima', 'Toshima'],
  ['kita', 'Kita'],
  ['arakawa', 'Arakawa'],
  ['itabashi', 'Itabashi'],
  ['nerima', 'Nerima'],
  ['adachi', 'Adachi'],
  ['katsushika', 'Katsushika'],
  ['edogawa', 'Edogawa'],
];

const PATTERNS = ['Symbol_of_{NAME},_Tokyo.svg', 'Emblem_of_{NAME},_Tokyo.svg', 'Flag_of_{NAME},_Tokyo.svg'];

function fetchUrl(url, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('too many redirects'));
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': '012kids-bot/1.0 (https://012.kids)' } },
      (res) => {
        if (res.statusCode && [301, 302, 303, 307, 308].includes(res.statusCode)) {
          const loc = res.headers.location;
          if (!loc) {
            reject(new Error(`redirect without location: ${res.statusCode}`));
            return;
          }
          const next = loc.startsWith('http') ? loc : new URL(loc, url).toString();
          resolve(fetchUrl(next, depth + 1));
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ url, body: Buffer.concat(chunks) }));
      },
    );
    req.on('error', reject);
  });
}

async function tryDownload(name) {
  for (const pat of PATTERNS) {
    const filename = pat.replace('{NAME}', name);
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
    try {
      const res = await fetchUrl(url);
      // Sanity check: must contain SVG header or be at least a reasonable size
      const head = res.body.slice(0, 200).toString('utf8');
      if (head.includes('<svg') || head.includes('<?xml')) {
        return { ok: true, url: res.url, body: res.body, pattern: pat };
      }
    } catch {
      // try next pattern
    }
  }
  return { ok: false };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Downloading 23区章 SVGs to ${path.relative(process.cwd(), OUT_DIR)}/\n`);

  const results = [];
  for (const [slug, name] of WARDS) {
    const outPath = path.join(OUT_DIR, `${slug}.svg`);
    if (!FORCE && fs.existsSync(outPath)) {
      console.log(`  ✓ ${slug.padEnd(12)} (exists, skip)`);
      results.push({ slug, status: 'skipped' });
      continue;
    }
    try {
      const r = await tryDownload(name);
      if (!r.ok) {
        console.log(`  ✗ ${slug.padEnd(12)} (not found in Commons; check manually)`);
        results.push({ slug, status: 'failed' });
        continue;
      }
      fs.writeFileSync(outPath, r.body);
      console.log(`  ✓ ${slug.padEnd(12)} ← ${r.pattern}`);
      results.push({ slug, status: 'downloaded', source: r.url, pattern: r.pattern });
    } catch (e) {
      console.log(`  ✗ ${slug.padEnd(12)} (error: ${e.message})`);
      results.push({ slug, status: 'error', error: String(e) });
    }
  }

  // Write a LICENSE/attribution note
  const licenseNote =
    `# 区章 (Ward Emblems) — Sources\n\n` +
    `各SVGはWikipedia Commonsから取得した東京23区の公式区章です。\n` +
    `多くは PD-Japan-flag（日本国旗・紋章としてのパブリックドメイン）扱いですが、\n` +
    `各ファイルのライセンスは Commons の元ページで確認してください。\n\n` +
    `自動取得日時: ${new Date().toISOString()}\n\n` +
    `## 取得結果\n\n` +
    results
      .map((r) => {
        if (r.status === 'downloaded') return `- \`${r.slug}.svg\` ✓ (${r.pattern})  \n  source: ${r.source}`;
        if (r.status === 'skipped') return `- \`${r.slug}.svg\` (skipped, already present)`;
        return `- \`${r.slug}.svg\` ✗ (${r.status})`;
      })
      .join('\n') +
    `\n`;
  fs.writeFileSync(path.join(OUT_DIR, 'LICENSE.md'), licenseNote, 'utf8');

  const ok = results.filter((r) => r.status === 'downloaded' || r.status === 'skipped').length;
  console.log(`\n✅ ${ok}/${WARDS.length} 件用意できました。`);
  if (ok < WARDS.length) {
    console.log(`⚠️  失敗した区は Commons でファイル名を手動確認のうえ public/ward-crests/<slug>.svg として保存してください。`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
