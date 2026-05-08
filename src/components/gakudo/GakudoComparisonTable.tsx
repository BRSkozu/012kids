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

export default function GakudoComparisonTable() {
  const [query, setQuery] = useState('');
  const [modelFilter, setModelFilter] = useState<ModelFilter>('all');
  const [articleOnly, setArticleOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('default');

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

    const modelOrder: Record<GakudoModelType, number> = {
      hybrid: 0,
      unified: 1,
      standard: 2,
      unknown: 3,
    };

    if (sortKey === 'ward') {
      result = [...result].sort((a, b) => a.ward.localeCompare(b.ward, 'ja'));
    } else if (sortKey === 'model') {
      result = [...result].sort(
        (a, b) =>
          modelOrder[a.modelType] - modelOrder[b.modelType] ||
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
  }, [query, modelFilter, articleOnly, sortKey]);

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
          {(query || modelFilter !== 'all' || articleOnly || sortKey !== 'default') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setModelFilter('all');
                setArticleOnly(false);
                setSortKey('default');
              }}
              className="ml-3 text-[var(--color-primary)] hover:underline"
            >
              フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full min-w-[840px]">
          <thead className="bg-[var(--color-warm-cream)]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                区
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)]">
                制度・モデル
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                利用料目安
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                平日終了
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                対象学年
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                リンク
              </th>
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
