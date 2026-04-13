'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Fuse from 'fuse.js';
import ArticleCard from '@/components/articles/ArticleCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import WorrySearch from '@/components/search/WorrySearch';
import SearchAutocomplete from '@/components/search/SearchAutocomplete';
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
  threshold: 0.4,
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

  const results = useMemo(() => {
    if (!query.trim() && selectedStage === 'all' && selectedCategory === 'all') {
      return [];
    }

    let filtered = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : [...ARTICLES];

    if (selectedStage !== 'all') {
      filtered = filtered.filter((a) => a.stage === selectedStage);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) =>
        a.categories.includes(selectedCategory as ContentCategory)
      );
    }

    return filtered;
  }, [query, selectedStage, selectedCategory]);

  const showResults = query.trim() || selectedStage !== 'all' || selectedCategory !== 'all';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '検索' }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">記事を検索</h1>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('keyword')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'keyword'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
          }`}
        >
          キーワードで検索
        </button>
        <button
          onClick={() => setTab('worry')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'worry'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
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
              <label className="text-xs font-medium text-gray-500 mb-1 block">年齢帯</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedStage('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedStage === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
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
              <label className="text-xs font-medium text-gray-500 mb-1 block">カテゴリ</label>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
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
                        : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
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
              <p className="text-sm text-gray-500 mb-4">
                {results.length}件の記事が見つかりました
              </p>
              {results.length === 0 ? (
                <div className="text-center py-16 bg-orange-50 rounded-xl">
                  <p className="text-gray-500 text-lg mb-2">
                    該当する記事が見つかりませんでした
                  </p>
                  <p className="text-sm text-gray-400">
                    別のキーワードで検索するか、フィルタを変更してみてください
                  </p>
                  <button
                    onClick={() => setTab('worry')}
                    className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
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
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">キーワードを入力して検索してください</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['離乳食', '発達', '習い事', 'プログラミング', 'いじめ', 'アレルギー', '受験'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-orange-50 text-gray-600 rounded-full text-sm hover:bg-orange-100 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-orange-100">
                <button
                  onClick={() => setTab('worry')}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  お悩みから記事を探すこともできます →
                </button>
              </div>
            </div>
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
