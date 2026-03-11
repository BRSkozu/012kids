export interface RecommendedLink {
  title: string;
  url: string;
  org: string;
  description: string;
  categories: string[]; // matching ContentCategory ids + 'general' + 'pregnancy'
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
    url: 'https://benesse.jp/kosodate/',
    org: 'ベネッセ',
    description: '臨床心理士監修の年齢別発達ガイド',
    categories: ['development'],
  },
  {
    title: '発達障害情報・支援センター',
    url: 'http://www.rehab.go.jp/ddis/',
    org: '国立障害者リハビリテーションセンター',
    description: '発達障害に関する信頼性の高い情報ハブ',
    categories: ['development', 'mental'],
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
    url: 'http://kodomo-qq.jp/',
    org: '日本小児科学会',
    description: '夜間休日の症状チェック。病院に行くべきか判断できる',
    categories: ['health'],
  },
  {
    title: 'KNOW-VPD!',
    url: 'https://www.know-vpd.jp/',
    org: '「VPDを知って、子どもを守ろう。」の会',
    description: '予防接種の最新スケジュール・ワクチン情報',
    categories: ['health'],
  },

  // === 食育・栄養 ===
  {
    title: '農水省「子どもの食育」',
    url: 'https://www.maff.go.jp/j/syokuiku/kodomo_navi/',
    org: '農林水産省',
    description: '栄養バランス・食の安全の公式ポータル',
    categories: ['nutrition'],
  },
  {
    title: '文科省「たのしい食事つながる食育」',
    url: 'https://www.mext.go.jp/a_menu/shotou/eiyou/syokuseikatsu.htm',
    org: '文部科学省',
    description: '小学生向け食育教材が無料ダウンロード可能',
    categories: ['nutrition'],
  },
  {
    title: 'ソラレピ 食育レシピ',
    url: 'https://recipe.shidax.co.jp/',
    org: 'シダックス',
    description: '管理栄養士が作った保育園給食レシピ（0〜9歳対象）',
    categories: ['nutrition'],
  },

  // === メンタル・心理 ===
  {
    title: 'チャイルドライン',
    url: 'https://childline.or.jp/',
    org: 'チャイルドライン支援センター',
    description: '18歳以下の子ども専用相談ダイヤル',
    categories: ['mental'],
  },
  {
    title: '不登校新聞',
    url: 'https://futoko.publishers.fm/',
    org: '全国不登校新聞社',
    description: '不登校の子ども・保護者向け情報メディア',
    categories: ['mental'],
  },

  // === デジタル・メディア ===
  {
    title: '総務省「インターネットトラブル事例集」',
    url: 'https://www.soumu.go.jp/main_sosiki/joho_tsusin/kyouiku_joho-ka/jireishu.html',
    org: '総務省',
    description: '子どものネットトラブル実例と対策集',
    categories: ['digital'],
  },
  {
    title: 'e-ネットキャラバン',
    url: 'https://www.e-netcaravan.jp/',
    org: '総務省・文科省',
    description: 'ネット安全教室の情報と教材',
    categories: ['digital'],
  },

  // === 社会・環境 ===
  {
    title: 'いこーよ',
    url: 'https://iko-yo.net/',
    org: 'アクトインディ',
    description: '親子おでかけ情報No.1サイト。無料スポット検索も',
    categories: ['social', 'general'],
  },
  {
    title: '朝日新聞「放課後たのしーと」',
    url: 'https://houkago.asahi.com/',
    org: '朝日新聞×東京学芸大',
    description: '低学年向け無料あそび＆まなびプリント',
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
 * Get recommended links for an article based on its categories.
 * Returns up to `count` links, prioritizing exact category matches.
 */
export function getRecommendedLinks(
  articleCategories: string[],
  count: number = 10
): RecommendedLink[] {
  // Score each link by how many categories match
  const scored = RECOMMENDED_LINKS.map((link) => {
    const matchCount = link.categories.filter(
      (c) => articleCategories.includes(c) || c === 'general'
    ).length;
    return { link, matchCount };
  });

  // Sort by match count desc, then stable order
  scored.sort((a, b) => b.matchCount - a.matchCount);

  // Filter to only those with at least one match
  return scored
    .filter((s) => s.matchCount > 0)
    .slice(0, count)
    .map((s) => s.link);
}
