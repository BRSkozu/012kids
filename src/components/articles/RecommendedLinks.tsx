import { RecommendedLink, LinkSentiment } from '@/data/recommended-links';

interface RecommendedLinksProps {
  links: RecommendedLink[];
  currentSlug?: string;
}

const SENTIMENT_CONFIG: Record<LinkSentiment, {
  border: string;
  hoverBorder: string;
  dot: string;
  label: string;
  symbol: string;
}> = {
  positive: {
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-200',
    dot: 'bg-blue-400',
    label: '支持的',
    symbol: '+',
  },
  neutral: {
    border: 'border-gray-200',
    hoverBorder: 'hover:border-gray-300',
    dot: 'bg-gray-300',
    label: '中立',
    symbol: '=',
  },
  cautious: {
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-200',
    dot: 'bg-amber-400',
    label: '慎重・注意喚起',
    symbol: '!',
  },
};

export default function RecommendedLinks({ links }: RecommendedLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="border-t border-[var(--color-paper-edge)] pt-6 mb-8">
      <h3
        className="text-lg text-[var(--color-foreground)] mb-2"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        おすすめサイトまとめ（{links.length}選）
      </h3>
      <p className="text-sm text-[var(--color-foreground-soft)] mb-4 leading-relaxed">
        この記事のテーマに関連する、信頼性の高い外部サイトをまとめました
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, i) => {
          const sentiment = link.sentiment ?? 'neutral';
          const config = SENTIMENT_CONFIG[sentiment];
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-xl bg-[var(--color-surface)] border border-[var(--color-paper-edge)] hover:border-[var(--color-primary-light)] hover:shadow-[0_12px_28px_-16px_rgba(31,36,57,0.25)] transition-all flex items-start gap-3 p-4`}
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] flex items-center justify-center text-xs font-bold text-[var(--color-primary-dark)]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`shrink-0 w-2 h-2 rounded-full ${config.dot}`} />
                  <p
                    className="text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
                  >
                    {link.title}
                    <span className="ml-1 text-xs text-[var(--color-foreground-muted)]">↗</span>
                  </p>
                </div>
                <p className="text-xs text-[var(--color-foreground-soft)] mt-0.5 leading-relaxed">{link.description}</p>
                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{link.org}</p>
              </div>
            </a>
          );
        })}
      </div>
      {/* センチメント凡例 */}
      <div className="mt-3 pt-2 border-t border-[var(--color-paper-edge)] flex items-center gap-4 text-xs text-[var(--color-foreground-muted)]">
        {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        ))}
      </div>
    </div>
  );
}
