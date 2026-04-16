import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import MilestoneTracker from '@/components/milestones/MilestoneTracker';

export const metadata: Metadata = {
  title: '発達マイルストーン・トラッカー',
  description:
    '0〜12歳までの代表的な発達の目安をチェックリスト形式で記録できます。お子さまひとりひとりの歩みを、そっと見守るツールです。',
  robots: { index: false, follow: false },
};

export default function MilestonesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '発達マイルストーン' }]} />
      <div className="mb-6">
        <h1
          className="text-3xl text-[var(--color-foreground)] mb-2"
          style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}
        >
          発達マイルストーン
        </h1>
        <p className="text-sm text-[var(--color-foreground-soft)] leading-relaxed">
          お子さまの「できるようになったこと」を記録しましょう。
          データはこの端末にのみ保存されます。
        </p>
      </div>
      <MilestoneTracker />
    </div>
  );
}
