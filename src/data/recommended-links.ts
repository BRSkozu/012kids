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
    url: 'https://www.cfa.go.jp/',
    org: '内閣府',
    description: '子どもの権利・福祉・支援に関する国の中心機関',
    categories: ['general', 'development', 'health', 'social', 'mental'],
  },
  {
    title: 'たまひよ',
    url: 'https://st.benesse.ne.jp/',
    org: 'ベネッセ',
    description: '妊娠・出産・育児の総合情報サイト。医師監修記事多数',
    categories: ['general', 'development', 'health', 'pregnancy'],
  },
  {
    title: 'ママリ',
    url: 'https://mamari.jp/',
    org: 'コネヒト',
    description: '3人に1人のママが利用する子育てQ&Aコミュニティ',
    categories: ['general', 'mental', 'social'],
  },
  {
    title: 'HugKum（はぐくむ）',
    url: 'https://hugkum.sho.jp/',
    org: '小学館',
    description: '乳幼児～小学生の子育て・学習情報メディア',
    categories: ['general', 'education', 'development'],
  },

  // === 教育・学習 ===
  {
    title: 'NHK for School',
    url: 'https://www.nhk.or.jp/school/',
    org: 'NHK',
    description: '約8,000本の無料教育動画。全教科対応',
    categories: ['education'],
  },
  {
    title: '文科省「たのしくまなび隊」',
    url: 'https://tanoshikumanabitai.mext.go.jp/',
    org: '文部科学省',
    description: '小学生向け学習支援ポータル。無料教材を集約',
    categories: ['education'],
  },
  {
    title: '学研キッズネット',
    url: 'https://kids.gakken.co.jp/',
    org: '学研',
    description: '自由研究500テーマ以上＋理科なぜなぜ110番',
    categories: ['education'],
  },
  {
    title: 'ちびむすドリル',
    url: 'https://happylilac.net/',
    org: 'パディンハウス',
    description: '月間200万訪問の国内最大級・無料プリント教材サイト',
    categories: ['education'],
  },
  {
    title: 'eboard（イーボード）',
    url: 'https://www.eboard.jp/',
    org: 'NPO法人eboard',
    description: '2,000本の動画授業＋10,000問のドリル。完全無料',
    categories: ['education'],
  },
  {
    title: 'ぷりんときっず',
    url: 'https://print-kids.net/',
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
  {
    title: '発達障害情報・支援センター',
    url: 'https://www.rehab.go.jp/ddis/',
    org: '国立障害者リハビリテーションセンター',
    description: '発達障害に関する信頼性の高い情報ハブ',
    categories: ['development', 'mental'],
    tags: ['発達障害', 'ADHD', '自閉症', 'ASD'],
  },

  // === 健康・医療 ===
  {
    title: '日本小児科学会',
    url: 'https://www.jpeds.or.jp/',
    org: '日本小児科学会',
    description: '予防接種スケジュール・子どもの健康ガイドライン',
    categories: ['health'],
  },
  {
    title: 'こどもの救急（ONLINE-QQ）',
    url: 'https://kodomo-qq.jp/',
    org: '日本小児科学会',
    description: '夜間休日の症状チェック。病院に行くべきか判断できる',
    categories: ['health'],
    tags: ['発熱', '嘔吐', '急病', '救急'],
  },
  {
    title: 'KNOW-VPD!',
    url: 'https://www.know-vpd.jp/',
    org: '「VPDを知って、子どもを守ろう。」の会',
    description: '予防接種の最新スケジュール・ワクチン情報',
    categories: ['health'],
    tags: ['予防接種', 'ワクチン'],
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
    title: 'ソラレピ 食育レシピ',
    url: 'https://recipe.shidax.co.jp/',
    org: 'シダックス',
    description: '管理栄養士が作った保育園給食レシピ（0〜9歳対象）',
    categories: ['nutrition'],
    tags: ['レシピ', '給食', '食材', '献立'],
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
    url: 'https://www.dietitian.or.jp/',
    org: '日本栄養士会',
    description: '管理栄養士による子どもの栄養相談・食事指導情報',
    categories: ['nutrition', 'health'],
    tags: ['栄養', '偏食', '食育', '肥満', '痩せ'],
  },

  // === メンタル・心理 ===
  {
    title: 'チャイルドライン',
    url: 'https://childline.or.jp/',
    org: 'チャイルドライン支援センター',
    description: '18歳以下の子ども専用相談ダイヤル',
    categories: ['mental'],
    tags: ['いじめ', '相談', '不安', 'ストレス'],
  },
  {
    title: '不登校オンライン',
    url: 'https://futoko-online.jp/',
    org: 'キズキ',
    description: '不登校の子ども・保護者向け情報メディア。体験談・相談先・イベント情報',
    categories: ['mental'],
    tags: ['不登校', '登校しぶり', '学校'],
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
  {
    title: 'e-ネットキャラバン',
    url: 'https://www3.fmmc.or.jp/e-netcaravan/',
    org: '総務省・文科省',
    description: 'ネット安全教室の情報と教材',
    categories: ['digital'],
    tags: ['ネット', 'リテラシー', '安全'],
  },

  // === 社会・環境 ===
  {
    title: 'いこーよ',
    url: 'https://iko-yo.net/',
    org: 'アクトインディ',
    description: '親子おでかけ情報No.1サイト。無料スポット検索も',
    categories: ['social', 'general'],
    tags: ['おでかけ', '遊び場', '体験'],
  },
  {
    title: '放課後たのしーと',
    url: 'https://houkago.gakken.jp/',
    org: '学研',
    description: '学童向け無料あそび＆まなびプリント。1,200以上のコンテンツ',
    categories: ['education', 'social'],
  },
  {
    title: '学研「家で勉強しよう」',
    url: 'https://ieben.gakken.jp/',
    org: '学研',
    description: '全学年対応の無料ドリル・参考書ページ',
    categories: ['education'],
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
