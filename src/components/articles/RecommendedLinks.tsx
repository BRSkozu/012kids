import Link from 'next/link';
import { RecommendedLink } from '@/data/recommended-links';
import { getAllArticlesSync } from '@/lib/articles';

interface RecommendedLinksProps {
  links: RecommendedLink[];
  currentSlug?: string;
}

export default function RecommendedLinks({ links, currentSlug }: RecommendedLinksProps) {
  if (links.length === 0) return null;

  const allArticles = getAllArticlesSync();
  const usedSlugs = new Set<string>();
  if (currentSlug) usedSlugs.add(currentSlug);

  return (
    <div className="border-t border-orange-100 pt-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        おすすめサイトまとめ（{links.length}選）
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        この記事のテーマに関連する、信頼性の高いサイトと012.kidsの関連記事をまとめました
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, i) => {
          const related = allArticles
            .filter((a) =>
              !usedSlugs.has(a.slug) &&
              a.categories.some((c) => link.categories.includes(c))
            )
            .sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0))
            .slice(0, 2);
          related.forEach((a) => usedSlugs.add(a.slug));

          return (
            <div
              key={i}
              className="rounded-xl bg-white border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all overflow-hidden"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4"
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors text-sm">
                    {link.title}
                    <span className="ml-1 text-xs text-gray-400">↗</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{link.org}</p>
                </div>
              </a>
              {related.length > 0 && (
                <div className="border-t border-orange-50 bg-orange-50/30 px-4 py-2.5">
                  <p className="text-[10px] font-medium text-gray-400 mb-1.5">関連する012.kids記事</p>
                  <div className="flex flex-col gap-1">
                    {related.map((a) => (
                      <Link
                        key={a.id}
                        href={`/articles/${a.slug}`}
                        className="text-xs text-[var(--color-primary)] hover:underline truncate block"
                      >
                        {a.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
