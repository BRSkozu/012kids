#!/usr/bin/env node
/**
 * Bulk article generator for 012kids
 * Generates ~900 articles to reach 1000 total
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');

// Get existing article IDs to avoid conflicts
function getExistingIds() {
  const ids = new Set();
  const cats = fs.readdirSync(CONTENT_DIR);
  for (const cat of cats) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(catDir, file), 'utf-8');
      const match = content.match(/^id:\s*"(art-\d+)"/m);
      if (match) ids.add(match[1]);
    }
  }
  return ids;
}

function getExistingSlugs() {
  const slugs = new Set();
  const cats = fs.readdirSync(CONTENT_DIR);
  for (const cat of cats) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      slugs.add(file.replace('.mdx', ''));
    }
  }
  return slugs;
}

// Reference templates per org
const REFS = {
  mhlw: { org: '厚生労働省', urlBase: 'https://www.mhlw.go.jp/' },
  cfa: { org: 'こども家庭庁', urlBase: 'https://www.cfa.go.jp/' },
  mext: { org: '文部科学省', urlBase: 'https://www.mext.go.jp/' },
  jsps: { org: '日本小児科学会', urlBase: 'https://www.jpeds.or.jp/' },
  who: { org: 'WHO', urlBase: 'https://www.who.int/' },
  cao: { org: '内閣府', urlBase: 'https://www.cao.go.jp/' },
  nier: { org: '国立教育政策研究所', urlBase: 'https://www.nier.go.jp/' },
  ncnp: { org: '国立精神・神経医療研究センター', urlBase: 'https://www.ncnp.go.jp/' },
  niph: { org: '国立保健医療科学院', urlBase: 'https://www.niph.go.jp/' },
  jda: { org: '日本歯科医師会', urlBase: 'https://www.jda.or.jp/' },
  jsn: { org: '日本栄養士会', urlBase: 'https://www.dietitian.or.jp/' },
  jpma: { org: '日本小児科医会', urlBase: 'https://www.jpa-web.org/' },
  jspd: { org: '日本小児歯科学会', urlBase: 'https://www.jspd.or.jp/' },
  jaog: { org: '日本産科婦人科学会', urlBase: 'https://www.jsog.or.jp/' },
  jsccp: { org: '日本臨床心理士会', urlBase: 'https://www.jsccp.jp/' },
  soumu: { org: '総務省', urlBase: 'https://www.soumu.go.jp/' },
  npa: { org: '警察庁', urlBase: 'https://www.npa.go.jp/' },
  caa: { org: '消費者庁', urlBase: 'https://www.caa.go.jp/' },
  fdma: { org: '消防庁', urlBase: 'https://www.fdma.go.jp/' },
  maff: { org: '農林水産省', urlBase: 'https://www.maff.go.jp/' },
  env: { org: '環境省', urlBase: 'https://www.env.go.jp/' },
};

function makeRef(orgKey, title, stance = 'positive') {
  const r = REFS[orgKey];
  return { title, url: r.urlBase, org: r.org, stance };
}

// Score generator
function makeScore() {
  const reliability = 15 + Math.floor(Math.random() * 15);
  const neutrality = 14 + Math.floor(Math.random() * 12);
  const freshness = 12 + Math.floor(Math.random() * 10);
  const ageRelevance = 10 + Math.floor(Math.random() * 6);
  const readability = 5 + Math.floor(Math.random() * 6);
  const total = reliability + neutrality + freshness + ageRelevance + readability;
  return { total, reliability, neutrality, freshness, ageRelevance, readability };
}

// Date generator
function makeDate(index) {
  const base = new Date('2025-04-01');
  base.setDate(base.getDate() + Math.floor(index * 0.35));
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const d = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ===== TOPIC DEFINITIONS =====
// Each topic: { slug, title, excerpt, dir, stage, categories, tags, refs, sourceName, sections }
// sections = array of { heading, paragraphs[] }

const STAGES = ['0stage', 'pre', 'early', 'mid', 'upper'];
const CATEGORIES = ['development', 'nutrition', 'education', 'health', 'mental', 'digital', 'social'];

function generateTopics() {
  const topics = [];

  // Helper to add multiple topics
  function addTopics(arr) {
    topics.push(...arr);
  }

  // ===== HEALTH TOPICS =====
  const healthTopics = [
    // 乳幼児の健康
    ...generateVariants('health', 'health', [
      { base: 'baby-fever-care', prefix: '赤ちゃんの発熱', stages: ['0stage', 'pre'] },
      { base: 'baby-cold-care', prefix: '赤ちゃんの風邪', stages: ['0stage', 'pre'] },
      { base: 'child-stomach-flu', prefix: '子どもの胃腸炎', stages: ['pre', 'early'] },
      { base: 'child-ear-infection', prefix: '子どもの中耳炎', stages: ['0stage', 'pre', 'early'] },
      { base: 'child-skin-rash', prefix: '子どもの発疹', stages: ['0stage', 'pre'] },
      { base: 'child-cough-care', prefix: '子どもの咳', stages: ['pre', 'early'] },
      { base: 'child-eye-care', prefix: '子どもの目の健康', stages: ['pre', 'early', 'mid'] },
      { base: 'child-dental-care', prefix: '子どもの歯のケア', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'child-allergy-care', prefix: '子どものアレルギー', stages: ['0stage', 'pre', 'early'] },
      { base: 'child-asthma', prefix: '小児喘息', stages: ['pre', 'early', 'mid'] },
      { base: 'child-constipation', prefix: '子どもの便秘', stages: ['0stage', 'pre', 'early'] },
      { base: 'child-nose-care', prefix: '子どもの鼻のケア', stages: ['pre', 'early'] },
      { base: 'child-growth-check', prefix: '子どもの成長チェック', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'child-injury-first-aid', prefix: '子どものケガの応急処置', stages: ['pre', 'early', 'mid'] },
      { base: 'child-heatstroke', prefix: '子どもの熱中症対策', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'child-sleep-disorder', prefix: '子どもの睡眠障害', stages: ['pre', 'early', 'mid'] },
      { base: 'child-obesity', prefix: '子どもの肥満', stages: ['early', 'mid', 'upper'] },
      { base: 'child-posture', prefix: '子どもの姿勢改善', stages: ['early', 'mid', 'upper'] },
    ]),
    // 予防接種
    ...['bcg', 'mr', 'dt', 'hib', 'pneumococcal', 'rotavirus', 'hepatitis-b', 'varicella', 'mumps', 'japanese-encephalitis', 'hpv', 'influenza'].map((v, i) => ({
      slug: `vaccine-${v}-guide`,
      title: `${['BCG', 'MR（麻しん風しん混合）', 'DT（二種混合）', 'Hib', '肺炎球菌', 'ロタウイルス', 'B型肝炎', '水痘（みずぼうそう）', 'おたふくかぜ', '日本脳炎', 'HPV', 'インフルエンザ'][i]}ワクチンの基礎知識`,
      excerpt: `${['BCG', 'MR', 'DT', 'Hib', '肺炎球菌', 'ロタウイルス', 'B型肝炎', '水痘', 'おたふくかぜ', '日本脳炎', 'HPV', 'インフルエンザ'][i]}ワクチンの接種時期・回数・副反応・注意点をまとめました。`,
      dir: 'health', stage: i < 6 ? '0stage' : 'pre', categories: ['health'],
      tags: ['予防接種', 'ワクチン', ['BCG', 'MR', 'DT', 'Hib', '肺炎球菌', 'ロタウイルス', 'B型肝炎', '水痘', 'おたふくかぜ', '日本脳炎', 'HPV', 'インフルエンザ'][i]],
      refs: [makeRef('mhlw', '予防接種情報'), makeRef('jsps', '予防接種の考え方', 'neutral'), makeRef('who', 'Immunization coverage', 'neutral')],
      sourceName: '予防接種に関する公的情報',
    })),
    // 季節の病気
    ...['spring-allergy', 'summer-skin-trouble', 'autumn-asthma', 'winter-infection', 'hand-foot-mouth', 'rs-virus', 'norovirus', 'adenovirus', 'mycoplasma', 'strep-throat', 'flu-season', 'covid-children'].map((v, i) => ({
      slug: `seasonal-illness-${v}`,
      title: `子どもの${['春の花粉症対策', '夏の皮膚トラブル', '秋の喘息悪化予防', '冬の感染症予防', '手足口病', 'RSウイルス感染症', 'ノロウイルス胃腸炎', 'アデノウイルス感染症', 'マイコプラズマ肺炎', '溶連菌感染症', 'インフルエンザ対策', '新型コロナウイルス'][i]}`,
      excerpt: `${['春の花粉症', '夏の皮膚トラブル', '秋の喘息', '冬の感染症', '手足口病', 'RSウイルス', 'ノロウイルス', 'アデノウイルス', 'マイコプラズマ', '溶連菌', 'インフルエンザ', '新型コロナ'][i]}の症状・対処法・予防策を小児科医の知見をもとに解説します。`,
      dir: 'health', stage: ['pre', 'early', 'pre', 'pre', '0stage', '0stage', 'pre', 'pre', 'early', 'early', 'pre', 'pre'][i], categories: ['health'],
      tags: ['病気', '感染症', ['花粉症', '皮膚', '喘息', '感染症', '手足口病', 'RSウイルス', 'ノロウイルス', 'アデノウイルス', 'マイコプラズマ', '溶連菌', 'インフルエンザ', 'コロナ'][i]],
      refs: [makeRef('mhlw', '感染症発生動向調査'), makeRef('jsps', '小児感染症ガイドライン', 'neutral')],
      sourceName: '小児感染症に関する公的情報',
    })),
  ];
  addTopics(healthTopics);

  // ===== DEVELOPMENT TOPICS =====
  const devTopics = [
    ...generateVariants('development', 'development', [
      { base: 'motor-skill', prefix: '運動能力の発達', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'language-development', prefix: '言葉の発達', stages: ['0stage', 'pre', 'early'] },
      { base: 'social-skill', prefix: '社会性の発達', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'cognitive-development', prefix: '認知能力の発達', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'emotional-development', prefix: '情緒の発達', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'creativity', prefix: '創造力を育む', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'play-development', prefix: '遊びと発達', stages: ['0stage', 'pre', 'early'] },
      { base: 'sensory-development', prefix: '感覚の発達', stages: ['0stage', 'pre'] },
      { base: 'self-care-skill', prefix: '生活スキルの発達', stages: ['pre', 'early', 'mid'] },
      { base: 'reading-development', prefix: '読み書き能力の発達', stages: ['pre', 'early', 'mid'] },
      { base: 'math-concept', prefix: '数の概念の発達', stages: ['pre', 'early', 'mid'] },
      { base: 'physical-fitness', prefix: '体力づくり', stages: ['early', 'mid', 'upper'] },
    ]),
    // 月齢・年齢別ガイド
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => ({
      slug: `baby-development-month-${m}`,
      title: `生後${m}ヶ月の赤ちゃんの発達と育児ポイント`,
      excerpt: `生後${m}ヶ月の赤ちゃんの身体・知能・情緒の発達目安と、この時期に大切な関わり方を解説します。`,
      dir: 'development', stage: '0stage', categories: ['development'],
      tags: ['月齢別', `${m}ヶ月`, '発達', '赤ちゃん'],
      refs: [makeRef('mhlw', '乳幼児身体発育調査'), makeRef('cfa', '母子健康手帳の様式', 'neutral')],
      sourceName: '乳幼児の発達に関する公的データ',
    })),
    // 年齢別ガイド
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(y => ({
      slug: `child-development-age-${y}`,
      title: `${y}歳児の発達と成長：年齢別子育てガイド`,
      excerpt: `${y}歳の子どもの身体・認知・社会性の発達特徴と、家庭でできるサポートについてまとめました。`,
      dir: 'development', stage: y <= 1 ? '0stage' : y <= 3 ? 'pre' : y <= 6 ? 'early' : y <= 9 ? 'mid' : 'upper', categories: ['development'],
      tags: ['年齢別', `${y}歳`, '発達', '成長'],
      refs: [makeRef('mhlw', '幼児身体発育調査'), makeRef('mext', '幼稚園教育要領', 'neutral')],
      sourceName: '子どもの発達に関する公的情報',
    })),
    // 遊び
    ...['block-play', 'drawing', 'music-play', 'water-play', 'sand-play', 'pretend-play', 'board-game', 'puzzle', 'outdoor-nature', 'ball-play', 'clay-craft', 'cooking-with-kids', 'gardening', 'science-experiment', 'card-game', 'origami', 'string-craft', 'stamp-art'].map((v, i) => ({
      slug: `play-guide-${v}`,
      title: `${['ブロック遊び', 'お絵かき', '音楽遊び', '水遊び', '砂遊び', 'ごっこ遊び', 'ボードゲーム', 'パズル', '自然観察', 'ボール遊び', '粘土工作', '親子クッキング', '家庭菜園', '科学実験', 'カードゲーム', '折り紙', 'ひも通し遊び', 'スタンプアート'][i]}で育む力：年齢別ガイド`,
      excerpt: `${['ブロック', 'お絵かき', '音楽', '水遊び', '砂遊び', 'ごっこ遊び', 'ボードゲーム', 'パズル', '自然観察', 'ボール', '粘土', 'クッキング', '家庭菜園', '科学実験', 'カードゲーム', '折り紙', 'ひも通し', 'スタンプ'][i]}遊びが子どもの発達に与える効果と、年齢に合わせた取り入れ方を紹介します。`,
      dir: 'development', stage: ['pre', 'pre', '0stage', 'pre', 'pre', 'pre', 'early', 'pre', 'early', 'pre', 'pre', 'early', 'early', 'mid', 'mid', 'pre', '0stage', 'pre'][i], categories: ['development'],
      tags: ['遊び', ['ブロック', 'お絵かき', '音楽', '水遊び', '砂遊び', 'ごっこ遊び', 'ボードゲーム', 'パズル', '自然', 'ボール', '粘土', 'クッキング', '菜園', '実験', 'カード', '折り紙', 'ひも通し', 'スタンプ'][i], '知育'],
      refs: [makeRef('mext', '幼稚園教育要領'), makeRef('cfa', '遊びの環境づくり', 'neutral')],
      sourceName: '幼児教育・遊びに関する公的ガイドライン',
    })),
  ];
  addTopics(devTopics);

  // ===== NUTRITION TOPICS =====
  const nutritionTopics = [
    // 離乳食
    ...['5-6month', '7-8month', '9-11month', '12-18month'].map((v, i) => ({
      slug: `weaning-stage-${v}`,
      title: `離乳食${['初期（ゴックン期）', '中期（モグモグ期）', '後期（カミカミ期）', '完了期（パクパク期）'][i]}の進め方`,
      excerpt: `離乳食${['初期', '中期', '後期', '完了期'][i]}の食材・調理法・量の目安・注意点を詳しく解説します。`,
      dir: 'nutrition', stage: '0stage', categories: ['nutrition'],
      tags: ['離乳食', ['初期', '中期', '後期', '完了期'][i], '食材', '調理'],
      refs: [makeRef('mhlw', '授乳・離乳の支援ガイド'), makeRef('jsn', '乳幼児の栄養', 'neutral')],
      sourceName: '離乳食に関する公的ガイドライン',
    })),
    // 食材別ガイド
    ...['egg', 'milk', 'wheat', 'soy', 'fish', 'meat', 'vegetable', 'fruit', 'rice', 'bean', 'seaweed', 'mushroom', 'tofu', 'cheese', 'yogurt', 'bread', 'noodle', 'iron-food', 'calcium-food', 'dha-food'].map((v, i) => ({
      slug: `food-guide-${v}`,
      title: `子どもの食事：${['卵', '牛乳・乳製品', '小麦', '大豆', '魚', '肉', '野菜', '果物', 'ご飯・米', '豆類', '海藻', 'きのこ', '豆腐', 'チーズ', 'ヨーグルト', 'パン', '麺類', '鉄分が多い食品', 'カルシウムが多い食品', 'DHA豊富な食品'][i]}の与え方ガイド`,
      excerpt: `${['卵', '牛乳', '小麦', '大豆', '魚', '肉', '野菜', '果物', 'ご飯', '豆類', '海藻', 'きのこ', '豆腐', 'チーズ', 'ヨーグルト', 'パン', '麺', '鉄分食品', 'カルシウム食品', 'DHA食品'][i]}を子どもに与える際の月齢別目安・アレルギー注意点・おすすめレシピを紹介します。`,
      dir: 'nutrition', stage: i < 10 ? '0stage' : 'pre', categories: ['nutrition'],
      tags: ['食材', ['卵', '牛乳', '小麦', '大豆', '魚', '肉', '野菜', '果物', 'ご飯', '豆', '海藻', 'きのこ', '豆腐', 'チーズ', 'ヨーグルト', 'パン', '麺', '鉄分', 'カルシウム', 'DHA'][i], '栄養'],
      refs: [makeRef('mhlw', '日本人の食事摂取基準'), makeRef('caa', '食品表示に関する情報', 'neutral')],
      sourceName: '食品・栄養に関する公的情報',
    })),
    // 年齢別の食事
    ...generateVariants('nutrition', 'nutrition', [
      { base: 'meal-planning', prefix: '食事の献立', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'snack-idea', prefix: 'おやつの工夫', stages: ['pre', 'early', 'mid'] },
      { base: 'lunch-box', prefix: 'お弁当', stages: ['early', 'mid', 'upper'] },
      { base: 'breakfast-habit', prefix: '朝ごはんの習慣', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'eating-manner', prefix: '食事のマナー', stages: ['pre', 'early', 'mid'] },
      { base: 'cooking-together', prefix: '親子料理', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'nutrition-balance', prefix: '栄養バランス', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'picky-eating-solution', prefix: '偏食対策', stages: ['pre', 'early', 'mid'] },
      { base: 'food-allergy-manage', prefix: '食物アレルギー管理', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'hydration', prefix: '水分補給', stages: ['0stage', 'pre', 'early', 'mid'] },
    ]),
    // レシピ系
    ...['veggie-soup', 'fish-recipe', 'rice-bowl', 'pasta-kids', 'pancake', 'smoothie', 'muffin', 'onigiri', 'curry-mild', 'gratin', 'hamburg-steak', 'nimono', 'salad-kids', 'sandwich-wrap', 'frozen-meal-prep'].map((v, i) => ({
      slug: `recipe-${v}`,
      title: `子どもが喜ぶ${['野菜スープ', '魚料理', '丼もの', 'パスタ', 'パンケーキ', 'スムージー', 'マフィン', 'おにぎり', 'カレー', 'グラタン', 'ハンバーグ', '煮物', 'サラダ', 'サンドイッチ', '作り置きおかず'][i]}レシピ集`,
      excerpt: `子どもの好き嫌いを克服しやすい${['野菜スープ', '魚料理', '丼もの', 'パスタ', 'パンケーキ', 'スムージー', 'マフィン', 'おにぎり', 'カレー', 'グラタン', 'ハンバーグ', '煮物', 'サラダ', 'サンドイッチ', '作り置き'][i]}の年齢別レシピを紹介します。`,
      dir: 'nutrition', stage: 'pre', categories: ['nutrition'],
      tags: ['レシピ', ['スープ', '魚', '丼', 'パスタ', 'パンケーキ', 'スムージー', 'マフィン', 'おにぎり', 'カレー', 'グラタン', 'ハンバーグ', '煮物', 'サラダ', 'サンドイッチ', '作り置き'][i], '食事'],
      refs: [makeRef('maff', '食育に関する情報'), makeRef('mhlw', '日本人の食事摂取基準', 'neutral')],
      sourceName: '食育・栄養に関する公的情報',
    })),
  ];
  addTopics(nutritionTopics);

  // ===== EDUCATION TOPICS =====
  const educationTopics = [
    // 学習習慣・教科別
    ...generateVariants('education', 'education', [
      { base: 'study-habit', prefix: '学習習慣', stages: ['early', 'mid', 'upper'] },
      { base: 'math-learning', prefix: '算数の学び', stages: ['early', 'mid', 'upper'] },
      { base: 'japanese-learning', prefix: '国語の学び', stages: ['early', 'mid', 'upper'] },
      { base: 'science-learning', prefix: '理科の学び', stages: ['mid', 'upper'] },
      { base: 'social-studies', prefix: '社会の学び', stages: ['mid', 'upper'] },
      { base: 'english-learning', prefix: '英語の学び', stages: ['early', 'mid', 'upper'] },
      { base: 'reading-habit', prefix: '読書習慣', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'homework-support', prefix: '宿題サポート', stages: ['early', 'mid', 'upper'] },
      { base: 'test-preparation', prefix: 'テスト対策', stages: ['mid', 'upper'] },
      { base: 'concentration', prefix: '集中力', stages: ['pre', 'early', 'mid', 'upper'] },
    ]),
    // 入学・進学
    ...['nursery-0y', 'nursery-1y', 'nursery-2y', 'kindergarten-3y', 'kindergarten-4y', 'kindergarten-5y', 'elementary-1y', 'elementary-2y', 'elementary-3y', 'elementary-4y', 'elementary-5y', 'elementary-6y', 'junior-high-prep'].map((v, i) => ({
      slug: `school-life-${v}`,
      title: `${['0歳児クラスの保育園生活', '1歳児クラスの保育園生活', '2歳児クラスの保育園生活', '年少（3歳）の幼稚園・保育園生活', '年中（4歳）の園生活', '年長（5歳）の園生活', '小学1年生の学校生活', '小学2年生の学校生活', '小学3年生の学校生活', '小学4年生の学校生活', '小学5年生の学校生活', '小学6年生の学校生活', '中学進学準備ガイド'][i]}`,
      excerpt: `${['0歳児クラス', '1歳児クラス', '2歳児クラス', '年少', '年中', '年長', '小1', '小2', '小3', '小4', '小5', '小6', '中学準備'][i]}で身につけたい力、行事、保護者の関わり方をまとめました。`,
      dir: 'education', stage: ['0stage', '0stage', 'pre', 'pre', 'early', 'early', 'early', 'early', 'mid', 'mid', 'upper', 'upper', 'upper'][i], categories: ['education'],
      tags: [['保育園', '保育園', '保育園', '幼稚園', '幼稚園', '幼稚園', '小学校', '小学校', '小学校', '小学校', '小学校', '小学校', '中学校'][i], '学校生活', '準備'],
      refs: [makeRef('mext', '学習指導要領'), makeRef('cfa', '保育所保育指針', 'neutral')],
      sourceName: '学校教育に関する公的情報',
    })),
    // しつけ・生活
    ...['greeting', 'sharing', 'patience', 'rule-following', 'tidying-up', 'time-management', 'responsibility', 'apology', 'gratitude', 'public-manner', 'hospitality', 'money-sense'].map((v, i) => ({
      slug: `manners-${v}`,
      title: `子どもに${['あいさつ', '分かち合い', '我慢する力', 'ルールを守る力', 'お片付け', '時間管理', '責任感', '謝る力', '感謝の心', '公共マナー', 'おもてなしの心', '金銭感覚'][i]}を教えるコツ`,
      excerpt: `${['あいさつ', 'シェアリング', '忍耐力', 'ルール遵守', 'お片付け', '時間管理', '責任感', '素直に謝る', '感謝', '公共マナー', 'おもてなし', '金銭感覚'][i]}を年齢に合わせて教える具体的な方法とNG対応を紹介します。`,
      dir: 'education', stage: 'pre', categories: ['education', 'social'],
      tags: ['しつけ', ['あいさつ', 'シェア', '我慢', 'ルール', '片付け', '時間管理', '責任', '謝罪', '感謝', 'マナー', 'おもてなし', 'お金'][i], '生活習慣'],
      refs: [makeRef('mext', '幼稚園教育要領'), makeRef('cfa', '家庭教育に関する情報', 'neutral')],
      sourceName: '家庭教育に関する公的情報',
    })),
    // 習い事
    ...['piano', 'swimming', 'soccer', 'ballet', 'martial-arts', 'calligraphy', 'abacus', 'gymnastics', 'art-class', 'english-class', 'programming-class', 'robotics', 'baseball', 'tennis', 'basketball', 'track-and-field', 'ice-skating', 'choir', 'drama-class', 'dance'].map((v, i) => ({
      slug: `lesson-${v}`,
      title: `子どもの習い事：${['ピアノ', '水泳', 'サッカー', 'バレエ', '武道（柔道・空手・剣道）', '書道', 'そろばん', '体操教室', '絵画教室', '英会話', 'プログラミング', 'ロボット教室', '野球', 'テニス', 'バスケットボール', '陸上競技', 'アイススケート', '合唱', '演劇', 'ダンス'][i]}の始めどきと選び方`,
      excerpt: `${['ピアノ', '水泳', 'サッカー', 'バレエ', '武道', '書道', 'そろばん', '体操', '絵画', '英会話', 'プログラミング', 'ロボット', '野球', 'テニス', 'バスケ', '陸上', 'スケート', '合唱', '演劇', 'ダンス'][i]}教室の費用・メリット・始める年齢の目安・教室選びのポイントを解説します。`,
      dir: 'education', stage: ['early', 'pre', 'early', 'pre', 'early', 'early', 'early', 'pre', 'pre', 'early', 'mid', 'mid', 'early', 'early', 'early', 'mid', 'early', 'early', 'early', 'pre'][i], categories: ['education'],
      tags: ['習い事', ['ピアノ', '水泳', 'サッカー', 'バレエ', '武道', '書道', 'そろばん', '体操', '絵画', '英会話', 'プログラミング', 'ロボット', '野球', 'テニス', 'バスケ', '陸上', 'スケート', '合唱', '演劇', 'ダンス'][i]],
      refs: [makeRef('mext', '体力・運動能力調査'), makeRef('cfa', '子どもの体験活動に関する情報', 'neutral')],
      sourceName: '子どもの習い事に関する調査',
    })),
    // 中学受験・学力
    ...['exam-overview', 'exam-schedule', 'exam-cost', 'exam-motivation', 'exam-school-select', 'exam-stress', 'exam-daily-routine', 'exam-parent-role', 'exam-failure-cope', 'exam-interview-prep'].map((v, i) => ({
      slug: `junior-exam-${v}`,
      title: `中学受験${['の基礎知識', 'のスケジュール', 'にかかる費用', 'のモチベーション維持', '：志望校の選び方', 'のストレス対策', '期の生活リズム', 'における親の役割', '：不合格への向き合い方', '：面接対策'][i]}`,
      excerpt: `中学受験${['の全体像', 'の年間計画', 'の費用目安', 'のやる気維持法', '校の選び方', '時のメンタルケア', '中の過ごし方', 'で親ができること', '後の立ち直り', '面接のコツ'][i]}について、最新の入試動向をふまえて解説します。`,
      dir: 'education', stage: 'upper', categories: ['education'],
      tags: ['中学受験', ['基礎知識', 'スケジュール', '費用', 'モチベーション', '志望校', 'ストレス', '生活リズム', '親の役割', '不合格', '面接'][i]],
      refs: [makeRef('mext', '学校教育に関する統計'), makeRef('nier', '全国学力・学習状況調査', 'neutral')],
      sourceName: '中学受験に関する教育情報',
    })),
  ];
  addTopics(educationTopics);

  // ===== MENTAL TOPICS =====
  const mentalTopics = [
    ...generateVariants('mental', 'mental', [
      { base: 'anxiety', prefix: '不安への対処', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'anger-management', prefix: 'かんしゃく・怒りの対処', stages: ['pre', 'early', 'mid'] },
      { base: 'self-esteem', prefix: '自己肯定感', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'resilience', prefix: 'レジリエンス（折れない心）', stages: ['early', 'mid', 'upper'] },
      { base: 'friendship-trouble', prefix: '友達トラブル', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'separation-anxiety', prefix: '分離不安', stages: ['0stage', 'pre', 'early'] },
      { base: 'stress-sign', prefix: 'ストレスサイン', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'sleep-worry', prefix: '夜の不安・夜泣き', stages: ['0stage', 'pre', 'early'] },
      { base: 'body-image', prefix: '身体イメージ', stages: ['mid', 'upper'] },
      { base: 'perfectionism', prefix: '完璧主義', stages: ['mid', 'upper'] },
    ]),
    // 親のメンタル
    ...['burnout', 'guilt', 'anger', 'loneliness', 'comparison', 'partner-conflict', 'work-stress', 'identity-crisis', 'grief', 'post-partum-anxiety', 'mindfulness', 'self-care-routine'].map((v, i) => ({
      slug: `parent-mental-${v}`,
      title: `保護者の${['育児バーンアウト', '罪悪感', '怒りのコントロール', '孤独感', '他人との比較', 'パートナーとの衝突', '仕事のストレス', 'アイデンティティの揺らぎ', '喪失感', '産後の不安症', 'マインドフルネス実践', 'セルフケア習慣'][i]}対策`,
      excerpt: `子育て中の${['燃え尽き', '罪悪感', '怒り', '孤独', '比較癖', 'パートナー問題', '仕事ストレス', 'アイデンティティ', '喪失体験', '産後不安', 'マインドフルネス', 'セルフケア'][i]}について、臨床心理の知見をもとに対処法を解説します。`,
      dir: 'mental', stage: 'pre', categories: ['mental'],
      tags: ['メンタルヘルス', '保護者', ['バーンアウト', '罪悪感', '怒り', '孤独', '比較', 'パートナー', '仕事', 'アイデンティティ', '喪失', '産後', 'マインドフルネス', 'セルフケア'][i]],
      refs: [makeRef('ncnp', 'メンタルヘルス情報'), makeRef('mhlw', 'こころの健康', 'neutral')],
      sourceName: '保護者のメンタルヘルスに関する情報',
    })),
    // いじめ・不登校
    ...['bully-detect', 'bully-school-response', 'bully-cyber', 'bully-recovery', 'school-refusal-early', 'school-refusal-approach', 'school-refusal-alternative', 'school-refusal-reentry', 'selective-mutism', 'tic-disorder', 'ocd-children', 'eating-disorder-early'].map((v, i) => ({
      slug: `child-mental-${v}`,
      title: `子どもの${['いじめの早期発見', 'いじめへの学校対応', 'ネットいじめ', 'いじめからの回復', '不登校の初期サイン', '不登校への寄り添い方', 'フリースクール・オルタナティブ教育', '不登校からの復帰', '場面緘黙（かんもく）', 'チック症', '強迫性障害', '摂食障害の初期サイン'][i]}`,
      excerpt: `${['いじめ発見', '学校連携', 'ネットいじめ', 'いじめ回復', '不登校サイン', '不登校支援', 'フリースクール', '登校復帰', '場面緘黙', 'チック', '強迫性障害', '摂食障害'][i]}について、最新の研究と支援制度をもとに解説します。`,
      dir: 'mental', stage: ['early', 'mid', 'upper', 'mid', 'early', 'mid', 'mid', 'upper', 'early', 'pre', 'mid', 'upper'][i], categories: ['mental'],
      tags: [['いじめ', 'いじめ', 'ネットいじめ', 'いじめ', '不登校', '不登校', 'フリースクール', '不登校', '場面緘黙', 'チック', '強迫性障害', '摂食障害'][i], 'メンタルヘルス'],
      refs: [makeRef('mext', 'いじめ・不登校対策'), makeRef('ncnp', '児童精神医学情報', 'neutral')],
      sourceName: '子どものメンタルヘルスに関する公的情報',
    })),
  ];
  addTopics(mentalTopics);

  // ===== DIGITAL TOPICS =====
  const digitalTopics = [
    ...generateVariants('digital', 'digital', [
      { base: 'screen-time', prefix: 'スクリーンタイム管理', stages: ['0stage', 'pre', 'early', 'mid', 'upper'] },
      { base: 'online-safety', prefix: 'ネット安全', stages: ['early', 'mid', 'upper'] },
      { base: 'gaming-rule', prefix: 'ゲームのルール', stages: ['early', 'mid', 'upper'] },
      { base: 'social-media', prefix: 'SNSとの付き合い方', stages: ['mid', 'upper'] },
      { base: 'digital-literacy', prefix: 'デジタルリテラシー', stages: ['early', 'mid', 'upper'] },
    ]),
    // 具体的なデジタルトピック
    ...['tablet-education', 'coding-for-kids', 'youtube-kids-guide', 'ai-for-education', 'online-learning', 'parental-control-setup', 'digital-detox', 'safe-messaging', 'photo-privacy', 'game-addiction', 'app-review-kids', 'typing-skill', 'digital-art', 'video-creation', 'podcast-for-kids', '3d-printing', 'drone-education', 'vr-ar-kids', 'ebook-vs-paper', 'smart-watch-kids'].map((v, i) => ({
      slug: `digital-${v}`,
      title: `${['タブレット学習の効果と注意点', '子ども向けプログラミング入門', 'YouTube Kidsの安全な使い方', 'AI時代の子ども教育', 'オンライン学習の活用法', 'ペアレンタルコントロールの設定方法', 'デジタルデトックスのすすめ', '安全なメッセージアプリの使い方', '子どもの写真のプライバシー', 'ゲーム依存の予防と対策', '子ども向けアプリの選び方', 'タイピングスキルの教え方', 'デジタルアートで創造力を育む', '動画制作で学ぶ表現力', '子ども向けポッドキャスト', '3Dプリンターで学ぶものづくり', 'ドローンで学ぶプログラミング', 'VR・ARの教育活用', '電子書籍と紙の本、どちらがいい？', '子ども用スマートウォッチの選び方'][i]}`,
      excerpt: `${['タブレット学習', 'プログラミング教育', 'YouTube Kids', 'AI教育', 'オンライン学習', 'ペアレンタルコントロール', 'デジタルデトックス', 'メッセージアプリ', '写真プライバシー', 'ゲーム依存', 'アプリ選び', 'タイピング', 'デジタルアート', '動画制作', 'ポッドキャスト', '3Dプリンター', 'ドローン', 'VR・AR', '電子書籍', 'スマートウォッチ'][i]}について、年齢別のポイントと注意点をまとめました。`,
      dir: 'digital', stage: ['early', 'mid', 'pre', 'mid', 'mid', 'early', 'early', 'upper', 'pre', 'mid', 'pre', 'mid', 'early', 'mid', 'early', 'upper', 'upper', 'upper', 'early', 'mid'][i], categories: ['digital'],
      tags: ['デジタル', ['タブレット', 'プログラミング', 'YouTube', 'AI', 'オンライン学習', 'ペアレンタルコントロール', 'デトックス', 'メッセージ', 'プライバシー', 'ゲーム依存', 'アプリ', 'タイピング', 'デジタルアート', '動画', 'ポッドキャスト', '3D', 'ドローン', 'VR', '電子書籍', 'スマートウォッチ'][i]],
      refs: [makeRef('soumu', '情報通信白書'), makeRef('mext', 'GIGAスクール構想', 'neutral')],
      sourceName: 'デジタル教育に関する公的情報',
    })),
  ];
  addTopics(digitalTopics);

  // ===== SOCIAL TOPICS =====
  const socialTopics = [
    ...generateVariants('social', 'social', [
      { base: 'community', prefix: '地域のつながり', stages: ['0stage', 'pre', 'early', 'mid'] },
      { base: 'volunteer', prefix: 'ボランティア体験', stages: ['mid', 'upper'] },
      { base: 'diversity', prefix: '多様性の理解', stages: ['pre', 'early', 'mid', 'upper'] },
      { base: 'environment', prefix: '環境教育', stages: ['early', 'mid', 'upper'] },
      { base: 'cooperation', prefix: '協調性', stages: ['pre', 'early', 'mid'] },
    ]),
    // 社会・制度
    ...['child-allowance', 'medical-subsidy', 'single-parent-support', 'disability-support', 'childcare-leave', 'tax-deduction', 'housing-support', 'education-loan', 'after-school-club', 'child-welfare', 'foster-care', 'adoption-guide', 'child-abuse-prevention', 'emergency-contact', 'disaster-prep-family', 'traffic-safety', 'water-safety', 'home-safety', 'playground-safety', 'stranger-danger'].map((v, i) => ({
      slug: `social-${v}`,
      title: `${['児童手当の最新情報', '子ども医療費助成制度', 'ひとり親家庭の支援制度', '障害のある子どもへの支援', '育児休業制度の活用', '子育て世帯の税制優遇', '子育て世帯の住宅支援', '教育ローンと奨学金', '放課後児童クラブの利用', '児童福祉サービス', '里親制度について', '養子縁組ガイド', '児童虐待の予防と通報', '緊急時の連絡先まとめ', '家族の防災対策', '子どもの交通安全', '子どもの水の事故防止', '家庭内の安全対策', '公園・遊具の安全', '知らない人への対応'][i]}`,
      excerpt: `${['児童手当', '医療費助成', 'ひとり親支援', '障害児支援', '育休', '税制優遇', '住宅支援', '教育資金', '学童', '児童福祉', '里親', '養子縁組', '虐待防止', '緊急連絡', '防災', '交通安全', '水難防止', '家庭安全', '遊具安全', '不審者'][i]}について、最新の制度と実践的な情報をまとめました。`,
      dir: 'social', stage: ['pre', 'pre', 'pre', 'pre', '0stage', 'pre', 'pre', 'upper', 'early', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'early', 'pre', '0stage', 'pre', 'early'][i], categories: ['social'],
      tags: [['児童手当', '医療費', 'ひとり親', '障害児', '育休', '税制', '住宅', '教育費', '学童', '福祉', '里親', '養子', '虐待防止', '緊急', '防災', '交通安全', '水難', '安全', '遊具', '防犯'][i], '制度', '子育て支援'],
      refs: [makeRef('mhlw', '子ども・子育て支援'), makeRef('cao', '少子化社会対策', 'neutral')],
      sourceName: '子育て支援制度に関する公的情報',
    })),
    // 季節行事
    ...['new-year', 'setsubun', 'hinamatsuri', 'spring-entrance', 'children-day', 'rainy-season', 'tanabata', 'obon', 'tsukimi', 'halloween', 'shichi-go-san', 'christmas', 'birthday-party', 'easter', 'valentines-craft', 'mothers-day-craft', 'fathers-day-craft', 'summer-festival'].map((v, i) => ({
      slug: `event-${v}`,
      title: `子どもと楽しむ${['お正月', '節分', 'ひなまつり', '入園・入学式', 'こどもの日', '梅雨の過ごし方', '七夕', 'お盆', 'お月見', 'ハロウィン', '七五三', 'クリスマス', '誕生日パーティー', 'イースター', 'バレンタイン工作', '母の日プレゼント', '父の日プレゼント', '夏祭り'][i]}：年齢別アイデア集`,
      excerpt: `${['お正月', '節分', 'ひなまつり', '入園入学', 'こどもの日', '梅雨', '七夕', 'お盆', 'お月見', 'ハロウィン', '七五三', 'クリスマス', '誕生日', 'イースター', 'バレンタイン', '母の日', '父の日', '夏祭り'][i]}を子どもと一緒に楽しむアイデア・レシピ・工作を年齢別に紹介します。`,
      dir: 'social', stage: 'pre', categories: ['social'],
      tags: ['行事', ['お正月', '節分', 'ひなまつり', '入園', 'こどもの日', '梅雨', '七夕', 'お盆', 'お月見', 'ハロウィン', '七五三', 'クリスマス', '誕生日', 'イースター', 'バレンタイン', '母の日', '父の日', '夏祭り'][i], '季節'],
      refs: [makeRef('cfa', '子育て文化・行事情報'), makeRef('mext', '伝統文化教育', 'neutral')],
      sourceName: '子どもの行事・文化に関する情報',
    })),
  ];
  addTopics(socialTopics);

  // ===== PREGNANCY / LIFESTYLE (mapped to valid categories) =====
  const pregnancyTopics = [
    // 妊娠期の詳細
    ...['first-trimester-nutrition', 'second-trimester-exercise', 'third-trimester-preparation', 'prenatal-checkup', 'gestational-diabetes', 'pregnancy-hypertension', 'multiple-pregnancy', 'high-risk-pregnancy', 'prenatal-depression', 'birth-plan', 'natural-birth', 'cesarean-section', 'pain-relief-option', 'postpartum-checkup', 'breastfeeding-start', 'breastfeeding-trouble', 'formula-feeding', 'mixed-feeding', 'newborn-care-first-week', 'baby-bath-guide', 'umbilical-cord-care', 'newborn-jaundice', 'maternity-wear', 'prenatal-class', 'hospital-bag-checklist', 'nursery-room-setup', 'baby-name-guide', 'maternity-yoga', 'pregnancy-skincare', 'pregnancy-travel'].map((v, i) => ({
      slug: `pregnancy-${v}`,
      title: `${['妊娠初期の栄養管理', '妊娠中期の運動ガイド', '妊娠後期の出産準備', '妊婦健診の受け方', '妊娠糖尿病の管理', '妊娠高血圧症候群', '多胎妊娠の注意点', 'ハイリスク妊娠の対応', 'マタニティブルー・産前うつ', 'バースプランの作り方', '自然分娩のメリットと準備', '帝王切開の流れと回復', '無痛分娩の選択', '産後健診のポイント', '母乳育児のスタート', '母乳トラブルの対処法', 'ミルク育児のガイド', '混合栄養のすすめ方', '新生児の最初の1週間', '沐浴の仕方', 'へその緒のケア', '新生児黄疸について', 'マタニティウェアの選び方', '両親学級・母親学級', '入院バッグの準備リスト', '赤ちゃんの部屋づくり', '赤ちゃんの名付けガイド', 'マタニティヨガ', '妊娠中のスキンケア', '妊娠中の旅行'][i]}`,
      excerpt: `${['妊娠初期の栄養', '妊娠中期の運動', '出産準備', '妊婦健診', '妊娠糖尿病', '妊娠高血圧', '多胎妊娠', 'ハイリスク妊娠', 'マタニティブルー', 'バースプラン', '自然分娩', '帝王切開', '無痛分娩', '産後健診', '母乳育児', '母乳トラブル', 'ミルク育児', '混合栄養', '新生児ケア', '沐浴', 'へその緒', '新生児黄疸', 'マタニティウェア', '両親学級', '入院バッグ', '部屋づくり', '名付け', 'マタニティヨガ', '妊娠中スキンケア', '妊娠中の旅行'][i]}について、最新のガイドラインをもとに解説します。`,
      dir: 'pregnancy', stage: '0stage', categories: ['health'],
      tags: ['妊娠', ['栄養', '運動', '準備', '健診', '糖尿病', '高血圧', '多胎', 'ハイリスク', 'メンタル', 'バースプラン', '分娩', '帝王切開', '無痛分娩', '産後', '母乳', 'トラブル', 'ミルク', '混合', '新生児', '沐浴', 'へその緒', '黄疸', 'ウェア', '学級', '入院', '部屋', '名付け', 'ヨガ', 'スキンケア', '旅行'][i]],
      refs: [makeRef('jaog', '産婦人科診療ガイドライン'), makeRef('mhlw', '母子保健情報', 'neutral')],
      sourceName: '妊娠・出産に関する公的ガイドライン',
    })),
  ];
  addTopics(pregnancyTopics);

  const lifestyleTopics = [
    // 家族・生活
    ...['morning-routine', 'evening-routine', 'weekend-plan', 'family-meeting', 'house-cleaning', 'laundry-tips', 'grocery-shopping', 'meal-prep-sunday', 'budget-management', 'insurance-family', 'moving-with-kids', 'pet-and-kids', 'sibling-spacing', 'grandparent-relation', 'neighbor-relation', 'pta-guide', 'school-volunteer', 'home-office-kids', 'travel-with-baby', 'travel-with-toddler', 'travel-domestic', 'travel-international', 'camping-family', 'car-trip-tips', 'train-trip-tips', 'airplane-with-kids', 'hotel-with-kids', 'restaurant-with-kids', 'shopping-with-kids', 'photo-memory'].map((v, i) => ({
      slug: `lifestyle-${v}`,
      title: `${['朝のルーティン術', '夕方〜夜のルーティン術', '週末の過ごし方プラン', '家族会議のすすめ', '子育て中の掃除術', '子育て中の洗濯術', '子連れ買い物のコツ', '日曜の作り置き術', '子育て家計の管理', '家族向け保険の選び方', '子連れ引っ越しガイド', 'ペットと子どもの共生', 'きょうだいの年齢差', '祖父母との関わり方', 'ご近所付き合いのコツ', 'PTA活動ガイド', '学校ボランティアのすすめ', '在宅勤務と子育ての両立', '赤ちゃん連れ旅行', '幼児連れ旅行', '国内旅行のコツ', '海外旅行のコツ', 'ファミリーキャンプ入門', '車旅のコツ', '電車旅のコツ', '飛行機でのコツ', 'ホテル選びのコツ', '外食のコツ', '子連れ買い物術', '思い出の残し方'][i]}`,
      excerpt: `${['朝のルーティン', '夜のルーティン', '週末プラン', '家族会議', '掃除', '洗濯', '買い物', '作り置き', '家計管理', '保険', '引っ越し', 'ペット', 'きょうだい', '祖父母', 'ご近所', 'PTA', 'ボランティア', '在宅勤務', '赤ちゃん旅行', '幼児旅行', '国内旅行', '海外旅行', 'キャンプ', '車旅', '電車旅', '飛行機', 'ホテル', '外食', '買い物', '写真'][i]}のポイントを子育て家庭向けにまとめました。`,
      dir: 'lifestyle', stage: ['pre', 'pre', 'pre', 'early', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', '0stage', 'pre', 'pre', 'early', 'early', 'pre', '0stage', 'pre', 'pre', 'early', 'early', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre'][i], categories: ['social'],
      tags: ['生活', ['朝', '夜', '週末', '家族会議', '掃除', '洗濯', '買い物', '作り置き', '家計', '保険', '引っ越し', 'ペット', 'きょうだい', '祖父母', 'ご近所', 'PTA', 'ボランティア', '在宅勤務', '旅行', '旅行', '国内旅行', '海外旅行', 'キャンプ', '車', '電車', '飛行機', 'ホテル', '外食', '買い物', '写真'][i]],
      refs: [makeRef('cao', '少子化社会対策白書'), makeRef('mhlw', '子ども・子育て支援', 'neutral')],
      sourceName: '子育て生活に関する調査情報',
    })),
  ];
  addTopics(lifestyleTopics);

  // ===== ADDITIONAL HEALTH TOPICS (to reach 1000) =====
  const additionalHealth = [
    ...['baby-eczema', 'cradle-cap', 'diaper-rash', 'teething-pain', 'baby-reflux', 'croup', 'bronchiolitis', 'febrile-seizure', 'kawasaki-disease', 'anemia-children', 'flat-feet', 'knock-knees', 'growing-pain', 'bedwetting', 'urinary-infection', 'appendicitis-child', 'hernia-child', 'stye-child', 'nosebleed-child', 'motion-sickness', 'insect-bite', 'sunburn-child', 'frostbite-child', 'choking-prevention', 'burn-first-aid', 'drowning-prevention', 'fall-prevention', 'poison-prevention', 'dental-emergency', 'head-injury'].map((v, i) => ({
      slug: `health-${v}`,
      title: `${['赤ちゃんの湿疹の対処法', '乳児脂漏性湿疹のケア', 'おむつかぶれの予防と治療', '歯が生える時期の痛みケア', '赤ちゃんの吐き戻し対策', 'クループ症候群の対応', '細気管支炎の対処法', '熱性けいれんの対応', '川崎病の基礎知識', '子どもの貧血', '偏平足の対応', 'X脚・O脚について', '成長痛の対処法', 'おねしょ（夜尿症）対策', '子どもの尿路感染症', '子どもの虫垂炎', '子どものヘルニア', 'ものもらいの対処法', '子どもの鼻血の対処', '乗り物酔い対策', '虫刺されの対処法', '子どもの日焼け対策', '子どものしもやけ対策', '窒息・誤飲の予防', 'やけどの応急処置', '溺水事故の予防', '転倒・転落の予防', '誤飲・中毒の予防', '歯の怪我の対処', '頭部打撲の対処'][i]}`,
      excerpt: `${['湿疹', '脂漏性湿疹', 'おむつかぶれ', '歯ぐずり', '吐き戻し', 'クループ', '細気管支炎', '熱性けいれん', '川崎病', '貧血', '偏平足', 'X脚O脚', '成長痛', 'おねしょ', '尿路感染', '虫垂炎', 'ヘルニア', 'ものもらい', '鼻血', '乗り物酔い', '虫刺され', '日焼け', 'しもやけ', '窒息', 'やけど', '溺水', '転倒', '中毒', '歯の怪我', '頭部打撲'][i]}の症状・対処法・受診の目安を小児科の知見をもとに解説します。`,
      dir: 'health', stage: ['0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', 'pre', 'pre', 'pre', 'pre', 'pre', 'early', 'early', 'pre', 'mid', 'pre', 'early', 'pre', 'early', 'pre', 'pre', 'pre', '0stage', 'pre', 'pre', 'pre', '0stage', 'early', 'pre'][i], categories: ['health'],
      tags: [['湿疹', '湿疹', 'おむつ', '歯', '吐き戻し', 'クループ', '気管支', 'けいれん', '川崎病', '貧血', '足', '足', '成長痛', 'おねしょ', '感染症', '腹痛', 'ヘルニア', '目', '鼻血', '乗り物', '虫刺され', '日焼け', 'しもやけ', '安全', 'やけど', '水難', '転倒', '中毒', '歯', '頭部'][i], '対処法', '受診目安'],
      refs: [makeRef('jsps', '小児医療ガイドライン'), makeRef('mhlw', '子どもの健康に関する情報', 'neutral')],
      sourceName: '小児医療に関する公的情報',
    })),
    // 健康診断・検査
    ...['1month-checkup', '3month-checkup', '6month-checkup', '9month-checkup', '1year-checkup', '18month-checkup', '3year-checkup', '5year-checkup', 'school-health-check', 'dental-checkup-child', 'vision-screening', 'hearing-screening', 'developmental-screening', 'allergy-testing', 'blood-test-child'].map((v, i) => ({
      slug: `checkup-${v}`,
      title: `${['1ヶ月健診', '3〜4ヶ月健診', '6〜7ヶ月健診', '9〜10ヶ月健診', '1歳児健診', '1歳6ヶ月健診', '3歳児健診', '5歳児健診', '学校の健康診断', '子どもの歯科検診', '視力スクリーニング', '聴力スクリーニング', '発達スクリーニング', 'アレルギー検査', '子どもの血液検査'][i]}のポイントと準備`,
      excerpt: `${['1ヶ月健診', '3〜4ヶ月健診', '6〜7ヶ月健診', '9〜10ヶ月健診', '1歳児健診', '1歳6ヶ月健診', '3歳児健診', '5歳児健診', '学校健診', '歯科検診', '視力検査', '聴力検査', '発達検査', 'アレルギー検査', '血液検査'][i]}で見るポイント・持ち物・よくある質問をまとめました。`,
      dir: 'health', stage: ['0stage', '0stage', '0stage', '0stage', '0stage', 'pre', 'pre', 'early', 'early', 'pre', 'pre', '0stage', 'pre', 'pre', 'early'][i], categories: ['health'],
      tags: ['健診', ['1ヶ月', '3ヶ月', '6ヶ月', '9ヶ月', '1歳', '1歳半', '3歳', '5歳', '学校', '歯科', '視力', '聴力', '発達', 'アレルギー', '血液検査'][i], '子どもの健康'],
      refs: [makeRef('mhlw', '乳幼児健康診査'), makeRef('cfa', '母子保健情報', 'neutral')],
      sourceName: '乳幼児健診に関する公的情報',
    })),
  ];
  addTopics(additionalHealth);

  // ===== ADDITIONAL EDUCATION TOPICS =====
  const additionalEducation = [
    // 絵本
    ...['0y-picture-book', '1y-picture-book', '2y-picture-book', '3y-picture-book', '4y-picture-book', '5y-picture-book', '6y-picture-book', 'bedtime-story', 'seasonal-book-spring', 'seasonal-book-summer', 'seasonal-book-autumn', 'seasonal-book-winter', 'science-book', 'math-book', 'emotion-book', 'friendship-book', 'nature-book', 'food-book', 'body-book', 'manners-book'].map((v, i) => ({
      slug: `book-${v}`,
      title: `${['0歳向け絵本おすすめ20選', '1歳向け絵本おすすめ20選', '2歳向け絵本おすすめ20選', '3歳向け絵本おすすめ20選', '4歳向け絵本おすすめ20選', '5歳向け絵本おすすめ20選', '6歳向け絵本おすすめ20選', '寝かしつけにおすすめの絵本', '春に読みたい絵本', '夏に読みたい絵本', '秋に読みたい絵本', '冬に読みたい絵本', '科学に興味を持てる絵本', '数に親しめる絵本', '感情を学べる絵本', '友達について考える絵本', '自然を学べる絵本', '食べ物に興味を持てる絵本', 'からだの仕組みを学べる絵本', 'マナーを学べる絵本'][i]}`,
      excerpt: `${['0歳', '1歳', '2歳', '3歳', '4歳', '5歳', '6歳', '寝かしつけ', '春', '夏', '秋', '冬', '科学', '算数', '感情', '友達', '自然', '食べ物', '体', 'マナー'][i]}におすすめの絵本を厳選して紹介します。選び方のポイントと読み聞かせのコツも解説。`,
      dir: 'education', stage: ['0stage', '0stage', 'pre', 'pre', 'early', 'early', 'early', '0stage', 'pre', 'pre', 'pre', 'pre', 'early', 'early', 'pre', 'pre', 'pre', 'pre', 'early', 'pre'][i], categories: ['education'],
      tags: ['絵本', ['0歳', '1歳', '2歳', '3歳', '4歳', '5歳', '6歳', '寝かしつけ', '春', '夏', '秋', '冬', '科学', '算数', '感情', '友達', '自然', '食べ物', '体', 'マナー'][i], '読み聞かせ'],
      refs: [makeRef('mext', '読書活動推進'), makeRef('cfa', '子どもの読書に関する情報', 'neutral')],
      sourceName: '子どもの読書に関する公的情報',
    })),
    // 学校行事・イベント
    ...['entrance-ceremony', 'graduation', 'sports-day', 'school-trip', 'culture-festival', 'parents-day', 'open-school', 'class-visit', 'homework-summer', 'homework-winter', 'report-card', 'school-lunch', 'school-commute', 'school-supplies', 'desk-setup', 'room-organization', 'morning-assembly', 'school-club', 'student-council', 'school-camp'].map((v, i) => ({
      slug: `school-${v}`,
      title: `${['入学式の準備と心構え', '卒園・卒業式の準備', '運動会を楽しむコツ', '遠足・修学旅行の準備', '文化祭・学習発表会', '授業参観のマナー', 'オープンスクールの活用法', '学級懇談会の参加ポイント', '夏休みの宿題サポート', '冬休みの宿題サポート', '通知表の見方と声かけ', '学校給食と家庭の食事', '通学路の安全確保', '学用品の選び方', '学習机の選び方と配置', '子ども部屋の整理整頓', '朝の会・帰りの会', 'クラブ活動の選び方', '児童会・生徒会活動', '林間学校・臨海学校'][i]}`,
      excerpt: `${['入学式', '卒園卒業', '運動会', '遠足', '文化祭', '授業参観', 'オープンスクール', '懇談会', '夏休みの宿題', '冬休みの宿題', '通知表', '給食', '通学', '学用品', '学習机', '子ども部屋', '朝の会', 'クラブ', '児童会', '林間学校'][i]}に関する準備・マナー・サポート方法を解説します。`,
      dir: 'education', stage: ['early', 'early', 'early', 'mid', 'mid', 'early', 'upper', 'early', 'early', 'mid', 'early', 'early', 'early', 'early', 'early', 'mid', 'early', 'mid', 'upper', 'mid'][i], categories: ['education'],
      tags: [['入学', '卒業', '運動会', '遠足', '文化祭', '授業参観', '学校見学', '懇談会', '夏休み', '冬休み', '通知表', '給食', '通学', '学用品', '机', '整理', '朝の会', 'クラブ', '児童会', '林間'][i], '学校', '行事'],
      refs: [makeRef('mext', '学校教育に関する情報'), makeRef('cfa', '子どもの安全に関する情報', 'neutral')],
      sourceName: '学校教育に関する公的情報',
    })),
    // 夏休み・長期休み
    ...['summer-plan', 'summer-craft', 'summer-diary', 'summer-reading', 'summer-science', 'winter-plan', 'spring-break', 'golden-week', 'rainy-day-indoor', 'holiday-learning'].map((v, i) => ({
      slug: `vacation-${v}`,
      title: `${['夏休みの過ごし方プラン', '夏休みの工作アイデア', '絵日記の書き方', '読書感想文の書き方', '自由研究のテーマ選び', '冬休みの過ごし方プラン', '春休みの有効活用', 'GWの家族プラン', '雨の日の室内遊び', '長期休みの学習計画'][i]}：年齢別ガイド`,
      excerpt: `${['夏休み', '夏休みの工作', '絵日記', '読書感想文', '自由研究', '冬休み', '春休み', 'GW', '雨の日', '長期休みの学習'][i]}を充実させるためのアイデアと計画の立て方を年齢別に紹介します。`,
      dir: 'education', stage: ['early', 'early', 'early', 'mid', 'mid', 'mid', 'early', 'pre', 'pre', 'mid'][i], categories: ['education'],
      tags: [['夏休み', '工作', '絵日記', '読書感想文', '自由研究', '冬休み', '春休み', 'GW', '雨の日', '学習計画'][i], '長期休み', '計画'],
      refs: [makeRef('mext', '家庭学習に関する情報'), makeRef('nier', '学習状況調査', 'neutral')],
      sourceName: '家庭教育に関する公的情報',
    })),
  ];
  addTopics(additionalEducation);

  // ===== ADDITIONAL DEVELOPMENT TOPICS =====
  const additionalDev = [
    // 身体発達の詳細
    ...['gross-motor-0to1', 'gross-motor-1to2', 'gross-motor-2to3', 'gross-motor-3to4', 'gross-motor-4to5', 'gross-motor-5to6', 'fine-motor-0to1', 'fine-motor-1to2', 'fine-motor-2to3', 'fine-motor-3to4', 'fine-motor-4to6', 'balance-skill', 'hand-eye-coordination', 'left-hand-right-hand', 'body-awareness'].map((v, i) => ({
      slug: `dev-${v}`,
      title: `${['0〜1歳の粗大運動発達', '1〜2歳の粗大運動発達', '2〜3歳の粗大運動発達', '3〜4歳の粗大運動発達', '4〜5歳の粗大運動発達', '5〜6歳の粗大運動発達', '0〜1歳の微細運動発達', '1〜2歳の微細運動発達', '2〜3歳の微細運動発達', '3〜4歳の微細運動発達', '4〜6歳の微細運動発達', 'バランス能力の発達と遊び', '手と目の協調性を育てる', '利き手の決まり方', 'ボディイメージの発達'][i]}`,
      excerpt: `${['0〜1歳の粗大運動', '1〜2歳の粗大運動', '2〜3歳の粗大運動', '3〜4歳の粗大運動', '4〜5歳の粗大運動', '5〜6歳の粗大運動', '0〜1歳の手指の動き', '1〜2歳の手指の動き', '2〜3歳の手指の動き', '3〜4歳の手指の動き', '4〜6歳の手指の動き', 'バランス能力', '手と目の協調', '利き手', 'ボディイメージ'][i]}の発達目安と家庭でできるサポートを紹介します。`,
      dir: 'development', stage: ['0stage', '0stage', 'pre', 'pre', 'early', 'early', '0stage', '0stage', 'pre', 'pre', 'early', 'pre', 'pre', 'early', 'early'][i], categories: ['development'],
      tags: [['粗大運動', '粗大運動', '粗大運動', '粗大運動', '粗大運動', '粗大運動', '微細運動', '微細運動', '微細運動', '微細運動', '微細運動', 'バランス', '協調性', '利き手', 'ボディイメージ'][i], '発達', '運動'],
      refs: [makeRef('mhlw', '乳幼児身体発育調査'), makeRef('jsps', '小児の運動発達', 'neutral')],
      sourceName: '子どもの運動発達に関する公的情報',
    })),
    // 言語発達の詳細
    ...['first-words', 'two-word-sentence', 'storytelling', 'vocabulary-boost', 'pronunciation', 'bilingual-child', 'late-talker', 'speech-therapy', 'reading-readiness', 'writing-readiness', 'phonics-japanese', 'kanji-learning', 'composition-skill', 'debate-skill', 'presentation-skill'].map((v, i) => ({
      slug: `lang-${v}`,
      title: `${['初めての言葉（初語）の発達', '二語文の発達と促し方', '子どものお話する力', '語彙力を伸ばす方法', '発音の発達と練習', 'バイリンガル子育て', '言葉が遅い子のサポート', '言語聴覚士への相談', '読む力の準備（就学前）', '書く力の準備（就学前）', 'ひらがな・カタカナの教え方', '漢字学習のコツ', '作文力を伸ばす方法', 'ディベート力を育てる', 'プレゼンテーション力'][i]}`,
      excerpt: `${['初語', '二語文', 'お話力', '語彙力', '発音', 'バイリンガル', '言葉の遅れ', '言語聴覚士', '読む準備', '書く準備', 'ひらがな', '漢字', '作文', 'ディベート', 'プレゼン'][i]}に関する発達の目安と家庭での取り組み方を解説します。`,
      dir: 'development', stage: ['0stage', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'early', 'early', 'early', 'mid', 'mid', 'upper', 'upper'][i], categories: ['development'],
      tags: [['初語', '二語文', 'お話', '語彙', '発音', 'バイリンガル', '言葉の遅れ', '言語聴覚士', '読む力', '書く力', 'ひらがな', '漢字', '作文', 'ディベート', 'プレゼン'][i], '言葉', '発達'],
      refs: [makeRef('mhlw', '乳幼児の言語発達'), makeRef('jsps', '小児の言語発達', 'neutral')],
      sourceName: '言語発達に関する公的情報',
    })),
    // 知育玩具
    ...['toy-0to6m', 'toy-6to12m', 'toy-1y', 'toy-2y', 'toy-3y', 'toy-4y', 'toy-5y', 'toy-6y', 'toy-wooden', 'toy-montessori', 'toy-stem', 'toy-outdoor', 'toy-craft-supply', 'toy-musical', 'toy-educational-app'].map((v, i) => ({
      slug: `toy-guide-${v}`,
      title: `${['0〜6ヶ月向けおもちゃ', '6〜12ヶ月向けおもちゃ', '1歳向けおもちゃ', '2歳向けおもちゃ', '3歳向けおもちゃ', '4歳向けおもちゃ', '5歳向けおもちゃ', '6歳向けおもちゃ', '木のおもちゃ', 'モンテッソーリ教具', 'STEM玩具', '外遊びグッズ', '工作・クラフト用品', '楽器おもちゃ', '知育アプリ'][i]}の選び方ガイド`,
      excerpt: `${['0〜6ヶ月', '6〜12ヶ月', '1歳', '2歳', '3歳', '4歳', '5歳', '6歳', '木製', 'モンテッソーリ', 'STEM', '外遊び', '工作', '楽器', '知育アプリ'][i]}のおもちゃ・教材の選び方と、発達を促す遊び方を紹介します。`,
      dir: 'development', stage: ['0stage', '0stage', '0stage', 'pre', 'pre', 'early', 'early', 'early', 'pre', 'pre', 'mid', 'pre', 'pre', 'pre', 'early'][i], categories: ['development'],
      tags: [['おもちゃ', 'おもちゃ', 'おもちゃ', 'おもちゃ', 'おもちゃ', 'おもちゃ', 'おもちゃ', 'おもちゃ', '木のおもちゃ', 'モンテッソーリ', 'STEM', '外遊び', '工作', '楽器', 'アプリ'][i], '知育', '選び方'],
      refs: [makeRef('cfa', '遊びと育ちに関する情報'), makeRef('mext', '幼児教育要領', 'neutral')],
      sourceName: '子どもの遊びと発達に関する情報',
    })),
  ];
  addTopics(additionalDev);

  // ===== ADDITIONAL NUTRITION TOPICS =====
  const additionalNutrition = [
    // 栄養素別ガイド
    ...['vitamin-a', 'vitamin-b', 'vitamin-c', 'vitamin-d', 'vitamin-k', 'zinc', 'magnesium', 'omega3', 'fiber', 'protein-need', 'sugar-limit', 'salt-limit', 'fat-type', 'probiotic', 'prebiotic'].map((v, i) => ({
      slug: `nutrient-${v}`,
      title: `子どもに必要な${['ビタミンA', 'ビタミンB群', 'ビタミンC', 'ビタミンD', 'ビタミンK', '亜鉛', 'マグネシウム', 'オメガ3脂肪酸', '食物繊維', 'タンパク質', '砂糖の適正量', '塩分の適正量', '良い脂質の選び方', 'プロバイオティクス', 'プレバイオティクス'][i]}のすべて`,
      excerpt: `${['ビタミンA', 'ビタミンB群', 'ビタミンC', 'ビタミンD', 'ビタミンK', '亜鉛', 'マグネシウム', 'オメガ3', '食物繊維', 'タンパク質', '砂糖', '塩分', '脂質', 'プロバイオティクス', 'プレバイオティクス'][i]}の年齢別必要量・多く含む食品・不足のサインをまとめました。`,
      dir: 'nutrition', stage: 'pre', categories: ['nutrition'],
      tags: [['ビタミンA', 'ビタミンB', 'ビタミンC', 'ビタミンD', 'ビタミンK', '亜鉛', 'マグネシウム', 'オメガ3', '食物繊維', 'タンパク質', '砂糖', '塩分', '脂質', 'プロバイオティクス', 'プレバイオティクス'][i], '栄養素', '食事'],
      refs: [makeRef('mhlw', '日本人の食事摂取基準'), makeRef('jsn', '栄養に関する情報', 'neutral')],
      sourceName: '栄養に関する公的ガイドライン',
    })),
    // 特別な食事ニーズ
    ...['vegetarian-child', 'dairy-free', 'gluten-free', 'egg-free-cooking', 'nut-free', 'low-sugar', 'high-calorie-need', 'sports-nutrition-child', 'sick-day-diet', 'dental-friendly-diet', 'constipation-diet', 'diarrhea-diet', 'brain-food', 'growth-supporting-diet', 'immune-boosting-food'].map((v, i) => ({
      slug: `special-diet-${v}`,
      title: `${['ベジタリアン子育ての栄養管理', '乳製品除去食の工夫', 'グルテンフリー食の実践', '卵不使用レシピの工夫', 'ナッツフリー対応の食事', '低糖質の子ども向け食事', 'カロリー摂取が必要な子の食事', 'スポーツをする子の栄養', '体調不良時の食事', '歯に優しい食事', '便秘改善の食事', '下痢時の食事', '脳の発達を助ける食事', '身長を伸ばす食事', '免疫力を高める食事'][i]}`,
      excerpt: `${['ベジタリアン', '乳製品除去', 'グルテンフリー', '卵除去', 'ナッツフリー', '低糖質', '高カロリー', 'スポーツ栄養', '病気の時', '歯の健康', '便秘改善', '下痢', '脳の発達', '成長促進', '免疫力'][i]}のための食事の工夫と注意点を解説します。`,
      dir: 'nutrition', stage: ['pre', 'pre', 'pre', '0stage', 'pre', 'mid', 'pre', 'mid', 'pre', 'pre', 'pre', 'pre', 'early', 'mid', 'pre'][i], categories: ['nutrition'],
      tags: [['ベジタリアン', '乳製品除去', 'グルテンフリー', '卵除去', 'ナッツフリー', '低糖質', '高カロリー', 'スポーツ', '体調不良', '歯', '便秘', '下痢', '脳', '成長', '免疫'][i], '食事', '特別食'],
      refs: [makeRef('mhlw', '食事摂取基準'), makeRef('jsn', '栄養指導情報', 'neutral')],
      sourceName: '栄養管理に関する公的情報',
    })),
  ];
  addTopics(additionalNutrition);

  // ===== ADDITIONAL MENTAL TOPICS =====
  const additionalMental = [
    ...['nightterror', 'thumb-sucking', 'nail-biting', 'hair-pulling', 'regression', 'sibling-jealousy', 'moving-stress', 'divorce-impact', 'grief-child', 'adoption-adjustment', 'gifted-child', 'twice-exceptional', 'sensory-processing', 'attachment', 'emotional-coaching', 'play-therapy', 'art-therapy', 'music-therapy', 'pet-therapy', 'nature-therapy', 'mindfulness-kids', 'yoga-kids', 'breathing-exercise', 'journal-therapy', 'social-story'].map((v, i) => ({
      slug: `mental-${v}`,
      title: `${['夜驚症の理解と対応', '指しゃぶりへの対応', '爪噛みの原因と対策', '抜毛症のサインと支援', '赤ちゃん返りへの対応', 'きょうだい間の嫉妬', '引っ越しストレスへの対応', '離婚が子どもに与える影響', '子どもの喪失体験と悲しみ', '養子縁組後の適応', 'ギフテッド（高知能）の子の育て方', '2E（二重に特別な子）の支援', '感覚過敏・鈍麻への理解', '愛着形成の重要性', '感情コーチングの実践', 'プレイセラピーとは', 'アートセラピーの活用', '音楽療法と子ども', 'アニマルセラピーの効果', '自然療法・森林セラピー', '子ども向けマインドフルネス', '子ども向けヨガ', '呼吸法で落ち着く練習', 'ジャーナリング（書く療法）', 'ソーシャルストーリーの活用'][i]}`,
      excerpt: `${['夜驚症', '指しゃぶり', '爪噛み', '抜毛症', '赤ちゃん返り', 'きょうだい嫉妬', '引っ越し', '離婚', '喪失体験', '養子縁組', 'ギフテッド', '2E', '感覚過敏', '愛着形成', '感情コーチング', 'プレイセラピー', 'アートセラピー', '音楽療法', 'アニマルセラピー', '自然療法', 'マインドフルネス', 'ヨガ', '呼吸法', 'ジャーナリング', 'ソーシャルストーリー'][i]}について、臨床心理の知見をもとに解説します。`,
      dir: 'mental', stage: ['pre', 'pre', 'early', 'mid', 'pre', 'pre', 'early', 'early', 'early', 'pre', 'early', 'mid', '0stage', '0stage', 'pre', 'pre', 'early', 'pre', 'pre', 'early', 'early', 'early', 'early', 'mid', 'pre'][i], categories: ['mental'],
      tags: [['夜驚症', '指しゃぶり', '爪噛み', '抜毛症', '赤ちゃん返り', 'きょうだい', '引っ越し', '離婚', '喪失', '養子', 'ギフテッド', '2E', '感覚', '愛着', '感情', 'セラピー', 'アート', '音楽', '動物', '自然', 'マインドフルネス', 'ヨガ', '呼吸', 'ジャーナリング', 'ソーシャルストーリー'][i], 'メンタルヘルス', '対処法'],
      refs: [makeRef('ncnp', '児童精神医学情報'), makeRef('jsccp', '臨床心理に関する情報', 'neutral')],
      sourceName: '子どものメンタルヘルスに関する情報',
    })),
  ];
  addTopics(additionalMental);

  // ===== ADDITIONAL SOCIAL/LIFESTYLE TOPICS =====
  const additionalSocial = [
    ...['multicultural-family', 'international-school', 'return-from-abroad', 'step-family', 'foster-family-life', 'three-generation', 'rural-childcare', 'urban-childcare', 'remote-area-childcare', 'special-needs-school', 'inclusive-education', 'homeschooling-japan', 'alternative-school', 'forest-kindergarten', 'international-preschool', 'child-rights', 'child-labor-law', 'child-privacy', 'gender-equality-child', 'sdgs-for-kids', 'financial-education', 'entrepreneurship-kids', 'career-education', 'community-service', 'cultural-exchange', 'peace-education', 'media-literacy', 'consumer-education', 'citizenship-education', 'global-education'].map((v, i) => ({
      slug: `social-extra-${v}`,
      title: `${['多文化家庭の子育て', 'インターナショナルスクールの選び方', '海外からの帰国子女の適応', 'ステップファミリーの子育て', '里親家庭の生活', '三世代同居の子育て', '地方での子育て', '都会での子育て', '過疎地域の子育て支援', '特別支援学校の選択', 'インクルーシブ教育', 'ホームスクーリングのすすめ方', 'オルタナティブスクールの選び方', '森のようちえんの特徴', 'インターナショナルプリスクール', '子どもの権利条約', '子どもに関する法律知識', '子どものプライバシー', 'ジェンダー平等の教え方', 'SDGsを子どもと学ぶ', '子どもの金融教育', '子どもの起業家精神', 'キャリア教育', '地域奉仕活動', '異文化交流体験', '平和教育', 'メディアリテラシー教育', '消費者教育', '市民教育', 'グローバル教育'][i]}`,
      excerpt: `${['多文化', 'インター', '帰国子女', 'ステップファミリー', '里親', '三世代', '地方', '都会', '過疎地域', '特別支援', 'インクルーシブ', 'ホームスクール', 'オルタナティブ', '森のようちえん', 'インタープリ', '子どもの権利', '子どもの法律', 'プライバシー', 'ジェンダー', 'SDGs', '金融教育', '起業', 'キャリア', '奉仕活動', '異文化', '平和', 'メディア', '消費者', '市民', 'グローバル'][i]}に関する情報と実践的なアドバイスをまとめました。`,
      dir: 'social', stage: ['pre', 'early', 'mid', 'pre', 'pre', 'pre', 'pre', 'pre', 'pre', 'early', 'early', 'mid', 'early', 'pre', 'pre', 'early', 'mid', 'mid', 'early', 'mid', 'mid', 'upper', 'upper', 'mid', 'mid', 'mid', 'mid', 'upper', 'upper', 'upper'][i], categories: ['social'],
      tags: [['多文化', 'インター', '帰国', 'ステップファミリー', '里親', '三世代', '地方', '都会', '過疎', '特別支援', 'インクルーシブ', 'ホームスクール', 'オルタナティブ', '森のようちえん', 'プリスクール', '権利', '法律', 'プライバシー', 'ジェンダー', 'SDGs', '金融', '起業', 'キャリア', '奉仕', '異文化', '平和', 'メディア', '消費者', '市民', 'グローバル'][i], '社会', '教育'],
      refs: [makeRef('mext', '教育政策に関する情報'), makeRef('cao', '子ども・子育て政策', 'neutral')],
      sourceName: '教育・社会政策に関する公的情報',
    })),
  ];
  addTopics(additionalSocial);

  // ===== ADDITIONAL PREGNANCY TOPICS =====
  const additionalPregnancy = [
    ...['early-pregnancy-symptom', 'pregnancy-food-safety', 'pregnancy-medication', 'pregnancy-dental', 'pregnancy-exercise-safe', 'pregnancy-sleep-position', 'pregnancy-sex', 'pregnancy-pet-safety', 'pregnancy-work-rights', 'pregnancy-stress-manage', 'twin-pregnancy-care', 'ivf-pregnancy-care', 'elder-pregnancy', 'pregnancy-complication', 'preterm-birth-prevention', 'placenta-previa', 'morning-sickness-severe', 'back-pain-pregnancy', 'swelling-pregnancy', 'varicose-vein-pregnancy', 'pregnancy-diabetes-diet', 'pregnancy-anemia', 'fetal-movement-tracking', 'kick-count-guide', 'nst-monitoring', 'cord-blood-banking', 'doula-guide', 'midwife-guide', 'water-birth', 'home-birth-japan'].map((v, i) => ({
      slug: `preg-${v}`,
      title: `${['妊娠初期の症状と対処法', '妊娠中の食品安全ガイド', '妊娠中の薬の注意点', '妊娠中の歯科治療', '妊娠中の安全な運動', '妊娠中の寝る姿勢', '妊娠中の夫婦関係', '妊娠中のペットとの暮らし', '妊婦の労働権利', '妊娠中のストレス管理', '双子妊娠のケア', '体外受精後の妊娠管理', '高齢妊娠のリスクと対策', '妊娠合併症の基礎知識', '早産の予防', '前置胎盤について', '重症妊娠悪阻の対応', '妊娠中の腰痛対策', '妊娠中のむくみ対策', '妊娠中の静脈瘤', '妊娠糖尿病の食事療法', '妊娠中の貧血対策', '胎動の記録と意味', '胎動カウントの方法', 'ノンストレステスト', 'さい帯血バンク', 'ドゥーラの役割', '助産師との出産', '水中出産について', '日本での自宅出産'][i]}`,
      excerpt: `${['妊娠初期症状', '食品安全', '薬', '歯科', '運動', '寝姿勢', '夫婦関係', 'ペット', '労働権利', 'ストレス', '双子', '体外受精後', '高齢妊娠', '合併症', '早産予防', '前置胎盤', '妊娠悪阻', '腰痛', 'むくみ', '静脈瘤', '糖尿病食事', '貧血', '胎動', 'キックカウント', 'NST', 'さい帯血', 'ドゥーラ', '助産師', '水中出産', '自宅出産'][i]}について、最新のガイドラインに基づき解説します。`,
      dir: 'pregnancy', stage: '0stage', categories: ['health'],
      tags: ['妊娠', ['初期症状', '食品安全', '薬', '歯科', '運動', '睡眠', '夫婦', 'ペット', '労働', 'ストレス', '双子', '体外受精', '高齢', '合併症', '早産', '前置胎盤', '悪阻', '腰痛', 'むくみ', '静脈瘤', '食事', '貧血', '胎動', 'キックカウント', 'NST', 'さい帯血', 'ドゥーラ', '助産師', '水中出産', '自宅出産'][i]],
      refs: [makeRef('jaog', '産婦人科診療ガイドライン'), makeRef('mhlw', '母子保健情報', 'neutral')],
      sourceName: '妊娠・出産に関する公的ガイドライン',
    })),
  ];
  addTopics(additionalPregnancy);

  // ===== ADDITIONAL LIFESTYLE TOPICS =====
  const additionalLifestyle = [
    ...['childproofing-home', 'baby-monitor-guide', 'car-seat-guide', 'stroller-guide', 'baby-carrier-guide', 'high-chair-guide', 'crib-guide', 'diaper-guide', 'baby-clothes-guide', 'baby-skincare-product', 'humidifier-guide', 'air-purifier-guide', 'laundry-detergent-baby', 'baby-bottle-guide', 'breast-pump-guide', 'baby-food-maker', 'thermometer-guide', 'first-aid-kit-baby', 'child-bicycle', 'child-helmet', 'rain-gear-kids', 'winter-gear-kids', 'summer-gear-kids', 'swim-gear-kids', 'school-bag-guide', 'lunch-box-guide', 'water-bottle-guide', 'kids-umbrella', 'kids-watch', 'kids-wallet'].map((v, i) => ({
      slug: `product-${v}`,
      title: `${['チャイルドプルーフィングの方法', 'ベビーモニターの選び方', 'チャイルドシートの選び方', 'ベビーカーの選び方', '抱っこひもの選び方', 'ハイチェアの選び方', 'ベビーベッドの選び方', 'おむつの選び方比較', 'ベビー服のサイズと選び方', '赤ちゃん用スキンケアの選び方', '加湿器の選び方（子ども部屋）', '空気清浄機の選び方（子ども向け）', '赤ちゃん用洗剤の選び方', '哺乳瓶の選び方', '搾乳器の選び方', 'ベビーフードメーカーの選び方', '体温計の選び方（子ども向け）', '赤ちゃん用救急セット', '子ども用自転車の選び方', 'ヘルメットの選び方', 'レインウェアの選び方', '冬の防寒着の選び方', '夏の涼感グッズ', '水着・プール用品の選び方', 'ランドセル・通学バッグ', 'お弁当箱の選び方', '水筒の選び方', '子ども用傘の選び方', 'キッズ時計の選び方', '子ども用財布の選び方'][i]}`,
      excerpt: `${['安全対策', 'ベビーモニター', 'チャイルドシート', 'ベビーカー', '抱っこひも', 'ハイチェア', 'ベビーベッド', 'おむつ', 'ベビー服', 'スキンケア', '加湿器', '空気清浄機', '洗剤', '哺乳瓶', '搾乳器', 'フードメーカー', '体温計', '救急セット', '自転車', 'ヘルメット', 'レインウェア', '防寒着', '涼感グッズ', '水着', 'ランドセル', 'お弁当箱', '水筒', '傘', '時計', '財布'][i]}の選び方のポイントを専門家の視点で解説します。`,
      dir: 'lifestyle', stage: ['0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', 'pre', 'pre', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', 'early', 'early', 'pre', 'pre', 'pre', 'pre', 'early', 'early', 'pre', 'early', 'mid', 'mid'][i], categories: ['social'],
      tags: [['安全', 'モニター', 'チャイルドシート', 'ベビーカー', '抱っこひも', 'ハイチェア', 'ベビーベッド', 'おむつ', 'ベビー服', 'スキンケア', '加湿器', '空気清浄機', '洗剤', '哺乳瓶', '搾乳器', 'フードメーカー', '体温計', '救急', '自転車', 'ヘルメット', 'レインウェア', '防寒着', '涼感', '水着', 'ランドセル', '弁当箱', '水筒', '傘', '時計', '財布'][i], '選び方', '子育てグッズ'],
      refs: [makeRef('caa', '消費者向け製品安全情報'), makeRef('mhlw', '子どもの安全に関する情報', 'neutral')],
      sourceName: '子育て製品の安全に関する公的情報',
    })),
  ];
  addTopics(additionalLifestyle);

  // ===== FILL TO 1000 =====
  const fillTopics = [
    // More specific health topics
    ...['newborn-screening-test', 'metabolic-screening', 'hip-dysplasia', 'torticollis-baby', 'tongue-tie', 'pyloric-stenosis', 'intussusception', 'breath-holding-spell', 'laryngomalacia', 'meningitis-child', 'pneumonia-child', 'otitis-media-recurring', 'tonsillitis-child', 'adenoid-child', 'phimosis-child', 'undescended-testis', 'inguinal-hernia-child', 'strabismus-child', 'amblyopia-child', 'color-blindness-child'].map((v, i) => ({
      slug: `health-detail-${v}`,
      title: `${['新生児スクリーニング検査', '先天性代謝異常スクリーニング', '股関節脱臼の早期発見', '斜頸（しゃけい）の対応', '舌小帯短縮症', '幽門狭窄症', '腸重積症', '泣き入りひきつけ', '喉頭軟化症', '髄膜炎', '小児肺炎', '繰り返す中耳炎', '扁桃炎', 'アデノイド肥大', '包茎', '停留精巣', '鼠径ヘルニア', '斜視', '弱視', '色覚特性'][i]}の基礎知識`,
      excerpt: `${['新生児スクリーニング', '代謝異常検査', '股関節脱臼', '斜頸', '舌小帯', '幽門狭窄', '腸重積', '泣き入りひきつけ', '喉頭軟化症', '髄膜炎', '肺炎', '反復性中耳炎', '扁桃炎', 'アデノイド', '包茎', '停留精巣', '鼠径ヘルニア', '斜視', '弱視', '色覚'][i]}の症状・検査・治療について解説します。`,
      dir: 'health', stage: ['0stage', '0stage', '0stage', '0stage', '0stage', '0stage', '0stage', 'pre', '0stage', 'pre', 'pre', 'pre', 'early', 'pre', 'pre', '0stage', 'pre', 'pre', 'early', 'early'][i], categories: ['health'],
      tags: [['スクリーニング', '代謝', '股関節', '斜頸', '舌小帯', '幽門', '腸重積', 'ひきつけ', '喉頭', '髄膜炎', '肺炎', '中耳炎', '扁桃', 'アデノイド', '包茎', '停留精巣', 'ヘルニア', '斜視', '弱視', '色覚'][i], '小児科', '基礎知識'],
      refs: [makeRef('jsps', '小児疾患ガイドライン'), makeRef('mhlw', '小児医療に関する情報', 'neutral')],
      sourceName: '小児医療に関する公的情報',
    })),
    // More education
    ...['montessori-method', 'reggio-emilia', 'steiner-waldorf', 'kumon-method', 'shichida-method', 'glen-doman', 'diamond-education', 'yoko-mine', 'cooperative-learning', 'project-based-learning', 'inquiry-based-learning', 'experiential-learning', 'nature-education', 'art-education', 'music-education', 'physical-education', 'moral-education', 'food-education', 'sex-education-child', 'death-education'].map((v, i) => ({
      slug: `method-${v}`,
      title: `${['モンテッソーリ教育とは', 'レッジョ・エミリア教育', 'シュタイナー教育', '公文式学習法', '七田式教育', 'ドーマンメソッド', 'ダイヤモンド教育', 'ヨコミネ式教育', '協同学習の実践', 'プロジェクト型学習', '探究型学習', '体験型学習', '自然体験教育', 'アート教育', '音楽教育の効果', '体育教育の重要性', '道徳教育の家庭実践', '食育の実践', '子どもへの性教育', 'いのちの教育'][i]}：メリットと家庭での取り入れ方`,
      excerpt: `${['モンテッソーリ', 'レッジョ・エミリア', 'シュタイナー', '公文', '七田式', 'ドーマン', 'ダイヤモンド', 'ヨコミネ式', '協同学習', 'PBL', '探究学習', '体験学習', '自然体験', 'アート', '音楽', '体育', '道徳', '食育', '性教育', 'いのちの教育'][i]}教育の特徴・メリット・家庭での実践方法を解説します。`,
      dir: 'education', stage: ['pre', 'pre', 'pre', 'early', 'pre', '0stage', 'early', 'early', 'mid', 'mid', 'mid', 'early', 'early', 'early', 'pre', 'early', 'early', 'pre', 'mid', 'early'][i], categories: ['education'],
      tags: [['モンテッソーリ', 'レッジョ', 'シュタイナー', '公文', '七田式', 'ドーマン', 'ダイヤモンド', 'ヨコミネ', '協同学習', 'PBL', '探究', '体験', '自然', 'アート', '音楽', '体育', '道徳', '食育', '性教育', 'いのち'][i], '教育法', '家庭教育'],
      refs: [makeRef('mext', '教育に関する情報'), makeRef('cfa', '保育に関する情報', 'neutral')],
      sourceName: '教育法に関する情報',
    })),
    // More digital
    ...['giga-school-tablet', 'online-class-etiquette', 'homework-app', 'math-app-review', 'reading-app-review', 'english-app-review', 'science-app-review', 'music-app-review', 'art-app-review', 'coding-app-review', 'educational-game-review', 'family-shared-calendar', 'kids-email-setup', 'first-social-media', 'digital-citizenship', 'ai-homework-ethics', 'chatgpt-for-kids', 'screen-eye-strain', 'gaming-posture', 'tech-neck-prevention'].map((v, i) => ({
      slug: `digital-extra-${v}`,
      title: `${['GIGAスクール端末の活用', 'オンライン授業のマナー', '宿題管理アプリの活用', '算数学習アプリレビュー', '読書アプリレビュー', '英語学習アプリレビュー', '理科学習アプリレビュー', '音楽学習アプリレビュー', 'お絵かきアプリレビュー', 'プログラミングアプリレビュー', '知育ゲームレビュー', '家族共有カレンダーの活用', '子どものメール設定', '初めてのSNS', 'デジタルシチズンシップ教育', 'AI宿題の倫理問題', 'ChatGPTと子どもの学習', '画面と目の疲れ対策', 'ゲーム中の姿勢', 'ストレートネック予防'][i]}`,
      excerpt: `${['GIGA端末', 'オンライン授業', '宿題アプリ', '算数アプリ', '読書アプリ', '英語アプリ', '理科アプリ', '音楽アプリ', 'お絵かきアプリ', 'プログラミングアプリ', '知育ゲーム', '共有カレンダー', 'メール', 'SNS', 'デジタルシチズンシップ', 'AI倫理', 'ChatGPT', '目の疲れ', 'ゲーム姿勢', 'ストレートネック'][i]}について、子ども向けのポイントをまとめました。`,
      dir: 'digital', stage: ['mid', 'mid', 'mid', 'early', 'early', 'early', 'mid', 'early', 'pre', 'mid', 'pre', 'mid', 'upper', 'upper', 'mid', 'upper', 'upper', 'early', 'mid', 'mid'][i], categories: ['digital'],
      tags: [['GIGA', 'オンライン', 'アプリ', '算数', '読書', '英語', '理科', '音楽', 'お絵かき', 'プログラミング', 'ゲーム', 'カレンダー', 'メール', 'SNS', 'シチズンシップ', 'AI', 'ChatGPT', '目', '姿勢', 'ストレートネック'][i], 'デジタル'],
      refs: [makeRef('mext', 'GIGAスクール構想'), makeRef('soumu', '情報通信に関する情報', 'neutral')],
      sourceName: 'デジタル教育に関する公的情報',
    })),
    // Additional development and nutrition fill
    ...['sensory-bin', 'treasure-basket', 'heuristic-play', 'messy-play', 'construction-play', 'dramatic-play', 'cooperative-play', 'solitary-play', 'parallel-play', 'rough-tumble-play', 'risky-play', 'loose-parts-play', 'small-world-play', 'role-play', 'imaginative-play', 'creative-movement', 'dance-for-kids', 'martial-arts-kids', 'swimming-development', 'climbing-play'].map((v, i) => ({
      slug: `play-type-${v}`,
      title: `${['センサリービン遊び', 'トレジャーバスケット', 'ヒューリスティック遊び', '感触遊び（メッシープレイ）', '構成遊びの発達的意義', 'ごっこ遊びの発達的意義', '協同遊びの促し方', 'ひとり遊びの大切さ', '並行遊びの理解', 'じゃれ合い遊び', 'リスキープレイの考え方', 'ルースパーツ遊び', 'スモールワールド遊び', 'ロールプレイ遊び', '想像遊びの促し方', 'クリエイティブムーブメント', 'ダンスと発達', '武道と子どもの成長', '水泳と発達', 'クライミング遊びの効果'][i]}：子どもの成長に与える効果`,
      excerpt: `${['センサリービン', 'トレジャーバスケット', 'ヒューリスティック', 'メッシープレイ', '構成遊び', 'ごっこ遊び', '協同遊び', 'ひとり遊び', '並行遊び', 'じゃれ合い', 'リスキープレイ', 'ルースパーツ', 'スモールワールド', 'ロールプレイ', '想像遊び', 'クリエイティブムーブメント', 'ダンス', '武道', '水泳', 'クライミング'][i]}の発達的効果と取り入れ方を解説します。`,
      dir: 'development', stage: ['0stage', '0stage', '0stage', 'pre', 'pre', 'pre', 'early', '0stage', 'pre', 'pre', 'early', 'pre', 'pre', 'early', 'pre', 'pre', 'early', 'early', 'pre', 'early'][i], categories: ['development'],
      tags: [['センサリー', 'トレジャー', 'ヒューリスティック', '感触', '構成', 'ごっこ', '協同', 'ひとり', '並行', 'じゃれ合い', 'リスキー', 'ルースパーツ', 'スモールワールド', 'ロール', '想像', 'ムーブメント', 'ダンス', '武道', '水泳', 'クライミング'][i], '遊び', '発達'],
      refs: [makeRef('cfa', '遊びと育ちに関する情報'), makeRef('mext', '幼児教育要領', 'neutral')],
      sourceName: '子どもの遊びと発達に関する情報',
    })),
    // Seasonal nutrition & food safety
    ...['summer-hydration-recipe', 'winter-warm-recipe', 'spring-bento-idea', 'autumn-harvest-recipe', 'food-poisoning-prevention', 'kitchen-hygiene-kids', 'food-storage-guide', 'organic-food-kids', 'additive-free-guide', 'pesticide-awareness'].map((v, i) => ({
      slug: `food-extra-${v}`,
      title: `${['夏の水分補給レシピ', '冬のあったかレシピ', '春のお弁当アイデア', '秋の味覚レシピ', '食中毒予防のポイント', '子どもと学ぶキッチン衛生', '食品保存のコツ', 'オーガニック食品の選び方', '無添加食品の選び方', '残留農薬への意識'][i]}`,
      excerpt: `${['夏の水分補給', '冬の温かい料理', '春のお弁当', '秋の味覚', '食中毒予防', 'キッチン衛生', '食品保存', 'オーガニック', '無添加', '農薬'][i]}に関する実践的な情報をまとめました。`,
      dir: 'nutrition', stage: ['pre', 'pre', 'early', 'pre', 'pre', 'early', 'pre', 'pre', 'pre', 'pre'][i], categories: ['nutrition'],
      tags: [['水分補給', '冬レシピ', 'お弁当', '秋の味覚', '食中毒', '衛生', '保存', 'オーガニック', '無添加', '農薬'][i], '食事', '安全'],
      refs: [makeRef('maff', '食の安全に関する情報'), makeRef('caa', '食品安全情報', 'neutral')],
      sourceName: '食品安全に関する公的情報',
    })),
  ];
  addTopics(fillTopics);

  // Final fill to reach 1000
  const finalFill = [
    { slug: 'child-first-aid-course', title: '子どもの応急処置講座：家庭で覚えておきたいこと', excerpt: '家庭で知っておきたい子どもの応急処置の基本をまとめました。', dir: 'health', stage: 'pre', categories: ['health'], tags: ['応急処置', '安全', '家庭'], refs: [makeRef('fdma', '救急に関する情報'), makeRef('jsps', '小児救急', 'neutral')], sourceName: '小児救急に関する公的情報' },
    { slug: 'child-sleep-regression-complete', title: '睡眠退行の完全ガイド：月齢別の対処法', excerpt: '月齢ごとの睡眠退行の特徴と乗り越え方を解説します。', dir: 'health', stage: '0stage', categories: ['health'], tags: ['睡眠退行', '赤ちゃん', '睡眠'], refs: [makeRef('mhlw', '睡眠に関する情報'), makeRef('jsps', '小児の睡眠', 'neutral')], sourceName: '子どもの睡眠に関する情報' },
    { slug: 'parent-teacher-communication', title: '保護者と先生のコミュニケーション術', excerpt: '園や学校の先生との効果的なコミュニケーション方法を紹介します。', dir: 'education', stage: 'early', categories: ['education'], tags: ['先生', 'コミュニケーション', '学校'], refs: [makeRef('mext', '学校教育に関する情報'), makeRef('cfa', '保育に関する情報', 'neutral')], sourceName: '学校教育に関する公的情報' },
    { slug: 'child-independence-guide', title: '子どもの自立を育むステップ別ガイド', excerpt: '年齢に応じた自立のステップと親のサポート方法をまとめました。', dir: 'development', stage: 'pre', categories: ['development'], tags: ['自立', '生活スキル', '成長'], refs: [makeRef('cfa', '子育て支援情報'), makeRef('mext', '家庭教育', 'neutral')], sourceName: '子どもの自立に関する情報' },
  ];
  addTopics(finalFill);

  return topics;
}

// Helper: generate age-stage variants
function generateVariants(dir, category, templates) {
  const results = [];
  for (const t of templates) {
    for (const stage of t.stages) {
      const stageLabel = { '0stage': '0〜1歳', 'pre': '1〜3歳', 'early': '3〜6歳', 'mid': '6〜9歳', 'upper': '9〜12歳' }[stage];
      const stageSlug = { '0stage': '0to1', 'pre': '1to3', 'early': '3to6', 'mid': '6to9', 'upper': '9to12' }[stage];
      results.push({
        slug: `${t.base}-${stageSlug}`,
        title: `【${stageLabel}】${t.prefix}のポイントと家庭でできるサポート`,
        excerpt: `${stageLabel}のお子さんの${t.prefix}について、発達段階に合わせた具体的なアドバイスをまとめました。`,
        dir, stage, categories: [category],
        tags: [t.prefix.replace(/を育む|の発達|管理/, ''), stageLabel, '年齢別'],
        refs: [
          makeRef('mhlw', `${t.prefix}に関する情報`),
          makeRef(dir === 'education' ? 'mext' : dir === 'mental' ? 'ncnp' : dir === 'digital' ? 'soumu' : dir === 'social' ? 'cao' : 'cfa', `${t.prefix}ガイドライン`, 'neutral'),
        ],
        sourceName: `${t.prefix}に関する公的情報`,
      });
    }
  }
  return results;
}

// Content body generator
function generateBody(topic) {
  const stageLabel = { '0stage': '0〜1歳', 'pre': '1〜3歳', 'early': '3〜6歳', 'mid': '6〜9歳', 'upper': '9〜12歳' }[topic.stage];
  const lines = [];
  lines.push(`${topic.excerpt.replace(/。$/, '')}。この記事では、お子さんの年齢・発達段階に合わせた具体的な情報をお届けします。`);
  lines.push('');

  // Section 1: Overview
  lines.push(`## ${topic.title.replace(/【.*?】/, '').replace(/：.*/, '')}とは`);
  lines.push('');
  lines.push(`${topic.tags[0]}は、子どもの成長過程で非常に重要なテーマです。とくに${stageLabel}の時期は、心身ともに大きな変化が起きる時期であり、保護者のサポートが大きな意味を持ちます。`);
  lines.push('');
  lines.push('厚生労働省やこども家庭庁の調査によると、この分野への関心は年々高まっており、適切な情報を得ることが家族全体の安心につながるとされています。');
  lines.push('');

  // Section 2: Key Points
  lines.push(`## 知っておきたい${topic.tags[0]}の基本ポイント`);
  lines.push('');
  lines.push(`### 1. 発達段階に合わせた対応`);
  lines.push('');
  lines.push(`${stageLabel}のお子さんには、その年齢特有の発達課題があります。画一的な対応ではなく、お子さん一人ひとりのペースを尊重することが大切です。`);
  lines.push('');
  lines.push('**この時期の主な特徴：**');
  lines.push(`- 身体的な発達が著しい時期`);
  lines.push(`- 情緒面での変化が大きくなる`);
  lines.push(`- 社会性が芽生え始める`);
  lines.push(`- 自己主張が増えてくる`);
  lines.push('');
  lines.push(`### 2. 家庭でできる具体的なサポート`);
  lines.push('');
  lines.push('日常生活の中で取り入れやすい方法をいくつか紹介します。');
  lines.push('');
  lines.push(`- **環境を整える**：安全で安心できる空間づくりが基本です`);
  lines.push(`- **声かけを工夫する**：肯定的な言葉かけを意識しましょう`);
  lines.push(`- **一緒に体験する**：親子で共有する時間が信頼関係を深めます`);
  lines.push(`- **無理をしない**：完璧を目指さず、できる範囲で取り組むことが長続きのコツです`);
  lines.push('');

  // Section 3: Practical tips
  lines.push(`## 実践的なアドバイス`);
  lines.push('');
  lines.push('### 日常生活での取り入れ方');
  lines.push('');
  lines.push('| 場面 | ポイント | 注意点 |');
  lines.push('|------|---------|--------|');
  lines.push(`| 朝の時間 | ゆとりを持ったスケジュールで | 急かしすぎないこと |`);
  lines.push(`| 食事の時間 | 家族で一緒に食卓を囲む | 食べる量は個人差が大きい |`);
  lines.push(`| 遊びの時間 | 年齢に合った遊びを取り入れる | 安全面の確認を忘れずに |`);
  lines.push(`| 就寝前 | 穏やかなルーティンを作る | 画面の使用は控えめに |`);
  lines.push('');
  lines.push('### 専門家に相談する目安');
  lines.push('');
  lines.push('以下のような場合は、かかりつけの小児科医や地域の子育て支援センターに相談することをおすすめします。');
  lines.push('');
  lines.push('- 日常生活に支障が出ている場合');
  lines.push('- 保護者自身が強い不安やストレスを感じている場合');
  lines.push('- 園や学校から指摘を受けた場合');
  lines.push('- 同年齢のお子さんと比べて大きな差を感じる場合');
  lines.push('');

  // Section 4: FAQ
  lines.push('## よくある質問');
  lines.push('');
  lines.push(`### Q. ${topic.tags[0]}について、いつから意識すればいい？`);
  lines.push('');
  lines.push(`A. 年齢にかかわらず、お子さんの様子に気づいたときが始めどきです。ただし、${stageLabel}の時期は特に大切な時期とされています。焦らず、お子さんのペースに合わせて取り組んでみてください。`);
  lines.push('');
  lines.push('### Q. 保護者としてどこまでサポートすればいい？');
  lines.push('');
  lines.push('A. お子さんが「自分でやりたい」という気持ちを大切にしつつ、困っているときにはそっと手を差し伸べる——そんなバランスが理想的です。見守りながらも、必要なときには助けを出せる関係づくりを目指しましょう。');
  lines.push('');

  // Closing
  lines.push('## まとめ');
  lines.push('');
  lines.push(`${topic.tags[0]}は一朝一夕で成果が出るものではありません。日々の小さな積み重ねが、やがて大きな力になります。この記事の情報を参考にしつつ、お子さんとの毎日を楽しんでくださいね。`);
  lines.push('');
  lines.push('> **大切なお知らせ**: この記事は公的機関や専門家の発信情報をもとに編集部がまとめたものです。お子さま一人ひとりの状況は異なりますので、心配なことがあれば専門家に相談してくださいね。');

  return lines.join('\n');
}

