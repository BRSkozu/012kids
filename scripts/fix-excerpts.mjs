#!/usr/bin/env node

/**
 * Fix template-style excerpts in MDX files.
 * Generates unique excerpts from title, tags, and category context.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'articles');
const TEMPLATE_PATTERN = '公的機関や専門家の情報をもとに';

const CATEGORY_CONTEXT = {
  development: '子どもの発達・成長',
  nutrition: '食事・栄養',
  education: '教育・学び',
  health: '健康・医療',
  mental: 'こころ・メンタル',
  digital: 'デジタル・メディア',
  social: '社会性・人間関係',
  lifestyle: '生活・暮らし',
  pregnancy: '妊娠・出産',
};

const STAGE_LABELS = {
  '0stage': '0〜2歳',
  pre: '3〜5歳',
  early: '6〜8歳',
  mid: '9〜10歳',
  upper: '11〜12歳',
};

const PATTERNS = [
  (title, tags, stage) => {
    const tagStr = tags.slice(0, 2).join('や');
    return tagStr
      ? `${tagStr}について、${STAGE_LABELS[stage] || ''}の子どもに合わせた対応のポイントをまとめました。`
      : `${STAGE_LABELS[stage] || ''}の子育てで知っておきたいポイントをまとめました。`;
  },
  (title, tags, stage, cat) => {
    const catLabel = CATEGORY_CONTEXT[cat] || '';
    const tagStr = tags.slice(0, 2).join('・');
    return tagStr
      ? `${catLabel}の観点から、${tagStr}のポイントと家庭でできる工夫を紹介します。`
      : `${catLabel}に関する基礎知識と、日常で活かせるヒントをお届けします。`;
  },
  (title, tags, stage) => {
    const tagStr = tags.slice(0, 3).join('・');
    return tagStr
      ? `${tagStr}に関する疑問に答えます。年齢に合った対応の目安もあわせて解説。`
      : `よくある疑問に答えつつ、年齢に合った対応の目安を解説します。`;
  },
  (title, tags, stage, cat) => {
    const catLabel = CATEGORY_CONTEXT[cat] || '';
    return `${STAGE_LABELS[stage] || ''}のお子さんの${catLabel}について、押さえておきたい基本と実践的なアドバイス。`;
  },
];

let fixed = 0;
let skipped = 0;

function generateExcerpt(title, tags, stage, category, index) {
  const pattern = PATTERNS[index % PATTERNS.length];
  return pattern(title, tags || [], stage, category);
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.mdx')) continue;

    const raw = fs.readFileSync(fullPath, 'utf-8');

    const excerptMatch = raw.match(/^excerpt:\s*"(.+)"/m);
    if (!excerptMatch || !excerptMatch[1].includes(TEMPLATE_PATTERN)) {
      skipped++;
      continue;
    }

    const fmEnd = raw.indexOf('---', 4);
    if (fmEnd === -1) { skipped++; continue; }

    const frontmatter = raw.slice(0, fmEnd + 3);
    const content = raw.slice(fmEnd + 3);

    const titleMatch = frontmatter.match(/^title:\s*"(.+)"/m);
    const title = titleMatch ? titleMatch[1] : '';
    const stageMatch = frontmatter.match(/^stage:\s*"?(\w+)"?/m);
    const stage = stageMatch ? stageMatch[1] : '';
    const catMatch = frontmatter.match(/categories:\n\s+-\s*(\w+)/);
    const category = catMatch ? catMatch[1] : '';
    const tagsSection = frontmatter.match(/tags:\n((?:\s+-\s*"[^"]+"\n?)+)/);
    const tags = tagsSection
      ? tagsSection[1].match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || []
      : [];

    const newExcerpt = generateExcerpt(title, tags, stage, category, fixed);
    const safeExcerpt = newExcerpt.replace(/"/g, '\\"');

    const newFrontmatter = frontmatter.replace(
      /^excerpt:\s*".*"/m,
      `excerpt: "${safeExcerpt}"`
    );

    const newRaw = newFrontmatter + content;
    fs.writeFileSync(fullPath, newRaw, 'utf-8');
    fixed++;

    if (fixed <= 8) {
      console.log(`✓ ${entry.name}`);
      console.log(`  OLD: ${excerptMatch[1].slice(0, 70)}...`);
      console.log(`  NEW: ${newExcerpt}`);
      console.log();
    }
  }
}

processDirectory(CONTENT_DIR);
console.log(`Done: ${fixed} excerpts fixed, ${skipped} already unique.`);
