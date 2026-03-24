'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { getStageByAge } from '@/data/stages';

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
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 md:py-24 wave-divider">
      {/* Decorative background elements */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--color-stage-0)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[var(--color-stage-upper)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12 animate-fade-in-up">
          <div className="relative animate-float">
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.png`}
              alt="012.kids"
              width={180}
              height={180}
              className="shrink-0 drop-shadow-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              <span className="text-[#A0C4FF]">0</span>
              <span className="text-[#7BC67E]">1</span>
              <span className="text-[#E8943D]">2</span>
              <span className="text-gray-400">.kids</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md leading-relaxed">
              0歳から12歳の子育てに役立つ情報を
              <br className="hidden md:block" />
              わかりやすくまとめてお届けします
            </p>
            <p className="mt-3 text-sm text-gray-400">
              公的機関・専門家の情報をもとに、信頼度スコア付きでお届け
            </p>
          </div>
        </div>

        {/* Age Selector */}
        <div className="max-w-3xl mx-auto animate-fade-in-up delay-200">
          <div className="glass rounded-2xl shadow-lg shadow-orange-100/50 p-6 md:p-8 border border-white/60">
            <p className="text-center text-sm font-medium text-gray-500 mb-4">
              お子さまの年齢を選んでみてください
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
                      relative h-12 rounded-xl font-bold text-sm transition-all duration-300
                      ${isSelected
                        ? 'ring-2 ring-offset-2 ring-[var(--color-primary)] scale-110 shadow-lg z-10'
                        : 'hover:scale-105 hover:shadow-md hover:z-10'}
                    `}
                    style={{
                      backgroundColor: isSelected ? stage.color : `${stage.color}50`,
                      color: '#2d2a26',
                    }}
                    aria-label={`${yr}歳`}
                    aria-pressed={isSelected}
                  >
                    {yr}歳
                  </button>
                );
              })}
            </div>

            {/* Stage Display */}
            {mounted && currentStage && age !== null && (
              <div
                className="rounded-xl p-5 text-center animate-scale-in"
                style={{ backgroundColor: currentStage.colorLight }}
              >
                <p className="text-sm text-gray-500 mb-1">
                  {age}歳は
                </p>
                <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                  {currentStage.label}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({currentStage.ageRange})
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">{currentStage.description}</p>
                <Link
                  href={`/age-guide/${currentStage.id}`}
                  className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-all hover:shadow-md hover:shadow-orange-200/50"
                >
                  {currentStage.ageRange}の記事を見る
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}

            {mounted && age === null && (
              <p className="text-center text-sm text-gray-400 animate-pulse-soft">
                年齢を選ぶと、お子さまの年齢に合った記事が見つかりますよ
              </p>
            )}
          </div>
        </div>

        {/* Stage Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {AGE_STAGES.map((stage, i) => (
            <Link
              key={stage.id}
              href={`/age-guide/${stage.id}`}
              className={`group block rounded-2xl p-4 text-center card-hover border-2 border-transparent hover:border-orange-200 animate-fade-in-up`}
              style={{
                backgroundColor: stage.colorLight,
                animationDelay: `${300 + i * 100}ms`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold shadow-sm group-hover:shadow-md transition-shadow"
                style={{ backgroundColor: stage.color }}
              >
                {stage.ageRange.split('〜')[0]}
              </div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{stage.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{stage.ageRange}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {stage.themes.slice(0, 3).map((theme) => (
                  <span key={theme} className="text-xs bg-white/80 rounded-full px-2 py-0.5 text-gray-600 shadow-sm">
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
