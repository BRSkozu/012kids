import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約',
  description: '012.kidsの利用規約。サイトのご利用にあたっての注意事項と免責事項について。',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-primary)]">TOP</Link>
        <span>/</span>
        <span className="text-gray-400">利用規約</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>

      <div className="prose-like space-y-8 text-gray-700 text-sm leading-relaxed">
        <p>
          この利用規約（以下「本規約」）は、012.kids（以下「当サイト」）のご利用に関する条件を定めるものです。
          当サイトをご利用いただく場合、本規約に同意したものとみなします。
        </p>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. サイトの性質</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
            <p className="font-semibold text-orange-800 mb-1">重要</p>
            <p>
              当サイトは、子育て・教育に関する公的機関や専門家の情報をわかりやすくまとめて紹介する
              「情報まとめサイト」です。当サイトの記事は、各情報源の機関が監修・承認したものではありません。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 免責事項</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              当サイトに掲載された情報の正確性、完全性、有用性について、いかなる保証もいたしません。
              情報は予告なく変更・削除される場合があります。
            </li>
            <li>
              当サイトの情報を利用したことにより生じた損害について、当サイトは一切の責任を負いません。
            </li>
            <li>
              お子さまの健康や発達に関して心配がある場合は、必ず医師や専門家にご相談ください。
              当サイトの情報は医療行為の代替となるものではありません。
            </li>
            <li>
              当サイトからリンクする外部サイトの内容について、当サイトは責任を負いません。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 著作権</h2>
          <p>
            当サイトに掲載されている文章、画像、デザイン等のコンテンツの著作権は、
            当サイトまたは正当な権利を有する第三者に帰属します。
            私的利用の範囲を超えた無断転載・複製は禁止します。
          </p>
          <p className="mt-2">
            ただし、SNS等でのシェア・紹介については、当サイトへのリンクを明示していただければ歓迎いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. 禁止事項</h2>
          <p>当サイトのご利用にあたり、以下の行為を禁止します。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>当サイトのコンテンツを無断で営利目的に使用する行為</li>
            <li>当サイトの運営を妨害する行為</li>
            <li>他のユーザーや第三者の権利を侵害する行為</li>
            <li>虚偽の情報を用いてお問い合わせを行う行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. 情報の訂正・更新</h2>
          <p>
            当サイトは、掲載情報の正確性の維持に努めていますが、万が一誤りを発見された場合は、
            <Link href="/contact" className="text-[var(--color-primary)] hover:underline">お問い合わせページ</Link>
            よりご連絡ください。速やかに確認・対応いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. 規約の変更</h2>
          <p>
            当サイトは、必要に応じて本規約を変更することがあります。
            変更後の規約は、当ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. 準拠法</h2>
          <p>
            本規約の解釈は日本法に準拠するものとします。
          </p>
        </section>

        <p className="text-xs text-gray-400 mt-8">制定日: 2026年3月6日</p>
      </div>
    </div>
  );
}
