import { Expert } from '@/types';

export const EXPERTS: Expert[] = [
  {
    id: 'expert-1',
    name: '田中 美咲',
    title: '小児科医・医学博士',
    organization: '国立成育医療研究センター',
    speciality: '小児発達医学',
    imageUrl: '/experts/tanaka.jpg',
    bio: '小児科医として20年以上の臨床経験を持ち、特に乳幼児の発達評価と支援を専門としています。国立成育医療研究センターで研究に従事しながら、一般の保護者向けの情報発信にも力を入れています。',
  },
  {
    id: 'expert-2',
    name: '山本 健太郎',
    title: '教育学博士・教育コンサルタント',
    organization: '東京大学教育学研究科',
    speciality: '幼児教育・初等教育',
    imageUrl: '/experts/yamamoto.jpg',
    bio: '幼児教育から初等教育まで幅広い研究を行い、エビデンスに基づいた教育方法の普及に取り組んでいます。著書多数。NHK教育番組の監修も務めています。',
  },
  {
    id: 'expert-3',
    name: '佐藤 あゆみ',
    title: '公認心理師・臨床心理士',
    organization: '子ども心理支援センター',
    speciality: '児童心理・発達支援',
    imageUrl: '/experts/sato.jpg',
    bio: '子どもの心理発達支援に15年以上携わり、不登校・いじめ問題の相談支援を行っています。保護者向けのペアレンティング講座の講師としても活動中。',
  },
  {
    id: 'expert-4',
    name: '鈴木 陽子',
    title: '管理栄養士・食育インストラクター',
    organization: '日本栄養士会',
    speciality: '小児栄養・食物アレルギー',
    imageUrl: '/experts/suzuki.jpg',
    bio: '小児栄養の専門家として、離乳食から学童期の食事まで幅広くアドバイス。食物アレルギーの子どもを持つ家庭へのサポートにも注力しています。',
  },
  {
    id: 'expert-5',
    name: '高橋 誠',
    title: 'ICT教育専門家',
    organization: '文部科学省 GIGAスクール推進室',
    speciality: 'デジタル教育・プログラミング教育',
    imageUrl: '/experts/takahashi.jpg',
    bio: 'GIGAスクール構想の推進に携わり、子どものデジタルリテラシー教育の第一人者。安全なICT活用と創造的なプログラミング教育について研究しています。',
  },
];

export function getExpertById(id: string): Expert | undefined {
  return EXPERTS.find((e) => e.id === id);
}
