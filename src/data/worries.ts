export interface Worry {
  id: string;
  text: string;
  keywords: string[];
  stage: string[];
  relatedArticleIds: string[];
}

export const WORRIES: Worry[] = [
  // 0 Stage
  {
    id: 'w-001',
    text: '夜泣きがひどくて寝られない',
    keywords: ['夜泣き', '睡眠', '寝ない', '起きる'],
    stage: ['0stage'],
    relatedArticleIds: ['art-001'],
  },
  {
    id: 'w-002',
    text: '離乳食を全然食べてくれない',
    keywords: ['離乳食', '食べない', '食事', '好き嫌い'],
    stage: ['0stage'],
    relatedArticleIds: ['art-002'],
  },
  {
    id: 'w-003',
    text: '発達が周りの子より遅い気がする',
    keywords: ['発達', '遅い', '心配', 'マイルストーン', '歩かない', 'ハイハイ'],
    stage: ['0stage'],
    relatedArticleIds: ['art-003'],
  },
  {
    id: 'w-004',
    text: 'アレルギーが心配で新しい食材を試せない',
    keywords: ['アレルギー', '食物アレルギー', '卵', '牛乳', '小麦'],
    stage: ['0stage'],
    relatedArticleIds: ['art-006', 'art-002'],
  },
  // Pre Stage
  {
    id: 'w-005',
    text: '幼稚園と保育園、どっちがいいの？',
    keywords: ['幼稚園', '保育園', '園選び', '入園'],
    stage: ['pre'],
    relatedArticleIds: ['art-005'],
  },
  {
    id: 'w-006',
    text: '子どもとどんな遊びをしたらいい？',
    keywords: ['遊び', '知育', '何して遊ぶ', 'おもちゃ'],
    stage: ['pre'],
    relatedArticleIds: ['art-004'],
  },
  {
    id: 'w-007',
    text: 'ことばが遅い気がする',
    keywords: ['ことば', '言葉', '話さない', '発語', '遅い'],
    stage: ['0stage', 'pre'],
    relatedArticleIds: ['art-003'],
  },
  // Early Stage
  {
    id: 'w-008',
    text: '小学校入学の準備が不安',
    keywords: ['入学', '小学校', '準備', 'ひらがな', 'ランドセル'],
    stage: ['pre', 'early'],
    relatedArticleIds: ['art-007'],
  },
  {
    id: 'w-009',
    text: '宿題を全然やらない',
    keywords: ['宿題', 'やらない', '家庭学習', '勉強しない'],
    stage: ['early'],
    relatedArticleIds: ['art-008'],
  },
  {
    id: 'w-010',
    text: 'プログラミング教育って何をすればいい？',
    keywords: ['プログラミング', 'パソコン', 'スクラッチ', 'Scratch'],
    stage: ['early', 'mid'],
    relatedArticleIds: ['art-015'],
  },
  // Mid Stage
  {
    id: 'w-011',
    text: '習い事が多すぎて子どもが疲れている',
    keywords: ['習い事', '多い', '疲れ', 'やめたい', '忙しい'],
    stage: ['mid'],
    relatedArticleIds: ['art-009'],
  },
  {
    id: 'w-012',
    text: 'ゲームやスマホばかりで心配',
    keywords: ['ゲーム', 'スマホ', 'YouTube', '動画', 'スクリーンタイム'],
    stage: ['mid', 'upper'],
    relatedArticleIds: ['art-010'],
  },
  {
    id: 'w-013',
    text: '子どもの自己肯定感が低い気がする',
    keywords: ['自己肯定感', '自信', 'ネガティブ', '自分はダメ'],
    stage: ['mid', 'upper'],
    relatedArticleIds: ['art-014'],
  },
  // Upper Stage
  {
    id: 'w-014',
    text: '中学受験をさせるべきか迷っている',
    keywords: ['中学受験', '受験', '塾', '私立', '公立'],
    stage: ['upper'],
    relatedArticleIds: ['art-011'],
  },
  {
    id: 'w-015',
    text: '子どもが自分で勉強しない',
    keywords: ['自主学習', '勉強しない', 'やる気', 'モチベーション'],
    stage: ['upper'],
    relatedArticleIds: ['art-012', 'art-008'],
  },
  {
    id: 'w-016',
    text: 'いじめられているかもしれない',
    keywords: ['いじめ', '学校', '行きたくない', '不登校', '友達'],
    stage: ['early', 'mid', 'upper'],
    relatedArticleIds: ['art-013'],
  },
  {
    id: 'w-017',
    text: '友達とうまくいっていないようだ',
    keywords: ['友達', '友人関係', 'トラブル', 'けんか', '仲間はずれ'],
    stage: ['early', 'mid', 'upper'],
    relatedArticleIds: ['art-013', 'art-014'],
  },
  {
    id: 'w-018',
    text: '子どもが最近元気がない',
    keywords: ['元気がない', '暗い', 'メンタル', '心配', 'ストレス'],
    stage: ['mid', 'upper'],
    relatedArticleIds: ['art-014', 'art-013'],
  },
];

export function searchWorries(query: string): Worry[] {
  const q = query.toLowerCase();
  return WORRIES.filter(
    (w) =>
      w.text.toLowerCase().includes(q) ||
      w.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export function getWorriesByStage(stage: string): Worry[] {
  return WORRIES.filter((w) => w.stage.includes(stage));
}
