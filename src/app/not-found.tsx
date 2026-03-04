import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        ページが見つかりません
      </h2>
      <p className="text-gray-500 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-[var(--color-primary)] text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          トップページへ
        </Link>
        <Link
          href="/search"
          className="bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          記事を検索
        </Link>
      </div>
    </div>
  );
}
