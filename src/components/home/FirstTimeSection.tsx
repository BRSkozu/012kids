'use client';

import Image from 'next/image';
import Link from 'next/link';
import { trackFirst3Click } from '@/lib/analytics';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

const FIRST_TIME_CARDS = [
  {
    ageGroup: '0-2',
    title: '0〜2歳：生活リズム・睡眠',
    description: '夜泣き対策や睡眠習慣づくりなど、赤ちゃん期の基本をまとめています。',
    href: '/articles/baby-sleep-training',
    image: `${bp}/photos/stage-icon-0.webp`,
    color: '#FFB3B3',
  },
  {
    ageGroup: '3-6',
    title: '3〜6歳：園生活・しつけ',
    description: 'トイレトレーニングや園選びなど、幼児期のよくある疑問に答えます。',
    href: '/articles/potty-training-guide',
    image: `${bp}/photos/stage-icon-pre.webp`,
    color: '#FFD9A0',
  },
  {
    ageGroup: '7-12',
    title: '7〜12歳：学校・学習習慣',
    description: '宿題のやる気や学習環境づくりなど、小学生の親が知りたい情報です。',
    href: '/articles/homework-motivation-tips',
    image: `${bp}/photos/stage-icon-early.webp`,
    color: '#A0C4FF',
  },
];

export default function FirstTimeSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h2
          className="text-xl md:text-2xl text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          まずはこの3つから
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-foreground-soft)] leading-relaxed">
          0〜12歳の子育てで、最初に読むと役立つ記事を厳選しました。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FIRST_TIME_CARDS.map((card) => (
          <Link
            key={card.ageGroup}
            href={card.href}
            onClick={() => trackFirst3Click(card.ageGroup)}
            className="group flex items-start gap-4 rounded-xl p-5 border border-[var(--color-paper-edge)] bg-[var(--color-surface)] hover:shadow-[0_12px_28px_-12px_rgba(31,36,57,0.18)] transition-all"
          >
            <div
              className="shrink-0 w-16 h-16 rounded-full overflow-hidden shadow-[0_4px_12px_-4px_rgba(31,36,57,0.15)] group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: card.color }}
            >
              <Image
                src={card.image}
                alt={card.title}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3
                className="text-base text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors leading-snug"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                {card.title}
              </h3>
              <p className="text-sm text-[var(--color-foreground-soft)] mt-1.5 leading-relaxed line-clamp-2">
                {card.description}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[var(--color-primary-dark)]">
                記事を見る
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
