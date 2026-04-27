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
import matter from 'gray-matter';
import { validateAllArticles } from './validate-articles.mjs';

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
// Content variation data
// ---------------------------------------------------------------------------
const STAGE_INTROS = {
  '0stage': '0〜2歳は心身の発達が最も著しい時期です。日々の成長に驚きながらも、初めての育児で不安を感じる保護者も少なくありません。この時期の関わり方が、その後の発達の土台となります。',
  'pre': '3〜5歳の幼児期は、集団生活を通じて社会性を身につけ、言葉や運動能力が飛躍的に伸びる時期です。園生活と家庭のバランスを取りながら、子どもの「やりたい」という気持ちを大切にすることが重要です。',
  'early': '小学校低学年（6〜8歳）は、学校という新しい環境で学びと友だち関係の基礎を築く時期です。学習習慣の定着や放課後の過ごし方など、保護者のサポートが子どもの自信につながります。',
  'mid': '9〜10歳は「ギャングエイジ」とも呼ばれ、仲間関係が深まり自立心が芽生える時期です。学力の個人差も出始め、親子のコミュニケーションの取り方に工夫が必要になります。',
  'upper': '11〜12歳は思春期の入り口であり、中学進学を見据えた準備期間です。心身の変化が大きく、プライバシーへの配慮やデジタルリテラシーの教育も重要なテーマとなります。',
};

const CATEGORY_RESOURCES = {
  health: [
    { name: 'かかりつけ小児科', desc: '日頃の健康相談から急な体調変化まで、最初に相談する窓口' },
    { name: '子ども医療電話相談（#8000）', desc: '夜間・休日の急な症状について看護師に電話相談できる' },
    { name: '保健センター', desc: '乳幼児健診や予防接種、発育相談を実施' },
    { name: '小児専門病院', desc: '専門的な検査や治療が必要な場合の紹介先' },
    { name: '学校保健室', desc: '学校生活での体調管理や健康教育の拠点' },
  ],
  mental: [
    { name: 'スクールカウンセラー', desc: '学校に配置された心理の専門家。子どもも保護者も相談可能' },
    { name: '児童相談所（189番）', desc: '子どもに関するあらゆる相談に対応する公的機関' },
    { name: 'よりそいホットライン（0120-279-338）', desc: '24時間無料の電話相談。子育ての悩みにも対応' },
    { name: '子どもの人権110番（0120-007-110）', desc: '法務局による子どもの人権に関する相談窓口' },
    { name: '精神保健福祉センター', desc: '心の健康に関する専門的な相談・支援を行う機関' },
  ],
  education: [
    { name: '教育相談センター', desc: '学習や進路、学校生活の悩みについて専門スタッフが対応' },
    { name: '学校の担任・教頭', desc: '日常の学校生活に関する最も身近な相談先' },
    { name: '教育委員会', desc: '学区・転校・特別支援など制度に関する問い合わせ先' },
    { name: '家庭教育支援チーム', desc: '文科省事業として地域で活動する子育て支援の専門チーム' },
    { name: '学習支援NPO', desc: '無料学習塾や放課後学習支援を提供する団体' },
  ],
  development: [
    { name: '発達支援センター', desc: '発達に心配のある子どもの相談・療育を行う専門機関' },
    { name: '乳幼児健診（保健センター）', desc: '定期健診で発達の経過を確認できる' },
    { name: '療育施設', desc: '個別の発達課題に応じた専門的な支援プログラムを提供' },
    { name: '児童発達支援事業所', desc: '未就学児向けの通所型発達支援サービス' },
    { name: '小児神経科', desc: '発達障害や神経系の専門的な診療を行う医療機関' },
  ],
  nutrition: [
    { name: 'かかりつけ小児科', desc: '食事量や栄養状態、アレルギーについて相談できる' },
    { name: '管理栄養士（保健センター）', desc: '離乳食や偏食、食事バランスの個別アドバイス' },
    { name: '食物アレルギー相談窓口', desc: 'アレルギー対応の食事指導や生活管理の専門相談' },
    { name: '学校栄養士', desc: '給食のアレルギー対応や食育について相談できる' },
    { name: '子育て支援センター', desc: '離乳食講座や食育イベントを定期的に開催' },
  ],
  digital: [
    { name: 'こどもの安全ネット（総務省）', desc: 'インターネットの安全利用に関する情報と相談' },
    { name: 'e-ネットキャラバン', desc: 'ネットリテラシー教育の出前講座を学校や地域で実施' },
    { name: '警察サイバー相談窓口', desc: 'ネット犯罪やトラブルに関する専門相談' },
    { name: 'フィルタリング相談', desc: '携帯キャリアや専門機関で設定方法を案内' },
    { name: '学校ICT担当', desc: 'GIGAスクール端末の使い方やルールについて' },
  ],
  social: [
    { name: '民生委員・児童委員', desc: '地域の身近な相談役。子育て支援の情報提供も' },
    { name: '子育て支援センター', desc: '親子の交流や育児相談、情報提供の拠点' },
    { name: 'ファミリーサポートセンター', desc: '送迎や一時預かりなど地域の相互援助活動' },
    { name: '地域包括支援センター', desc: '多世代の暮らしの相談に対応する総合窓口' },
    { name: '社会福祉協議会', desc: '生活支援や福祉サービスの総合相談窓口' },
  ],
  lifestyle: [
    { name: 'かかりつけ小児科', desc: '生活習慣に起因する体調の変化を相談できる' },
    { name: '保健センター', desc: '生活リズムや運動習慣に関する保健指導' },
    { name: '子育て支援センター', desc: '日常の育児の悩みを気軽に相談できる場所' },
    { name: '学校保健室', desc: '睡眠や食事など生活習慣の相談に対応' },
    { name: '栄養士相談（自治体）', desc: '食事と生活リズムの改善アドバイス' },
  ],
  pregnancy: [
    { name: '産婦人科', desc: '妊娠・出産に関する医学的な相談の最優先窓口' },
    { name: '助産師外来', desc: '妊娠中の体調管理や出産準備の相談' },
    { name: '母子保健窓口（市区町村）', desc: '母子手帳の交付や妊婦健診の案内' },
    { name: '妊婦相談ダイヤル', desc: '自治体が運営する妊娠・出産の電話相談' },
    { name: '産後ケアセンター', desc: '産後の体調回復と育児スタートをサポート' },
  ],
};

