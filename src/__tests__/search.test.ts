import { describe, expect, it } from 'vitest';
import Fuse from 'fuse.js';

// Mirror the production fuse config
function makeFuse<T extends { title: string }>(items: T[]) {
  return new Fuse(items, {
    keys: ['title'],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
    includeScore: true,
  });
}

describe('Fuse search behavior', () => {
  const fixture = [
    { id: '1', title: 'おむつの選び方比較' },
    { id: '2', title: 'おむつかぶれの予防と治療' },
    { id: '3', title: '子どものおやつガイド：補食としての正しい与え方' },
    { id: '4', title: '手作りおやつレシピ集' },
    { id: '5', title: '幼稚園と保育園の違い：それぞれのメリットと選び方' },
    { id: '6', title: '保育園選びのポイント' },
    { id: '7', title: '幼稚園の入園準備完全ガイド' },
  ];

  it('does not match おむつ to おやつ (regression)', () => {
    const fuse = makeFuse(fixture);
    const hits = fuse.search('おむつ').map((r) => r.item.id);
    expect(hits).toContain('1');
    expect(hits).toContain('2');
    expect(hits).not.toContain('3');
    expect(hits).not.toContain('4');
  });

  it('matches single keyword on relevant articles', () => {
    const fuse = makeFuse(fixture);
    const hits = fuse.search('保育園').map((r) => r.item.id);
    expect(hits).toContain('5');
    expect(hits).toContain('6');
  });
});

describe('Tokenized fallback', () => {
  function extractTokens(q: string): string[] {
    const cleaned = q.replace(/[、。！？「」『』（）()\[\]\s,.!?]+/g, ' ');
    const stopwords = new Set([
      'と', 'や', 'の', 'は', 'が', 'を', 'に', 'で', 'から', 'まで', 'へ', 'も', 'か', 'よ', 'ね',
      'どっち', 'どちら', 'どう', 'どの', 'いい', 'よい', 'なに', '何', 'なん',
    ]);
    return [
      ...new Set(
        cleaned
          .split(/\s+|と|や/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 2 && !stopwords.has(s))
      ),
    ];
  }

  it('tokenizes natural language question into meaningful words', () => {
    const tokens = extractTokens('幼稚園と保育園、どっちがいいの？');
    expect(tokens).toContain('幼稚園');
    expect(tokens).toContain('保育園');
  });

  it('drops single-character/stopword fragments', () => {
    const tokens = extractTokens('と や は が');
    expect(tokens).toEqual([]);
  });

  it('handles ASCII punctuation', () => {
    const tokens = extractTokens('夜泣き, 離乳食, 入学準備!');
    expect(tokens).toContain('夜泣き');
    expect(tokens).toContain('離乳食');
    expect(tokens).toContain('入学準備');
  });
});
