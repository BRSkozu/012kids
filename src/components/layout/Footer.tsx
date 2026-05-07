import Link from 'next/link';
import { AGE_STAGES } from '@/data/stages';
import { CATEGORIES } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-warm-bg)] border-t border-[var(--color-paper-edge)] mt-20 overflow-hidden">
      {/* Faint starry pattern to echo the hero */}
      <div className="absolute inset-0 starry-pattern opacity-40 pointer-events-none" />
      <div className="lamp-glow top-[-8rem] left-[10%] w-[24rem] h-[24rem] bg-[#F5D9B1] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-baseline gap-0.5 mb-4 group">
              <span
                className="text-3xl group-hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
              >
                <span className="text-[#A0C4FF]">0</span>
                <span className="text-[#7BC67E]">1</span>
                <span className="text-[var(--color-primary)]">2</span>
              </span>
              <span className="text-lg font-semibold text-[var(--color-foreground-muted)] group-hover:text-[var(--color-foreground-soft)] transition-colors">.kids</span>
            </Link>
            <p className="text-sm text-[var(--color-foreground-soft)] leading-[1.9]">
              検索したその時に、必要な答えが、ここに。
              <br />
              0歳から12歳の子育てに、そっと灯りを。
            </p>
            {/* Color bar representing all stages */}
            <div className="flex gap-1 mt-5">
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
            <h3
              className="mb-4 text-sm tracking-[0.18em] uppercase text-[var(--color-primary-dark)]"
              style={{ fontFamily: 'var(--font-gothic)', fontWeight: 600 }}
            >
              年齢別ガイド
            </h3>
            <ul className="space-y-2.5">
              {AGE_STAGES.map((stage) => (
                <li key={stage.id}>
                  <Link
                    href={`/age-guide/${stage.id}`}
                    className="text-sm text-[var(--color-foreground-soft)] hover:text-[var(--color-primary-dark)] transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full group-hover:scale-150 transition-transform duration-200"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span>{stage.label}</span>
                    <span className="text-xs text-[var(--color-foreground-muted)]">({stage.ageRange})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3
              className="mb-4 text-sm tracking-[0.18em] uppercase text-[var(--color-primary-dark)]"
              style={{ fontFamily: 'var(--font-gothic)', fontWeight: 600 }}
            >
              カテゴリ
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-sm text-[var(--color-foreground-soft)] hover:text-[var(--color-primary-dark)] transition-colors inline-flex items-center gap-1.5"
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
            <h3
              className="mb-4 text-sm tracking-[0.18em] uppercase text-[var(--color-primary-dark)]"
              style={{ fontFamily: 'var(--font-gothic)', fontWeight: 600 }}
            >
              サイト情報
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'このサイトについて' },
                { href: '/editorial-policy', label: '編集方針' },
                { href: '/editorial-team', label: '編集部について' },
                { href: '/contact', label: 'お問い合わせ・訂正依頼' },
                { href: '/privacy', label: 'プライバシーポリシー' },
                { href: '/terms', label: '利用規約' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-foreground-soft)] hover:text-[var(--color-primary-dark)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="sketch-divider mt-14 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-foreground-muted)] tracking-wide">
            &copy; {new Date().getFullYear()} 012.kids — All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-foreground-muted)] text-center max-w-xl leading-relaxed">
            情報まとめサイト · 公的機関や専門家の発信をもとに編集部が独自にまとめたもので、医療行為の代替にはなりません。
            心配なことがあれば専門家にご相談ください。
          </p>
        </div>
      </div>
    </footer>
  );
}
