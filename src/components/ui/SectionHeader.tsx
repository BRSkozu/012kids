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
      className={`flex ${isCenter ? 'flex-col items-center text-center' : 'items-end justify-between flex-wrap gap-3'} mb-7 ${className}`}
    >
      <div className={isCenter ? 'flex flex-col items-center' : 'min-w-0 flex-1'}>
        {kicker && (
          <p
            className={`text-[11px] font-medium tracking-[0.22em] uppercase text-[var(--color-primary-dark)] mb-2 inline-flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}
            style={{ fontFamily: 'var(--font-gothic)' }}
          >
            <span className={`inline-block w-5 h-px ${accentColor}`} aria-hidden="true" />
            {icon && <span aria-hidden="true">{icon}</span>}
            <span>{kicker}</span>
          </p>
        )}
        <h2
          className="text-[26px] md:text-[32px] leading-[1.25] text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '0.005em' }}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-2 text-sm md:text-[15px] text-[var(--color-foreground-soft)] leading-[1.85] ${isCenter ? 'max-w-xl' : ''}`}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {description}
          </p>
        )}
      </div>
      {seeAllHref && !isCenter && (
        <Link
          href={seeAllHref}
          className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors group"
        >
          <span className="border-b border-transparent group-hover:border-current">{seeAllLabel}</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
