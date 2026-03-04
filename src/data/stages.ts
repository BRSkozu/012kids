import { AgeStageInfo, AgeStage } from '@/types';

export const AGE_STAGES: AgeStageInfo[] = [
  {
    id: '0stage',
    label: '0 Stage',
    labelEn: '0 Stage',
    ageRange: '0〜2歳',
    ageMin: 0,
    ageMax: 2,
    description: '授乳・離乳食・発達発育・睡眠・保育に関する情報',
    color: '#FFB3B3',
    colorLight: '#FFF0F0',
    themes: ['授乳', '離乳食', '発達発育', '睡眠', '保育'],
  },
  {
    id: 'pre',
    label: 'Pre Stage',
    labelEn: 'Pre Stage',
    ageRange: '3〜5歳',
    ageMin: 3,
    ageMax: 5,
    description: '幼児教育・遊び・ことば・しつけ・幼稚園に関する情報',
    color: '#FFD9A0',
    colorLight: '#FFF8ED',
    themes: ['幼児教育', '遊び', 'ことば', 'しつけ', '幼稚園'],
  },
  {
    id: 'early',
    label: 'Early Stage',
    labelEn: 'Early Stage',
    ageRange: '6〜8歳',
    ageMin: 6,
    ageMax: 8,
    description: '小学校入学・読み書き・算数・生活習慣に関する情報',
    color: '#FFFAA0',
    colorLight: '#FFFEF0',
    themes: ['小学校入学', '読み書き', '算数', '生活習慣'],
  },
  {
    id: 'mid',
    label: 'Mid Stage',
    labelEn: 'Mid Stage',
    ageRange: '9〜10歳',
    ageMin: 9,
    ageMax: 10,
    description: '理科・社会・英語・習い事・友達関係に関する情報',
    color: '#A8E6CF',
    colorLight: '#EEFAF4',
    themes: ['理科・社会', '英語', '習い事', '友達関係'],
  },
  {
    id: 'upper',
    label: 'Upper Stage',
    labelEn: 'Upper Stage',
    ageRange: '11〜12歳',
    ageMin: 11,
    ageMax: 12,
    description: '受験・自主学習・メンタル・デジタルリテラシーに関する情報',
    color: '#A0C4FF',
    colorLight: '#EEF4FF',
    themes: ['受験', '自主学習', 'メンタル', 'デジタルリテラシー'],
  },
];

export function getStageById(id: AgeStage): AgeStageInfo {
  return AGE_STAGES.find((s) => s.id === id) ?? AGE_STAGES[0];
}

export function getStageByAge(years: number): AgeStageInfo {
  return (
    AGE_STAGES.find((s) => years >= s.ageMin && years <= s.ageMax) ??
    AGE_STAGES[0]
  );
}

export function getStageColor(id: AgeStage): string {
  return getStageById(id).color;
}
