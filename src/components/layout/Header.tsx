'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(250,246,238,0.92)] backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(31,36,57,0.12)]'
          : 'bg-[rgba(250,246,238,0.82)] backdrop-blur-sm'
      } border-b border-[var(--color-paper-edge)]`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link href="/" className="shrink-0 group flex items-center gap-2.5">
            <picture>
              <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.webp`} type="image/webp" />
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.png`}
                alt="012.kids"
                width={56}
                height={56}
                className={`w-auto group-hover:rotate-[-3deg] group-hover:scale-105 transition-all duration-300 ${
                  scrolled ? 'h-10' : 'h-12'
                }`}
              />
            </picture>
            <span
              className={`hidden sm:block font-serif tracking-tight text-[var(--color-foreground)] transition-all duration-300 ${
                scrolled ? 'text-lg' : 'text-xl'
              }`}
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              <span className="text-[#A0C4FF]">0</span>
              <span className="text-[#7BC67E]">1</span>
              <span className="text-[var(--color-primary)]">2</span>
              <span className="text-[var(--color-foreground-muted)]">.kids</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {AGE_STAGES.map((stage) => (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="px-3 py-2 text-sm font-medium rounded-full hover:bg-[var(--color-warm-cream)] transition-all duration-200 group flex items-center"
                style={{ color: 'var(--color-foreground-soft)' }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5 group-hover:scale-150 transition-transform duration-200"
                  style={{ backgroundColor: stage.color }}
                />
                {stage.ageRange}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-2 px-3.5 py-1.5 text-sm text-[var(--color-foreground-muted)] bg-[var(--color-surface)] hover:bg-[var(--color-warm-cream)] hover:text-[var(--color-primary)] rounded-full transition-all duration-200 border border-[var(--color-paper-edge)] hover:border-[var(--color-primary-light)]"
              aria-label="検索"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs">記事を探す…</span>
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors px-2 py-1"
            >
              記事一覧
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors px-2 py-1"
            >
              特集
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--color-foreground-soft)] hover:text-[var(--color-primary)] transition-colors px-2 py-1"
            >
              このサイトについて
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[var(--color-foreground-soft)] hover:text-[var(--color-primary-dark)] transition-colors rounded-full hover:bg-[var(--color-warm-cream)]"
            aria-label="メニュー"
            aria-expanded={menuOpen}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                  menuOpen ? 'top-[11px] rotate-45' : 'top-1'
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                  menuOpen ? 'top-[11px] -rotate-45' : 'top-[19px]'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="pb-4 border-t border-[var(--color-paper-edge)] pt-4">
            {/* Mobile Search */}
            <Link
              href="/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 mx-2 mb-4 px-4 py-3 bg-[var(--color-warm-cream)] rounded-xl text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary-dark)] transition-colors border border-[var(--color-paper-edge)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">記事を検索...</span>
            </Link>

            <div className="space-y-1">
              <p
                className="px-3 py-1 text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)]"
                style={{ fontFamily: 'var(--font-gothic)' }}
              >
                年齢別ガイド
              </p>
              {AGE_STAGES.map((stage) => (
                <Link
                  key={stage.id}
                  href={`/age-guide/${stage.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-warm-cream)] transition-colors text-[var(--color-foreground)]"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{stage.label}</span>
                  <span className="ml-2 text-xs text-[var(--color-foreground-muted)]">({stage.ageRange})</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-paper-edge)] space-y-1">
              {[
                { href: '/articles', label: '記事一覧' },
                { href: '/features', label: '特集' },
                { href: '/editorial-team', label: '編集部について' },
                { href: '/about', label: 'このサイトについて' },
                { href: '/editorial-policy', label: '編集方針' },
                { href: '/contact', label: 'お問い合わせ' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--color-warm-cream)] transition-colors text-[var(--color-foreground-soft)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
