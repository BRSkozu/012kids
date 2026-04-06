import Link from 'next/link';

export default function TrustBlock() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/60 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          安心して読める理由
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            公的機関・専門家の情報をもとに作成しています
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            参考元を記事内に明記しています
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            定期的に内容を見直し・更新しています
          </li>
        </ul>
        <Link
          href="/editorial-policy"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          情報の作成方針を見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
