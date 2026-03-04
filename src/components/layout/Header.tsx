'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl font-bold text-[var(--color-primary)]">012</span>
            <span className="text-lg font-semibold text-gray-600">.kids</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {AGE_STAGES.map((stage) => (
              <Link
                key={stage.id}
                href={`/age-guide/${stage.id}`}
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--color-foreground)' }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mr-1.5"
                  style={{ backgroundColor: stage.color }}
                />
                {stage.ageRange}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="検索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/articles"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              記事一覧
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              について
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            aria-label="メニュー"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">年齢別ガイド</p>
              {AGE_STAGES.map((stage) => (
                <Link
                  key={stage.id}
                  href={`/age-guide/${stage.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: stage.color }}
                  />
                  {stage.label} ({stage.ageRange})
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
              <Link
                href="/articles"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                記事一覧
              </Link>
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                検索
              </Link>
              <Link
                href="/experts"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                専門家紹介
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                012.kidsについて
              </Link>
              <Link
                href="/editorial-policy"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                編集方針
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
              >
                お問い合わせ
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
