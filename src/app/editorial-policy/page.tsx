import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '編集方針',
  description: '012.kidsの編集方針。中立性・科学的根拠・最新性・安全性・多様性の5原則に基づく情報提供ポリシー。',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">編集方針</h1>
      <p className="text-gray-500 mb-8">
        012.kidsが情報の中立性と信頼性を担保するために定めた編集ポリシーです。
      </p>

      <div className="prose max-w-none space-y-8">
        {/* Principle 1 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">1</span>
            出典の明示
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            すべての記事は必ず「情報元URL・発行機関・発行日」を明示します。
            読者が元の情報に直接アクセスし、内容を検証できる透明性を確保します。
          </p>
        </section>

        {/* Principle 2 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
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
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">3</span>
            医療情報の免責事項
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            医療情報には必ず「この情報は一般的な参考情報です。診断・治療は必ず医師に相談ください」
            の免責事項を明記します。当サイトは医療行為の代替となるものではありません。
          </p>
        </section>

        {/* Principle 4 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">4</span>
            多元的アプローチの提示
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            特定の教育方法・しつけ方法を「唯一の正解」として提示しません。
            複数のアプローチを並列提示し、読者が自らの状況に合った方法を選択できるようにします。
          </p>
        </section>

        {/* Principle 5 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">5</span>
            有用性スコアによる優先表示
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            アクセス数・閲覧数ではなく「有用性スコア」で記事の優先表示を決定します。
            信頼性・中立性・新規性・年齢適合性・読みやすさの5軸で自動評価を行います。
          </p>
        </section>

        {/* Principle 6 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold">6</span>
            外部有識者レビュー
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            年1回の外部有識者による「編集方針レビュー」を実施し、結果を公開します。
            第三者の目による評価を通じて、継続的な改善を行います。
          </p>
        </section>
      </div>

      {/* Quality Score */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">品質スコアリング</h2>
        <p className="text-gray-600 text-sm mb-6">
          各記事は以下の5軸で自動評価し、重み付きスコアを算出します。
        </p>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="space-y-4">
            {[
              { label: '信頼性・出典', weight: '30%', desc: '政府機関・学会・査読済み論文の引用。著者の専門性。' },
              { label: '中立性・偏り', weight: '25%', desc: '商業的バイアス・特定商品誘導・極端な主張の有無。' },
              { label: '新規性・鮮度', weight: '20%', desc: '公開・更新日。医療情報は3年以内を優先。' },
              { label: '年齢適合性', weight: '15%', desc: '対象年齢の明記。内容の年齢帯合致度。' },
              { label: '読みやすさ', weight: '10%', desc: '平易な日本語。図表・画像の活用。' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-sm font-bold text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded shrink-0">
                  {item.weight}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>70点以上: 自動掲載 / 50〜69点: 編集者レビュー / 49点以下: 非掲載</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div className="mt-12 text-center bg-yellow-50 rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-3">
          記事の誤りや改善提案がありましたらお知らせください
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
