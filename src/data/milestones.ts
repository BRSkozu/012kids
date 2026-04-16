import type { AgeStage } from '@/types';

export interface Milestone {
  id: string;
  title: string;
  /** Sub-note / rough age window shown under the title */
  note: string;
  category: 'motor' | 'language' | 'social' | 'cognitive' | 'life';
  /** Typical age in months when most children achieve this (for rough sorting) */
  typicalMonths: number;
}

export interface MilestoneGroup {
  stage: AgeStage;
  ageRange: string;
  headline: string;
  description: string;
  milestones: Milestone[];
}

/**
 * Milestone data — curated from 母子健康手帳 and 厚生労働省「乳幼児身体発育調査」を
 * 参考にした目安。個人差は大きいため参考情報。
 */
export const MILESTONE_GROUPS: MilestoneGroup[] = [
  {
    stage: '0stage',
    ageRange: '0〜2歳',
    headline: '赤ちゃん期の発達マイルストーン',
    description: '首すわりから二語文まで、0〜2歳の代表的な発達の目安です。',
    milestones: [
      { id: '0-1', title: '首がすわる', note: '目安: 3〜4か月', category: 'motor', typicalMonths: 4 },
      { id: '0-2', title: '寝返りをする', note: '目安: 5〜6か月', category: 'motor', typicalMonths: 5 },
      { id: '0-3', title: 'ひとりすわりができる', note: '目安: 6〜9か月', category: 'motor', typicalMonths: 7 },
      { id: '0-4', title: 'はいはいをする', note: '目安: 8〜10か月', category: 'motor', typicalMonths: 9 },
      { id: '0-5', title: 'つかまり立ちをする', note: '目安: 9〜11か月', category: 'motor', typicalMonths: 10 },
      { id: '0-6', title: 'ひとりで歩く', note: '目安: 12〜15か月', category: 'motor', typicalMonths: 13 },
      { id: '0-7', title: '喃語（なんご）を話す', note: '目安: 4〜6か月', category: 'language', typicalMonths: 5 },
      { id: '0-8', title: '意味のある単語を話す', note: '目安: 12〜18か月', category: 'language', typicalMonths: 15 },
      { id: '0-9', title: '二語文を話す（例：ママ きた）', note: '目安: 22〜24か月', category: 'language', typicalMonths: 23 },
      { id: '0-10', title: 'あやすと笑う', note: '目安: 2〜3か月', category: 'social', typicalMonths: 3 },
      { id: '0-11', title: '人見知りをする', note: '目安: 6〜10か月', category: 'social', typicalMonths: 8 },
      { id: '0-12', title: 'バイバイなどの身振り', note: '目安: 10〜12か月', category: 'social', typicalMonths: 11 },
      { id: '0-13', title: 'スプーンを使ってみる', note: '目安: 18〜24か月', category: 'life', typicalMonths: 21 },
      { id: '0-14', title: '排泄のサインが出る', note: '目安: 18〜24か月', category: 'life', typicalMonths: 22 },
    ],
  },
  {
    stage: 'pre',
    ageRange: '3〜5歳',
    headline: '幼児期の発達マイルストーン',
    description: '言葉の爆発期から就学前の準備まで、3〜5歳の目安です。',
    milestones: [
      { id: 'pre-1', title: '三語文で話す', note: '目安: 3歳頃', category: 'language', typicalMonths: 36 },
      { id: 'pre-2', title: '自分の名前と年齢が言える', note: '目安: 3歳', category: 'language', typicalMonths: 36 },
      { id: 'pre-3', title: '簡単なお話を理解する', note: '目安: 4歳', category: 'language', typicalMonths: 48 },
      { id: 'pre-4', title: 'ひらがなを読み始める', note: '目安: 4〜5歳', category: 'cognitive', typicalMonths: 54 },
      { id: 'pre-5', title: '10まで数えられる', note: '目安: 4歳', category: 'cognitive', typicalMonths: 48 },
      { id: 'pre-6', title: '色を4〜6色識別できる', note: '目安: 3〜4歳', category: 'cognitive', typicalMonths: 42 },
      { id: 'pre-7', title: 'ケンケンができる', note: '目安: 4歳', category: 'motor', typicalMonths: 48 },
      { id: 'pre-8', title: 'ハサミで直線を切れる', note: '目安: 4歳', category: 'motor', typicalMonths: 48 },
      { id: 'pre-9', title: 'ひとりでトイレに行ける', note: '目安: 3〜4歳', category: 'life', typicalMonths: 42 },
      { id: 'pre-10', title: 'ひとりで服を着脱できる', note: '目安: 4歳', category: 'life', typicalMonths: 48 },
      { id: 'pre-11', title: '友達とごっこ遊びをする', note: '目安: 3〜4歳', category: 'social', typicalMonths: 42 },
      { id: 'pre-12', title: '順番を守って遊べる', note: '目安: 5歳', category: 'social', typicalMonths: 60 },
    ],
  },
  {
    stage: 'early',
    ageRange: '6〜8歳',
    headline: '小学校低学年の成長マイルストーン',
    description: '小学校生活の始まりと読み書き・算数の基礎づくり。',
    milestones: [
      { id: 'early-1', title: 'ひらがな・カタカナを読み書きできる', note: '目安: 小1', category: 'cognitive', typicalMonths: 84 },
      { id: 'early-2', title: '一桁の足し算・引き算ができる', note: '目安: 小1', category: 'cognitive', typicalMonths: 84 },
      { id: 'early-3', title: '簡単な漢字（学習漢字）を覚える', note: '目安: 小1〜2', category: 'cognitive', typicalMonths: 90 },
      { id: 'early-4', title: '掛け算九九を覚える', note: '目安: 小2', category: 'cognitive', typicalMonths: 96 },
      { id: 'early-5', title: '時計が読める', note: '目安: 小1', category: 'life', typicalMonths: 84 },
      { id: 'early-6', title: 'ひとりで登下校できる', note: '目安: 小1', category: 'life', typicalMonths: 84 },
      { id: 'early-7', title: '宿題の習慣がつく', note: '目安: 小1〜2', category: 'life', typicalMonths: 90 },
      { id: 'early-8', title: '縄跳び連続20回以上', note: '目安: 小1〜2', category: 'motor', typicalMonths: 90 },
      { id: 'early-9', title: '自転車に乗れる', note: '目安: 小1〜2', category: 'motor', typicalMonths: 84 },
      { id: 'early-10', title: '友達関係が広がる', note: '目安: 小1〜2', category: 'social', typicalMonths: 90 },
      { id: 'early-11', title: 'ルールのある遊びを楽しむ', note: '目安: 小1〜3', category: 'social', typicalMonths: 96 },
      { id: 'early-12', title: '簡単なお手伝いができる', note: '目安: 小1〜3', category: 'life', typicalMonths: 90 },
    ],
  },
  {
    stage: 'mid',
    ageRange: '9〜10歳',
    headline: '中学年の成長マイルストーン',
    description: '「10歳の壁」と呼ばれる抽象思考の芽生え期。',
    milestones: [
      { id: 'mid-1', title: '抽象的な概念を理解し始める', note: '目安: 小3〜4', category: 'cognitive', typicalMonths: 108 },
      { id: 'mid-2', title: '分数・小数を理解する', note: '目安: 小3〜4', category: 'cognitive', typicalMonths: 114 },
      { id: 'mid-3', title: 'ローマ字の読み書きができる', note: '目安: 小3', category: 'cognitive', typicalMonths: 108 },
      { id: 'mid-4', title: '読書量が増え、長めの本を読める', note: '目安: 小3〜5', category: 'cognitive', typicalMonths: 114 },
      { id: 'mid-5', title: '自分の意見を論理的に話す', note: '目安: 小3〜4', category: 'language', typicalMonths: 114 },
      { id: 'mid-6', title: '仲間意識が強くなる', note: '目安: 小3〜4', category: 'social', typicalMonths: 114 },
      { id: 'mid-7', title: '自己評価が明確になる', note: '目安: 小4', category: 'social', typicalMonths: 120 },
      { id: 'mid-8', title: '習い事・クラブ活動への取り組み', note: '目安: 小3〜5', category: 'life', typicalMonths: 114 },
      { id: 'mid-9', title: '自分で時間管理ができる', note: '目安: 小4', category: 'life', typicalMonths: 120 },
    ],
  },
  {
    stage: 'upper',
    ageRange: '11〜12歳',
    headline: '高学年〜中学進学のマイルストーン',
    description: '思春期の入り口。自主性と自己管理の獲得。',
    milestones: [
      { id: 'upper-1', title: '中学準備の学習習慣がある', note: '目安: 小5〜6', category: 'cognitive', typicalMonths: 138 },
      { id: 'upper-2', title: '自分で学習計画を立てられる', note: '目安: 小6', category: 'cognitive', typicalMonths: 144 },
      { id: 'upper-3', title: '複雑な文章を読み解ける', note: '目安: 小5〜6', category: 'cognitive', typicalMonths: 138 },
      { id: 'upper-4', title: 'ネットリテラシーを身につけている', note: '目安: 小5〜6', category: 'life', typicalMonths: 138 },
      { id: 'upper-5', title: '思春期の身体の変化を理解する', note: '目安: 小5〜6', category: 'life', typicalMonths: 138 },
      { id: 'upper-6', title: '金銭感覚を身につける', note: '目安: 小6', category: 'life', typicalMonths: 144 },
      { id: 'upper-7', title: '家庭での役割を担う', note: '目安: 小5〜6', category: 'life', typicalMonths: 138 },
      { id: 'upper-8', title: '自分の気持ちを言語化できる', note: '目安: 小5〜6', category: 'language', typicalMonths: 138 },
      { id: 'upper-9', title: 'グループ内でリーダーシップを発揮', note: '目安: 小6', category: 'social', typicalMonths: 144 },
    ],
  },
];

export function getMilestoneGroup(stage: AgeStage): MilestoneGroup | undefined {
  return MILESTONE_GROUPS.find((g) => g.stage === stage);
}

export const MILESTONE_CATEGORY_LABELS: Record<Milestone['category'], { label: string; color: string; icon: string }> = {
  motor:     { label: '運動',  color: '#FFB3B3', icon: '🏃' },
  language:  { label: '言葉',  color: '#A0C4FF', icon: '💬' },
  cognitive: { label: '認知',  color: '#FFD9A0', icon: '🧠' },
  social:    { label: '社会性', color: '#A8E6CF', icon: '🤝' },
  life:      { label: '生活',  color: '#FFFAA0', icon: '🍽️' },
};
