export interface RecommendedLink {
  title: string;
  url: string;
  org: string;
  description: string;
  categories: string[]; // matching ContentCategory ids + 'general' + 'pregnancy'
  tags?: string[]; // fine-grained topic tags for better article matching
}

export const RECOMMENDED_LINKS: RecommendedLink[] = [
  // === 健康・医療 ===
  {
    title: '日本小児科学会「知っておきたいわくちん情報」',
    url: 'https://www.jpeds.or.jp/modules/activity/index.php?content_id=138',
    org: '日本小児科学会',
    description: '予防接種スケジュールと各ワクチンの詳細解説',
    categories: ['health'],
    tags: ['予防接種', 'ワクチン'],
  },

  // === 食育・栄養 ===
  {
    title: '文科省「たのしい食事つながる食育」',
    url: 'https://www.mext.go.jp/a_menu/shotou/eiyou/syokuseikatsu.htm',
    org: '文部科学省',
    description: '小学生向け食育教材が無料ダウンロード可能',
    categories: ['nutrition'],
    tags: ['食育', '給食'],
  },
  {
    title: '厚生労働省「授乳・離乳の支援ガイド」',
    url: 'https://www.mhlw.go.jp/stf/newpage_04250.html',
    org: '厚生労働省',
    description: '月齢別の離乳食進め方・食材一覧の公式ガイドライン',
    categories: ['nutrition'],
    tags: ['離乳食', '食材', '月齢', 'アレルギー', '母乳', 'ミルク'],
  },
  {
    title: '消費者庁「食物アレルギー表示」',
    url: 'https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/',
    org: '消費者庁',
    description: '食物アレルギー表示制度と注意すべきアレルゲン情報',
    categories: ['nutrition', 'health'],
    tags: ['アレルギー', '食材', '卵', '乳', '小麦'],
  },
  {
    title: '日本栄養士会「小児栄養専門」',
    url: 'https://www.dietitian.or.jp/career/specialcertifications/pediatricnutrition/',
    org: '日本栄養士会',
    description: '管理栄養士による子どもの栄養相談・食事指導情報',
    categories: ['nutrition', 'health'],
    tags: ['栄養', '偏食', '食育', '肥満', '痩せ'],
  },

  // === デジタル・メディア ===
  {
    title: '総務省「インターネットトラブル事例集」',
    url: 'https://www.soumu.go.jp/main_sosiki/joho_tsusin/kyouiku_joho-ka/jireishu.html',
    org: '総務省',
    description: '子どものネットトラブル実例と対策集',
    categories: ['digital'],
    tags: ['ネット', 'SNS', 'トラブル', 'スマホ'],
  },
];

/**
 * Get recommended links for an article based on its categories and tags.
 * Prioritizes tag matches (specific relevance) over category matches (general relevance).
 * Returns up to `count` links.
 */
export function getRecommendedLinks(
  articleCategories: string[],
  count: number = 10,
  articleTags: string[] = []
): RecommendedLink[] {
  const scored = RECOMMENDED_LINKS.map((link) => {
    // Category match: +1 per matching category
    const categoryScore = link.categories.filter(
      (c) => articleCategories.includes(c)
    ).length;

    // Tag match: +3 per matching tag (tags are more specific = higher weight)
    const tagScore = (link.tags ?? []).filter(
      (t) => articleTags.some((at) => at.includes(t) || t.includes(at))
    ).length * 3;

    // 'general' category gives a small boost
    const generalBoost = link.categories.includes('general') ? 0.5 : 0;

    return { link, score: categoryScore + tagScore + generalBoost };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter((s) => s.score > 0)
    .slice(0, count)
    .map((s) => s.link);
}
