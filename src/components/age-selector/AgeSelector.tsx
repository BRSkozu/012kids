'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AGE_STAGES } from '@/data/stages';
import { HERO_PHOTO, STAGE_ICON_PHOTOS } from '@/data/photos';

const POPULAR_KEYWORDS = ['夜泣き', '離乳食', '入学準備', '小1の壁', '習い事', '反抗期', 'いじめ'];

interface Props {
  totalArticles?: number;
}

export default function AgeSelector({ totalArticles }: Props = {}) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handlePickKeyword = (kw: string) => {
    router.push(`/search?q=${encodeURIComponent(kw)}`);
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-14 md:pt-14 md:pb-20">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image src={HERO_PHOTO} alt="" fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,253,247,0.92)] via-[rgba(255,253,247,0.86)] to-[rgba(255,253,247,0.95)]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        {/* Catchcopy */}
        <div className="text-center mb-8 md:mb-10">
          <h1
            className="text-[2rem] md:text-[3.2rem] leading-[1.2] mb-4"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, textShadow: '0 1px 8px rgba(255,253,247,0.8)' }}
          >
            <span className="text-[var(--color-foreground)]">子育ての「どうしよう」を、</span>
            <br />
            <span className="text-[var(--color-foreground)]">ここで解決。</span>
          </h1>
          <p
            className="text-sm md:text-[15px] text-[var(--color-foreground-soft)] max-w-xl mx-auto leading-[1.9]"
            style={{ textShadow: '0 0 12px rgba(255,253,247,0.9)' }}
          >
            厚労省・文科省・小児科専門医のガイドラインから、0〜12歳のリアルなお悩み{totalArticles ? <strong className="text-[var(--color-primary-dark)]">{totalArticles.toLocaleString()}記事</strong> : '1,200記事以上'}を集約。
            <br className="hidden sm:inline" />
            広告なし、出典明記。
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 md:mb-12">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="気になるキーワードで検索…（例：夜泣き、離乳食、入学準備）"
              className="w-full pl-12 pr-28 py-4 rounded-2xl border border-[var(--color-paper-edge)] bg-white/90 backdrop-blur text-sm shadow-[0_8px_30px_-12px_rgba(31,36,57,0.15)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              検索
            </button>
          </div>
          {/* Popular keywords */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="text-[11px] text-[var(--color-foreground-muted)] self-center mr-1">人気:</span>
            {POPULAR_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handlePickKeyword(kw)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/70 backdrop-blur border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] hover:bg-[var(--color-warm-cream)] hover:border-[var(--color-primary-light)] transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </form>

        {/* Age stage buttons */}
        <div className="mb-8">
          <p
            className="text-center text-sm text-[var(--color-foreground-soft)] mb-4"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
          >
            お子さまの年齢から探す
          </p>
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
            {AGE_STAGES.map((stage) => (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border border-[var(--color-paper-edge)] bg-white/80 backdrop-blur hover:shadow-[0_12px_28px_-10px_rgba(31,36,57,0.2)] hover:scale-[1.04] transition-all duration-200"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-[0_4px_12px_-4px_rgba(31,36,57,0.15)] group-hover:scale-110 transition-transform">
                  <Image
                    src={STAGE_ICON_PHOTOS[stage.id]}
                    alt={stage.ageRange}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className="text-xs md:text-sm text-[var(--color-foreground)] text-center leading-tight"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                >
                  {stage.ageRange}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            ), label: '公的データに基づく' },
            { icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ), label: '出典を明記' },
            { icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ), label: '広告なし' },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
              <span className="text-[var(--color-primary)]">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
