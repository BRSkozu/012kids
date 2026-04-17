'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { getStageByAge } from '@/data/stages';
import EmotionalHero from '@/components/home/EmotionalHero';

function getGradeLabel(age: number): string | null {
  const grades: Record<number, string> = {
    3: '年少',
    4: '年中',
    5: '年長',
    6: '小1',
    7: '小2',
    8: '小3',
    9: '小4',
    10: '小5',
    11: '小6',
    12: '中1',
  };
  return grades[age] ?? null;
}

export default function AgeSelector() {
  const [age, setAge] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('012kids_age');
    if (saved) {
      setAge(parseInt(saved, 10));
    }
  }, []);

  const handleAgeSelect = (years: number) => {
    setAge(years);
    localStorage.setItem('012kids_age', years.toString());
  };

  const currentStage = age !== null ? getStageByAge(age) : null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Ambient lamp glows + starry pattern */}
      <div className="absolute inset-0 starry-pattern opacity-70 pointer-events-none" />
      <div className="lamp-glow top-[-6rem] left-[8%] w-[22rem] h-[22rem] bg-[#F5D9B1] animate-lamp" />
      <div className="lamp-glow bottom-[-8rem] right-[6%] w-[26rem] h-[26rem] bg-[#C8D1E8] opacity-40" />
      <div className="lamp-glow top-[20%] right-[30%] w-[14rem] h-[14rem] bg-[#F3B2B2] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in-up">
          {/* Kicker — gentle bedside-library feel */}
          <p className="inline-flex items-center gap-2 mb-5 text-xs font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)]">
            <span className="inline-block w-6 h-px bg-[var(--color-primary)]" />
            A Gentle Library for Parents
            <span className="inline-block w-6 h-px bg-[var(--color-primary)]" />
          </p>
          <h1
            className="text-[2.4rem] md:text-[3.8rem] leading-[1.15] mb-5"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.01em' }}
          >
            <span className="block text-[var(--color-foreground)]">
              検索したその時に、
            </span>
            <span className="block">
              <span className="sketched-underline text-[var(--color-primary-dark)]">必要な答え</span>
              <span className="text-[var(--color-foreground)]">が、ここに。</span>
            </span>
          </h1>
          <p className="text-[15px] md:text-base text-[var(--color-foreground-soft)] max-w-xl mx-auto leading-[1.9]">
            0歳から12歳。眠れない夜の不安も、朝の焦りも、昼の迷いも。
            <br className="hidden md:block" />
            公的機関・専門家の情報を、そっと灯りのように差し出します。
          </p>
          <EmotionalHero />
        </div>

        {/* Age Selector */}
        <div className="max-w-3xl mx-auto animate-fade-in-up delay-200">
          <div className="paper-card p-6 md:p-8 relative">
            <p
              className="text-center text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-primary-dark)] mb-5"
              style={{ fontFamily: 'var(--font-gothic)' }}
            >
              ― お子さまの年齢を選んでください ―
            </p>

            {/* Age Buttons Grid */}
            <div className="grid grid-cols-5 md:grid-cols-13 gap-2 mb-6">
              {Array.from({ length: 13 }, (_, i) => i).map((yr) => {
                const stage = getStageByAge(yr);
                const isSelected = age === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => handleAgeSelect(yr)}
                    className={`
                      relative h-14 rounded-xl text-sm transition-all duration-300 flex flex-col items-center justify-center
                      ${isSelected
                        ? 'scale-110 z-10 shadow-[0_12px_24px_-10px_rgba(198,107,31,0.4)] ring-2 ring-[var(--color-primary)]'
                        : 'hover:scale-105 hover:z-10 hover:shadow-[0_8px_18px_-10px_rgba(31,36,57,0.15)]'}
                    `}
                    style={{
                      backgroundColor: isSelected ? stage.color : `${stage.color}4d`,
                      color: 'var(--color-foreground)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                    }}
                    aria-label={`${yr}歳${getGradeLabel(yr) ? `（${getGradeLabel(yr)}）` : ''}`}
                    aria-pressed={isSelected}
                  >
                    <span>{yr}歳</span>
                    {getGradeLabel(yr) && (
                      <span className="text-[10px] font-normal leading-none text-[var(--color-foreground-muted)]">{getGradeLabel(yr)}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stage Display */}
            {mounted && currentStage && age !== null && (
              <div
                className="rounded-2xl p-5 text-center animate-scale-in border border-[var(--color-paper-edge)]"
                style={{ backgroundColor: currentStage.colorLight }}
              >
                <p className="text-xs tracking-widest uppercase text-[var(--color-foreground-muted)] mb-1">
                  {age}歳は
                </p>
                <p
                  className="text-2xl mb-2"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary-dark)' }}
                >
                  {currentStage.label}
                  <span className="text-sm font-normal text-[var(--color-foreground-muted)] ml-2">
                    ({currentStage.ageRange})
                  </span>
                </p>
                <p className="text-sm text-[var(--color-foreground-soft)] mb-4 leading-relaxed">{currentStage.description}</p>
                <Link
                  href={`/age-guide/${currentStage.id}`}
                  className="btn-lamp inline-flex"
                >
                  {currentStage.ageRange}の記事を見る
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}

            {mounted && age === null && (
              <p className="text-center text-sm text-[var(--color-foreground-muted)] animate-pulse-soft">
                年齢を選ぶと、お子さまに合った記事をお見せします。
              </p>
            )}
          </div>
        </div>

        {/* Stage Cards */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-4">
          {AGE_STAGES.map((stage, i) => (
            <Link
              key={stage.id}
              href={`/age-guide/${stage.id}`}
              className="group block rounded-2xl p-5 text-center card-hover border border-[var(--color-paper-edge)] hover:border-[var(--color-primary-light)] animate-fade-in-up bg-[var(--color-surface)]"
              style={{
                animationDelay: `${300 + i * 100}ms`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg shadow-[0_6px_16px_-8px_rgba(31,36,57,0.2)] group-hover:scale-105 transition-transform"
                style={{ backgroundColor: stage.color, fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                {stage.ageRange.split('〜')[0]}
              </div>
              <h3
                className="text-base text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                {stage.label}
              </h3>
              <p className="text-[11px] text-[var(--color-foreground-muted)] mt-1 tracking-wider">{stage.ageRange}</p>
              <div className="mt-2.5 flex flex-wrap justify-center gap-1">
                {stage.themes.slice(0, 3).map((theme) => (
                  <span
                    key={theme}
                    className="text-[10px] bg-[var(--color-warm-cream)] rounded-full px-2 py-0.5 text-[var(--color-foreground-soft)] border border-[var(--color-paper-edge)]"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
