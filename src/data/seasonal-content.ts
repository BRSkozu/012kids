/**
 * 季節コンテンツ定義
 * 月ごとにテーマ・関連タグ・表示テキストを管理し、
 * 該当する記事を自動でピックアップする仕組み。
 */

export interface SeasonalTheme {
  /** 対象月（1-12） */
  months: number[];
  /** テーマ名 */
  title: string;
  /** サブタイトル */
  subtitle: string;
  /** テーマの背景色（グラデーション） */
  gradient: string;
  /** アイコン */
  icon: string;
  /** テキスト色 */
  textColor: string;
  /** 記事マッチ用のタグ（部分一致） */
  tags: string[];
  /** 記事マッチ用のタイトルキーワード */
  titleKeywords: string[];
}

export const SEASONAL_THEMES: SeasonalTheme[] = [
  // === 春（3-4月）：入学・新生活 ===
  {
    months: [3, 4],
    title: '🌸 春の入学・新生活準備',
    subtitle: '新しい環境に向けて、親子で備えよう',
    gradient: 'from-pink-50 to-rose-50',
    icon: '🌸',
    textColor: 'text-pink-800',
    tags: ['入学', '新生活', '友達', '小学校', '幼稚園', '保育', '生活習慣', '準備', 'トイレトレーニング', '自己肯定感'],
    titleKeywords: ['入学', '新生活', '友達', '小学校', '幼稚園', '園', '準備', '習慣'],
  },
  // === 初夏（5-6月）：運動・体づくり ===
  {
    months: [5, 6],
    title: '☀️ 初夏の体づくり・外遊び',
    subtitle: '元気に遊んで、丈夫な体を育てよう',
    gradient: 'from-green-50 to-emerald-50',
    icon: '☀️',
    textColor: 'text-green-800',
    tags: ['運動', '外遊び', '体力', '成長', '食育', '栄養', '偏食', '好き嫌い'],
    titleKeywords: ['運動', '遊び', '体', '食', '栄養', '偏食'],
  },
  // === 夏（7-8月）：夏休み・安全・健康管理 ===
  {
    months: [7, 8],
    title: '🍉 夏休みの過ごし方・安全対策',
    subtitle: '長い休みを安全に、充実して過ごすために',
    gradient: 'from-sky-50 to-cyan-50',
    icon: '🍉',
    textColor: 'text-sky-800',
    tags: ['夏休み', '自由研究', '水遊び', '熱中症', '生活リズム', '睡眠', 'ゲーム', 'スマホ', '時間'],
    titleKeywords: ['夏', '自由研究', '水', '熱中症', 'ゲーム', 'スマホ', '時間'],
  },
  // === 秋（9-10月）：学び・読書 ===
  {
    months: [9, 10],
    title: '📚 秋の学び・読書シーズン',
    subtitle: '落ち着いた季節に、じっくり学ぶ力を育てよう',
    gradient: 'from-amber-50 to-orange-50',
    icon: '📚',
    textColor: 'text-amber-800',
    tags: ['読み聞かせ', '絵本', '学力', '勉強', '読書', '知育', 'プログラミング', '習い事'],
    titleKeywords: ['読み聞かせ', '絵本', '学力', '勉強', '読書', '学習', 'プログラミング', '習い事'],
  },
  // === 晩秋（11月）：メンタルケア・友達関係 ===
  {
    months: [11],
    title: '🍂 心のケア・友達関係を見守る秋',
    subtitle: '学校生活も後半戦。子どもの心に寄り添おう',
    gradient: 'from-orange-50 to-amber-50',
    icon: '🍂',
    textColor: 'text-orange-800',
    tags: ['いじめ', 'メンタルヘルス', '友達', 'トラブル', '自己肯定感', '声かけ', 'ストレス', '不登校'],
    titleKeywords: ['いじめ', 'メンタル', '友達', '自己肯定感', '声かけ', 'ストレス', '不登校'],
  },
  // === 冬（12-1月）：健康管理・受験 ===
  {
    months: [12, 1],
    title: '⛄ 冬の健康管理・受験サポート',
    subtitle: '風邪予防と受験期の家族のケア',
    gradient: 'from-blue-50 to-indigo-50',
    icon: '⛄',
    textColor: 'text-blue-800',
    tags: ['風邪', '発熱', '予防接種', 'ワクチン', 'インフルエンザ', '受験', '睡眠', '栄養', '免疫'],
    titleKeywords: ['風邪', '発熱', '予防接種', 'ワクチン', '受験', 'インフルエンザ', '免疫'],
  },
  // === 早春（2月）：新年度準備・生活リズム ===
  {
    months: [2],
    title: '🌷 新年度に向けた準備の季節',
    subtitle: '春はもうすぐ。生活リズムを整え、新しいスタートに備えよう',
    gradient: 'from-violet-50 to-purple-50',
    icon: '🌷',
    textColor: 'text-violet-800',
    tags: ['生活リズム', '睡眠', '生活習慣', '準備', '入学', '発達', '成長'],
    titleKeywords: ['生活リズム', '睡眠', '習慣', '準備', '入学', '発達'],
  },
];

