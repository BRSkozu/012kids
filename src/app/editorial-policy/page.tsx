import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '編集方針',
  description: '012.kidsの編集方針。情報まとめサイトとしての透明性と信頼性を確保するための編集ポリシーです。',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">編集方針</h1>
      <p className="text-gray-500 mb-8">
        012.kidsが情報まとめサイトとして、透明性と信頼性を確保するために定めた編集ポリシーです。
      </p>

      {/* Site nature clarification */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-2">当サイトの位置づけ</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          012.kidsは、公的機関や専門家の発信する子育て・教育情報を、わかりやすくまとめて紹介する「情報まとめサイト」です。
          掲載記事は編集部が各種情報源をもとに独自にまとめたものであり、
          引用元の機関が当サイトの記事を監修・承認したものではありません。
        </p>
      </div>

      <div className="space-y-8">
        {/* Principle 1 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">1</span>
            参考情報の明示
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            すべての記事に「参考にした情報」を明記します。
            読者が元の情報に直接アクセスし、内容を検証できる透明性を確保します。
            なお、参考元として記載した機関が当サイトの記事を承認しているわけではありません。
          </p>
        </section>

        {/* Principle 2 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">2</span>
            スポンサーとの独立性
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            商品・サービス名を記事中に出す場合、編集部とスポンサー関係の独立性を明示します。
            広告コンテンツには必ず「PR」表記を行い、記事コンテンツと明確に区別します。
          </p>
        </section>

        {/* Principle 3 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">3</span>
            医療情報に関する免責
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            医療・健康に関する記事には、必ず「この情報は一般的な参考情報であり、
            個別の医療アドバイスではありません」という趣旨の免責事項を明記します。
            当サイトは医療行為の代替となるものではありません。
          </p>
        </section>

        {/* Principle 4 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">4</span>
            多様なアプローチの提示
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            特定の教育方法・しつけ方法を「唯一の正解」として提示しません。
            複数のアプローチを並べて紹介し、読者がご自身の状況に合った方法を選択できるようにします。
          </p>
        </section>

        {/* Principle 5 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">5</span>
            品質スコアによる記事評価
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            アクセス数ではなく「品質スコア」で記事の優先表示を決定します。
            信頼性・中立性・新規性・年齢適合性・読みやすさの5軸で評価を行います。
          </p>
        </section>

        {/* Principle 6 */}
        <section className="bg-white rounded-xl border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">6</span>
            誤り・訂正への対応
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            記事の内容に誤りや古い情報が含まれている場合は、速やかに訂正します。
            読者からの指摘や訂正依頼にも真摯に対応いたします。
          </p>
        </section>
      </div>

      {/* Quality Score */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">品質スコアリング</h2>
        <p className="text-gray-600 text-sm mb-6">
          各記事は以下の5軸で評価し、重み付きスコアを算出します。
        </p>
        <div className="bg-[var(--color-warm-cream)] rounded-xl p-6">
          <div className="space-y-4">
            {[
              { label: '信頼性・参考元', weight: '30%', desc: '公的機関・学会・専門家の情報を参考にしているか。' },
              { label: '中立性・偏り', weight: '25%', desc: '商業的バイアス・特定商品誘導・極端な主張がないか。' },
              { label: '新規性・鮮度', weight: '20%', desc: '最新の情報を反映しているか。医療情報は定期的に見直し。' },
              { label: '年齢適合性', weight: '15%', desc: '対象年齢が明確で、内容が年齢帯に合っているか。' },
              { label: '読みやすさ', weight: '10%', desc: 'わかりやすい言葉で書かれているか。' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-sm font-bold text-[var(--color-primary)] bg-orange-50 px-2 py-1 rounded shrink-0">
                  {item.weight}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200 text-sm text-gray-500">
            <p>70点以上: 掲載 / 50〜69点: 編集部レビュー後に判断 / 49点以下: 非掲載</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div className="mt-12 text-center bg-orange-50 rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-3">
          記事の誤りや改善のご提案がありましたらお知らせください
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          訂正依頼・お問い合わせ
        </Link>
      </div>
    </div>
  );
}
