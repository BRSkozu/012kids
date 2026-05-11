'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  GAKUDO_DATA,
  MODEL_TYPE_LABELS,
  MODEL_TYPE_DESCRIPTIONS,
  AREA_GROUP_LABELS,
  AREA_GROUP_DESCRIPTIONS,
  type GakudoWardData,
  type GakudoModelType,
  type GakudoAreaGroup,
} from '@/data/gakudo';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

const MODEL_TYPE_BADGE_CLASS: Record<GakudoModelType, string> = {
  hybrid: 'bg-blue-50 text-blue-700 border border-blue-200',
  unified: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  standard: 'bg-amber-50 text-amber-700 border border-amber-200',
  unknown: 'bg-gray-50 text-gray-600 border border-gray-200',
};

const AREA_ACCENT: Record<GakudoAreaGroup, { dot: string; soft: string; border: string }> = {
  central: { dot: 'bg-rose-400', soft: 'bg-rose-50', border: 'border-rose-200' },
  south: { dot: 'bg-amber-400', soft: 'bg-amber-50', border: 'border-amber-200' },
  west: { dot: 'bg-emerald-400', soft: 'bg-emerald-50', border: 'border-emerald-200' },
  north: { dot: 'bg-indigo-400', soft: 'bg-indigo-50', border: 'border-indigo-200' },
  east: { dot: 'bg-sky-400', soft: 'bg-sky-50', border: 'border-sky-200' },
};

const AREAS: GakudoAreaGroup[] = ['central', 'south', 'west', 'north', 'east'];

/**
 * ペルソナ別の推奨スラッグ。ユーザーの優先順位に対する短い推奨セット。
 * 編集判断で選定（公的データの細部ではなく、本記事から導ける傾向）。
 */
const PERSONAS: { id: string; label: string; emoji: string; description: string; wardSlugs: string[] }[] = [
  {
    id: 'cost',
    label: '家賃を抑えたい',
    emoji: '💰',
    description: '23区の中で住居費の負担が比較的軽め',
    wardSlugs: ['adachi', 'katsushika', 'kita', 'arakawa', 'itabashi'],
  },
  {
    id: 'commute',
    label: '都心通勤◎',
    emoji: '🚆',
    description: '主要オフィス街への通勤がスムーズ',
    wardSlugs: ['minato', 'chuo', 'chiyoda', 'shibuya', 'shinjuku', 'meguro'],
  },
  {
    id: 'family',
    label: 'ファミリー多',
    emoji: '👨‍👩‍👧',
    description: '同世代の子育て家庭が多くコミュニティが厚め',
    wardSlugs: ['nerima', 'edogawa', 'setagaya', 'suginami', 'adachi'],
  },
  {
    id: 'education',
    label: '教育環境重視',
    emoji: '📚',
    description: '区立小の評価や教育選択肢の豊富さ',
    wardSlugs: ['bunkyo', 'meguro', 'minato', 'shibuya', 'chiyoda'],
  },
  {
    id: 'unified',
    label: '全児童型で安心',
    emoji: '🏫',
    description: '校内併設の統合運営で送迎・安全面が楽',
    wardSlugs: ['setagaya', 'shinagawa', 'shibuya', 'itabashi', 'koto', 'edogawa'],
  },
];

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

function WardCard({ ward }: { ward: GakudoWardData }) {
  const accent = AREA_ACCENT[ward.areaGroup];
  return (
    <div
      className={`relative rounded-xl border ${accent.border} bg-white hover:shadow-[0_10px_24px_-14px_rgba(31,36,57,0.2)] transition-shadow overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${accent.dot}`} aria-hidden />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-base text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
          >
            {ward.articleSlug ? (
              <Link
                href={`${bp}/articles/${ward.articleSlug}`}
                className="hover:text-[var(--color-primary-dark)]"
              >
                {ward.ward}
              </Link>
            ) : (
              ward.ward
            )}
          </h3>
          <ModelBadge type={ward.modelType} />
        </div>

        <div className="text-xs text-[var(--color-foreground-soft)] mb-2.5 leading-relaxed">
          {ward.programName}
        </div>

        {ward.highlights && ward.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ward.highlights.map((h) => (
              <span
                key={h}
                className={`text-[10px] px-1.5 py-0.5 rounded ${accent.soft} text-[var(--color-foreground-soft)]`}
              >
                {h}
              </span>
            ))}
          </div>
        )}

        <dl className="space-y-1 text-[11px] text-[var(--color-foreground-muted)] mb-3">
          {ward.monthlyFee && (
            <div className="flex gap-2">
              <dt className="text-[var(--color-foreground-soft)] w-14 shrink-0">料金</dt>
              <dd>{ward.monthlyFee}</dd>
            </div>
          )}
          {ward.weekdayEnd && (
            <div className="flex gap-2">
              <dt className="text-[var(--color-foreground-soft)] w-14 shrink-0">終了</dt>
              <dd>{ward.weekdayEnd}</dd>
            </div>
          )}
          {ward.gradeRange && (
            <div className="flex gap-2">
              <dt className="text-[var(--color-foreground-soft)] w-14 shrink-0">学年</dt>
              <dd>{ward.gradeRange}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-center gap-3 text-xs">
          {ward.articleSlug ? (
            <Link
              href={`${bp}/articles/${ward.articleSlug}`}
              className="text-[var(--color-primary)] hover:underline whitespace-nowrap font-medium"
            >
              012.kids 解説 →
            </Link>
          ) : (
            <span className="text-[var(--color-foreground-muted)] whitespace-nowrap">準備中</span>
          )}
          <a
            href={ward.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-foreground-soft)] hover:underline whitespace-nowrap ml-auto"
          >
            区公式 ↗
          </a>
        </div>
      </div>
    </div>
  );
}

