#!/usr/bin/env node
/**
 * Enrich existing articles with richer content structure:
 * 1. まとめ (Summary)
 * 2. 比較・各意見の整理 (Comparison)
 * 3. おすすめサイト・参考リンク (Recommended sites)
 * 4. 詳細解説 (Detailed explanation)
 *
 * Only enriches articles that don't already have the new structure.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

function getAllMdxFiles() {
  const files = [];
  const categories = fs.readdirSync(CONTENT_DIR);
  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const mdxFiles = fs.readdirSync(catDir).filter((f) => f.endsWith('.mdx'));
    for (const file of mdxFiles) {
      files.push(path.join(catDir, file));
    }
  }
  return files;
}

function generateEnrichedBody(fm, originalBody) {
  const title = fm.title;
  const refs = fm.references || [];
  const perspectives = fm.perspectives || {};
  const tags = fm.tags || [];
  const stage = fm.stage;

  // Build age context
  const ageMap = {
    '0stage': '0〜2歳',
    'pre': '3〜5歳',
    'early': '6〜8歳',
    'mid': '9〜10歳',
    'upper': '11〜12歳',
  };
  const ageRange = ageMap[stage] || '';

  // Build reference links
  const refLinks = refs.map((r) =>
    `- [${r.title}](${r.url})（${r.org}）`
  ).join('\n');

  // Build org names for mentions
  const orgNames = [...new Set(refs.map((r) => r.org))];
  const mainOrg = orgNames[0] || '公的機関';
  const secondOrg = orgNames[1] || '専門家';

  // Extract bullet points from original body for preserving unique content
  const originalLines = originalBody.trim().split('\n').filter(l => l.trim());
  const originalSections = [];
  let currentSection = null;
  for (const line of originalLines) {
    if (line.startsWith('## ')) {
      if (currentSection) originalSections.push(currentSection);
      currentSection = { heading: line.replace('## ', ''), lines: [] };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }
  if (currentSection) originalSections.push(currentSection);

  // Preserve original sections as "詳しい解説" subsections
  let preservedContent = '';
  for (const section of originalSections) {
    if (section.heading.includes('まとめ') || section.heading.includes('比較') || section.heading.includes('おすすめ')) continue;
    preservedContent += `\n### ${section.heading}\n\n${section.lines.join('\n')}\n`;
  }

  // Build perspectives comparison
  const positiveText = perspectives.positive || '適切な対応で効果が期待できます。';
  const neutralText = perspectives.neutral || '個別の状況に応じた判断が重要です。';
  const cautiousText = perspectives.cautious || '専門家への相談も検討しましょう。';

  return `
## この記事の3つのポイント

**${title}**について、${orgNames.slice(0, 3).join('・')}などの情報をもとにまとめました。

- **結論から言うと**：${positiveText.slice(0, 60)}…
- **ただし注意点も**：${cautiousText.slice(0, 60)}…
- **対象年齢**：${ageRange}のお子さんを持つ保護者向け

> この記事では、まず「まとめ」で全体像を示し、次に「各機関の見解比較」「おすすめサイト」を紹介した上で、詳細を解説します。

---

## 各機関の見解を比較

このテーマについて、主要な機関の見方は以下のように整理できます。

| 立場 | 機関・出典 | 見解の要旨 |
|------|-----------|------------|
| **積極的** | ${refs.find(r => r.stance === 'positive')?.org || mainOrg} | ${positiveText.slice(0, 80)} |
| **中立的** | ${refs.find(r => r.stance === 'neutral')?.org || secondOrg} | ${neutralText.slice(0, 80)} |
| **慎重派** | ${refs.find(r => r.stance === 'cautious')?.org || '一部専門家'} | ${cautiousText.slice(0, 80)} |

### 見解の詳細

**積極的な立場：**
${positiveText}

**中立的な立場：**
${neutralText}

**慎重な立場：**
${cautiousText}

---

## おすすめサイト・参考リンク

このテーマについて信頼できる情報源を厳選しました。詳しく知りたい方はこちらもご確認ください。

${refLinks}

${tags.length > 0 ? `**関連キーワード**: ${tags.join('、')}` : ''}

---

## 詳しい解説
${preservedContent || `

### 基本的な知識

${title}について、まず押さえておきたい基本情報です。

${mainOrg}の情報によると、このテーマは${ageRange}の子どもを持つ多くの保護者が関心を寄せるテーマの一つです。正しい知識を身につけることで、お子さんに適切な対応ができるようになります。

### 家庭でできること

1. **正確な情報を集める**：公的機関のサイトで最新情報を確認する
2. **お子さんの様子を観察**：日頃の変化を記録しておく
3. **専門家に相談**：かかりつけ医や地域の相談窓口を活用する
4. **家族で共有**：パートナーや祖父母と方針を揃える
5. **焦らず見守る**：子どもの成長ペースは個人差が大きい

### よくある質問

**Q. いつ頃から気をつけるべき？**
A. ${ageRange}頃が一つの目安ですが、お子さんの個性によって異なります。気になることがあれば早めに専門家へ。

**Q. どこに相談すればいい？**
A. まずはかかりつけ小児科、または地域の子育て支援センター・保健センターに相談しましょう。

**Q. 費用はかかる？**
A. 公的な相談窓口は基本的に無料です。医療機関の場合は保険適用の範囲をご確認ください。
`}

---

## 相談できる窓口

| 窓口 | 連絡先 | 対応時間 |
|------|--------|----------|
| こどもの救急 | **#8000** | 夜間・休日 |
| 児童相談所 | **189** | 24時間 |
| 子育て支援センター | お住まいの市区町村 | 平日日中 |
| かかりつけ小児科 | ー | 診療時間内 |

---

## この記事のまとめ

${title}について、${orgNames.slice(0, 2).join('と')}などの公的情報をもとに解説しました。

**ポイントの振り返り：**
- ${positiveText.split('。')[0]}
- ${neutralText.split('。')[0]}
- 不安があれば専門家への早めの相談が大切

子育てに唯一の正解はありません。お子さんの個性を大切にしながら、この記事が日々の参考になれば幸いです。

> **大切なお知らせ**: この記事は公的機関の発信情報をもとに012.kids編集部が独自にまとめたものです。お子さまの個別の状況については、かかりつけ医や専門家にご相談ください。
`;
}

// Main
const files = getAllMdxFiles();
let enriched = 0;
let skipped = 0;

for (const filePath of files) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Skip if already has the new structure
  if (content.includes('## この記事の3つのポイント') || content.includes('## 各機関の見解を比較')) {
    skipped++;
    continue;
  }

  // Also skip articles that already have the まとめ+比較 structure from daily generator
  if (content.includes('## この記事のまとめ') && content.includes('## 各意見・見解の比較')) {
    skipped++;
    continue;
  }

  const newBody = generateEnrichedBody(data, content);

  // Reconstruct the file
  const frontmatterStr = fileContent.split('---')[1];
  const newContent = `---${frontmatterStr}---\n${newBody}`;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  enriched++;
}

console.log(`Enriched: ${enriched} articles`);
console.log(`Skipped (already rich): ${skipped} articles`);
console.log(`Total: ${files.length} articles`);
