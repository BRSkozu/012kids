'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  MILESTONE_CATEGORY_LABELS,
  MILESTONE_GROUPS,
  type Milestone,
  type MilestoneGroup,
} from '@/data/milestones';
import {
  getMilestoneState,
  resetChildMilestones,
  toggleMilestone,
} from '@/lib/milestoneStore';
import {
  ChildEntry,
  computeAgeYears,
  getUserProfile,
  stageForChild,
} from '@/lib/userProfile';
import { AGE_STAGES } from '@/data/stages';
import type { AgeStage } from '@/types';

/**
 * Interactive milestone checklist.
 * - Pulls the active child from the user profile (first child by default).
 * - Shows their stage's milestones + lets you switch to adjacent stages.
 * - Per-category filter; overall progress ring; achievement timestamps.
 */
export default function MilestoneTracker() {
  const [mounted, setMounted] = useState(false);
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [overrideStage, setOverrideStage] = useState<AgeStage | null>(null);
  const [checked, setChecked] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Milestone['category'] | 'all'>('all');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const p = getUserProfile();
    if (p && p.children.length > 0) {
      setChildren(p.children);
      setActiveChildId(p.children[0].id);
    }
  }, []);

  useEffect(() => {
    if (!activeChildId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecked(getMilestoneState(activeChildId));
    const onChange = () => {
      if (activeChildId) setChecked(getMilestoneState(activeChildId));
    };
    window.addEventListener('012kids:milestones-updated', onChange);
    return () => window.removeEventListener('012kids:milestones-updated', onChange);
  }, [activeChildId]);

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId) ?? null,
    [children, activeChildId]
  );
  const childAge = activeChild ? computeAgeYears(activeChild) : null;
  const autoStage = activeChild ? stageForChild(activeChild) : null;
  const currentStage: AgeStage | null = overrideStage ?? autoStage ?? '0stage';
  const group: MilestoneGroup | undefined = MILESTONE_GROUPS.find(
    (g) => g.stage === currentStage
  );

  if (!mounted) {
    return <div className="h-40 rounded-2xl bg-orange-50/40 animate-pulse-soft" />;
  }

  // ----- No profile yet -----
  if (!activeChild) {
    return (
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-[#fff4e8] to-[#fff] p-6 md:p-8 text-center">
        <div className="text-4xl mb-3">👶</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          お子さまのプロフィールを設定してから使おう
        </h3>
        <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
          マイルストーントラッカーは、お子さまの発達の記録をつける機能です。
          トップページからプロフィールを作成してください。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          プロフィールを設定する
        </Link>
      </div>
    );
  }

  const milestones = group?.milestones ?? [];
  const visibleMilestones =
    filter === 'all' ? milestones : milestones.filter((m) => m.category === filter);
  const achievedCount = milestones.filter((m) => checked[m.id]).length;
  const total = milestones.length;
  const pct = total === 0 ? 0 : Math.round((achievedCount / total) * 100);

  const handleToggle = (milestoneId: string) => {
    if (!activeChild) return;
    toggleMilestone(activeChild.id, milestoneId);
    setChecked(getMilestoneState(activeChild.id));
  };

  const handleReset = () => {
    if (!activeChild) return;
    if (!window.confirm(`${activeChild.nickname}のマイルストーン記録をリセットしますか？`)) return;
    resetChildMilestones(activeChild.id);
    setChecked({});
  };

  return (
    <div className="space-y-6">
      {/* Child + stage switcher */}
      <div className="rounded-2xl bg-white border border-orange-100 p-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0"
              style={{ backgroundColor: AGE_STAGES.find((s) => s.id === (autoStage ?? '0stage'))?.colorLight ?? '#FFF0F0' }}
            >
              👶
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400">記録中の子</p>
              {children.length > 1 ? (
                <select
                  value={activeChildId ?? ''}
                  onChange={(e) => {
                    setActiveChildId(e.target.value);
                    setOverrideStage(null);
                  }}
                  className="font-bold text-base text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 pr-6 -ml-0.5"
                >
                  {children.map((c) => {
                    const age = computeAgeYears(c);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.nickname}（{age ?? '?'}歳）
                      </option>
                    );
                  })}
                </select>
              ) : (
                <p className="font-bold text-base text-gray-900">
                  {activeChild.nickname}
                  {childAge !== null && (
                    <span className="text-sm text-gray-500 ml-1 font-normal">（{childAge}歳）</span>
                  )}
                </p>
              )}
            </div>
          </div>
          <ProgressRing pct={pct} label={`${achievedCount}/${total}`} />
        </div>

        {/* Stage pills */}
        <div className="mt-4 flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 mr-1">表示中の年齢帯:</span>
          {AGE_STAGES.map((s) => {
            const active = currentStage === s.id;
            const isAuto = autoStage === s.id && !overrideStage;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setOverrideStage(s.id === autoStage ? null : s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? 'ring-2 ring-offset-1 ring-[var(--color-primary)]'
                    : 'opacity-60 hover:opacity-90'
                }`}
                style={{ backgroundColor: active ? s.color : `${s.color}55` }}
              >
                {s.ageRange}
                {isAuto && <span className="ml-1 text-[9px] align-middle">自動</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
          }`}
        >
          すべて ({milestones.length})
        </button>
        {(Object.entries(MILESTONE_CATEGORY_LABELS) as Array<
          [Milestone['category'], (typeof MILESTONE_CATEGORY_LABELS)[Milestone['category']]]
        >).map(([key, meta]) => {
          const count = milestones.filter((m) => m.category === key).length;
          if (count === 0) return null;
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                active ? 'ring-2 ring-offset-1 ring-[var(--color-primary)]' : 'hover:opacity-80'
              }`}
              style={{ backgroundColor: active ? meta.color : `${meta.color}66` }}
            >
              <span>{meta.icon}</span>
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Milestones list */}
      <div>
        {group ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{group.headline}</h2>
              <p className="text-sm text-gray-500 mt-1">{group.description}</p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleMilestones.map((m) => {
                const achievedAt = checked[m.id];
                const achieved = Boolean(achievedAt);
                const meta = MILESTONE_CATEGORY_LABELS[m.category];
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => handleToggle(m.id)}
                      aria-pressed={achieved}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        achieved
                          ? 'border-[var(--color-primary)] bg-orange-50/60 shadow-sm'
                          : 'border-orange-100 bg-white hover:border-orange-200'
                      }`}
                    >
                      <span
                        className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                          achieved
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-white border-2 border-orange-200'
                        }`}
                        aria-hidden="true"
                      >
                        {achieved && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: meta.color, color: '#2d2a26' }}
                          >
                            {meta.icon} {meta.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{m.note}</span>
                        </div>
                        <p className={`mt-1 text-sm font-medium ${achieved ? 'text-[var(--color-primary-dark)]' : 'text-gray-900'}`}>
                          {m.title}
                        </p>
                        {achieved && achievedAt && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            ✓ {new Date(achievedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })} に達成
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="text-sm text-gray-500">この年齢帯のマイルストーンは準備中です。</p>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-orange-100 pt-4">
        <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
          💡 発達には大きな個人差があります。これらはあくまで目安で、医学的診断ではありません。
          気になる点があれば小児科や地域の保健センターにご相談ください。
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="shrink-0 ml-4 text-xs text-gray-400 hover:text-red-500 transition-colors underline"
        >
          記録をリセット
        </button>
      </div>
    </div>
  );
}

function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const size = 56;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#FFE4CC" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-[var(--color-primary-dark)]">{label}</span>
        <span className="text-[9px] text-gray-400">{pct}%</span>
      </div>
    </div>
  );
}