type AreaFilter = 'all' | GakudoAreaGroup;
type PersonaId = string | null;

export default function GakudoComparisonTable() {
  const [query, setQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [personaId, setPersonaId] = useState<PersonaId>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = GAKUDO_DATA.filter((w) => {
      if (areaFilter !== 'all' && w.areaGroup !== areaFilter) return false;
      if (personaId) {
        const persona = PERSONAS.find((p) => p.id === personaId);
        if (persona && !persona.wardSlugs.includes(w.wardSlug)) return false;
      }
      if (q) {
        const haystack = `${w.ward} ${w.wardSlug} ${w.programName} ${w.notes ?? ''} ${(w.highlights ?? []).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return result;
  }, [query, areaFilter, personaId]);

  // 結果をエリア別にグループ化
  const byArea = useMemo(() => {
    const groups: Record<GakudoAreaGroup, GakudoWardData[]> = {
      central: [],
      south: [],
      west: [],
      north: [],
      east: [],
    };
    for (const w of filtered) groups[w.areaGroup].push(w);
    return groups;
  }, [filtered]);

  const hasFilters = query || areaFilter !== 'all' || personaId !== null;

  return (
    <div className="space-y-8">
      {/* Persona quick finder */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-dark)]">
            目的別
          </span>
          <span>こんな視点で絞り込み</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => {
            const active = personaId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersonaId(active ? null : p.id)}
                title={p.description}
                className={`group inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                  active
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white border-[var(--color-border)] text-[var(--color-foreground-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]'
                }`}
              >
                <span>{p.emoji}</span>
                <span className="font-medium">{p.label}</span>
              </button>
            );
          })}
          {personaId && (
            <button
              type="button"
              onClick={() => setPersonaId(null)}
              className="text-xs text-[var(--color-foreground-muted)] hover:underline ml-1"
            >
              リセット
            </button>
          )}
        </div>
        {personaId && (
          <p className="text-xs text-[var(--color-foreground-muted)] mt-2">
            {PERSONAS.find((p) => p.id === personaId)?.description}
          </p>
        )}
      </div>

      {/* Search + Area filter */}
      <div className="bg-white rounded-lg border border-[var(--color-border)] p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-foreground-soft)] mb-1">
            区名・制度名・特徴で検索
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: すまいる / 湾岸 / 全児童型 / 教育"
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-foreground-soft)] mb-1.5">
            エリアで絞り込み
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setAreaFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                areaFilter === 'all'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-border)]'
              }`}
            >
              すべて
            </button>
            {AREAS.map((a) => {
              const active = areaFilter === a;
              const accent = AREA_ACCENT[a];
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAreaFilter(a)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${accent.dot}`}
                    aria-hidden
                  />
                  {AREA_GROUP_LABELS[a]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-[var(--color-foreground-muted)]">
          {filtered.length}件 / {GAKUDO_DATA.length}件 を表示中
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setAreaFilter('all');
                setPersonaId(null);
              }}
              className="ml-3 text-[var(--color-primary)] hover:underline"
            >
              フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {/* Area-grouped cards */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-8 text-center text-sm text-[var(--color-foreground-muted)]">
          該当する区がありません。フィルター条件を変更してください。
        </div>
      ) : (
        <div className="space-y-8">
          {AREAS.map((area) => {
            const wards = byArea[area];
            if (wards.length === 0) return null;
            const accent = AREA_ACCENT[area];
            return (
              <section key={area}>
                <header className="mb-3">
                  <h3 className="text-base font-semibold text-[var(--color-foreground)] flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${accent.dot}`} aria-hidden />
                    <span>{AREA_GROUP_LABELS[area]}</span>
                    <span className="text-xs text-[var(--color-foreground-muted)] font-normal">
                      {wards.length}区
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-1 ml-5 leading-relaxed">
                    {AREA_GROUP_DESCRIPTIONS[area]}
                  </p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wards.map((w) => (
                    <WardCard key={w.wardSlug} ward={w} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-[var(--color-warm-cream)] rounded-lg p-4 text-xs">
        <p className="font-medium text-[var(--color-foreground)] mb-2">制度モデルの読み方</p>
        <ul className="space-y-1 text-[var(--color-foreground-muted)] leading-relaxed">
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

      {/* Disclaimer */}
      <div className="text-xs text-[var(--color-foreground-muted)] leading-relaxed">
        ※ 利用料・時間・対象学年は各区の運用変更で更新されることがあります。
        最新情報は必ず各区公式サイトでご確認ください。012.kids
        は編集時点の公開情報を整理した参考情報です。「目的別」の推奨は記事内容に基づく編集判断であり、
        個別の状況に応じて公式サイト・自治体窓口で必ずご確認ください。
      </div>
    </div>
  );
}
