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
    <div className="border-t border-orange-100 pt-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        おすすめサイトまとめ（{links.length}選）
      </h3>
      <p className="text-sm text-gray-500 mb-4">
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
              className={`group rounded-xl bg-white border ${config.border} ${config.hoverBorder} hover:shadow-md transition-all flex items-start gap-3 p-4`}
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`shrink-0 w-2 h-2 rounded-full ${config.dot}`} />
                  <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors text-sm">
                    {link.title}
                    <span className="ml-1 text-xs text-gray-400">↗</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                <p className="text-xs text-gray-400 mt-1">{link.org}</p>
              </div>
            </a>
          );
        })}
      </div>
      {/* センチメント凡例 */}
      <div className="mt-3 pt-2 border-t border-orange-100 flex items-center gap-4 text-xs text-gray-400">
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
