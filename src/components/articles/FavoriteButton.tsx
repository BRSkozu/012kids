'use client';

import { useEffect, useState } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/userProfile';

interface Props {
  slug: string;
  /** 'icon' = compact heart for card corners; 'button' = full pill for article pages */
  variant?: 'icon' | 'button';
  className?: string;
}

/**
 * Heart toggle — persists per-slug in localStorage via userProfile.ts.
 * Listens to the '012kids:favorites-updated' global event so multiple
 * instances stay in sync across the page (e.g. card heart ↔ article page heart).
 */
export default function FavoriteButton({ slug, variant = 'icon', className = '' }: Props) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setActive(isFavorite(slug));
    const onChange = () => setActive(isFavorite(slug));
    window.addEventListener('012kids:favorites-updated', onChange);
    return () => window.removeEventListener('012kids:favorites-updated', onChange);
  }, [slug]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleFavorite(slug);
    setActive(now);
  };

  if (!mounted) {
    // Avoid layout shift: render invisible placeholder of same size.
    if (variant === 'icon') {
      return <span className={`inline-block w-9 h-9 ${className}`} aria-hidden="true" />;
    }
    return (
      <span className={`inline-block h-10 w-[120px] ${className}`} aria-hidden="true" />
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? 'お気に入りから外す' : 'お気に入りに追加'}
        className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-200 hover:text-pink-600'
        } ${className}`}
      >
        <HeartSvg filled={active} />
        {active ? '保存済み' : 'お気に入り'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'お気に入りから外す' : 'お気に入りに追加'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
        active
          ? 'bg-pink-50 text-pink-500 shadow-sm'
          : 'bg-white/90 text-gray-400 hover:text-pink-500 hover:bg-pink-50 shadow-sm'
      } ${className}`}
    >
      <HeartSvg filled={active} />
    </button>
  );
}

function HeartSvg({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
      />
    </svg>
  );
}
