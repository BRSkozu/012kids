#!/usr/bin/env node
/**
 * Article Duplicate Detector for 012.kids
 *
 * 1300件超の記事から、重複・類似度の高いペアを検出する。
 *
 * 検出ロジック（3つの観点で総合スコア）:
 *   1. タイトル類似度（文字 N-gram の Jaccard 係数）
 *   2. タグ重複率（Jaccard）
 *   3. 同一カテゴリ + 同一ステージ判定（+ボーナス）
 *
 * 出力:
 *   - score >= 0.75: 強い重複候補（統合検討）
 *   - score >= 0.50: 弱い重複候補（要レビュー）
 *
 * Usage:
 *   node scripts/detect-duplicates.mjs                  # コンソール出力
 *   node scripts/detect-duplicates.mjs --threshold 0.6  # しきい値変更
 *   node scripts/detect-duplicates.mjs --json           # JSON 出力
 *   node scripts/detect-duplicates.mjs --csv            # CSV 出力
 *   node scripts/detect-duplicates.mjs --limit 50       # 上位N件のみ
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');

const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json');
const CSV_OUT = args.includes('--csv');
const thresholdIdx = args.indexOf('--threshold');
const THRESHOLD = thresholdIdx >= 0 ? parseFloat(args[thresholdIdx + 1]) : 0.5;
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 100;

// ---------------------------------------------------------------------------
// Collect articles
// ---------------------------------------------------------------------------
function getAllArticles() {
  const articles = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter((d) =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory(),
  );
  for (const cat of categories) {
    const dir = path.join(CONTENT_DIR, cat);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    for (const f of files) {
      const fp = path.join(dir, f);
      const raw = fs.readFileSync(fp, 'utf8');
      const { data } = matter(raw);
      articles.push({
        category: cat,
        file: f,
        path: fp,
        slug: data.slug,
        title: data.title || '',
        stage: data.stage,
        categories: data.categories ?? [],
        tags: data.tags ?? [],
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        score: data.score?.total ?? 0,
        referencesCount: (data.references ?? []).length,
      });
    }
  }
  return articles;
}

// ---------------------------------------------------------------------------
// Similarity helpers
// ---------------------------------------------------------------------------
function bigrams(str) {
  const s = str.replace(/[\s　・：:、。「」（）()【】！？]/g, '');
  const set = new Set();
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.slice(i, i + 2));
  }
  return set;
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const x of setA) if (setB.has(x)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function tagJaccard(tagsA, tagsB) {
  const a = new Set(tagsA);
  const b = new Set(tagsB);
  return jaccard(a, b);
}

// ---------------------------------------------------------------------------
// Pair scoring
// ---------------------------------------------------------------------------
function similarityScore(a, b) {
  const titleSim = jaccard(bigrams(a.title), bigrams(b.title));
  const tagSim = tagJaccard(a.tags, b.tags);
  const sameCategory = a.category === b.category ? 1 : 0;
  const sameStage = a.stage === b.stage ? 1 : 0;

  // 加重平均（タイトル類似度を重視）
  const composite = titleSim * 0.6 + tagSim * 0.25 + sameCategory * 0.1 + sameStage * 0.05;

  return { composite, titleSim, tagSim, sameCategory, sameStage };
}

// ---------------------------------------------------------------------------
// Detect duplicates
// ---------------------------------------------------------------------------
function detectDuplicates(articles) {
  // 効率化: タイトルの最初の bigram で粗くインデックスを作って候補を絞る
  // 全ペア比較は 1300^2 = 1.7M 件で許容範囲だが、bigram filter で大幅短縮可能
  const pairs = [];
  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const titleBigramsA = bigrams(a.title);
    for (let j = i + 1; j < articles.length; j++) {
      const b = articles[j];
      const titleBigramsB = bigrams(b.title);
      // 粗いフィルタ: タイトルの bigram 共有が 1つ以上ないペアはスキップ
      let shared = 0;
      for (const x of titleBigramsA) {
        if (titleBigramsB.has(x)) {
          shared++;
          if (shared > 0) break;
        }
      }
      if (shared === 0) continue;

      const sim = similarityScore(a, b);
      if (sim.composite >= THRESHOLD) {
        pairs.push({ a, b, ...sim });
      }
    }
  }
  pairs.sort((x, y) => y.composite - x.composite);
  return pairs;
}

// ---------------------------------------------------------------------------
// Recommend which to keep (higher score, more references, newer)
// ---------------------------------------------------------------------------
function recommendKeep(a, b) {
  // 残すべき記事を判定（複合スコアの高いほう）
  const scoreA =
    a.score * 0.4 +
    a.referencesCount * 5 +
    (a.updatedAt ? new Date(a.updatedAt).getTime() / 1e10 : 0) +
    (a.tags?.length ?? 0);
  const scoreB =
    b.score * 0.4 +
    b.referencesCount * 5 +
    (b.updatedAt ? new Date(b.updatedAt).getTime() / 1e10 : 0) +
    (b.tags?.length ?? 0);
  return scoreA >= scoreB ? a : b;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
function run() {
  const articles = getAllArticles();
  const pairs = detectDuplicates(articles).slice(0, LIMIT);

  if (JSON_OUT) {
    console.log(
      JSON.stringify(
        pairs.map((p) => ({
          composite: Number(p.composite.toFixed(3)),
          titleSim: Number(p.titleSim.toFixed(3)),
          tagSim: Number(p.tagSim.toFixed(3)),
          sameCategory: !!p.sameCategory,
          sameStage: !!p.sameStage,
          keep: recommendKeep(p.a, p.b).slug,
          a: { slug: p.a.slug, title: p.a.title, category: p.a.category, score: p.a.score },
          b: { slug: p.b.slug, title: p.b.title, category: p.b.category, score: p.b.score },
        })),
        null,
        2,
      ),
    );
    return;
  }

  if (CSV_OUT) {
    console.log('composite,titleSim,tagSim,sameCategory,recommend_keep,slug_a,slug_b,title_a,title_b');
    for (const p of pairs) {
      const keep = recommendKeep(p.a, p.b).slug;
      const esc = (s) => `"${(s || '').replace(/"/g, '""')}"`;
      console.log(
        `${p.composite.toFixed(3)},${p.titleSim.toFixed(3)},${p.tagSim.toFixed(3)},${!!p.sameCategory},${esc(keep)},${esc(p.a.slug)},${esc(p.b.slug)},${esc(p.a.title)},${esc(p.b.title)}`,
      );
    }
    return;
  }

  // Console (default)
  console.log(`\n🔍 重複検出（しきい値: ${THRESHOLD}）`);
  console.log('─'.repeat(78));
  console.log(`記事総数: ${articles.length}件`);
  console.log(`重複候補ペア: ${pairs.length}件（上位${LIMIT}件まで表示）\n`);

  if (pairs.length === 0) {
    console.log('✅ 重複候補は見つかりませんでした。');
    return;
  }

  const strong = pairs.filter((p) => p.composite >= 0.75);
  const weak = pairs.filter((p) => p.composite < 0.75);
  console.log(`🚨 強い重複候補（>= 0.75）: ${strong.length}件`);
  console.log(`⚠️  弱い重複候補（< 0.75）: ${weak.length}件\n`);

  for (const p of pairs) {
    const keep = recommendKeep(p.a, p.b);
    const drop = keep === p.a ? p.b : p.a;
    const flag = p.composite >= 0.75 ? '🚨' : '⚠️ ';
    console.log(
      `${flag} score=${p.composite.toFixed(3)} title=${p.titleSim.toFixed(2)} tag=${p.tagSim.toFixed(2)}`,
    );
    console.log(`   KEEP: ${keep.slug}`);
    console.log(`         ${keep.title}`);
    console.log(`   DROP: ${drop.slug}`);
    console.log(`         ${drop.title}`);
    console.log('');
  }
}

run();
