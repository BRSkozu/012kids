import { RecommendedLink } from '@/data/recommended-links';

interface RecommendedLinksProps {
  links: RecommendedLink[];
}

export default function RecommendedLinks({ links }: RecommendedLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="border-t border-orange-100 pt-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        おすすめサイトまとめ（{links.length}選）
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        この記事のテーマに関連する、無料で使える信頼性の高いサイトを厳選しました
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 p-4 rounded-xl bg-white border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all"
          >
            <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors text-sm">
                {link.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
              <p className="text-xs text-gray-400 mt-1">{link.org}</p>
            </div>
            <span className="shrink-0 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
