'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { AGE_STAGES } from '@/data/stages';
import {
  ChildEntry,
  UserProfile,
  computeAgeYears,
  createOrUpdateProfile,
  getUserProfile,
  newChild,
  stageForChild,
} from '@/lib/userProfile';
import type { ContentCategory } from '@/types';

/**
 * Three-step onboarding (all optional, all stored locally):
 *  1. Parent nickname
 *  2. Child(ren): nickname + birth year
 *  3. Interests (1–3 categories)
 *
 * On the homepage we:
 *  - Show an inviting CTA when no profile exists
 *  - Show a "welcome back" personalized greeting + stage shortcut when it does
 */
export default function ProfileOnboarding() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState(0);

  // Draft state
  const [displayName, setDisplayName] = useState('');
  const [children, setChildren] = useState<ChildEntry[]>([]);
  const [interests, setInterests] = useState<ContentCategory[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setDisplayName(p.displayName ?? '');
      setChildren(p.children);
      setInterests(p.interests);
    }
    const onProfileUpdate = () => setProfile(getUserProfile());
    window.addEventListener('012kids:profile-updated', onProfileUpdate);
    return () => window.removeEventListener('012kids:profile-updated', onProfileUpdate);
  }, []);

  const startOnboarding = () => {
    if (children.length === 0) {
      const thisYear = new Date().getFullYear();
      setChildren([newChild({ nickname: '', birthYear: thisYear - 3 })]);
    }
    setStep(0);
    setEditing(true);
  };

  const closeOnboarding = () => {
    setEditing(false);
  };

  const handleSave = () => {
    const cleaned = children
      .filter((c) => c.birthYear)
      .map((c, i) => ({ ...c, nickname: c.nickname.trim() || `お子さま${i + 1}` }));
    createOrUpdateProfile({
      displayName: displayName.trim() || undefined,
      children: cleaned,
      interests,
    });
    setProfile(getUserProfile());
    setEditing(false);
  };

  if (!mounted) return null;

  // ----- Personalized welcome (existing profile) -----
  if (profile && profile.children.length > 0 && !editing) {
    return (
      <WelcomeBack
        profile={profile}
        onEdit={() => {
          setDisplayName(profile.displayName ?? '');
          setChildren(profile.children);
          setInterests(profile.interests);
          setStep(0);
          setEditing(true);
        }}
      />
    );
  }

  // ----- CTA card (no profile yet, not editing) -----
  if (!editing) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={startOnboarding}
          className="w-full group relative overflow-hidden rounded-2xl border border-[var(--color-paper-edge)] bg-[var(--color-warm-cream)] p-5 md:p-6 text-left transition-all hover:shadow-[0_16px_40px_-24px_rgba(31,36,57,0.35)]"
        >
          <div className="absolute inset-0 starry-pattern opacity-50 pointer-events-none" />
          <div className="lamp-glow top-[-4rem] right-[-4rem] w-[14rem] h-[14rem] bg-[#F5D9B1] opacity-40 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-surface)] shadow-[0_6px_16px_-8px_rgba(31,36,57,0.25)] border border-[var(--color-paper-edge)] flex items-center justify-center text-2xl">
              ✨
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-0.5 inline-flex items-center gap-2"
                style={{ fontFamily: 'var(--font-gothic)' }}
              >
                <span className="inline-block w-4 h-px bg-[var(--color-primary)]" />
                Personalize
              </p>
              <h3
                className="text-base md:text-lg text-[var(--color-foreground)]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                お子さまに合った情報を表示しよう
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-foreground-soft)] mt-0.5 leading-relaxed">
                ニックネーム・年齢・関心分野を30秒で設定 · 端末内にのみ保存
              </p>
            </div>
            <svg
              className="shrink-0 w-5 h-5 text-[var(--color-primary-dark)] group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      </section>
    );
  }

  // ----- Onboarding modal / form -----
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={closeOnboarding}
    >
      <div
        className="relative w-full md:max-w-lg bg-[var(--color-surface)] rounded-t-2xl md:rounded-2xl shadow-[0_24px_60px_-20px_rgba(31,36,57,0.45)] overflow-hidden animate-slide-down border border-[var(--color-paper-edge)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[var(--color-paper-edge)] flex items-center justify-between">
          <div>
            <p
              className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)]"
              style={{ fontFamily: 'var(--font-gothic)' }}
            >
              Step {step + 1} / 3
            </p>
            <h2
              className="text-lg text-[var(--color-foreground)] mt-0.5"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {step === 0 && 'あなたのこと、少しだけ'}
              {step === 1 && 'お子さまのこと'}
              {step === 2 && '関心のあるテーマ'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeOnboarding}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-foreground-muted)] hover:bg-[var(--color-warm-cream)] hover:text-[var(--color-primary-dark)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[var(--color-warm-cream)]">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {step === 0 && (
            <div>
              <p className="text-sm text-[var(--color-foreground-soft)] mb-4 leading-relaxed">
                表示名はサイト内の挨拶にのみ使われます。空欄でもOK。
              </p>
              <label className="block">
                <span className="text-xs font-medium text-[var(--color-foreground-muted)] tracking-wider">ニックネーム（任意）</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例：ゆうこ"
                  maxLength={20}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </label>
              <p className="mt-4 text-[11px] text-[var(--color-foreground-muted)] leading-relaxed">
                🔒 入力内容はあなたの端末（localStorage）にのみ保存されます。
                サーバーには送信されません。
              </p>
            </div>
          )}

          {step === 1 && (
            <ChildrenEditor items={children} onChange={setChildren} />
          )}

          {step === 2 && (
            <InterestsPicker interests={interests} onChange={setInterests} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-paper-edge)] flex items-center justify-between gap-3 bg-[var(--color-warm-cream)]">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
            >
              ← 戻る
            </button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              className="btn-lamp"
            >
              次へ →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="btn-lamp"
            >
              設定を保存する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function WelcomeBack({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
  const primaryChild = profile.children[0];
  const ageYears = primaryChild ? computeAgeYears(primaryChild) : null;
  const stageId = primaryChild ? stageForChild(primaryChild) : null;
  const stage = stageId ? AGE_STAGES.find((s) => s.id === stageId) : null;
  const greeting = useMemo(() => greetingFor(new Date()), []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-paper-edge)] bg-[var(--color-surface)] p-5 md:p-6">
        {stage && (
          <div
            className="lamp-glow top-[-4rem] right-[-4rem] w-[16rem] h-[16rem] opacity-40 pointer-events-none"
            style={{ backgroundColor: stage.color }}
          />
        )}
        <div className="relative flex items-start gap-4 flex-wrap">
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-[0_6px_16px_-8px_rgba(31,36,57,0.25)] border border-[var(--color-paper-edge)]"
            style={{ backgroundColor: stage?.colorLight ?? 'var(--color-warm-cream)' }}
          >
            👋
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)]"
              style={{ fontFamily: 'var(--font-gothic)' }}
            >
              {greeting}
            </p>
            <h3
              className="text-base md:text-lg text-[var(--color-foreground)] mt-0.5"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {profile.displayName ? `${profile.displayName}さん、お帰りなさい。` : 'お帰りなさい。'}
              {primaryChild && ageYears !== null && (
                <span className="font-normal text-[var(--color-foreground-soft)]">
                  {' '}
                  {primaryChild.nickname}ちゃん（{ageYears}歳）向けに記事を表示中
                </span>
              )}
            </h3>
            {stage && (
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <Link
                  href={`/age-guide/${stage.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] group"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="border-b border-transparent group-hover:border-current">{stage.ageRange}の記事を見る →</span>
                </Link>
                <Link
                  href="/favorites"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  お気に入り
                </Link>
                <Link
                  href="/milestones"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                  マイルストーン
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-primary-dark)] transition-colors underline"
          >
            プロフィールを編集
          </button>
        </div>
      </div>
    </section>
  );
}

function ChildrenEditor({
  items,
  onChange,
}: {
  items: ChildEntry[];
  onChange: (c: ChildEntry[]) => void;
}) {
  const thisYear = new Date().getFullYear();

  const update = (id: string, patch: Partial<ChildEntry>) => {
    onChange(items.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const add = () => {
    onChange([...items, newChild({ nickname: '', birthYear: thisYear - 3 })]);
  };
  const remove = (id: string) => {
    onChange(items.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
        ニックネームと生まれ年だけでOK。きょうだいも追加できます。
      </p>
      {items.map((child) => (
        <div key={child.id} className="p-4 rounded-xl bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)]">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-2.5">
              <label className="block">
                <span className="text-[11px] font-medium text-[var(--color-foreground-muted)] tracking-wider">ニックネーム</span>
                <input
                  type="text"
                  value={child.nickname}
                  onChange={(e) => update(child.id, { nickname: e.target.value })}
                  placeholder="例：はるか"
                  maxLength={20}
                  className="mt-0.5 w-full px-3 py-2 rounded-lg border border-[var(--color-paper-edge)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-surface)]"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[11px] font-medium text-[var(--color-foreground-muted)] tracking-wider">生まれ年</span>
                  <select
                    value={child.birthYear}
                    onChange={(e) => update(child.id, { birthYear: Number(e.target.value) })}
                    className="mt-0.5 w-full px-3 py-2 rounded-lg border border-[var(--color-paper-edge)] text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    {Array.from({ length: 13 }, (_, i) => thisYear - i).map((y) => (
                      <option key={y} value={y}>
                        {y}年
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-medium text-[var(--color-foreground-muted)] tracking-wider">生まれ月（任意）</span>
                  <select
                    value={child.birthMonth ?? ''}
                    onChange={(e) =>
                      update(child.id, {
                        birthMonth: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="mt-0.5 w-full px-3 py-2 rounded-lg border border-[var(--color-paper-edge)] text-sm bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">選択なし</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {m}月
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(child.id)}
                aria-label="削除"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[#c04444] hover:bg-[var(--color-warm-cream)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
      {items.length < 4 && (
        <button
          type="button"
          onClick={add}
          className="w-full py-2.5 rounded-xl border border-dashed border-[var(--color-paper-edge)] text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-warm-cream)] transition-colors"
        >
          + きょうだいを追加
        </button>
      )}
    </div>
  );
}

function InterestsPicker({
  interests,
  onChange,
}: {
  interests: ContentCategory[];
  onChange: (i: ContentCategory[]) => void;
}) {
  const toggle = (id: ContentCategory) => {
    if (interests.includes(id)) {
      onChange(interests.filter((x) => x !== id));
    } else if (interests.length < 3) {
      onChange([...interests, id]);
    }
  };
  return (
    <div>
      <p className="text-sm text-[var(--color-foreground-soft)] mb-3 leading-relaxed">
        最大3つまで選べます。新着記事や「今、読まれている記事」の並びが変わります。
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((cat) => {
          const active = interests.includes(cat.id);
          const disabled = !active && interests.length >= 3;
          return (
            <button
              key={cat.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(cat.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-[var(--color-primary)] bg-[var(--color-warm-cream)]'
                  : disabled
                  ? 'border-[var(--color-paper-edge)] bg-[var(--color-warm-bg)] opacity-50 cursor-not-allowed'
                  : 'border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:border-[var(--color-primary-light)]'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <p
                className={`text-sm mt-1 ${active ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-foreground)]'}`}
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                {cat.label}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[var(--color-foreground-muted)] text-center tracking-wider">{interests.length} / 3 選択中</p>
    </div>
  );
}

function greetingFor(d: Date): string {
  const h = d.getHours();
  if (h < 4) return 'Good night';
  if (h < 11) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
