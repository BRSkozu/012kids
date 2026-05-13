#!/usr/bin/env node
/**
 * MDX 記事の frontmatter `relatedSlugs` を自動補完する。
 *
 * スコアリング:
 *   - 同 stage:        +2
 *   - 共有 category:   +3 / 件
 *   - 共有 tag:        +1 / 件
 *   - 同点時は score.total が高いほうを優先
 *
 * デフォルトでは relatedSlugs が空（または足りない）記事のみ更新する。
 * --target=count で関連リンクの目標件数を指定（デフォルト 6）。
 *
 * Usage:
 *   node scripts/enrich-related-slugs.mjs --dry-run   # 変更プレビューのみ
 *   node scripts/enrich-related-slugs.mjs             # 実際に MDX を書き換え
 *   node scripts/enrich-related-slugs.mjs --target=8  # 関連 8 件を目指す
 *   node scripts/enrich-related-slugs.mjs --force     # 既存リンクも上書き（破壊的）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'articles');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const TARGET = (() => {
  const a = args.find((x) => x.startsWith('--target='));
  return a ? parseInt(a.split('=')[1], 10) : 6;
})();

function readAllArticles() {
  const articles = [];
  for (const cat of fs.readdirSync(CONTENT_DIR)) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const file of fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'))) {
      const fp = path.join(catDir, file);
      const raw = fs.readFileSync(fp, 'utf8');
      const { data } = matter(raw);
      if (data.draft) continue;
      articles.push({
        filePath: fp,
        raw,
        slug: data.slug,
        stage: data.stage,
        categories: data.categories || [],
        tags: data.tags || [],
        scoreTotal: data.score?.total ?? 0,
        relatedSlugs: Array.isArray(data.relatedSlugs) ? data.relatedSlugs : [],
      });
    }
  }
  return articles;
}

function scoreRelated(target, candidate) {
  let score = 0;
  if (candidate.stage && candidate.stage === target.stage) score += 2;
  const cats = new Set(target.categories);
  const tags = new Set(target.tags);
  for (const c of candidate.categories) if (cats.has(c)) score += 3;
  for (const t of candidate.tags) if (tags.has(t)) score += 1;
  return score;
}

function pickRelated(article, all, target) {
  const existing = new Set(article.relatedSlugs);
  const validSlugs = new Set(all.map((a) => a.slug));
  // 既存リンクのうち実在するものだけ残す
  const kept = article.relatedSlugs.filter((s) => validSlugs.has(s) && s !== article.slug);
  if (!FORCE && kept.length >= target) return kept.slice(0, target);

  const candidates = all
    .filter((a) => a.slug !== article.slug && (FORCE || !existing.has(a.slug)))
    .map((a) => ({ slug: a.slug, score: scoreRelated(article, a), total: a.scoreTotal }))
    .filter((c) => c.score > 0)
    .sort((x, y) => y.score - x.score || y.total - x.total);

  const need = target - kept.length;
  const additions = candidates.slice(0, need).map((c) => c.slug);
  return FORCE ? [...candidates.slice(0, target).map((c) => c.slug)] : [...kept, ...additions];
}

/**
 * frontmatter の relatedSlugs 行だけをサージカルに置換する。
 * 既存のフォーマット（インライン `[]` or YAML リスト）に関係なく動作。
 */
function replaceRelatedSlugs(raw, newSlugs) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) throw new Error('No frontmatter delimiter found');
  const fmBody = fmMatch[1];

  const yamlList =
    newSlugs.length === 0
      ? 'relatedSlugs: []'
      : 'relatedSlugs:\n' + newSlugs.map((s) => `  - ${s}`).join('\n');

  // 既存の relatedSlugs ブロック（インライン or 複数行）を一括で置換
  // 行頭の `relatedSlugs:` から、次のキー行 or frontmatter 終端まで
  const re = /^relatedSlugs:[ \t]*(\[[^\]]*\]|(?:\n[ \t]+-[^\n]*)+)?[ \t]*$/m;
  if (!re.test(fmBody)) {
    // relatedSlugs キー自体がない場合は末尾に追加
    const newFm = fmBody + '\n' + yamlList;
    return raw.replace(fmMatch[0], `---\n${newFm}\n---`);
  }
  const newFm = fmBody.replace(re, yamlList);
  return raw.replace(fmMatch[0], `---\n${newFm}\n---`);
}

// ---------------------------------------------------------------------------

const all = readAllArticles();
console.log(`📚 ${all.length} 記事を読み込みました（target=${TARGET}, force=${FORCE}, dry-run=${DRY_RUN}）`);

let updated = 0;
let skipped = 0;
let noCandidates = 0;
const samples = [];

for (const article of all) {
  if (!FORCE && article.relatedSlugs.length >= TARGET) {
    skipped++;
    continue;
  }
  const picked = pickRelated(article, all, TARGET);
  // 変更がない場合スキップ
  const before = article.relatedSlugs.join(',');
  const after = picked.join(',');
  if (before === after) {
    skipped++;
    continue;
  }
  if (picked.length === 0) {
    noCandidates++;
    continue;
  }

  if (samples.length < 5) {
    samples.push({ slug: article.slug, before: article.relatedSlugs, after: picked });
  }

  if (!DRY_RUN) {
    const newRaw = replaceRelatedSlugs(article.raw, picked);
    fs.writeFileSync(article.filePath, newRaw, 'utf8');
  }
  updated++;
}

console.log('');
console.log('────────────────────────────────────────');
console.log(`✅ 更新: ${updated} 件`);
console.log(`⏭️  スキップ: ${skipped} 件（既に充足）`);
console.log(`⚠️  候補なし: ${noCandidates} 件`);
console.log('');
console.log('サンプル（先頭 5 件）:');
for (const s of samples) {
  console.log(`  ${s.slug}`);
  console.log(`    before: [${s.before.join(', ') || '空'}]`);
  console.log(`    after:  [${s.after.join(', ')}]`);
}

if (DRY_RUN) {
  console.log('\n🔍 dry-run モード: ファイルは変更されていません');
}
