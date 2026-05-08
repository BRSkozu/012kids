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
      'chiyoda-gakudo-guide',
      'shinagawa-gakudo-guide',
      'nakano-gakudo-guide',
    ],
    tags: ['学童', '東京', '小1の壁', '共働き'],
    updatedAt: '2026-05-08',
  },
  {
    id: 'feat-rainy-season-survival',
    slug: 'rainy-season-survival',
    type: 'seasonal',
    title: '梅雨を乗り切る子育て家庭の生活術',
    description:
      '6月の梅雨時期に役立つ子育てトピックを集約。室内遊び、湿気・カビ対策、雨の日の通学・送迎安全、健康管理を一通り押さえられる特集です。',
    image: '/photos/seasonal-summer.webp',
    articleSlugs: [
      'rainy-season-survival-overview',
      'rainy-season-indoor-play',
      'rainy-season-mold-prevention',
      'rainy-season-commute-safety',
    ],
    tags: ['梅雨', '季節', '子育て'],
    updatedAt: '2026-05-08',
  },
  {
    id: 'feat-sho1wall-deep-dive',
    slug: 'sho1wall-deep-dive',
    type: 'deep-dive',
    title: '「小1の壁」完全攻略：学習・生活・働き方の全体設計',
    description:
      '保育園から小学校への移行で起きる「小1の壁」を、学習・生活リズム・親の働き方の3軸で深掘り。共働き家庭が事前に準備すべきポイントをまとめた特集です。',
    image: '/photos/worry-sho1wall.webp',
    articleSlugs: [
      'sho1wall-complete-guide',
      'sho1wall-academic-prep',
      'sho1wall-routine-prep',
      'sho1wall-parent-work-prep',
    ],
    tags: ['小1の壁', '入学準備', '共働き', '学童'],
    updatedAt: '2026-05-08',
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function getFeaturesByType(type: FeatureType): Feature[] {
  return FEATURES.filter((f) => f.type === type);
}
