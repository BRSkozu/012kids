'use client';

import Link from 'next/link';
import { trackFirst3Click } from '@/lib/analytics';

const FIRST_TIME_CARDS = [
  {
    ageGroup: '0-2',
    title: '0〜2歳：生活リズム・睡眠',
    description: '夜泣き対策や睡眠習慣づくりなど、赤ちゃん期の基本をまとめています。',
    href: '/articles/baby-sleep-training',
    color: '#FFB3B3',
    colorLight: '#FFF0F0',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    ageGroup: '3-6',
    title: '3〜6歳：園生活・しつけ',
    description: 'トイレトレーニングや園選びなど、幼児期のよくある疑問に答えます。',
    href: '/articles/potty-training-guide',
    color: '#FFD9A0',
    colorLight: '#FFF8ED',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    ageGroup: '7-12',
    title: '7〜12歳：学校・学習習慣',
    description: '宿題のやる気や学習環境づくりなど、小学生の親が知りたい情報です。',
    href: '/articles/homework-motivation-tips',
    color: '#A0C4FF',
    colorLight: '#EEF4FF',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
];

export default function FirstTimeSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p
          className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-gothic)' }}
        >
          <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
          First 3
        </p>
        <h2
          className="text-[26px] md:text-[32px] leading-[1.25] text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.005em' }}
        >
          まずはこの3つから
        </h2>
        <p className="mt-2 text-sm md:text-[15px] text-[var(--color-foreground-soft)] leading-[1.85]">
          0〜12歳の子育てで、最初に読むと役立つ記事を厳選しました。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FIRST_TIME_CARDS.map((card) => (
          <Link
            key={card.ageGroup}
            href={card.href}
            onClick={() => trackFirst3Click(card.ageGroup)}
            className="group relative block rounded-2xl p-6 border border-[var(--color-paper-edge)] card-hover overflow-hidden"
            style={{ backgroundColor: card.colorLight }}
          >
            <div
              className="lamp-glow top-[-4rem] right-[-3rem] w-[12rem] h-[12rem] opacity-40 pointer-events-none"
              style={{ backgroundColor: card.color }}
            />
            <div
              className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_8px_18px_-10px_rgba(31,36,57,0.25)]"
              style={{ backgroundColor: card.color }}
            >
              <span className="text-[var(--color-foreground)]">{card.icon}</span>
            </div>
            <h3
              className="relative text-base text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {card.title}
            </h3>
            <p className="relative text-sm text-[var(--color-foreground-soft)] mt-2 leading-[1.85]">
              {card.description}
            </p>
            <span className="relative inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[var(--color-primary-dark)]">
              記事を見る
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
