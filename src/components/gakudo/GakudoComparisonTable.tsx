'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  GAKUDO_DATA,
  MODEL_TYPE_LABELS,
  MODEL_TYPE_DESCRIPTIONS,
  type GakudoWardData,
  type GakudoModelType,
} from '@/data/gakudo';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

const MODEL_TYPE_BADGE_CLASS: Record<GakudoModelType, string> = {
  hybrid: 'bg-blue-50 text-blue-700 border border-blue-200',
  unified: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  standard: 'bg-amber-50 text-amber-700 border border-amber-200',
  unknown: 'bg-gray-50 text-gray-600 border border-gray-200',
};

type ModelFilter = 'all' | GakudoModelType;
type SortKey = 'default' | 'ward' | 'model' | 'hasArticle';
type ColumnKey = 'ward' | 'program' | 'fee' | 'end' | 'grade' | 'article';
type SortDirection = 'asc' | 'desc';
interface ColumnSort {
  column: ColumnKey;
  direction: SortDirection;
}

function ModelBadge({ type }: { type: GakudoModelType }) {
  return (
    <span
      title={MODEL_TYPE_DESCRIPTIONS[type]}
      className={`inline-block whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full ${MODEL_TYPE_BADGE_CLASS[type]}`}
    >
      {MODEL_TYPE_LABELS[type]}
    </span>
  );
}