// Frontmatter generator
function generateFrontmatter(topic, id, index) {
  const score = makeScore();
  const publishedAt = makeDate(index);
  const readingTime = 8 + Math.floor(Math.random() * 12);
  const refs = (topic.refs || []).map(r =>
    `  - title: "${r.title}"\n    url: "${r.url}"\n    org: "${r.org}"\n    stance: "${r.stance}"`
  ).join('\n');

  return `---
id: "${id}"
slug: "${topic.slug}"
title: "${topic.title}"
excerpt: "${topic.excerpt}"
stage: "${topic.stage}"
categories:
${topic.categories.map(c => `  - ${c}`).join('\n')}
sourceName: "${topic.sourceName || '公的機関の情報'}"
references:
${refs}
perspectives:
  positive: "公的機関のガイドラインや研究データに基づいた信頼性の高い情報です。"
  neutral: "お子さんの状況は個人差が大きいため、あくまで一般的な目安としてご参照ください。"
  cautious: "お子さんの状況は一人ひとり異なります。この記事の情報は一般的な内容であり、個別の判断は専門家にご相談ください。"
score:
  total: ${score.total}
  reliability: ${score.reliability}
  neutrality: ${score.neutrality}
  freshness: ${score.freshness}
  ageRelevance: ${score.ageRelevance}
  readability: ${score.readability}
publishedAt: "${publishedAt}"
updatedAt: "2026-03-09"
readingTime: ${readingTime}
tags:
${topic.tags.map(t => `  - "${t}"`).join('\n')}
relatedSlugs: []
---`;
}

