/**
 * Structured data for Tokyo 23-ku 学童保育 (gakudo / after-school care).
 *
 * Editorial policy:
 * - Numerical fields (fee, hours, etc.) are only filled in when the
 *   corresponding 012.kids article confirms them. Otherwise we surface
 *   the official ward page and mark the field as "要確認".
 * - "officialUrl" links to the ward government homepage; users should
 *   navigate from there to the latest 学童 page since URLs change.
 * - "modelType" reflects the high-level program structure:
 *     - "hybrid": 学童クラブ（要件あり）＋ 全児童型放課後事業 を併設
 *     - "unified": 学童機能を含めて全児童型に統合（例: 品川 すまいるスクール）
 *     - "standard": 学童クラブ中心
 *     - "unknown": 公式情報を要確認
 */

export type GakudoModelType = 'hybrid' | 'unified' | 'standard' | 'unknown';

export interface GakudoWardData {
  /** 区名（表示用） */
  ward: string;
  /** スラッグ（romaji, lower-case） */
  wardSlug: string;
  /** 主な制度名（例: 学童クラブ＋放課後子ども教室 / すまいるスクール） */
  programName: string;
  modelType: GakudoModelType;
  /** 012.kids 記事 slug があればリンク */
  articleSlug?: string;
  /** 区公式サイト */
  officialUrl: string;
  /** 月額利用料（要確認は空文字 or "—"） */
  monthlyFee?: string;
  /** 平日終了時刻（例: "18:00", "18:00 (延長19:00)"） */
  weekdayEnd?: string;
  /** 主な対象学年帯 */
  gradeRange?: string;
  /** 補足メモ（編集者の短評） */
  notes?: string;
}

