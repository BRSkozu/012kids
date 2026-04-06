'use client';

import Link from 'next/link';
import { trackAgeClick } from '@/lib/analytics';

const AGE_PILLS = [
  { label: '0〜2歳', href: '/age-guide/0stage', color: '#FFB3B3', colorLight: '#FFF0F0' },
  { label: '3〜5歳', href: '/age-guide/pre', color: '#FFD9A0', colorLight: '#FFF8ED' },
  { label: '6〜8歳', href: '/age-guide/early', color: '#FFFAA0', colorLight: '#FFFEF0' },
  { label: '9〜10歳', href: '/age-guide/mid', color: '#A8E6CF', colorLight: '#EEFAF4' },
  { label: '11〜12歳', href: '/age-guide/upper', color: '#A0C4FF', colorLight: '#EEF4FF' },
];

export default function AgePillNav() {
  return (
    <nav className="max-w-7xl mx-auto px-4 py-4" aria-label="年齢別ナビゲーション">
      <div className="flex flex-wrap justify-center gap-3">
        {AGE_PILLS.map((pill) => (
          <Link
            key={pill.label}
            href={pill.href}
            onClick={() => trackAgeClick(pill.label)}
            className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm border-2 transition-all duration-200 hover:shadow-md active:scale-95"
            style={{
              backgroundColor: pill.colorLight,
              borderColor: pill.color,
              color: '#2d2a26',
              minHeight: '44px',
            }}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 group-hover:scale-125 transition-transform"
              style={{ backgroundColor: pill.color }}
            />
            {pill.label}
            <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </nav>
  );
}