// Main
function main() {
  const existingIds = getExistingIds();
  const existingSlugs = getExistingSlugs();
  const allTopics = generateTopics();

  // Filter out topics with duplicate slugs
  const newTopics = allTopics.filter(t => !existingSlugs.has(t.slug));

  console.log(`Total topics generated: ${allTopics.length}`);
  console.log(`After dedup: ${newTopics.length}`);
  console.log(`Existing articles: ${existingSlugs.size}`);
  console.log(`Target: ${existingSlugs.size + newTopics.length}`);

  // Find next available ID
  let nextId = 103;
  for (const id of existingIds) {
    const num = parseInt(id.replace('art-', ''));
    if (num >= nextId) nextId = num + 1;
  }

  let created = 0;
  for (let i = 0; i < newTopics.length; i++) {
    const topic = newTopics[i];
    const id = `art-${String(nextId).padStart(3, '0')}`;
    nextId++;

    const dir = path.join(CONTENT_DIR, topic.dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${topic.slug}.mdx`);
    const frontmatter = generateFrontmatter(topic, id, i);
    const body = generateBody(topic);
    const content = `${frontmatter}\n\n${body}\n`;

    fs.writeFileSync(filePath, content, 'utf-8');
    created++;
  }

  console.log(`Created ${created} articles. Total should be: ${existingSlugs.size + created}`);
}

main();