export const GAKUDO_DATA: GakudoWardData[] = [
  {
    ward: '千代田区',
    wardSlug: 'chiyoda',
    programName: '学童クラブ ＋ 放課後子ども教室',
    modelType: 'hybrid',
    articleSlug: 'chiyoda-gakudo-guide',
    officialUrl: 'https://www.city.chiyoda.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）',
    notes: '人口規模が小さく独自支援が手厚い区',
  },
  {
    ward: '中央区',
    wardSlug: 'chuo',
    programName: '学童クラブ ＋ プレディ（放課後子ども教室）',
    modelType: 'hybrid',
    officialUrl: 'https://www.city.chuo.lg.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '港区',
    wardSlug: 'minato',
    programName: '放課GO→ ＋ 学童クラブ',
    modelType: 'hybrid',
    articleSlug: 'minato-gakudo-guide',
    officialUrl: 'https://www.city.minato.tokyo.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小6',
    notes: '都心部で人気エリアは需要が高い',
  },
  {
    ward: '新宿区',
    wardSlug: 'shinjuku',
    programName: '学童クラブ ＋ 放課後子どもひろば',
    modelType: 'hybrid',
    articleSlug: 'shinjuku-gakudo-guide',
    officialUrl: 'https://www.city.shinjuku.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（ひろば）',
    notes: '都心通勤利便性と住宅街エリアが混在',
  },
  {
    ward: '文京区',
    wardSlug: 'bunkyo',
    programName: '育成室（学童保育）',
    modelType: 'standard',
    articleSlug: 'bunkyo-gakudo-guide',
    officialUrl: 'https://www.city.bunkyo.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3',
    notes: '教育意識の高い区、学童＋塾併用が一般的',
  },
  {
    ward: '台東区',
    wardSlug: 'taito',
    programName: '学童クラブ',
    modelType: 'standard',
    officialUrl: 'https://www.city.taito.lg.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '墨田区',
    wardSlug: 'sumida',
    programName: '学童クラブ ＋ 放課後子ども教室',
    modelType: 'hybrid',
    articleSlug: 'sumida-gakudo-guide',
    officialUrl: 'https://www.city.sumida.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（教室）',
    notes: '下町と再開発エリア（押上・錦糸町）が混在',
  },
  {
    ward: '江東区',
    wardSlug: 'koto',
    programName: '江東きっずクラブ（A登録/B登録）',
    modelType: 'unified',
    articleSlug: 'koto-gakudo-guide',
    officialUrl: 'https://www.city.koto.lg.jp/',
    monthlyFee: 'A登録無料／B登録別途',
    weekdayEnd: '17:00（B登録19:00）',
    gradeRange: '小1〜小6',
    notes: '湾岸エリア（豊洲・有明）は児童数急増中',
  },
  {
    ward: '品川区',
    wardSlug: 'shinagawa',
    programName: 'すまいるスクール',
    modelType: 'unified',
    articleSlug: 'shinagawa-gakudo-guide',
    officialUrl: 'https://www.city.shinagawa.tokyo.jp/',
    monthlyFee: '一般無料／一時預かり別途',
    weekdayEnd: '17:00（一時預かり19:00）',
    gradeRange: '小1〜小6',
    notes: '全児童型と学童機能を統合した先進事例',
  },
  {
    ward: '目黒区',
    wardSlug: 'meguro',
    programName: '学童保育クラブ ＋ 放課後子ども総合プラン',
    modelType: 'hybrid',
    officialUrl: 'https://www.city.meguro.tokyo.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '大田区',
    wardSlug: 'ota',
    programName: '学童保育 ＋ おおたっ子ひろば',
    modelType: 'hybrid',
    articleSlug: 'ota-gakudo-guide',
    officialUrl: 'https://www.city.ota.tokyo.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（おおたっ子ひろば）',
    notes: '23区最大の面積、エリアで事情が大きく異なる',
  },
  {
    ward: '世田谷区',
    wardSlug: 'setagaya',
    programName: '新BOP学童クラブ',
    modelType: 'unified',
    articleSlug: 'setagaya-gakudo-guide',
    officialUrl: 'https://www.city.setagaya.lg.jp/',
    monthlyFee: 'おやつ・おかず代の実費中心',
    weekdayEnd: '18:15（延長19:15）',
    gradeRange: '小1〜小3',
    notes: '校内併設の新BOPで学童＋全児童を統合運営',
  },
  {
    ward: '渋谷区',
    wardSlug: 'shibuya',
    programName: '放課後クラブ',
    modelType: 'unified',
    officialUrl: 'https://www.city.shibuya.tokyo.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '中野区',
    wardSlug: 'nakano',
    programName: '学童クラブ ＋ キッズ・プラザ',
    modelType: 'hybrid',
    articleSlug: 'nakano-gakudo-guide',
    officialUrl: 'https://www.city.tokyo-nakano.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（キッズ・プラザ）',
    notes: '中野駅周辺の再開発で需要増加中',
  },
  {
    ward: '杉並区',
    wardSlug: 'suginami',
    programName: '学童クラブ ＋ 放課後等居場所事業',
    modelType: 'hybrid',
    articleSlug: 'suginami-gakudo-guide',
    officialUrl: 'https://www.city.suginami.tokyo.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（居場所事業）',
    notes: '中央線沿線の人気住宅区、家賃水準は高め',
  },
  {
    ward: '豊島区',
    wardSlug: 'toshima',
    programName: '学童クラブ ＋ 子どもスキップ',
    modelType: 'hybrid',
    officialUrl: 'https://www.city.toshima.lg.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '北区',
    wardSlug: 'kita',
    programName: '学童クラブ',
    modelType: 'standard',
    officialUrl: 'https://www.city.kita.tokyo.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '荒川区',
    wardSlug: 'arakawa',
    programName: 'にこにこすくーる ＋ 学童クラブ',
    modelType: 'hybrid',
    officialUrl: 'https://www.city.arakawa.tokyo.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '板橋区',
    wardSlug: 'itabashi',
    programName: 'あいキッズ',
    modelType: 'unified',
    articleSlug: 'itabashi-gakudo-guide',
    officialUrl: 'https://www.city.itabashi.tokyo.jp/',
    monthlyFee: '一般無料／きっずクラブ別途',
    weekdayEnd: '17:00（きっずクラブ19:00）',
    gradeRange: '小1〜小6',
    notes: '全区立小で実施、全児童＋学童の統合運営',
  },
  {
    ward: '練馬区',
    wardSlug: 'nerima',
    programName: '学童クラブ ＋ ねりっこクラブ',
    modelType: 'hybrid',
    articleSlug: 'nerima-gakudo-guide',
    officialUrl: 'https://www.city.nerima.tokyo.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（ねりっこクラブ）',
    notes: '23区最大級の児童数、人気学区は需要逼迫',
  },
  {
    ward: '足立区',
    wardSlug: 'adachi',
    programName: '住区センター児童館 ＋ 放課後子ども教室',
    modelType: 'hybrid',
    officialUrl: 'https://www.city.adachi.tokyo.jp/',
    notes: '公式で要確認',
  },
  {
    ward: '葛飾区',
    wardSlug: 'katsushika',
    programName: '学童保育クラブ ＋ わくわくチャレンジ広場',
    modelType: 'hybrid',
    articleSlug: 'katsushika-gakudo-guide',
    officialUrl: 'https://www.city.katsushika.lg.jp/',
    monthlyFee: '4,000〜6,000円目安',
    weekdayEnd: '18:00（延長19:00）',
    gradeRange: '小1〜小3（学童）／小1〜小6（チャレンジ広場）',
    notes: '家賃水準抑えめでファミリー人気、再開発進行中',
  },
  {
    ward: '江戸川区',
    wardSlug: 'edogawa',
    programName: 'すくすくスクール',
    modelType: 'unified',
    articleSlug: 'edogawa-gakudo-guide',
    officialUrl: 'https://www.city.edogawa.tokyo.jp/',
    monthlyFee: '登録料中心、預かり別途',
    weekdayEnd: '17:00（補食付登録で18:00）',
    gradeRange: '小1〜小6',
    notes: '全児童対象＋登録制の補食つきモデル',
  },
];

export const MODEL_TYPE_LABELS: Record<GakudoModelType, string> = {
  hybrid: '学童＋全児童併設型',
  unified: '統合型（全児童＋預かり）',
  standard: '学童クラブ中心',
  unknown: '要確認',
};

export const MODEL_TYPE_DESCRIPTIONS: Record<GakudoModelType, string> = {
  hybrid:
    '保育に欠ける家庭向けの「学童クラブ」と、全児童対象の「放課後子ども教室／キッズ広場等」を別事業として併設。共働きは学童、それ以外は放課後事業。',
  unified:
    '全児童対象の事業に学童機能を組み込んだ統合型。基本利用は安価／無料で、共働き家庭は預かり延長を別途登録。',
  standard:
    '学童クラブを中心に運用するシンプル型。全児童型の併設は限定的または準備中。',
  unknown:
    '012.kids ではまだ詳細未確認。区公式サイトで最新情報をご確認ください。',
};

export function getGakudoByWardSlug(slug: string): GakudoWardData | undefined {
  return GAKUDO_DATA.find((w) => w.wardSlug === slug);
}

export function getGakudoWardsWithArticles(): GakudoWardData[] {
  return GAKUDO_DATA.filter((w) => Boolean(w.articleSlug));
}
