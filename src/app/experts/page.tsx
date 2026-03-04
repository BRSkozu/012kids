import { Metadata } from 'next';
import { EXPERTS } from '@/data/experts';
import { ARTICLES } from '@/data/articles';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '専門家紹介',
  description: '012.kidsの記事を監修・執筆する専門家の紹介。小児科医・心理士・教育専門家など。',
};

export default function ExpertsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">専門家紹介</h1>
      <p className="text-gray-500 mb-8">
        012.kidsの記事は、各分野の専門家による監修・執筆で信頼性を担保しています。
      </p>

      <div className="space-y-6">
        {EXPERTS.map((expert) => {
          const expertArticles = ARTICLES.filter(
            (a) => a.author?.id === expert.id || a.supervisor?.id === expert.id
          );

          return (
            <div
              key={expert.id}
              className="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-[var(--color-primary)]">
                    {expert.name[0]}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{expert.name}</h2>
                  <p className="text-sm text-[var(--color-primary)] font-medium mt-1">
                    {expert.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {expert.organization}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    専門分野: {expert.speciality}
                  </p>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {expert.bio}
                  </p>

                  {/* Articles by this expert */}
                  {expertArticles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        執筆・監修記事 ({expertArticles.length}件)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {expertArticles.map((article) => (
                          <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {article.title.length > 30
                              ? article.title.slice(0, 30) + '...'
                              : article.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
