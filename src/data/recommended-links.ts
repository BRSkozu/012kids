export interface RecommendedLink {
  title: string;
  url: string;
  org: string;
  description: string;
  categories: string[]; // matching ContentCategory ids + 'general' + 'pregnancy'
  tags?: string[]; // fine-grained topic tags for better article matching
}

export const RECOMMENDED_LINKS: RecommendedLink[] = [
  // === 総合・子育て全般 ===
  {
    title: 'こども家庭庁',
    url: 'https://www.cfa.go.jp/policies/childrights',
    org: '内閣府',
    description: '子どもの権利・福祉・支援に関する国の中心機関',
    categories: ['general', 'development', 'health', 'social', 'mental'],
  },
  {
    title: 'たまひよ',
    url: 'https://st.benesse.ne.jp/ikuji/ranking/',
    org: 'ベネッセ',
    description: '妊娠・出産・育児の総合情報サイト。医師監修記事多数',
    categories: ['general', 'development', 'health', 'pregnancy'],
  },
  {
    title: 'HugKum（はぐくむ）',
    url: 'https://hugkum.sho.jp/series',
    org: '小学館',
    description: '乳幼児～小学生の子育て・学習情報メディア',
    categories: ['general', 'education', 'development'],
  },

  // === 教育・学習 ===
  {
    title: 'NHK for School',
    url: 'https://www.nhk.or.jp/school/program/',
    org: 'NHK',
    description: '約8,000本の無料教育動画。全教科対応',
    categories: ['education'],
  },
  {
    title: '学研キッズネット',
    url: 'https://kids.gakken.co.jp/jiyuu/',
    org: '学研',
    description: '自由研究500テーマ以上＋理科なぜなぜ110番',
    categories: ['education'],
  },
  {
    title: 'ちびむすドリル',
    url: 'https://happylilac.net/kisetsu-sozai.html',
    org: 'パディンハウス',
    description: '月間200万訪問の国内最大級・無料プリント教材サイト',
    categories: ['education'],
  },
  {
    title: 'eboard（イーボード）',
    url: 'https://www.eboard.jp/list/',
    org: 'NPO法人eboard',
    description: '2,000本の動画授業＋10,000問のドリル。完全無料',
    categories: ['education'],
  },
  {
    title: 'ぷりんときっず',
    url: 'https://print-kids.net/print/',
    org: 'ぷりんときっず',
    description: '幼児～小3向け無料プリント。ひらがな・計算ドリル充実',
    categories: ['education'],
  },

  // === 発達・成長 ===
  {
    title: 'ベネッセ「体の発達・こころの発達」',
    url: 'https://benesse.jp/contents/clinic/basic/',
    org: 'ベネッセ',
    description: '臨床心理士監修の年齢別発達ガイド',
    categories: ['development'],
  },

  // === 健康・医療 ===
  {
    title: '日本小児科学会',
    url: 'https://www.jpeds.or.jp/modules/activity/index.php?content_id=138',
    org: '日本小児科学会',
    description: '予防接種スケジュール・子どもの健康ガイドライン',
    categories: ['health'],
  },

  // === 食育・栄養 ===
  {
    title: '農水省「子どもの食育」',
    url: 'https://www.maff.go.jp/j/syokuiku/kodomo_navi/',
    org: '農林水産省',
    description: '栄養バランス・食の安全の公式ポータル',
    categories: ['nutrition'],
    tags: ['食育', '栄養', '食材'],
  },
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
    title: '食品安全委員会「お子さまの食事」',
    url: 'https://www.fsc.go.jp/kids-box/',
    org: '食品安全委員会',
    description: '子どもの食品安全に関する情報をわかりやすく解説',
    categories: ['nutrition'],
    tags: ['食材', 'アレルギー', '食品安全', '添加物'],
  },
  {
    title: '消費者庁「食物アレルギー」',
    url: 'https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/',
    org: '消費者庁',
    description: '食物アレルギー表示制度と注意すべきアレルゲン情報',
    categories: ['nutrition', 'health'],
    tags: ['アレルギー', '食材', '卵', '乳', '小麦'],
  },
  {
    title: '日本食品標準成分表',
    url: 'https://www.mext.go.jp/a_menu/syokuhinseibun/',
    org: '文部科学省',
    description: '食品ごとの栄養成分データベース。離乳食・幼児食の栄養計算に',
    categories: ['nutrition'],
    tags: ['栄養', '鉄分', 'カルシウム', 'ビタミン', 'DHA'],
  },
  {
    title: 'パルシステム「離乳食レシピ」',
    url: 'https://kosodate.pal-system.co.jp/recipe/',
    org: 'パルシステム',
    description: '月齢別の離乳食・幼児食レシピ。管理栄養士監修',
    categories: ['nutrition'],
    tags: ['離乳食', 'レシピ', '食材', '月齢', '幼児食'],
  },
  {
    title: 'ベビーカレンダー「離乳食レシピ」',
    url: 'https://baby-calendar.jp/baby-food-recipe',
    org: 'ベビーカレンダー',
    description: '管理栄養士監修の月齢別・食材別の離乳食レシピが1,000件以上',
    categories: ['nutrition'],
    tags: ['離乳食', 'レシピ', '食材', '献立', '月齢'],
  },
  {
    title: '和光堂「離乳食の進め方」',
    url: 'https://community.wakodo.co.jp/community/babyfood/',
    org: '和光堂（アサヒグループ食品）',
    description: '離乳食の月齢別ガイド・食材チェックリスト付き',
    categories: ['nutrition'],
    tags: ['離乳食', '食材', '月齢'],
  },
  {
    title: '日本栄養士会「子どもの食と栄養」',
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

  // === 社会・環境 ===
  {
    title: 'いこーよ',
    url: 'https://iko-yo.net/facilities?tags%5B%5D=%E7%84%A1%E6%96%99',
    org: 'アクトインディ',
    description: '親子おでかけ情報No.1サイト。無料スポット検索も',
    categories: ['social', 'general'],
    tags: ['おでかけ', '遊び場', '体験'],
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
