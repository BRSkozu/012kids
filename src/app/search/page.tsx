'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Fuse from 'fuse.js';
import ArticleCard from '@/components/articles/ArticleCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import WorrySearch from '@/components/search/WorrySearch';
import SearchAutocomplete from '@/components/search/SearchAutocomplete';
import SearchEmptyState from '@/components/search/SearchEmptyState';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';
import { ARTICLES } from '@/data/articles';
import { AgeStage, ContentCategory } from '@/types';

const fuse = new Fuse(ARTICLES, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'excerpt', weight: 2 },
    { name: 'tags', weight: 2 },
    { name: 'categories', weight: 1 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
});

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') === 'worry' ? 'worry' : 'keyword';
  const [query, setQuery] = useState(initialQuery);
  const [selectedStage, setSelectedStage] = useState<AgeStage | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [tab, setTab] = useState<'keyword' | 'worry'>(initialTab);

  useEffect(() => {
    document.title = tab === 'worry'
      ? 'お悩みから探す | 012キッズ'
      : '記事を検索 | 012キッズ';
  }, [tab]);

  // Tokenize Japanese query into meaningful words by stripping particles/punctuation
  function extractTokens(q: string): string[] {
    const cleaned = q.replace(/[、。！？「」『』（）()\[\]\s,.!?]+/g, ' ');
    const stopwords = new Set([
      'と', 'や', 'の', 'は', 'が', 'を', 'に', 'で', 'から', 'まで', 'へ', 'も', 'か', 'よ', 'ね',
      'どっち', 'どちら', 'どう', 'どの', 'いい', 'よい', 'なに', '何', 'なん',
    ]);
    const tokens = cleaned
      .split(/\s+|と|や/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && !stopwords.has(s));
    return [...new Set(tokens)];
  }

  const { results, isFallback, fallbackTokens } = useMemo(() => {
    if (!query.trim() && selectedStage === 'all' && selectedCategory === 'all') {
      return { results: [] as typeof ARTICLES, isFallback: false, fallbackTokens: [] as string[] };
    }

    const applyFilters = (items: typeof ARTICLES) => {
      let filtered = items;
      if (selectedStage !== 'all') filtered = filtered.filter((a) => a.stage === selectedStage);
      if (selectedCategory !== 'all') filtered = filtered.filter((a) => a.categories.includes(selectedCategory as ContentCategory));
      return filtered;
    };

    const trimmed = query.trim();
    if (!trimmed) return { results: applyFilters([...ARTICLES]), isFallback: false, fallbackTokens: [] };

    // Primary: full-query fuzzy search
    const primary = applyFilters(fuse.search(trimmed).map((r) => r.item));
    if (primary.length > 0) return { results: primary, isFallback: false, fallbackTokens: [] };

    // Fallback: tokenize query and merge per-token searches
    const tokens = extractTokens(trimmed);
    if (tokens.length === 0) return { results: [], isFallback: false, fallbackTokens: [] };

    const seen = new Set<string>();
    const merged: typeof ARTICLES = [];
    for (const token of tokens) {
      for (const r of fuse.search(token)) {
        if (!seen.has(r.item.id)) {
          seen.add(r.item.id);
          merged.push(r.item);
        }
      }
    }
    return { results: applyFilters(merged), isFallback: true, fallbackTokens: tokens };
  }, [query, selectedStage, selectedCategory]);

  const showResults = query.trim() || selectedStage !== 'all' || selectedCategory !== 'all';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '検索' }]} />
      <h1
        className="text-3xl text-[var(--color-foreground)] mb-6"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        {tab === 'worry' ? 'お悩みから探す' : '記事を検索'}
      </h1>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('keyword')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'keyword'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
          }`}
        >
          キーワードで検索
        </button>
        <button
          onClick={() => setTab('worry')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'worry'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
          }`}
        >
          お悩みから探す
        </button>
      </div>

      {tab === 'worry' ? (
        <WorrySearch />
      ) : (
        <>
          {/* Search Input with autocomplete */}
          <div className="mb-6">
            <SearchAutocomplete value={query} onChange={setQuery} autoFocus />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label
                className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-1 block"
                style={{ fontFamily: 'var(--font-gothic)' }}
              >
                年齢帯
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedStage('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedStage === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  全年齢
                </button>
                {AGE_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedStage === stage.id
                        ? 'ring-2 ring-[var(--color-primary)]'
                        : ''
                    }`}
                    style={{ backgroundColor: `${stage.color}${selectedStage === stage.id ? '' : '66'}` }}
                  >
                    {stage.ageRange}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-1 block"
                style={{ fontFamily: 'var(--font-gothic)' }}
              >
                カテゴリ
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  全カテゴリ
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults ? (
            <>
              {isFallback ? (
                <div className="mb-4 p-3 rounded-lg bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-sm text-[var(--color-foreground-soft)]">
                  <p>
                    「<span className="font-medium text-[var(--color-foreground)]">{query}</span>」に完全一致する記事はありませんでしたが、
                    {fallbackTokens.map((t, i) => (
                      <span key={t}>
                        {i > 0 && '・'}
                        <button
                          onClick={() => setQuery(t)}
                          className="font-medium text-[var(--color-primary-dark)] hover:underline"
                        >
                          {t}
                        </button>
                      </span>
                    ))}
                    {' '}に関連する {results.length} 件を表示しています
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[var(--color-foreground-soft)] mb-4">
                  {results.length}件の記事が見つかりました
                </p>
              )}
              {results.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl">
                  <p
                    className="text-[var(--color-foreground)] text-lg mb-2"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    該当する記事が見つかりませんでした
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)]">
                    別のキーワードで検索するか、フィルタを変更してみてください
                  </p>
                  <button
                    onClick={() => setTab('worry')}
                    className="mt-4 text-sm text-[var(--color-primary-dark)] hover:underline"
                  >
                    「お悩みから探す」も試してみる →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              )}
            </>
          ) : (
            <SearchEmptyState onPickTag={setQuery} onSwitchToWorry={() => setTab('worry')} />
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8">読み込み中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
