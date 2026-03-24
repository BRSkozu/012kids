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
            <Link href="/" className="inline-flex items-baseline gap-0.5 mb-4 group">
              <span className="text-3xl font-bold text-[var(--color-primary)] group-hover:opacity-80 transition-opacity">012</span>
              <span className="text-lg font-semibold text-gray-400 group-hover:text-gray-500 transition-colors">.kids</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              0歳から12歳の子どもに関わるすべての方へ。
              公的機関や専門家の情報をもとに、子育てに役立つ情報をわかりやすくまとめています。
            </p>
            {/* Color bar representing all stages */}
            <div className="flex gap-1 mt-4">
              {AGE_STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className="h-1 flex-1 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
              ))}
            </div>
          </div>

          {/* Age Stages */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">年齢別ガイド</h3>
            <ul className="space-y-2.5">
              {AGE_STAGES.map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/age-guide/${stage.id}`}
                    className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform duration-200"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span>{stage.label}</span>
                    <span className="text-xs text-gray-400">({stage.ageRange})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">カテゴリ</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-xs">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">サイト情報</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'このサイトについて' },
                { href: '/editorial-policy', label: '編集方針' },
                { href: '/experts', label: '編集部について' },
                { href: '/contact', label: 'お問い合わせ・訂正依頼' },
                { href: '/privacy', label: 'プライバシーポリシー' },
                { href: '/terms', label: '利用規約' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} 012.kids All rights reserved.
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xl leading-relaxed">
              当サイトは情報まとめサイトです。掲載情報は各種公的機関や専門家の発信をもとに編集部が独自にまとめたものであり、
              医療行為の代替となるものではありません。心配なことがあれば専門家にご相談ください。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