function WardRow({ ward }: { ward: GakudoWardData }) {
  const cell = 'px-3 py-3 text-sm text-[var(--color-foreground)] align-top';
  const muted = 'text-[var(--color-foreground-muted)]';

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-warm-cream)]/50 transition-colors">
      <td className={`${cell} font-medium whitespace-nowrap`}>
        {ward.articleSlug ? (
          <Link
            href={`${bp}/articles/${ward.articleSlug}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            {ward.ward}
          </Link>
        ) : (
          <span>{ward.ward}</span>
        )}
      </td>
      <td className={cell}>
        <div className="space-y-1">
          <div>{ward.programName}</div>
          <ModelBadge type={ward.modelType} />
        </div>
      </td>
      <td className={`${cell} ${muted} whitespace-nowrap`}>
        {ward.monthlyFee || '—'}
      </td>
      <td className={`${cell} ${muted} whitespace-nowrap`}>
        {ward.weekdayEnd || '—'}
      </td>
      <td className={`${cell} ${muted}`}>{ward.gradeRange || '—'}</td>
      <td className={cell}>
        <div className="flex flex-col gap-1">
          {ward.articleSlug ? (
            <Link
              href={`${bp}/articles/${ward.articleSlug}`}
              className="inline-block text-xs text-[var(--color-primary)] hover:underline whitespace-nowrap"
            >
              012.kids 解説 →
            </Link>
          ) : (
            <span className="text-xs text-[var(--color-foreground-muted)] whitespace-nowrap">
              準備中
            </span>
          )}
          <a
            href={ward.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-[var(--color-foreground-soft)] hover:underline whitespace-nowrap"
          >
            区公式 ↗
          </a>
        </div>
      </td>
    </tr>
  );
}

const MODEL_FILTER_OPTIONS: { value: ModelFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'hybrid', label: '併設型' },
  { value: 'unified', label: '統合型' },
  { value: 'standard', label: '学童中心' },
  { value: 'unknown', label: '要確認' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'デフォルト' },
  { value: 'hasArticle', label: '解説記事ありを上に' },
  { value: 'ward', label: '区名（あいうえお順）' },
  { value: 'model', label: '制度モデル順' },
];

const MODEL_ORDER: Record<GakudoModelType, number> = {
  hybrid: 0,
  unified: 1,
  standard: 2,
  unknown: 3,
};

function getCellSortValue(w: GakudoWardData, column: ColumnKey): string | number {
  switch (column) {
    case 'ward':
      return w.ward;
    case 'program':
      return MODEL_ORDER[w.modelType];
    case 'fee':
      return w.monthlyFee || '';
    case 'end':
      return w.weekdayEnd || '';
    case 'grade':
      return w.gradeRange || '';
    case 'article':
      return w.articleSlug ? 0 : 1;
  }
}

function compareWards(a: GakudoWardData, b: GakudoWardData, sort: ColumnSort): number {
  const av = getCellSortValue(a, sort.column);
  const bv = getCellSortValue(b, sort.column);

  // Empty/missing values sink to the bottom regardless of direction
  const aEmpty = av === '' || av === undefined;
  const bEmpty = bv === '' || bv === undefined;
  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;

  let cmp = 0;
  if (typeof av === 'number' && typeof bv === 'number') {
    cmp = av - bv;
  } else {
    cmp = String(av).localeCompare(String(bv), 'ja');
  }
  if (cmp === 0) {
    cmp = a.ward.localeCompare(b.ward, 'ja');
  }
  return sort.direction === 'asc' ? cmp : -cmp;
}

export default function GakudoComparisonTable() {
  const [query, setQuery] = useState('');
  const [modelFilter, setModelFilter] = useState<ModelFilter>('all');
  const [articleOnly, setArticleOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = GAKUDO_DATA.filter((w) => {
      if (modelFilter !== 'all' && w.modelType !== modelFilter) return false;
      if (articleOnly && !w.articleSlug) return false;
      if (q) {
        const haystack = `${w.ward} ${w.wardSlug} ${w.programName} ${w.notes ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (columnSort) {
      result = [...result].sort((a, b) => compareWards(a, b, columnSort));
    } else if (sortKey === 'ward') {
      result = [...result].sort((a, b) => a.ward.localeCompare(b.ward, 'ja'));
    } else if (sortKey === 'model') {
      result = [...result].sort(
        (a, b) =>
          MODEL_ORDER[a.modelType] - MODEL_ORDER[b.modelType] ||
          a.ward.localeCompare(b.ward, 'ja'),
      );
    } else if (sortKey === 'hasArticle') {
      result = [...result].sort((a, b) => {
        const aHas = a.articleSlug ? 0 : 1;
        const bHas = b.articleSlug ? 0 : 1;
        return aHas - bHas || a.ward.localeCompare(b.ward, 'ja');
      });
    }

    return result;
  }, [query, modelFilter, articleOnly, sortKey, columnSort]);

  const toggleColumnSort = (column: ColumnKey) => {
    setColumnSort((prev) => {
      if (!prev || prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      return null; // third click clears
    });
  };

  const sortIndicator = (column: ColumnKey) => {
    if (!columnSort || columnSort.column !== column) {
      return <span className="text-[var(--color-foreground-muted)] opacity-40">↕</span>;
    }
    return columnSort.direction === 'asc' ? '▲' : '▼';
  };

  const articleCount = GAKUDO_DATA.filter((w) => w.articleSlug).length;

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-[var(--color-warm-cream)] rounded-lg p-4 text-sm">
        <p className="font-medium text-[var(--color-foreground)] mb-2">
          制度モデルの3タイプ
        </p>
        <ul className="space-y-1 text-[var(--color-foreground-muted)]">
          <li>
            <ModelBadge type="hybrid" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.hybrid}</span>
          </li>
          <li>
            <ModelBadge type="unified" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.unified}</span>
          </li>
          <li>
            <ModelBadge type="standard" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.standard}</span>
          </li>
        </ul>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[var(--color-border)] p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-foreground-soft)] mb-1">
              区名・制度名で検索
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: すまいる / ねりっこ / 中野"
              className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            />
          </div>
          <div className="md:w-56">
            <label className="block text-xs font-medium text-[var(--color-foreground-soft)] mb-1">
              並び替え
            </label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-foreground-soft)] mb-1.5">
              制度モデルで絞り込み
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MODEL_FILTER_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setModelFilter(o.value)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    modelFilter === o.value
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:pt-5">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={articleOnly}
                onChange={(e) => setArticleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/30"
              />
              <span className="text-[var(--color-foreground-soft)]">
                解説記事ありのみ表示（{articleCount}区）
              </span>
            </label>
          </div>
        </div>

        <div className="text-xs text-[var(--color-foreground-muted)]">
          {filtered.length}件 / {GAKUDO_DATA.length}件 を表示中
          {(query ||
            modelFilter !== 'all' ||
            articleOnly ||
            sortKey !== 'default' ||
            columnSort) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setModelFilter('all');
                setArticleOnly(false);
                setSortKey('default');
                setColumnSort(null);
              }}
              className="ml-3 text-[var(--color-primary)] hover:underline"
            >
              フィルターをクリア
            </button>
          )}
          <span className="ml-3 hidden md:inline opacity-70">
            ヒント: 表ヘッダをクリックでカラム並び替え（↑/↓/解除の3段階）
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full min-w-[840px]">
          <thead className="bg-[var(--color-warm-cream)]">
            <tr>
              {(
                [
                  { key: 'ward', label: '区', whitespace: true },
                  { key: 'program', label: '制度・モデル', whitespace: false },
                  { key: 'fee', label: '利用料目安', whitespace: true },
                  { key: 'end', label: '平日終了', whitespace: true },
                  { key: 'grade', label: '対象学年', whitespace: true },
                  { key: 'article', label: 'リンク', whitespace: true },
                ] as { key: ColumnKey; label: string; whitespace: boolean }[]
              ).map((col) => {
                const isActive = columnSort?.column === col.key;
                return (
                  <th
                    key={col.key}
                    className={`px-3 py-2 text-left text-xs font-semibold ${
                      col.whitespace ? 'whitespace-nowrap' : ''
                    } ${
                      isActive
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-foreground-soft)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleColumnSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                      aria-label={`${col.label}で並び替え`}
                      aria-sort={
                        isActive
                          ? columnSort.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <span>{col.label}</span>
                      <span className="text-[10px]">{sortIndicator(col.key)}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-sm text-[var(--color-foreground-muted)]"
                >
                  該当する区がありません。フィルター条件を変更してください。
                </td>
              </tr>
            ) : (
              filtered.map((w) => <WardRow key={w.wardSlug} ward={w} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-[var(--color-foreground-muted)] leading-relaxed">
        ※ 利用料・時間・対象学年は各区の運用変更で更新されることがあります。
        最新情報は必ず各区公式サイトでご確認ください。012.kids
        は編集時点の公開情報を整理した参考情報です。
      </div>
    </div>
  );
}
