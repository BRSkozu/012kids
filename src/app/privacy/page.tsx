import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '012.kidsのプライバシーポリシー。個人情報の取り扱い、Cookieの利用、アクセス解析について。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--color-foreground-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-primary-dark)]">TOP</Link>
        <span>/</span>
        <span className="text-[var(--color-foreground-muted)]">プライバシーポリシー</span>
      </nav>

      <h1 className="text-3xl text-[var(--color-foreground)] mb-8" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>プライバシーポリシー</h1>

      <div className="prose-like space-y-8 text-[var(--color-foreground)] text-sm leading-relaxed">
        <p>
          012.kids（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
          本プライバシーポリシーは、当サイトにおける個人情報の取り扱いについて定めるものです。
        </p>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>1. 収集する情報</h2>
          <p>当サイトでは、以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>お問い合わせフォームに入力された氏名・メールアドレス・お問い合わせ内容</li>
            <li>アクセスログ（IPアドレス、ブラウザの種類、アクセス日時など）</li>
            <li>Cookieを通じて取得する閲覧情報</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>2. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Google アナリティクス」を使用しています。
            Google アナリティクスはデータの収集のためにCookieを使用しています。
            このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p className="mt-2">
            この機能はCookieを無効にすることで収集を拒否することができますので、
            お使いのブラウザの設定をご確認ください。
            Google アナリティクスの利用規約については、
            <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-dark)] hover:underline">Google アナリティクス利用規約</a>
            をご参照ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>3. Cookieについて</h2>
          <p>
            当サイトでは、ユーザーの利便性向上やアクセス状況の分析のためにCookieを使用しています。
            Cookieとは、ウェブサイトがユーザーのブラウザに保存する小さなテキストファイルです。
          </p>
          <p className="mt-2">
            ブラウザの設定により、Cookieの受け入れを拒否することが可能です。
            ただし、一部の機能が正常に動作しなくなる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>4. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的でのみ利用します。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>お問い合わせへの回答・対応</li>
            <li>サイトの改善・品質向上のための分析</li>
            <li>不正アクセスの防止</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>5. 個人情報の第三者提供</h2>
          <p>
            当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>6. 個人情報の安全管理</h2>
          <p>
            当サイトは、個人情報の漏洩、滅失、毀損を防止するために、適切な安全管理措置を講じています。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>7. お子さまの個人情報について</h2>
          <p>
            当サイトは子育て情報サイトとして、お子さまの個人情報の保護を特に重視しています。
            13歳未満のお子さまから意図的に個人情報を収集することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>8. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
            変更後のプライバシーポリシーは、当ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg text-[var(--color-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>9. お問い合わせ</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは、
            <Link href="/contact" className="text-[var(--color-primary-dark)] hover:underline">お問い合わせページ</Link>
            よりご連絡ください。
          </p>
        </section>

        <p className="text-xs text-[var(--color-foreground-muted)] mt-8">制定日: 2026年3月6日</p>
      </div>
    </div>
  );
}
