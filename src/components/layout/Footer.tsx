import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-[var(--color-primary)]">012</span>
              <span className="text-lg font-semibold text-gray-600">.kids</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              0歳から12歳の子どもに関わるすべての大人に、
              偏りのない正確な最新の教育情報を届けます。
            </p>
          </div>

          {/* Age Stages */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">年齢別ガイド</h3>
            <ul className="space-y-2">
              {AGE_STAGES.map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/age-guide/${stage.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.label} ({stage.ageRange})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">カテゴリ</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/articles?category=${cat.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">サイト情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  012.kidsについて
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  編集方針
                </Link>
              </li>
              <li>
                <Link href="/experts" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  専門家紹介
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  お問い合わせ・訂正依頼
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} 012.kids All rights reserved.
            </p>
            <p className="text-xs text-gray-400 text-center">
              当サイトの情報は一般的な参考情報です。医療・健康に関する判断は必ず専門家にご相談ください。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
