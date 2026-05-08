import Link from 'next/link';
import {
  GAKUDO_DATA,
  MODEL_TYPE_LABELS,
  MODEL_TYPE_DESCRIPTIONS,
  type GakudoWardData,
  type GakudoModelType,
} from '@/data/gakudo';

const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

const MODEL_TYPE_BADGE_CLASS: Record<GakudoModelType, string> = {
  hybrid: 'bg-blue-50 text-blue-700 border border-blue-200',
  unified: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  standard: 'bg-amber-50 text-amber-700 border border-amber-200',
  unknown: 'bg-gray-50 text-gray-600 border border-gray-200',
};

function ModelBadge({ type }: { type: GakudoModelType }) {
  return (
    <span
      title={MODEL_TYPE_DESCRIPTIONS[type]}
      className={`inline-block whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full ${MODEL_TYPE_BADGE_CLASS[type]}`}
    >
      {MODEL_TYPE_LABELS[type]}
    </span>
  );
}

function WardRow({ ward }: { ward: GakudoWardData }) {
  const cell = 'px-3 py-3 text-sm text-[var(--color-foreground)] align-top';
  const muted = 'text-[var(--color-foreground-muted)]';

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-warm-cream)]/50 transition-colors">
      <td className={`${cell} font-medium whitespace-nowrap`}>
        {ward.articleSlug ? (
          <Link
            href={`${bp}/articles/${ward.articleSlug}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            {ward.ward}
          </Link>
        ) : (
          <span>{ward.ward}</span>
        )}
      </td>
      <td className={cell}>
        <div className="space-y-1">
          <div>{ward.programName}</div>
          <ModelBadge type={ward.modelType} />
        </div>
      </td>
      <td className={`${cell} ${muted} whitespace-nowrap`}>
        {ward.monthlyFee || '—'}
      </td>
      <td className={`${cell} ${muted} whitespace-nowrap`}>
        {ward.weekdayEnd || '—'}
      </td>
      <td className={`${cell} ${muted}`}>{ward.gradeRange || '—'}</td>
      <td className={cell}>
        <div className="flex flex-col gap-1">
          {ward.articleSlug && (
            <Link
              href={`${bp}/articles/${ward.articleSlug}`}
              className="inline-block text-xs text-[var(--color-primary)] hover:underline whitespace-nowrap"
            >
              012.kids 解説 →
            </Link>
          )}
          <a
            href={ward.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-[var(--color-foreground-soft)] hover:underline whitespace-nowrap"
          >
            区公式 ↗
          </a>
        </div>
      </td>
    </tr>
  );
}

export default function GakudoComparisonTable() {
  const withArticles = GAKUDO_DATA.filter((w) => w.articleSlug);
  const withoutArticles = GAKUDO_DATA.filter((w) => !w.articleSlug);

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="bg-[var(--color-warm-cream)] rounded-lg p-4 text-sm">
        <p className="font-medium text-[var(--color-foreground)] mb-2">
          制度モデルの3タイプ
        </p>
        <ul className="space-y-1 text-[var(--color-foreground-muted)]">
          <li>
            <ModelBadge type="hybrid" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.hybrid}</span>
          </li>
          <li>
            <ModelBadge type="unified" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.unified}</span>
          </li>
          <li>
            <ModelBadge type="standard" />
            <span className="ml-2">{MODEL_TYPE_DESCRIPTIONS.standard}</span>
          </li>
        </ul>
      </div>

      {/* Articles section */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3">
          012.kids で詳しく解説中の区（{withArticles.length}区）
        </h3>
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full min-w-[840px]">
            <thead className="bg-[var(--color-warm-cream)]">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                  区
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)]">
                  制度・モデル
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                  利用料目安
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                  平日終了
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                  対象学年
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                  リンク
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {withArticles.map((w) => (
                <WardRow key={w.wardSlug} ward={w} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other wards */}
      {withoutArticles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-3">
            その他の区（{withoutArticles.length}区・順次拡充予定）
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[var(--color-warm-cream)]">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                    区
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)]">
                    制度・モデル
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)]">
                    補足
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--color-foreground-soft)] whitespace-nowrap">
                    リンク
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {withoutArticles.map((w) => (
                  <tr
                    key={w.wardSlug}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-warm-cream)]/50 transition-colors"
                  >
                    <td className="px-3 py-3 text-sm font-medium whitespace-nowrap">
                      {w.ward}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="space-y-1">
                        <div>{w.programName}</div>
                        <ModelBadge type={w.modelType} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--color-foreground-muted)]">
                      {w.notes || '—'}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <a
                        href={w.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-foreground-soft)] hover:underline whitespace-nowrap"
                      >
                        区公式 ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-[var(--color-foreground-muted)] leading-relaxed">
        ※ 利用料・時間・対象学年は各区の運用変更で更新されることがあります。
        最新情報は必ず各区公式サイトでご確認ください。012.kids
        は編集時点の公開情報を整理した参考情報です。
      </div>
    </div>
  );
}
