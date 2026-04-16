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

      <h1
        className="text-5xl text-[var(--color-primary-dark)] mb-2"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        404
      </h1>
      <h2
        className="text-xl text-[var(--color-foreground)] mb-3"
        style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
      >
        ページが見つかりません
      </h2>
      <p className="text-[var(--color-foreground-soft)] mb-8 leading-relaxed">
        お探しのページは存在しないか、移動した可能性があります。<br />
        下のリンクからお探しの情報を見つけてみてください。
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <Link href="/" className="btn-lamp">
          トップページへ
        </Link>
        <Link
          href="/search"
          className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] text-[var(--color-primary-dark)] font-medium px-6 py-3 rounded-lg hover:bg-[var(--color-surface)] hover:border-[var(--color-primary-light)] transition-colors"
        >
          記事を検索
        </Link>
        <Link
          href="/articles"
          className="bg-[var(--color-surface)] border border-[var(--color-paper-edge)] text-[var(--color-foreground-soft)] font-medium px-6 py-3 rounded-lg hover:bg-[var(--color-warm-cream)] transition-colors"
        >
          記事一覧
        </Link>
      </div>

      {/* Popular categories quick links */}
      <div className="bg-[var(--color-warm-cream)] border border-[var(--color-paper-edge)] rounded-xl p-6">
        <p
          className="text-sm text-[var(--color-foreground)] mb-3"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}
        >
          よく見られているカテゴリ
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: '発達・成長', href: '/category/development' },
            { label: '食育・栄養', href: '/category/nutrition' },
            { label: '教育・学習', href: '/category/education' },
            { label: '健康・医療', href: '/category/health' },
            { label: 'メンタル・心理', href: '/category/mental' },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-3 py-1.5 text-sm bg-[var(--color-surface)] rounded-full text-[var(--color-foreground-soft)] hover:text-[var(--color-primary-dark)] hover:border-[var(--color-primary-light)] transition-colors border border-[var(--color-paper-edge)]"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
