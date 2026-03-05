import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-warm-bg)] border-t border-orange-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <span className="text-3xl font-bold text-[var(--color-primary)]">012</span>
              <span className="text-lg font-semibold text-gray-500">.kids</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              0歳から12歳の子どもに関わるすべての方へ。
              公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくまとめています。
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
                    className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
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
                    className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors"
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
                <Link href="/about" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                  このサイトについて
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                  編集方針
                </Link>
              </li>
              <li>
                <Link href="/experts" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                  編集部について
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                  お問い合わせ・訂正依頼
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} 012.kids All rights reserved.
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xl">
              当サイトは情報まとめサイトです。掲載情報は各種公的機関や専門家の発信をもとに編集部が独自にまとめたものであり、
              医療行為の代替となるものではありません。心配なことがあれば専門家にご相談ください。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
