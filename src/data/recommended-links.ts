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
    title: 'こどもの発熱の対処法と解熱剤の正しい使い方',
    url: 'https://caps-clinic.jp/netsu/',
    org: 'キャップスクリニック（小児科）',
    description: '365日診療の小児科医が解説。発熱時の家庭ケア・解熱剤のタイミング・受診すべきサイン',
    categories: ['health'],
    tags: ['発熱', '受診目安', '小児科', '対処法'],
  },
  {
    title: '小学生の理想的な睡眠時間はどのくらい？',
    url: 'https://banno-clinic.biz/elementary-school-children-sleep/',
    org: '阪野クリニック（睡眠専門医）',
    description: '睡眠専門医が年齢別の推奨睡眠時間・就寝リズムの作り方を具体的に解説',
    categories: ['health', 'lifestyle'],
    tags: ['睡眠', '生活リズム', '小学生'],
  },
  {
    title: '寝る子は育つ～子どもにとって睡眠が大切な科学的理由',
    url: 'https://okubo-hayashi-clinic.com/archives/1121',
    org: '林クリニック（小児科）',
    description: '成長ホルモンと睡眠の関係、寝かしつけの具体的な工夫を科学的に解説',
    categories: ['health', 'development'],
    tags: ['睡眠', '成長', '生活リズム'],
  },

  // === 教育・学習 ===
  {
    title: '子どもの能力を伸ばす「絵本の読み聞かせ」効果とコツ',
    url: 'https://www.889100.com/column/column006.html',
    org: '学研教室',
    description: '文科省調査にも基づく読み聞かせの学力効果。年齢別のおすすめ絵本と読み方のコツ',
    categories: ['education', 'development'],
    tags: ['読み聞かせ', '絵本', '知育', '学力'],
  },
  {
    title: '【教育研究家に聞く】読み聞かせの効果&年齢別のコツ',
    url: 'https://uchi.tokyo-gas.co.jp/topics/5272',
    org: '東京ガス ウチコト',
    description: '教育研究家が0歳〜小学生まで年齢別の読み聞かせ方法と注意点を具体的にアドバイス',
    categories: ['education', 'development'],
    tags: ['読み聞かせ', '絵本', '年齢別'],
  },
  {
    title: '小学生の友達トラブル～サインを見逃さず対処するには',
    url: 'https://www.889100.com/column/column160.html',
    org: '学研教室',
    description: '友達関係のSOSサインの見分け方、親の介入タイミング、学校への相談方法を具体的に解説',
    categories: ['education', 'social', 'mental'],
    tags: ['友達', 'トラブル', '小学生', '対処法'],
  },

  // === 発達・成長 ===
  {
    title: '小学生の発達障害チェックリストやサポート方法',
    url: 'https://h-navi.jp/column/article/35030104',
    org: 'LITALICO発達ナビ',
    description: '発達障害の専門家が回答。年齢別の特徴チェックリストと家庭・学校でのサポート方法',
    categories: ['development', 'mental'],
    tags: ['発達障害', 'ADHD', '自閉症', 'ASD', 'チェックリスト'],
  },
  {
    title: '子供の発達障害の特徴は？種類別チェックリスト',
    url: 'https://shimokitamental.com/adhd-checklist-children/',
    org: 'メンタルクリニック下北沢',
    description: '精神科医がASD・ADHD・SLDの種類別に特徴と年齢ごとの気づきポイントを解説',
    categories: ['development', 'mental'],
    tags: ['発達障害', 'ADHD', '自閉症', 'ASD'],
  },

  // === 食育・栄養 ===
  {
    title: '離乳食の進め方とは？離乳食期別ポイント',
    url: 'https://boshieiyou.org/susumekata-rinyu/',
    org: '母子栄養協会（管理栄養士）',
    description: '管理栄養士が月齢別に食材の固さ・量・進め方を具体的に解説。初期〜完了期まで網羅',
    categories: ['nutrition'],
    tags: ['離乳食', '食材', '月齢', 'アレルギー'],
  },
  {
    title: '子どもの偏食や好き嫌いはどうする？解決策を管理栄養士が解説',
    url: 'https://boshieiyou.org/hensyoku-sukikirai/',
    org: '母子栄養協会（管理栄養士）',
    description: '偏食の原因と年齢別の具体的な克服方法。調理の工夫・食体験・スモールステップ法',
    categories: ['nutrition'],
    tags: ['偏食', '好き嫌い', '食育', '食材'],
  },
  {
    title: '親を悩ませる「子どもの偏食」改善のコツ',
    url: 'https://www.daiichisankyo-hc.co.jp/kenko-bijuku/articles/withclass/uneven-eating01/',
    org: '第一三共ヘルスケア',
    description: '管理栄養士監修。味付け・見た目・食環境の工夫で偏食を改善する実践テクニック',
    categories: ['nutrition', 'health'],
    tags: ['偏食', '好き嫌い', '栄養', 'レシピ'],
  },

  // === メンタル・心理 ===
  {
    title: 'わが子がいじめられたら？専門家が教える親の正しい関わり方',
    url: 'https://bookplus.nikkei.com/atcl/column/020200655/020300004/',
    org: '日経BOOKプラス',
    description: '米国精神科医の知見に基づく、いじめ発覚時の対応手順と子どもへの声かけ方法',
    categories: ['mental', 'social'],
    tags: ['いじめ', '対処法', '学校', 'メンタルヘルス'],
  },
  {
    title: '子育てストレス解消・メンタルケアのコツ7選',
    url: 'https://np-labo.com/archives/episode/202410kiji-04',
    org: 'NP-LABO（メンタルヘルス協会）',
    description: 'メンタルヘルスケア専門家が解説。ストレスの3つの予兆と、自宅でできる具体的な解消法',
    categories: ['mental'],
    tags: ['ストレス', 'メンタルヘルス', 'セルフケア'],
  },

  // === デジタル・メディア ===
  {
    title: '子どものスマホの時間制限をする方法とルール作り',
    url: 'https://comotto.docomo.ne.jp/family_smartphone/00000006-2/',
    org: 'comotto（NTTドコモ）',
    description: 'iPhone/Android別の具体的な設定手順と、年齢別のスマホルール作りのポイント',
    categories: ['digital'],
    tags: ['スマホ', '時間制限', 'ルール', 'ゲーム'],
  },
  {
    title: 'スマホやタブレットの「ルール」は？みんなの"我が家流"を紹介',
    url: 'https://kids.gakken.co.jp/parents/education/240422/',
    org: '学研キッズネット',
    description: '実際の家庭のスマホルール事例集。使用時間・場所・アプリなど具体的な約束ごと',
    categories: ['digital'],
    tags: ['スマホ', 'タブレット', 'ルール', 'ゲーム'],
  },
  {
    title: '総務省「インターネットトラブル事例集」',
    url: 'https://www.soumu.go.jp/main_sosiki/joho_tsusin/kyouiku_joho-ka/jireishu.html',
    org: '総務省',
    description: 'SNSいじめ・課金トラブル・個人情報流出など、実際に起きた子どものネットトラブル事例と対策',
    categories: ['digital'],
    tags: ['ネット', 'SNS', 'トラブル', 'スマホ'],
  },

  // === 社会・友達関係 ===
  {
    title: '子どもの友達関係は年齢で変わる！トラブルから守る対処法',
    url: 'https://benesse.jp/kosodate/202101/20210119-1.html',
    org: 'ベネッセ教育情報サイト',
    description: '低学年〜高学年で変化する友達関係の特徴と、親がすべきサポートを年齢別に解説',
    categories: ['social', 'mental'],
    tags: ['友達', 'トラブル', '小学生', '対処法'],
  },

  // === 妊娠・出産 ===
  {
    title: '【荻田医師監修】葉酸の働きとは？妊娠時に必要な理由と摂取量の目安',
    url: 'https://chirashi.akachan.jp/care/folic-acid/',
    org: 'アカチャンホンポ',
    description: '産婦人科医監修。妊娠時期別の葉酸推奨摂取量・多く含む食品・サプリの選び方',
    categories: ['pregnancy', 'health'],
    tags: ['妊娠', '葉酸', '栄養', 'サプリ'],
  },

  // === 生活・ライフスタイル ===
  {
    title: 'こどもの理想的な睡眠時間はどれくらい？文科省調査・国際比較',
    url: 'https://www.nishikawa1566.com/contents/min-iku/column/column02/',
    org: '西川（寝具メーカー）',
    description: '文科省・厚労省・OECDのデータに基づく年齢別推奨睡眠時間と、日本の子どもの睡眠の実態',
    categories: ['lifestyle', 'health'],
    tags: ['睡眠', '生活リズム', '年齢別'],
  },
  {
    title: 'トイレトレーニングはいつから？時期・やり方・進め方のコツ',
    url: 'https://shimajiro.benesse.ne.jp/contents/column/potty-training/',
    org: 'こどもちゃれんじ（ベネッセ）',
    description: '開始時期の目安サインからステップ別の進め方、うまくいかないときの対処法まで網羅',
    categories: ['lifestyle', 'development'],
    tags: ['トイレトレーニング', '1〜3歳', '生活習慣'],
  },
  {
    title: '歯磨きを嫌がる子供への対処法【1歳～6歳】年齢別アドバイス',
    url: 'https://mukae-dc.jp/brush-teeth/',
    org: 'むかえ歯科・小児歯科',
    description: '小児歯科医が年齢別の仕上げ磨きのコツ・嫌がる原因・歯ブラシの選び方を具体的に解説',
    categories: ['health', 'lifestyle'],
    tags: ['歯磨き', '仕上げ磨き', '虫歯予防', '対処法'],
  },

  // === 子どもの心・自己肯定感 ===
  {
    title: '子どもの自己肯定感がグンと高まる声かけと接し方のコツ',
    url: 'https://benesse.jp/kosodate/202403/20240316-1.html',
    org: 'ベネッセ教育情報サイト',
    description: '結果でなく過程を褒める・選ばせる・存在を認めるなど、具体的な声かけ例を多数紹介',
    categories: ['mental', 'development'],
    tags: ['自己肯定感', '声かけ', '褒め方', '子育て'],
  },
  {
    title: 'ひと言で子どものやる気を上げる「声かけ10選」',
    url: 'https://toyokeizai.net/articles/-/743749',
    org: '東洋経済オンライン',
    description: '自己肯定感が高まるポジティブな言葉。NG声かけとの比較で実践しやすい具体例',
    categories: ['mental', 'education'],
    tags: ['自己肯定感', '声かけ', 'やる気', '褒め方'],
  },

  // === プログラミング教育 ===
  {
    title: '小学校で必修化されたプログラミング教育の目的や狙いは？',
    url: 'https://kids.athuman.com/cecoe/articles/000261/',
    org: 'こども教育総合研究所',
    description: '何年生から？何を学ぶ？Scratchとは？学年別のアプローチ方法と家庭でできるサポート',
    categories: ['education', 'digital'],
    tags: ['プログラミング', '小学生', '必修化', 'Scratch'],
  },

  // === 予防接種 ===
  {
    title: '赤ちゃんの予防接種スケジュール',
    url: 'https://www.wakuchin.net/schedule/baby.html',
    org: 'ワクチン.net（MSD）',
    description: '生後2ヶ月からのワクチン接種順序・同時接種の組み合わせ・スケジュール自動作成ツール付き',
    categories: ['health'],
    tags: ['予防接種', 'ワクチン', 'スケジュール', '赤ちゃん'],
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
