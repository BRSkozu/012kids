import { describe, expect, it } from 'vitest';
import { ARTICLES } from '@/data/articles';

describe('ARTICLES dataset', () => {
  it('has at least one article', () => {
    expect(ARTICLES.length).toBeGreaterThan(0);
  });

  it('all article IDs are unique (regression: daily-articles ID collision)', () => {
    const ids = ARTICLES.map((a) => a.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes, `duplicate ids: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
  });

  it('all article slugs are unique', () => {
    const slugs = ARTICLES.map((a) => a.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes, `duplicate slugs: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
  });

  it('every article has required fields', () => {
    for (const a of ARTICLES) {
      expect(a.id, `missing id`).toBeTruthy();
      expect(a.slug, `${a.id}: missing slug`).toBeTruthy();
      expect(a.title, `${a.id}: missing title`).toBeTruthy();
      expect(a.excerpt, `${a.id}: missing excerpt`).toBeTruthy();
      expect(a.stage, `${a.id}: missing stage`).toBeTruthy();
      expect(a.categories, `${a.id}: categories not array`).toBeInstanceOf(Array);
      expect(a.categories.length, `${a.id}: empty categories`).toBeGreaterThan(0);
      expect(a.publishedAt, `${a.id}: missing publishedAt`).toMatch(/^\d{4}-\d{2}-\d{2}/);
    }
  });

  it('every article ID follows art-#### convention', () => {
    for (const a of ARTICLES) {
      expect(a.id, `bad id format: ${a.id}`).toMatch(/^art-\d+$/);
    }
  });

  it('relatedArticleIds reference existing articles only', () => {
    const idSet = new Set(ARTICLES.map((a) => a.id));
    for (const a of ARTICLES) {
      for (const rid of a.relatedArticleIds ?? []) {
        expect(idSet.has(rid), `${a.id} references non-existent ${rid}`).toBe(true);
      }
    }
  });

  it('stages are valid', () => {
    const validStages = new Set(['0stage', 'pre', 'early', 'mid', 'upper']);
    for (const a of ARTICLES) {
      expect(validStages.has(a.stage), `${a.id} bad stage: ${a.stage}`).toBe(true);
    }
  });
});
