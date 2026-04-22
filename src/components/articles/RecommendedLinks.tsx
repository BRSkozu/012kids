'use client';

import { useState } from 'react';
import { RecommendedLink, LinkSentiment } from '@/data/recommended-links';

interface RecommendedLinksProps {
  links: RecommendedLink[];
  currentSlug?: string;
}

const SENTIMENT_CONFIG: Record<LinkSentiment, {
  dot: string;
  label: string;
}> = {
  positive: { dot: 'bg-blue-400', label: '支持的' },
  neutral: { dot: 'bg-gray-300', label: '中立' },
  cautious: { dot: 'bg-amber-400', label: '慎重・注意喚起' },
};

const INITIAL_SHOW = 4;

export default function RecommendedLinks({ links }: RecommendedLinksProps) {
  const [expanded, setExpanded] = useState(false);
  if (links.length === 0) return null;

  const visibleLinks = expanded ? links : links.slice(0, INITIAL_SHOW);
  const hasMore = links.length > INITIAL_SHOW;

  return (
    <section className="mb-10">
      <div className="bg-[var(--color-warm-bg)] rounded-2xl p-5 md:p-6">
        <h3
          className="text-base text-[var(--color-foreground)] mb-1"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          参考になる外部サイト
        </h3>
        <p className="text-xs text-[var(--color-foreground-muted)] mb-4">
          信頼性の高い外部サイトをまとめました
        </p>

        <div className="space-y-2">
          {visibleLinks.map((link, i) => {
            const sentiment = link.sentiment ?? 'neutral';
            const config = SENTIMENT_CONFIG[sentiment];
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 bg-[var(--color-surface)] rounded-xl p-3.5 border border-transparent hover:border-[var(--color-primary-light)] hover:shadow-sm transition-all"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[11px] font-bold text-[var(--color-primary-dark)] mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors leading-snug"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    {link.title}
                    <span className="ml-1 opacity-40 text-xs">↗</span>
                  </p>
                  <p className="text-xs text-[var(--color-foreground-soft)] mt-0.5 leading-relaxed line-clamp-1">{link.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[var(--color-foreground-muted)]">{link.org}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 w-full py-2.5 text-sm font-medium text-[var(--color-primary-dark)] bg-[var(--color-surface)] rounded-xl border border-[var(--color-paper-edge)] hover:border-[var(--color-primary-light)] transition-colors"
          >
            残り{links.length - INITIAL_SHOW}件を表示
          </button>
        )}

        <div className="mt-3 flex items-center gap-4 text-[11px] text-[var(--color-foreground-muted)]">
          {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
