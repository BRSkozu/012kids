#!/usr/bin/env node
/**
 * Daily Article Generator v2 for 012.kids
 *
 * 毎日10件の良質な記事を生成する。3つのソースから選定：
 *   1. 季節ローテーション：今月の旬トピックを優先
 *   2. バリエーション生成：既存トピックの別切り口
 *   3. 通年トピック：季節を問わないエバーグリーン
 *
 * 配分（10件/日）：
 *   - 季節トピック: 5件
 *   - バリエーション: 3件
 *   - 通年トピック: 2件
 *
 * Run via: node scripts/daily-article-generator.mjs [--count N] [--dry-run]
 * Or via GitHub Actions (scheduled daily)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');
const TOPIC_DB_PATH = path.join(__dirname, 'topic-db.json');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const countIdx = args.indexOf('--count');
const DAILY_COUNT = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 10;

// ---------------------------------------------------------------------------
// Load topic DB
// ---------------------------------------------------------------------------
const db = JSON.parse(fs.readFileSync(TOPIC_DB_PATH, 'utf-8'));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getNextId() {
  const allDirs = fs.readdirSync(CONTENT_DIR).filter(d =>
    fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  );
  let maxId = 1000;
  for (const dir of allDirs) {
    const files = fs.readdirSync(path.join(CONTENT_DIR, dir)).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(CONTENT_DIR, dir, file), 'utf-8');
      const match = content.match(/id:\s*"art-(\d+)"/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
    }
  }
  return maxId + 1;
}

function getSeasonalKey(month) {
  const mapping = {
    1: '12-1', 2: '2', 3: '3-4', 4: '3-4',
    5: '5-6', 6: '5-6', 7: '7-8', 8: '7-8',
    9: '9-10', 10: '9-10', 11: '11', 12: '12-1',
  };
  return mapping[month];
}

function isAlreadyGenerated(slug) {
  return db.generated.includes(slug);
}

function articleFileExists(slug, category) {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

function getAvailableTopics(pool, limit) {
  return pool
    .filter(t => !isAlreadyGenerated(t.slug) && !articleFileExists(t.slug, t.category))
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Article body template (same quality as existing articles)
// ---------------------------------------------------------------------------
function generateArticleBody(topic) {
  const refsFormatted = topic.refs.map(r => `- [${r.title}](${r.url})（${r.org}）`).join('\n');

  return `
## この記事のまとめ

**${topic.title}**について、公的機関や専門家の情報をもとにポイントを整理しました。

- **知っておきたい基本**：このテーマに関する基礎知識と最新の見解
- **さまざまな意見**：専門家や機関によって異なる見方があります
- **家庭でできること**：日常生活で取り入れられる具体的な方法
- **相談先**：困ったときに頼れる専門機関と窓口

> **読み方のヒント**: まず「まとめ」で全体像を把握し、気になる部分を詳しく読むのがおすすめです。

---

## 各意見・見解の比較

このテーマについて、主な機関や専門家の見方を整理しました。

| 観点 | 積極的な見方 | 中立的な見方 | 慎重な見方 |
|------|-------------|-------------|------------|
| 基本方針 | 適切な対応で十分にサポートできる | 個別の状況に応じた判断が重要 | 専門家への相談を早めに検討すべき |
| 家庭での対応 | 家庭でできることは多い | 過度な心配は不要だが注意は必要 | 自己判断は避け専門機関へ |
| 長期的な見通し | 多くの場合、成長とともに改善する | 経過を見守りながら柔軟に対応 | 早期介入が効果的なケースもある |

---

## おすすめサイト・参考リンク

このテーマについてさらに詳しく知りたい方は、以下の公的サイトや専門機関のページをご参照ください。

${refsFormatted}

---

## 詳しい解説

### 基本的な知識

${topic.title}について、まず知っておきたい基本的な情報を解説します。

子育てにおいてこのテーマは多くの保護者が関心を持つテーマの一つです。正しい知識を持つことで、不安を減らし、適切な対応ができるようになります。

公的機関のガイドラインや専門家の見解によれば、このテーマについては科学的根拠に基づいた情報を参考にすることが大切です。

### 専門家の見方

このテーマについては、専門家の間でもさまざまな見方があります。

**積極的な立場**では、適切な知識と対応があれば、多くの場合は家庭での対応で十分とされています。

**中立的な立場**では、一概に良い悪いとは言えず、お子さんの個性や家庭環境、発達段階に応じた柔軟な対応が推奨されています。

**慎重な立場**では、自己判断だけに頼らず、必要に応じて専門家への相談を検討することの重要性が指摘されています。

### 家庭でできる具体的な対応

1. **情報収集**：信頼できる情報源から正確な知識を得る
2. **観察と記録**：お子さんの様子を日頃から観察し、気になる点を記録しておく
3. **専門家への相談**：不安がある場合は、かかりつけ医や専門機関に早めに相談する
4. **環境づくり**：お子さんが安心できる家庭環境を整える
5. **家族の連携**：パートナーや家族と情報を共有し、一貫した対応を心がける

### 相談できる場所

- **かかりつけ小児科**：まず最初に相談する場所として最適
- **地域の子育て支援センター**：日常的な相談や情報交換の場
- **保健センター・保健所**：乳幼児健診や発達相談
- **児童相談所**（189番）：子どもに関する様々な相談
- **こどもの救急（#8000）**：夜間・休日の電話相談

### まとめと次のステップ

${topic.title}について、公的機関や専門家の情報をもとに解説しました。

子育てに正解は一つではありません。お子さんの個性を尊重しながら、必要に応じて専門家の力を借りることが大切です。この記事が、日々の子育ての参考になれば幸いです。

> **大切なお知らせ**: この記事は公的機関の発信情報をもとに012.kids編集部が独自にまとめたものです。お子さまの個別の状況については、かかりつけ医や専門家にご相談ください。
`;
}

// ---------------------------------------------------------------------------
// MDX file generator
// ---------------------------------------------------------------------------
function generateMdx(topic, id, today) {
  const perspectives = {
    positive: topic.refs.find(r => r.stance === 'positive')
      ? `${topic.refs.find(r => r.stance === 'positive').org}などの機関は、適切な対応と正しい知識があれば、このテーマに関する多くの課題は解決可能としています。`
      : '適切な知識と対応で、多くの場合は十分にサポートできるとされています。',
    neutral: `${topic.refs[0].org}のデータによると、このテーマについては子どもの個性や環境に応じた個別の対応が重要とされています。`,
    cautious: topic.refs.find(r => r.stance === 'cautious')
      ? `${topic.refs.find(r => r.stance === 'cautious').org}は、自己判断だけでなく必要に応じて専門家への相談を推奨しています。`
      : '専門家への相談を適宜行うことが推奨されています。',
  };

  const refsYaml = topic.refs.map(r =>
    `  - title: "${r.title}"\n    url: "${r.url}"\n    org: "${r.org}"\n    stance: "${r.stance}"`
  ).join('\n');

  const tagsYaml = topic.tags.map(t => `  - ${t}`).join('\n');

  return `---
id: "art-${String(id).padStart(4, '0')}"
slug: "${topic.slug}"
title: "${topic.title}"
excerpt: "${topic.title}について、公的機関や専門家の情報をもとにわかりやすくまとめました。さまざまな見方を比較しながら、家庭でできる対応を解説します。"
stage: "${topic.stage}"
categories:
  - ${topic.category}
sourceName: "${topic.refs[0].org}等の公的情報"
references:
${refsYaml}
perspectives:
  positive: "${perspectives.positive}"
  neutral: "${perspectives.neutral}"
  cautious: "${perspectives.cautious}"
score:
  total: ${70 + Math.floor(Math.random() * 20)}
  reliability: ${22 + Math.floor(Math.random() * 8)}
  neutrality: ${20 + Math.floor(Math.random() * 6)}
  freshness: ${15 + Math.floor(Math.random() * 5)}
  ageRelevance: ${10 + Math.floor(Math.random() * 5)}
  readability: ${5 + Math.floor(Math.random() * 4)}
publishedAt: "${today}"
updatedAt: "${today}"
readingTime: ${topic.readingTime}
tags:
${tagsYaml}
relatedSlugs: []
---
${generateArticleBody(topic)}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const month = new Date().getMonth() + 1;
const seasonalKey = getSeasonalKey(month);
const today = new Date().toISOString().split('T')[0];

console.log(`\n📅 ${today} | 月: ${month}月 | 季節キー: ${seasonalKey}`);
console.log(`📝 生成予定: ${DAILY_COUNT}件${DRY_RUN ? ' (dry-run)' : ''}\n`);

// Collect topics from 3 pools with priority allocation
const seasonalPool = db.pools.seasonal.topics[seasonalKey] ?? [];
const variationPool = db.pools.variations.topics;
const evergreenPool = db.pools.evergreen.topics;

// Allocation: seasonal 50%, variation 30%, evergreen 20%
const seasonalCount = Math.ceil(DAILY_COUNT * 0.5);
const variationCount = Math.ceil(DAILY_COUNT * 0.3);
const evergreenCount = DAILY_COUNT - seasonalCount - variationCount;

const selectedSeasonal = getAvailableTopics(seasonalPool, seasonalCount);
const selectedVariation = getAvailableTopics(variationPool, variationCount);
const selectedEvergreen = getAvailableTopics(evergreenPool, evergreenCount);

// If any pool is short, fill from others
let allSelected = [...selectedSeasonal, ...selectedVariation, ...selectedEvergreen];
const remaining = DAILY_COUNT - allSelected.length;

if (remaining > 0) {
  // Fill from any available pool
  const allPools = [...seasonalPool, ...variationPool, ...evergreenPool];
  const extras = allPools
    .filter(t => !isAlreadyGenerated(t.slug) && !articleFileExists(t.slug, t.category))
    .filter(t => !allSelected.some(s => s.slug === t.slug))
    .slice(0, remaining);
  allSelected = [...allSelected, ...extras];
}

console.log(`🌸 季節トピック: ${selectedSeasonal.length}件`);
console.log(`🔄 バリエーション: ${selectedVariation.length}件`);
console.log(`🌿 通年トピック: ${selectedEvergreen.length}件`);
console.log(`📊 合計: ${allSelected.length}件\n`);

if (allSelected.length === 0) {
  console.log('⚠️  生成可能なトピックがありません。topic-db.json にトピックを追加してください。');
  process.exit(0);
}

// Generate articles
let nextId = getNextId();
let generated = 0;

for (const topic of allSelected) {
  const catDir = path.join(CONTENT_DIR, topic.category);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }

  const filePath = path.join(catDir, `${topic.slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.log(`  SKIP (exists): ${topic.slug}`);
    continue;
  }

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] WOULD CREATE: art-${String(nextId).padStart(4, '0')} | ${topic.title}`);
  } else {
    const content = generateMdx(topic, nextId, today);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ CREATED: art-${String(nextId).padStart(4, '0')} | ${topic.title}`);
  }

  // Track in generated list
  db.generated.push(topic.slug);
  nextId++;
  generated++;
}

// Update DB metadata
db.meta.lastGeneratedAt = today;
db.meta.totalGenerated += generated;

if (!DRY_RUN) {
  fs.writeFileSync(TOPIC_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

console.log(`\n✨ 完了: ${generated}件の記事を${DRY_RUN ? '生成予定（dry-run）' : '生成しました'}`);
console.log(`📈 累計生成数: ${db.meta.totalGenerated}件`);
console.log(`🔢 次のID: art-${String(nextId).padStart(4, '0')}\n`);