/**
 * 現在の月に対応する季節テーマを取得
 */
export function getCurrentSeasonalTheme(): SeasonalTheme {
  const month = new Date().getMonth() + 1; // 1-12
  return SEASONAL_THEMES.find((t) => t.months.includes(month)) ?? SEASONAL_THEMES[0];
}

/**
 * 季節と直接矛盾するキーワード（タイトル・タグに含まれていたら
 * 大きく減点して季節ピックアップから除外する）。
 *
 * 各エントリは、その月レンジの「ピックアップとして不適切な単語」を列挙。
 * 例: 5-6月のピックアップに「冬の運動」「クリスマス」記事を出さない。
 */
const ANTI_SEASON_KEYWORDS: Record<string, string[]> = {
  // 春 3-4月：他季節の典型語を弾く
  '3-4': ['夏休み', '熱中症', '紅葉', '読書の秋', 'ハロウィン', 'クリスマス', '年末', 'お正月', '冬', '雪', 'インフルエンザ', '節分'],
  // 初夏 5-6月：冬・秋・受験ピーク・お正月などを弾く
  '5-6': ['冬', '雪', '紅葉', '読書の秋', 'ハロウィン', 'クリスマス', '年末', 'お正月', 'インフルエンザ', '節分', '受験直前', '入試直前', '新年度'],
  // 夏 7-8月
  '7-8': ['冬', '雪', '紅葉', '読書の秋', 'ハロウィン', 'クリスマス', '年末', 'お正月', 'インフルエンザ', '節分', '入学', '新生活', '花粉'],
  // 秋 9-10月
  '9-10': ['梅雨', '夏休み', '熱中症', 'クリスマス', '年末', 'お正月', '節分', '入学', '新生活', '花粉'],
  // 晩秋 11月
  '11': ['梅雨', '夏休み', '熱中症', '入学', '新生活', '花粉', '節分'],
  // 冬 12-1月
  '12-1': ['梅雨', '夏休み', '熱中症', '紅葉', '入学', '新生活', '花粉'],
  // 受験期 2月
  '2': ['梅雨', '夏休み', '熱中症', '紅葉', '入学', '花粉'],
};

function getSeasonKey(theme: SeasonalTheme): string {
  // テーマの月リストをキー化（例: [5,6] -> "5-6"）
  return theme.months.join('-');
}

/**
 * 記事が季節テーマにマッチするかスコアリング。
 * - タグ・タイトルへのキーワードマッチで加点
 * - 他季節の典型語が含まれていたら大きく減点（季節外し対策）
 */
export function getSeasonalScore(
  articleTags: string[],
  articleTitle: string,
  theme: SeasonalTheme
): number {
  let score = 0;

  // タグマッチ: +2 per match
  for (const tag of articleTags) {
    if (theme.tags.some((t) => tag.includes(t) || t.includes(tag))) {
      score += 2;
    }
  }

  // タイトルキーワードマッチ: +3 per match
  for (const kw of theme.titleKeywords) {
    if (articleTitle.includes(kw)) {
      score += 3;
    }
  }

  // 反シーズン語が含まれていたら大幅減点（季節外しを除外）
  const seasonKey = getSeasonKey(theme);
  const antiKeywords = ANTI_SEASON_KEYWORDS[seasonKey] ?? [];
  const haystack = `${articleTitle} ${articleTags.join(' ')}`;
  for (const anti of antiKeywords) {
    if (haystack.includes(anti)) {
      score -= 10;
    }
  }

  return score;
}
