'use client';

import Image from 'next/image';
import Link from 'next/link';
import { trackTroubleClick } from '@/lib/analytics';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

const WORRY_CARDS = [
  {
    id: 'sleep',
    label: '夜泣き・睡眠',
    href: '/articles/baby-sleep-training',
    image: `${bp}/photos/worry-sleep.webp`,
    emoji: '🌙',
  },
  {
    id: 'hoikuen',
    label: '保育園',
    href: '/search?q=%E4%BF%9D%E8%82%B2%E5%9C%92',
    image: `${bp}/photos/worry-hoikuen.webp`,
    emoji: '🏠',
  },
  {
    id: 'youchien',
    label: '幼稚園',
    href: '/search?q=%E5%B9%BC%E7%A8%9A%E5%9C%92',
    image: `${bp}/photos/worry-youchien.webp`,
    emoji: '🏫',
  },
  {
    id: 'sho1wall',
    label: '小1の壁',
    href: '/search?q=%E5%B0%8F1%E3%81%AE%E5%A3%81',
    image: `${bp}/photos/worry-sho1wall.webp`,
    emoji: '🚸',
  },
  {
    id: 'gakudo',
    label: '学童・放課後',
    href: '/search?q=%E5%AD%A6%E7%AB%A5',
    image: `${bp}/photos/worry-gakudo.webp`,
    emoji: '🎒',
  },
  {
    id: 'naraigoto',
    label: '習い事',
    href: '/search?q=%E7%BF%92%E3%81%84%E4%BA%8B',
    image: `${bp}/photos/worry-naraigoto.webp`,
    emoji: '🎨',
  },
  {
    id: 'juku',
    label: '塾選び',
    href: '/search?q=%E5%A1%BE',
    image: `${bp}/photos/worry-juku.webp`,
    emoji: '📚',
  },
  {
    id: 'juken',
    label: '受験',
    href: '/search?q=%E5%8F%97%E9%A8%93',
    image: `${bp}/photos/worry-juken.webp`,
    emoji: '🎓',
  },
];

export default function WorryCardSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p
          className="text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-gothic)' }}
        >
          <span className="inline-block w-5 h-px bg-[var(--color-primary)]" />
          Worries
        </p>
        <h2
          className="text-[26px] md:text-[32px] leading-[1.25] text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.005em' }}
        >
          お悩みから探す
        </h2>
        <p className="mt-2 text-sm md:text-[15px] text-[var(--color-foreground-soft)] leading-[1.85]">
          今困っているテーマから、すぐに情報を見つけられます。
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {WORRY_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            onClick={() => trackTroubleClick(card.id)}
            className="group flex flex-col rounded-2xl bg-[var(--color-surface)] border border-[var(--color-paper-edge)] overflow-hidden card-hover"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-warm-cream)]">
              <Image
                src={card.image}
                alt={card.label}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <span
              className="block text-center text-[15px] md:text-base py-3 px-2 text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
            >
              {card.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-5 text-center">
        <Link
          href="/search?tab=worry"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] group"
        >
          <span className="border-b border-transparent group-hover:border-current">もっとお悩みから探す</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
