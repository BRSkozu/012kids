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
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-orange-100/30'
          : 'bg-white/90 backdrop-blur-sm'
      } border-b border-orange-100`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <picture>
              <source srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.webp`} type="image/webp" />
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-badge.png`}
                alt="012.kids"
                width={120}
                height={40}
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-200"
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {AGE_STAGES.map((stage) => (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-orange-50 transition-all duration-200 group"
                style={{ color: 'var(--color-foreground)' }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 group-hover:scale-125 transition-transform duration-200"
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
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 hover:bg-orange-50 hover:text-[var(--color-primary)] rounded-lg transition-all duration-200 border border-gray-100 hover:border-orange-200"
              aria-label="検索"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs">検索...</span>
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors px-2 py-1"
            >
              記事一覧
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors px-2 py-1"
            >
              このサイトについて
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-orange-50"
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
          <nav className="pb-4 border-t border-orange-100 pt-4">
            {/* Mobile Search */}
            <Link
              href="/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 mx-2 mb-4 px-4 py-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-orange-50 hover:text-[var(--color-primary)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">記事を検索...</span>
            </Link>

            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">年齢別ガイド</p>
              {AGE_STAGES.map((stage) => (
                <Link
                  key={stage.id}
                  href={`/age-guide/${stage.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="font-medium">{stage.label}</span>
                  <span className="ml-2 text-xs text-gray-400">({stage.ageRange})</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-orange-100 space-y-1">
              {[
                { href: '/articles', label: '記事一覧' },
                { href: '/experts', label: '編集部について' },
                { href: '/about', label: 'このサイトについて' },
                { href: '/editorial-policy', label: '編集方針' },
                { href: '/contact', label: 'お問い合わせ' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm rounded-lg hover:bg-orange-50 transition-colors"
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
