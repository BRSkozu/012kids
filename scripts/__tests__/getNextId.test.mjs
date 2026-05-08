import { describe, expect, it } from 'vitest';

// The regex used by daily-article-generator.mjs::getNextId() to extract IDs from MDX
// Regression: original /id:\s*"art-(\d+)"/ missed unquoted ids and caused duplicates.
const ID_REGEX = /^id:\s*"?art-(\d+)"?/m;

function findMaxId(mdxFiles) {
  let maxId = 1000;
  for (const content of mdxFiles) {
    const match = content.match(ID_REGEX);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) maxId = num;
    }
  }
  return maxId;
}

describe('getNextId regex', () => {
  it('matches quoted IDs', () => {
    expect('id: "art-1234"\n'.match(ID_REGEX)?.[1]).toBe('1234');
  });

  it('matches unquoted IDs (regression)', () => {
    expect('id: art-1240\n'.match(ID_REGEX)?.[1]).toBe('1240');
  });

  it('finds max across mixed-format files', () => {
    const files = [
      'id: "art-1238"\ntitle: "X"',
      'id: art-1286\ntitle: "Y"',
      'id: "art-1267"\ntitle: "Z"',
    ];
    expect(findMaxId(files)).toBe(1286);
  });

  it('does not match id: in middle of line', () => {
    // Should only match at line start (anchored with ^...m flag)
    const content = 'something id: "art-9999" inline\nid: "art-100"\n';
    expect(content.match(ID_REGEX)?.[1]).toBe('100');
  });
});
