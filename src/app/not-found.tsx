import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Illustration */}
      <div className="mb-8">
        <svg width="200" height="160" viewBox="0 0 200 160" className="mx-auto" aria-hidden="true">
          <circle cx="100" cy="80" r="60" fill="#FEF7F0" />
          <circle cx="80" cy="70" r="8" fill="#E07B4C" opacity="0.7" />
          <circle cx="120" cy="70" r="8" fill="#E07B4C" opacity="0.7" />
          <path d="M75 100 Q100 88 125 100" stroke="#E07B4C" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="100" y="130" textAnchor="middle" fontSize="14" fill="#C4623A" fontWeight="600">
            あれ...?
          </text>
        </svg>
      </div>

      <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        ページが見つかりません
      </h2>
      <p className="text-gray-500 mb-8 leading-relaxed">
        お探しのページは存在しないか、移動した可能性があります。<br />
        下のリンクからお探しの情報を見つけてみてください。
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <Link
          href="/"
          className="bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          トップページへ
        </Link>
        <Link
          href="/search"
          className="bg-orange-50 text-[var(--color-primary-dark)] font-medium px-6 py-3 rounded-lg hover:bg-orange-100 transition-colors"
        >
          記事を検索
        </Link>
        <Link
          href="/articles"
          className="bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          記事一覧
        </Link>
      </div>

      {/* Popular categories quick links */}
      <div className="bg-[var(--color-warm-cream)] rounded-xl p-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">よく見られているカテゴリ</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: '発達・成長', href: '/articles?category=development' },
            { label: '食育・栄養', href: '/articles?category=nutrition' },
            { label: '教育・学習', href: '/articles?category=education' },
            { label: '健康・医療', href: '/articles?category=health' },
            { label: 'メンタル・心理', href: '/articles?category=mental' },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-3 py-1.5 text-sm bg-white rounded-full text-gray-600 hover:text-[var(--color-primary)] hover:bg-orange-50 transition-colors border border-orange-100"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
