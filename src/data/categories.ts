import { CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'development',
    label: '発達・成長',
    icon: '🌱',
    description: '運動発達、認知発達、言語発達、社会性発達、発達障害・グレーゾーン',
  },
  {
    id: 'nutrition',
    label: '食育・栄養',
    icon: '🍎',
    description: '離乳食、アレルギー対応、好き嫌い克服、学童期の食事、給食',
  },
  {
    id: 'education',
    label: '教育・学習',
    icon: '📚',
    description: '早期教育、公教育、家庭学習法、習い事選び、受験情報',
  },
  {
    id: 'health',
    label: '健康・医療',
    icon: '🏥',
    description: '予防接種、かかりやすい病気、歯科・眼科情報、応急処置',
  },
  {
    id: 'mental',
    label: 'メンタル・心理',
    icon: '💚',
    description: '不登校・いじめ対応、自己肯定感、親の関わり方、メンタルケア',
  },
  {
    id: 'digital',
    label: 'デジタル・メディア',
    icon: '💻',
    description: 'スクリーンタイム管理、安全なアプリ、プログラミング教育、SNSリテラシー',
  },
  {
    id: 'social',
    label: '社会・環境',
    icon: '🌍',
    description: 'SDGs教育、多様性・インクルーシブ教育、地域資源の活用',
  },
  {
    id: 'expert',
    label: '専門家コラム',
    icon: '👨‍⚕️',
    description: '小児科医・心理士・教育専門家による監修コンテンツ',
  },
];

export function getCategoryById(id: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
