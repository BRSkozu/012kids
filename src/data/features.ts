/**
 * Curated feature collections that group related articles around a theme
 * (region, season, deep-dive). Editorially-managed, separate from the
 * auto-generated category/tag/stage taxonomies.
 */

export type FeatureType = 'region' | 'seasonal' | 'deep-dive';

export interface Feature {
  id: string;
  slug: string;
  type: FeatureType;
  title: string;
  description: string;
  /** Hero image path under public/ (e.g. /photos/feature-tokyo-gakudo.webp) */
  image?: string;
  /** Article slugs in display order */
  articleSlugs: string[];
  tags?: string[];
  /** ISO date the feature was last meaningfully updated */
  updatedAt: string;
}

export const FEATURE_TYPE_LABELS: Record<FeatureType, string> = {
  region: '地域特集',
  seasonal: '季節特集',
  'deep-dive': '深掘り特集',
};

export const FEATURES: Feature[] = [
  {
    id: 'feat-tokyo-23ku-gakudo',
    slug: 'tokyo-23ku-gakudo',
    type: 'region',
    title: '東京都23区 学童保育徹底比較',
    description:
      '23区それぞれの放課後児童クラブ（学童保育）の制度・定員・待機・利用料を整理。共働き家庭の保活、入学準備、引越し検討に役立つ情報を集約しました。',
    image: '/photos/worry-gakudo.webp',
    articleSlugs: [
      'tokyo-23ku-gakudo-overview',
      'setagaya-gakudo-guide',
      'minato-gakudo-guide',
      'edogawa-gakudo-guide',
    ],
    tags: ['学童', '東京', '小1の壁', '共働き'],
    updatedAt: '2026-05-08',
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function getFeaturesByType(type: FeatureType): Feature[] {
  return FEATURES.filter((f) => f.type === type);
}
