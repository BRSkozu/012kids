import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  /** Accent bar color class (e.g. 'bg-[var(--color-primary)]', 'bg-green-400') */
  accentColor?: string;
  /** Small kicker / eyebrow text shown above the title */
  kicker?: string;
  /** Main title */
  title: string;
  /** Subtitle / description */
  description?: string;
  /** Emoji or icon next to kicker */
  icon?: ReactNode;
  /** Optional "see all" link */
  seeAllHref?: string;
  seeAllLabel?: string;
  /** Centered style (default: left aligned) */
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Unified section header used across the home page and subpages.
 * Provides a consistent rhythm of: accent-bar + kicker + title + description.
 */
export default function SectionHeader({
  accentColor = 'bg-[var(--color-primary)]',
  kicker,
  title,
  description,
  icon,
  seeAllHref,
  seeAllLabel = 'すべて見る',
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex ${isCenter ? 'flex-col items-center text-center' : 'items-end justify-between flex-wrap gap-3'} mb-6 ${className}`}
    >
      <div className={isCenter ? 'flex flex-col items-center' : 'flex items-start gap-3 min-w-0'}>
        {!isCenter && <div className={`w-1 h-8 rounded-full mt-1.5 shrink-0 ${accentColor}`} />}
        <div className="min-w-0">
          {kicker && (
            <p
              className={`text-xs font-semibold tracking-[0.12em] uppercase text-[var(--color-primary)] mb-1.5 inline-flex items-center gap-1.5 ${isCenter ? 'justify-center' : ''}`}
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              <span>{kicker}</span>
            </p>
          )}
          <h2 className="text-2xl md:text-[26px] font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          {description && (
            <p className={`mt-1.5 text-sm text-gray-500 ${isCenter ? 'max-w-xl' : ''}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      {seeAllHref && !isCenter && (
        <Link
          href={seeAllHref}
          className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          {seeAllLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
