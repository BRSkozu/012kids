'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { ARTICLES } from '@/data/articles';
import { WORRIES } from '@/data/worries';

interface Suggestion {
  kind: 'article' | 'worry' | 'tag';
  label: string;
  href?: string;
  sub?: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  maxSuggestions?: number;
}

/**
 * Dropdown autocomplete. Shows a mix of matching articles, worry prompts, and
 * tag suggestions as the user types. Keyboard-accessible (↑↓ navigate, Enter confirms).
 */
export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = 'キーワードで検索（例：離乳食、発達、習い事）',
  autoFocus = false,
  maxSuggestions = 7,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(ARTICLES, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'excerpt', weight: 2 },
          { name: 'tags', weight: 2 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    []
  );

  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    ARTICLES.forEach((a) => a.tags?.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, []);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = value.trim();
    if (!q) {
      return popularTags.map((t) => ({
        kind: 'tag',
        label: t,
        sub: 'よく検索されるキーワード',
      }));
    }
    const articleHits: Suggestion[] = fuse
      .search(q)
      .slice(0, maxSuggestions)
      .map((r) => ({
        kind: 'article',
        label: r.item.title,
        sub: r.item.excerpt,
        href: `/articles/${r.item.slug}`,
      }));

    const worryHits: Suggestion[] = WORRIES.filter((w) =>
      w.text.toLowerCase().includes(q.toLowerCase())
    )
      .slice(0, 3)
      .map((w) => ({
        kind: 'worry',
        label: `「${w.text}」で探す`,
        sub: 'お悩みから記事を探す',
      }));

    return [...articleHits, ...worryHits];
  }, [value, fuse, popularTags, maxSuggestions]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      const s = suggestions[activeIdx];
      if (s) {
        e.preventDefault();
        handlePick(s);
      } else if (onSubmit) {
        onSubmit(value);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handlePick = (s: Suggestion) => {
    if (s.href) {
      window.location.href = s.href;
    } else {
      onChange(s.label);
      setOpen(false);
      onSubmit?.(s.label);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="autocomplete-listbox"
          className="w-full pl-12 pr-10 py-4 rounded-xl border border-orange-200 text-base focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none bg-white"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setActiveIdx(-1);
            }}
            aria-label="クリア"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-[var(--color-primary)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id="autocomplete-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-white shadow-xl shadow-orange-100/50 border border-orange-100 overflow-hidden max-h-[420px] overflow-y-auto"
        >
          {!value.trim() && (
            <li className="px-4 pt-3 pb-1 text-[11px] font-semibold tracking-wider uppercase text-gray-400">
              人気のキーワード
            </li>
          )}
          {suggestions.map((s, i) => {
            const active = i === activeIdx;
            return (
              <li key={`${s.kind}-${s.label}-${i}`} role="option" aria-selected={active}>
                {s.href ? (
                  <Link
                    href={s.href}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      active ? 'bg-orange-50' : 'hover:bg-orange-50/70'
                    }`}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <SuggestionIcon kind={s.kind} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{s.label}</p>
                      {s.sub && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{s.sub}</p>}
                    </div>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePick(s)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors ${
                      active ? 'bg-orange-50' : 'hover:bg-orange-50/70'
                    }`}
                  >
                    <SuggestionIcon kind={s.kind} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{s.label}</p>
                      {s.sub && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{s.sub}</p>}
                    </div>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SuggestionIcon({ kind }: { kind: Suggestion['kind'] }) {
  if (kind === 'article') {
    return (
      <span className="shrink-0 w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
        <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </span>
    );
  }
  if (kind === 'worry') {
    return (
      <span className="shrink-0 w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
        <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01" />
        </svg>
      </span>
    );
  }
  return (
    <span className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    </span>
  );
}