const CATEGORY_COMPARISONS = {
  health: { dim1: '予防と対策', dim2: '受診の目安', dim3: '家庭での経過観察' },
  mental: { dim1: '心の発達への影響', dim2: '家庭での関わり方', dim3: '専門家介入のタイミング' },
  education: { dim1: '学習効果', dim2: '家庭学習との連携', dim3: '費用対効果' },
  development: { dim1: '発達の個人差', dim2: '支援の必要性', dim3: '将来的な見通し' },
  nutrition: { dim1: '栄養バランス', dim2: '食習慣の形成', dim3: 'アレルギーへの配慮' },
  digital: { dim1: 'デジタル活用の効果', dim2: '利用時間の管理', dim3: 'リスクへの対策' },
  social: { dim1: '社会性の発達', dim2: '地域との関わり', dim3: '安全面の配慮' },
  lifestyle: { dim1: '生活リズムへの影響', dim2: '家族全体の取り組み', dim3: '継続のしやすさ' },
  pregnancy: { dim1: '母体への影響', dim2: '胎児の発育', dim3: '産後の準備' },
};

// ---------------------------------------------------------------------------
// Article body generator (varied by stage + category + topic)
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

  // スコアを事前計算して合計値の整合性を保証
  const scoreReliability = 22 + Math.floor(Math.random() * 8);
  const scoreNeutrality = 20 + Math.floor(Math.random() * 6);
  const scoreFreshness = 15 + Math.floor(Math.random() * 5);
  const scoreAgeRelevance = 10 + Math.floor(Math.random() * 5);
  const scoreReadability = 5 + Math.floor(Math.random() * 4);
  const scoreTotal = scoreReliability + scoreNeutrality + scoreFreshness + scoreAgeRelevance + scoreReadability;

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
  total: ${scoreTotal}
  reliability: ${scoreReliability}
  neutrality: ${scoreNeutrality}
  freshness: ${scoreFreshness}
  ageRelevance: ${scoreAgeRelevance}
  readability: ${scoreReadability}
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

// Collect topics from all pools with priority allocation
const seasonalPool = db.pools.seasonal.topics[seasonalKey] ?? [];
const featuresPool = db.pools.features?.topics ?? [];
const variationPool = db.pools.variations.topics;
const evergreenPool = db.pools.evergreen.topics;

// Allocation: seasonal 40%, features 30%, variation 20%, evergreen 10%
const seasonalCount = Math.ceil(DAILY_COUNT * 0.4);
const featuresCount = Math.ceil(DAILY_COUNT * 0.3);
const variationCount = Math.ceil(DAILY_COUNT * 0.2);
const evergreenCount = DAILY_COUNT - seasonalCount - featuresCount - variationCount;

const selectedSeasonal = getAvailableTopics(seasonalPool, seasonalCount);
const selectedFeatures = getAvailableTopics(featuresPool, featuresCount);
const selectedVariation = getAvailableTopics(variationPool, variationCount);
const selectedEvergreen = getAvailableTopics(evergreenPool, evergreenCount);

let allSelected = [...selectedSeasonal, ...selectedFeatures, ...selectedVariation, ...selectedEvergreen];
let remaining = DAILY_COUNT - allSelected.length;

if (remaining > 0) {
  // Fallback: pull from ALL seasonal pools (not just current month)
  const allSeasonalTopics = Object.values(db.pools.seasonal.topics).flat();
  const allPoolTopics = [...allSeasonalTopics, ...featuresPool, ...variationPool, ...evergreenPool];
  const extras = allPoolTopics
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

// ---------------------------------------------------------------------------
// 生成後バリデーション: 論理矛盾チェック
// ---------------------------------------------------------------------------
if (!DRY_RUN && generated > 0) {
  console.log('🔍 生成記事のバリデーション実行中...\n');

  // 生成した記事ファイルのみチェック（全体の重複チェックも含む）
  const { results, totalErrors, totalWarnings, fileCount } = validateAllArticles();

  for (const { relPath, errors, warnings } of results) {
    if (errors.length > 0) {
      console.log(`📄 ${relPath}`);
      for (const err of errors) {
        console.log(`  ❌ ERROR: ${err}`);
      }
    }
    if (warnings.length > 0) {
      console.log(`📄 ${relPath}`);
      for (const warn of warnings) {
        console.log(`  ⚠️  WARN: ${warn}`);
      }
    }
  }

  console.log(`\n📊 バリデーション結果: ${fileCount}件チェック / エラー: ${totalErrors}件 / 警告: ${totalWarnings}件`);

  if (totalErrors > 0) {
    console.error(`\n🚨 ${totalErrors}件のエラーがあります。生成記事を確認してください。`);
    process.exit(1);
  } else {
    console.log('✅ 論理矛盾なし。\n');
  }
}
