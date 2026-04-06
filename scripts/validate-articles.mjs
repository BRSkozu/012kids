#!/usr/bin/env node
/**
 * Article Validation Script for 012.kids
 *
 * 全記事の論理矛盾をチェックする。生成時・公開時に呼び出される。
 *
 * チェック項目：
 *   1. 必須フィールドの存在
 *   2. スコア合計値の整合性 (total = 各サブスコアの合計)
 *   3. ステージの有効性
 *   4. カテゴリの有効性
 *   5. カテゴリとディレクトリの一致
 *   6. ID・slugの重複チェック
 *   7. 日付の整合性 (updatedAt >= publishedAt)
 *   8. 参照元のstanceの有効性
 *   9. perspectivesの3観点存在チェック
 *  10. readingTimeの妥当性
 *  11. ステージとカテゴリの論理的整合性
 *  12. タイトル・excerptの空チェック
 *
 * Usage:
 *   node scripts/validate-articles.mjs                    # 全記事チェック
 *   node scripts/validate-articles.mjs --files a.mdx b.mdx  # 指定ファイルのみ
 *   node scripts/validate-articles.mjs --strict            # エラーがあれば exit 1
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

// ---------------------------------------------------------------------------
// 定義: 有効な値
// ---------------------------------------------------------------------------
const VALID_STAGES = ['0stage', 'pre', 'early', 'mid', 'upper'];
const VALID_CATEGORIES = [
  'development', 'nutrition', 'education', 'health',
  'mental', 'digital', 'social', 'lifestyle', 'pregnancy',
];
const VALID_STANCES = ['positive', 'neutral', 'cautious'];

// ステージとカテゴリの論理的に不整合な組み合わせ
const STAGE_CATEGORY_CONFLICTS = [
  // pregnancy記事は子ども向けステージ(mid/upper)と矛盾
  { stage: 'mid', category: 'pregnancy', reason: '妊娠・出産カテゴリは9〜10歳ステージと矛盾します' },
  { stage: 'upper', category: 'pregnancy', reason: '妊娠・出産カテゴリは11〜12歳ステージと矛盾します' },
  { stage: 'early', category: 'pregnancy', reason: '妊娠・出産カテゴリは6〜8歳ステージと矛盾します' },
];

const REQUIRED_FIELDS = ['id', 'slug', 'title', 'excerpt', 'stage', 'categories', 'publishedAt'];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const filesIdx = args.indexOf('--files');
const SPECIFIC_FILES = filesIdx >= 0 ? args.slice(filesIdx + 1).filter(f => !f.startsWith('--')) : null;

// ---------------------------------------------------------------------------
// ファイル収集
// ---------------------------------------------------------------------------
function getAllMdxFiles() {
  const files = [];
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const mdxFiles = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'));
    for (const file of mdxFiles) {
      files.push({ filePath: path.join(catDir, file), directory: cat });
    }
  }
  return files;
}

function getTargetFiles() {
  if (SPECIFIC_FILES && SPECIFIC_FILES.length > 0) {
    return SPECIFIC_FILES.map(f => {
      const abs = path.isAbsolute(f) ? f : path.join(process.cwd(), f);
      const rel = path.relative(CONTENT_DIR, abs);
      const directory = rel.split(path.sep)[0];
      return { filePath: abs, directory };
    });
  }
  return getAllMdxFiles();
}

// ---------------------------------------------------------------------------
// バリデーション
// ---------------------------------------------------------------------------
function validateArticle(filePath, directory, globalState) {
  const errors = [];
  const warnings = [];
  const relPath = path.relative(CONTENT_DIR, filePath);

  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  } catch {
    errors.push(`ファイルを読み込めません: ${filePath}`);
    return { errors, warnings };
  }

  let data;
  try {
    ({ data } = matter(fileContent));
  } catch (e) {
    errors.push(`frontmatterの解析に失敗: ${e.message}`);
    return { errors, warnings };
  }

  // 1. 必須フィールド
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`必須フィールド「${field}」が未設定です`);
    }
  }

  // 2. スコア合計値の整合性
  if (data.score) {
    const { reliability, neutrality, freshness, ageRelevance, readability, total } = data.score;
    const subScores = [reliability, neutrality, freshness, ageRelevance, readability];
    if (subScores.every(s => typeof s === 'number')) {
      const calculatedTotal = subScores.reduce((sum, v) => sum + v, 0);
      if (typeof total === 'number' && total !== calculatedTotal) {
        errors.push(`スコア合計値が不整合: total=${total} だが各項目の合計=${calculatedTotal} (reliability=${reliability}, neutrality=${neutrality}, freshness=${freshness}, ageRelevance=${ageRelevance}, readability=${readability})`);
      }
    }
    // サブスコアの範囲チェック
    if (typeof reliability === 'number' && (reliability < 0 || reliability > 30)) {
      warnings.push(`reliability=${reliability} が想定範囲(0-30)外です`);
    }
    if (typeof neutrality === 'number' && (neutrality < 0 || neutrality > 30)) {
      warnings.push(`neutrality=${neutrality} が想定範囲(0-30)外です`);
    }
    if (typeof freshness === 'number' && (freshness < 0 || freshness > 25)) {
      warnings.push(`freshness=${freshness} が想定範囲(0-25)外です`);
    }
    if (typeof ageRelevance === 'number' && (ageRelevance < 0 || ageRelevance > 20)) {
      warnings.push(`ageRelevance=${ageRelevance} が想定範囲(0-20)外です`);
    }
    if (typeof readability === 'number' && (readability < 0 || readability > 15)) {
      warnings.push(`readability=${readability} が想定範囲(0-15)外です`);
    }
  } else {
    warnings.push('scoreフィールドが未設定です');
  }

  // 3. ステージの有効性
  if (data.stage && !VALID_STAGES.includes(data.stage)) {
    errors.push(`無効なステージ: "${data.stage}" (有効値: ${VALID_STAGES.join(', ')})`);
  }

  // 4. カテゴリの有効性
  if (Array.isArray(data.categories)) {
    for (const cat of data.categories) {
      if (!VALID_CATEGORIES.includes(cat)) {
        errors.push(`無効なカテゴリ: "${cat}" (有効値: ${VALID_CATEGORIES.join(', ')})`);
      }
    }
    if (data.categories.length === 0) {
      errors.push('カテゴリが空の配列です');
    }
  }

  // 5. カテゴリとディレクトリの一致
  if (Array.isArray(data.categories) && directory) {
    if (!data.categories.includes(directory)) {
      warnings.push(`ディレクトリ "${directory}" がcategoriesに含まれていません (categories: [${data.categories.join(', ')}])`);
    }
  }

  // 6. ID・slugの重複チェック (globalStateを使用)
  if (data.id) {
    if (globalState.ids.has(data.id)) {
      errors.push(`IDが重複しています: "${data.id}" (既出: ${globalState.ids.get(data.id)})`);
    } else {
      globalState.ids.set(data.id, relPath);
    }
  }
  if (data.slug) {
    if (globalState.slugs.has(data.slug)) {
      errors.push(`slugが重複しています: "${data.slug}" (既出: ${globalState.slugs.get(data.slug)})`);
    } else {
      globalState.slugs.set(data.slug, relPath);
    }
  }

  // 7. 日付の整合性
  if (data.publishedAt && data.updatedAt) {
    const pub = new Date(data.publishedAt);
    const upd = new Date(data.updatedAt);
    if (!isNaN(pub.getTime()) && !isNaN(upd.getTime()) && upd < pub) {
      errors.push(`updatedAt (${data.updatedAt}) が publishedAt (${data.publishedAt}) より前の日付です`);
    }
  }
  if (data.publishedAt && isNaN(new Date(data.publishedAt).getTime())) {
    errors.push(`publishedAt "${data.publishedAt}" が無効な日付形式です`);
  }
  if (data.updatedAt && isNaN(new Date(data.updatedAt).getTime())) {
    errors.push(`updatedAt "${data.updatedAt}" が無効な日付形式です`);
  }

  // 8. 参照元のstanceの有効性
  if (Array.isArray(data.references)) {
    data.references.forEach((ref, i) => {
      if (ref.stance && !VALID_STANCES.includes(ref.stance)) {
        errors.push(`references[${i}] の stance が無効: "${ref.stance}" (有効値: ${VALID_STANCES.join(', ')})`);
      }
      if (!ref.title || !ref.url || !ref.org) {
        warnings.push(`references[${i}] に不完全な項目があります (title/url/orgが必要)`);
      }
    });
  }

  // 9. perspectivesの3観点存在チェック
  if (data.perspectives) {
    for (const key of ['positive', 'neutral', 'cautious']) {
      if (!data.perspectives[key] || data.perspectives[key].trim() === '') {
        warnings.push(`perspectives.${key} が未設定または空です`);
      }
    }
  }

  // 10. readingTimeの妥当性
  if (data.readingTime !== undefined) {
    if (typeof data.readingTime !== 'number' || data.readingTime < 1 || data.readingTime > 60) {
      warnings.push(`readingTime=${data.readingTime} が想定範囲(1-60分)外です`);
    }
  }

  // 11. ステージとカテゴリの論理的整合性
  if (data.stage && Array.isArray(data.categories)) {
    for (const conflict of STAGE_CATEGORY_CONFLICTS) {
      if (data.stage === conflict.stage && data.categories.includes(conflict.category)) {
        errors.push(`ステージ×カテゴリの論理矛盾: ${conflict.reason} (stage="${data.stage}", category="${conflict.category}")`);
      }
    }
  }

  // 12. タイトル・excerptの空白チェック
  if (typeof data.title === 'string' && data.title.trim() === '') {
    errors.push('titleが空文字です');
  }
  if (typeof data.excerpt === 'string' && data.excerpt.trim() === '') {
    errors.push('excerptが空文字です');
  }

  // 13. slugとファイル名の一致チェック
  if (data.slug) {
    const fileName = path.basename(filePath, '.mdx');
    if (data.slug !== fileName) {
      warnings.push(`slugとファイル名が不一致: slug="${data.slug}" / ファイル名="${fileName}"`);
    }
  }

  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// メイン
// ---------------------------------------------------------------------------
export function validateAllArticles(targetFiles = null) {
  const files = targetFiles || getAllMdxFiles();
  const globalState = { ids: new Map(), slugs: new Map() };

  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];

  for (const { filePath, directory } of files) {
    const { errors, warnings } = validateArticle(filePath, directory, globalState);
    const relPath = path.relative(CONTENT_DIR, filePath);

    if (errors.length > 0 || warnings.length > 0) {
      results.push({ relPath, errors, warnings });
    }
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }

  return { results, totalErrors, totalWarnings, fileCount: files.length };
}

// CLIモードで実行
const isMain = process.argv[1] && (
  process.argv[1].endsWith('validate-articles.mjs') ||
  process.argv[1].endsWith('validate-articles')
);

if (isMain) {
  console.log('\n🔍 記事バリデーション開始...\n');

  const files = getTargetFiles();
  const { results, totalErrors, totalWarnings, fileCount } = validateAllArticles(files);

  // 結果表示
  for (const { relPath, errors, warnings } of results) {
    console.log(`📄 ${relPath}`);
    for (const err of errors) {
      console.log(`  ❌ ERROR: ${err}`);
    }
    for (const warn of warnings) {
      console.log(`  ⚠️  WARN: ${warn}`);
    }
    console.log('');
  }

  // サマリー
  console.log('─'.repeat(60));
  console.log(`📊 チェック結果: ${fileCount}件の記事を検証`);
  console.log(`  ❌ エラー: ${totalErrors}件`);
  console.log(`  ⚠️  警告: ${totalWarnings}件`);

  if (totalErrors === 0) {
    console.log('\n✅ 論理矛盾は見つかりませんでした。\n');
  } else {
    console.log(`\n🚨 ${totalErrors}件のエラーが見つかりました。修正が必要です。\n`);
  }

  if (STRICT && totalErrors > 0) {
    process.exit(1);
  }
}
