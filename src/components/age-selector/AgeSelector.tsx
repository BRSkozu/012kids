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
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12">
          <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.png`}
              alt="012.kids"
              width={180}
              height={180}
              className="shrink-0"
            />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              <span className="text-[#A0C4FF]">0</span>
              <span className="text-[#7BC67E]">1</span>
              <span className="text-[#E8943D]">2</span>
              <span className="text-gray-400">.kids</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md">
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-6 md:p-8">
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
                      relative h-12 rounded-xl font-bold text-sm transition-all
                      ${isSelected
                        ? 'ring-2 ring-offset-2 ring-[var(--color-primary)] scale-105 shadow-md'
                        : 'hover:scale-105 hover:shadow-sm'}
                    `}
                    style={{
                      backgroundColor: isSelected ? stage.color : `${stage.color}66`,
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
                className="rounded-xl p-4 text-center transition-all"
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
                <p className="text-sm text-gray-600 mb-3">{currentStage.description}</p>
                <Link
                  href={`/age-guide/${currentStage.id}`}
                  className="inline-block bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {currentStage.ageRange}の記事を見る
                </Link>
              </div>
            )}

            {mounted && age === null && (
              <p className="text-center text-sm text-gray-400">
                年齢を選ぶと、お子さまの年齢に合った記事が見つかりますよ
              </p>
            )}
          </div>
        </div>

        {/* Stage Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {AGE_STAGES.map((stage) => (
            <Link
              key={stage.id}
              href={`/age-guide/${stage.id}`}
              className="group block rounded-xl p-4 text-center hover:shadow-md transition-all border-2 border-transparent hover:border-orange-200"
              style={{ backgroundColor: stage.colorLight }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: stage.color }}
              >
                {stage.ageRange.split('〜')[0]}
              </div>
              <h3 className="font-bold text-sm text-gray-900">{stage.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{stage.ageRange}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {stage.themes.slice(0, 3).map((theme) => (
                  <span key={theme} className="text-xs bg-white/70 rounded-full px-2 py-0.5 text-gray-600">
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
