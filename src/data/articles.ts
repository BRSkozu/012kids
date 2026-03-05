import { Article } from '@/types';

export const ARTICLES: Article[] = [
  // 0 Stage articles
  {
    id: 'art-001',
    slug: 'baby-sleep-training-guide',
    title: '赤ちゃんの睡眠リズムを整える方法：月齢別ガイド',
    excerpt: '新生児から2歳までの睡眠パターンと、ぐっすり眠るための環境づくりについてまとめました。',
    content: `赤ちゃんの睡眠は、成長発達において非常に重要な役割を果たしています。しかし、多くのパパ・ママが赤ちゃんの睡眠に悩みを抱えていますよね。

ここでは、各機関が発信している情報をもとに、月齢別の睡眠の目安をまとめました。

## 月齢別の睡眠時間の目安

### 新生児（0〜3ヶ月）
新生児は1日に16〜17時間の睡眠が必要と言われています。ただし、まだ昼夜の区別がつかないため、2〜3時間おきに目を覚まします。

### 4〜6ヶ月
この時期になると、夜にまとまって眠れるようになり始めます。1日の睡眠時間は14〜15時間程度です。

### 7〜12ヶ月
夜間の連続睡眠が安定してきます。昼寝は午前と午後の2回が一般的です。

### 1〜2歳
昼寝は1回に減り、夜間に11〜12時間眠るのが理想的です。

## 良質な睡眠のための環境づくり

1. **室温管理**: 20〜22℃が過ごしやすいとされています
2. **暗さの確保**: 遮光カーテンがあると安心です
3. **静かな環境**: ホワイトノイズを活用するご家庭も
4. **寝る前のルーティン**: お風呂→絵本→おやすみ、の流れをつくってみましょう

## こんなときは相談を

以下のような場合は、かかりつけの小児科医に相談してみてくださいね：
- 夜中に何度も泣いて起きる（6ヶ月以降）
- いびきがひどい
- 日中の眠気が強すぎる

> **大切なお知らせ**: この記事は公的機関や専門家の発信情報をもとに編集部がまとめたものです。お子さま一人ひとりの状況は異なりますので、心配なことがあれば小児科の先生に相談してくださいね。`,
    stage: '0stage',
    categories: ['health', 'development'],
    source: {
      name: '乳幼児の睡眠に関する公的ガイドライン等',
      url: 'https://www.ncchd.go.jp/',
      references: [
        '国立成育医療研究センター 乳幼児の睡眠に関する情報',
        '厚生労働省「健やか親子21」関連資料',
      ],
    },
    score: {
      total: 88,
      reliability: 28,
      neutrality: 23,
      freshness: 18,
      ageRelevance: 13,
      readability: 6,
    },
    publishedAt: '2026-01-20',
    updatedAt: '2026-02-15',
    imageUrl: '/articles/baby-sleep.jpg',
    readingTime: 8,
    tags: ['睡眠', '赤ちゃん', '月齢別', '寝かしつけ'],
    relatedArticleIds: ['art-002', 'art-003'],
  },
  {
    id: 'art-002',
    slug: 'weaning-food-start-guide',
    title: '離乳食の始め方ガイド：時期・進め方・注意点',
    excerpt: '離乳食を始めるタイミングの見極め方から、月齢別の進め方、アレルギー対策まで。',
    content: `離乳食は、赤ちゃんが母乳やミルク以外の食べ物を初めて口にする大切なステップですね。

## 離乳食を始める目安

一般的に生後5〜6ヶ月頃が開始の目安とされていますが、以下のサインを確認してみてください：
- 首がすわっている
- 支えがあれば座れる
- 食べ物に興味を示す
- 舌で押し出す反射が弱まっている

## 月齢別の進め方

### 初期（5〜6ヶ月）
10倍がゆからスタートし、なめらかにすりつぶした状態で与えます。

### 中期（7〜8ヶ月）
舌でつぶせる固さに。タンパク質源も少しずつ追加します。

### 後期（9〜11ヶ月）
歯ぐきでつぶせる固さに。手づかみ食べも始まります。

### 完了期（12〜18ヶ月）
歯ぐきで噛める固さに。大人の食事に近づいていきます。

> **大切なお知らせ**: この記事は公的機関の発信情報をもとに編集部がまとめたものです。お子さまの個別の状況については、かかりつけ医にご相談くださいね。`,
    stage: '0stage',
    categories: ['nutrition'],
    source: {
      name: '離乳食に関する公的ガイドライン等',
      url: 'https://www.mhlw.go.jp/',
      references: [
        '厚生労働省「授乳・離乳の支援ガイド」',
        '日本小児科学会 離乳に関する提言',
      ],
    },
    score: {
      total: 92,
      reliability: 30,
      neutrality: 24,
      freshness: 19,
      ageRelevance: 14,
      readability: 5,
    },
    publishedAt: '2026-01-10',
    updatedAt: '2026-02-20',
    imageUrl: '/articles/weaning-food.jpg',
    readingTime: 10,
    tags: ['離乳食', '食育', 'アレルギー', '月齢別'],
    relatedArticleIds: ['art-001', 'art-006'],
  },
  {
    id: 'art-003',
    slug: 'infant-development-milestones',
    title: '0〜2歳の発達マイルストーン：運動・言語・社会性',
    excerpt: '赤ちゃんの月齢ごとの発達の目安と、個人差への向き合い方をまとめました。',
    content: `子どもの発達には個人差がありますが、おおよその目安を知っておくと少し安心できますよね。

## 運動発達の目安
- **3〜4ヶ月**: 首がすわる
- **5〜6ヶ月**: 寝返り
- **7〜8ヶ月**: おすわり
- **9〜10ヶ月**: ハイハイ
- **11〜12ヶ月**: つかまり立ち・伝い歩き
- **12〜15ヶ月**: ひとり歩き

## 大切なのは「個人差」への理解
発達の速度は一人ひとり異なります。上記はあくまで目安であり、多少のずれは正常範囲内です。周りの子と比べて焦る必要はありませんよ。

> **大切なお知らせ**: この記事は各種専門機関の情報をもとに編集部がまとめたものです。発達について心配がある場合は、小児科医や発達相談窓口に相談してみてくださいね。`,
    stage: '0stage',
    categories: ['development'],
    source: {
      name: '乳幼児の発達に関する専門情報',
      url: 'https://www.jpeds.or.jp/',
      references: [
        '日本小児科学会 発達に関する情報',
        '厚生労働省 母子健康手帳 副読本',
      ],
    },
    score: {
      total: 85,
      reliability: 27,
      neutrality: 22,
      freshness: 17,
      ageRelevance: 13,
      readability: 6,
    },
    publishedAt: '2026-01-05',
    updatedAt: '2026-01-05',
    imageUrl: '/articles/development-milestones.jpg',
    readingTime: 7,
    tags: ['発達', 'マイルストーン', '運動発達', '言語発達'],
    relatedArticleIds: ['art-001', 'art-004'],
  },
  // Pre Stage articles
  {
    id: 'art-004',
    slug: 'preschool-play-learning',
    title: '遊びから学ぶ：3〜5歳の知育遊びアイデア集',
    excerpt: '幼児期の遊びは最高の学び。創造力・思考力・社会性を育む遊びのアイデアをご紹介します。',
    content: `幼児期の子どもにとって、遊びは最も大切な「学びの時間」です。

## 遊びの種類と効果

### 1. 構成遊び（ブロック・積み木）
空間認知能力と問題解決力を育みます。

### 2. ごっこ遊び
社会性と言語能力の発達に大きく貢献します。

### 3. 外遊び・体を動かす遊び
運動能力はもちろん、心の健康にも大切です。

### 4. 絵本の読み聞かせ
語彙力と想像力をぐんと伸ばしてくれます。

## 年齢別おすすめの遊び

### 3歳
- 粘土遊び、お絵かき
- 簡単なパズル（6〜12ピース）
- 砂場遊び

### 4歳
- ルールのある簡単なゲーム
- はさみを使った工作
- 鬼ごっこ・かくれんぼ

### 5歳
- ボードゲーム・カードゲーム
- 文字や数字に触れる遊び
- グループでの創作活動`,
    stage: 'pre',
    categories: ['education', 'development'],
    source: {
      name: '幼児教育に関する各種研究・情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「幼児教育の充実について」',
        '幼児教育に関する各種研究論文',
      ],
    },
    score: {
      total: 78,
      reliability: 22,
      neutrality: 20,
      freshness: 18,
      ageRelevance: 12,
      readability: 6,
    },
    publishedAt: '2026-02-01',
    updatedAt: '2026-02-01',
    imageUrl: '/articles/play-learning.jpg',
    readingTime: 12,
    tags: ['知育', '遊び', '幼児教育', '創造力'],
    relatedArticleIds: ['art-005', 'art-006'],
  },
  {
    id: 'art-005',
    slug: 'kindergarten-preparation',
    title: '幼稚園・保育園選びガイド：見学のポイントと質問リスト',
    excerpt: '園選びで後悔しないために。見学時のチェックポイントと先生に聞くべき質問をまとめました。',
    content: `お子さんに合った園を見つけるために、しっかりと情報収集・見学を行いたいですよね。

## 園選びの基本ステップ

1. 自分の教育方針を明確にする
2. 候補となる園をリストアップする
3. 見学・説明会に参加する
4. 在園児の保護者に話を聞く
5. 総合的に判断する

## 見学時のチェックポイント

- 子どもたちの表情は明るいか
- 先生の対応は丁寧か
- 施設の安全対策は十分か
- 給食の内容と対応（アレルギー等）
- 通園のしやすさ`,
    stage: 'pre',
    categories: ['education'],
    source: {
      name: '幼稚園・保育園に関する公的情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省 幼稚園教育要領',
        '内閣府 子ども・子育て支援新制度',
      ],
    },
    score: {
      total: 82,
      reliability: 26,
      neutrality: 22,
      freshness: 16,
      ageRelevance: 12,
      readability: 6,
    },
    publishedAt: '2026-01-25',
    updatedAt: '2026-01-25',
    imageUrl: '/articles/kindergarten.jpg',
    readingTime: 9,
    tags: ['幼稚園', '保育園', '園選び', '入園準備'],
    relatedArticleIds: ['art-004'],
  },
  {
    id: 'art-006',
    slug: 'food-allergy-children',
    title: '子どもの食物アレルギー：原因・検査・対処法まとめ',
    excerpt: '食物アレルギーの基礎知識から、保育園・学校での対応まで。最新のガイドラインをもとにまとめました。',
    content: `食物アレルギーは、乳幼児の約10%に見られると言われている身近な疾患です。

## 食物アレルギーとは

特定の食べ物を摂取した後に、免疫システムが過剰に反応して起こる症状です。

## 主なアレルゲン食品

- 鶏卵（最も多い）
- 牛乳
- 小麦
- ピーナッツ
- 甲殻類
- そば
- 果物類

## 検査方法

- 血液検査（IgE抗体検査）
- 皮膚プリックテスト
- 食物経口負荷試験（確定診断）

> **大切なお知らせ**: この記事は各種ガイドラインをもとに編集部がまとめたものです。診断・治療は必ず専門の医師にご相談ください。`,
    stage: '0stage',
    categories: ['health', 'nutrition'],
    source: {
      name: '食物アレルギーに関するガイドライン等',
      url: 'https://www.jspaci.jp/',
      references: [
        '日本小児アレルギー学会「食物アレルギー診療ガイドライン」',
        '厚生労働省 アレルギー疾患対策関連資料',
      ],
    },
    score: {
      total: 90,
      reliability: 29,
      neutrality: 24,
      freshness: 18,
      ageRelevance: 13,
      readability: 6,
    },
    publishedAt: '2026-02-05',
    updatedAt: '2026-02-28',
    imageUrl: '/articles/food-allergy.jpg',
    readingTime: 11,
    tags: ['食物アレルギー', 'アレルギー検査', '給食対応', 'アナフィラキシー'],
    relatedArticleIds: ['art-002'],
  },
  // Early Stage articles
  {
    id: 'art-007',
    slug: 'first-grade-preparation',
    title: '小学校入学準備チェックリスト：学習面・生活面・心の準備',
    excerpt: '小学校入学を控えた年長さんの保護者に向けて、入学までに身につけておきたい力と準備のコツ。',
    content: `小学校入学は子どもにとって大きな環境変化。ドキドキしているのはお子さんもパパ・ママも同じですよね。

## 学習面の準備
- 自分の名前がひらがなで書ける
- 数を10まで数えられる
- 鉛筆の正しい持ち方

## 生活面の準備
- 自分で着替えができる
- トイレが一人でできる
- 時計の読み方の基礎

できないことがあっても大丈夫。入学してから身につくことも多いですよ。`,
    stage: 'early',
    categories: ['education'],
    source: {
      name: '小学校入学に関する公的情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省 学習指導要領',
        '各自治体の入学準備に関するガイド',
      ],
    },
    score: {
      total: 84,
      reliability: 26,
      neutrality: 22,
      freshness: 17,
      ageRelevance: 13,
      readability: 6,
    },
    publishedAt: '2026-02-10',
    updatedAt: '2026-02-10',
    imageUrl: '/articles/school-prep.jpg',
    readingTime: 8,
    tags: ['入学準備', '小学校', '年長', 'チェックリスト'],
    relatedArticleIds: ['art-008'],
  },
  {
    id: 'art-008',
    slug: 'home-study-habits-elementary',
    title: '小学生の家庭学習習慣の作り方：学年別アプローチ',
    excerpt: '家庭学習を習慣化するためのコツを学年別にご紹介。親のサポート方法と環境づくりのポイント。',
    content: `家庭学習の習慣は、小学校の早い段階で少しずつ身につけていきたいですよね。

## 学年別の目安時間
- 1〜2年生: 15〜30分
- 3〜4年生: 30〜45分
- 5〜6年生: 45〜60分

## 習慣化のポイント
1. 毎日決まった時間に
2. 専用の学習スペースを確保
3. 小さな目標から始める
4. できたことを認める・ほめる

最初は短い時間から。「できた！」の積み重ねが大切です。`,
    stage: 'early',
    categories: ['education'],
    source: {
      name: '家庭学習に関する教育研究等',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「全国学力・学習状況調査」結果概要',
        '各種教育研究機関による家庭学習に関する調査',
      ],
    },
    score: {
      total: 76,
      reliability: 22,
      neutrality: 20,
      freshness: 17,
      ageRelevance: 12,
      readability: 5,
    },
    publishedAt: '2026-02-15',
    updatedAt: '2026-02-15',
    imageUrl: '/articles/home-study.jpg',
    readingTime: 7,
    tags: ['家庭学習', '学習習慣', '小学生', '学年別'],
    relatedArticleIds: ['art-007', 'art-009'],
  },
  // Mid Stage articles
  {
    id: 'art-009',
    slug: 'extracurricular-activities-guide',
    title: '習い事の選び方ガイド：9〜10歳で伸ばしたい力',
    excerpt: 'この時期に始める習い事のメリット・デメリットを比較。子どもの適性と習い事の相性をまとめました。',
    content: `9〜10歳は「ゴールデンエイジ」とも呼ばれ、さまざまな能力が大きく伸びる時期です。

## 人気の習い事
1. スイミング
2. 学習塾
3. ピアノ
4. 英語・英会話
5. サッカー

## 選び方のポイント
- 子ども自身の興味・関心を最優先に
- 無理な掛け持ちは避ける
- 体験レッスンを活用する
- 送迎の負担も考慮する

お子さんが「やりたい！」と思えることが一番大切ですよね。`,
    stage: 'mid',
    categories: ['education'],
    source: {
      name: '習い事・課外活動に関する各種調査',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「子どもの学校外での学習活動に関する実態調査」',
        '各種教育関連メディアの調査データ',
      ],
    },
    score: {
      total: 74,
      reliability: 21,
      neutrality: 19,
      freshness: 18,
      ageRelevance: 11,
      readability: 5,
    },
    publishedAt: '2026-02-20',
    updatedAt: '2026-02-20',
    imageUrl: '/articles/extracurricular.jpg',
    readingTime: 9,
    tags: ['習い事', 'ゴールデンエイジ', '適性', '小学校中学年'],
    relatedArticleIds: ['art-010', 'art-008'],
  },
  {
    id: 'art-010',
    slug: 'screen-time-management',
    title: 'スクリーンタイムの適切な管理方法：年齢別ガイドライン',
    excerpt: 'WHOなどのガイドラインをもとに、デジタルデバイスとの健全な付き合い方をまとめました。',
    content: `デジタルデバイスは現代の子育てに欠かせない一方、適切な管理も大切ですよね。

## 年齢別の目安（各機関のガイドラインより）
- 2歳未満: ビデオ通話以外はなるべく避ける
- 2〜5歳: 1日1時間以内（質の高いコンテンツ）
- 6歳以上: 家庭でルールを決める

## 健全なデジタル習慣のヒント
1. 食事中はデバイスを使わない
2. 就寝1時間前はスクリーンオフ
3. 親子で一緒にコンテンツを楽しむ時間を作る
4. 外遊びとのバランスを取る

完全に禁止するより、上手に付き合うルールを一緒に考えてみましょう。`,
    stage: 'mid',
    categories: ['digital', 'health'],
    source: {
      name: 'スクリーンタイムに関する国際的ガイドライン',
      url: 'https://www.who.int/',
      references: [
        'WHO「Guidelines on physical activity, sedentary behaviour and sleep」',
        '米国小児科学会 メディアガイドライン',
      ],
    },
    score: {
      total: 86,
      reliability: 28,
      neutrality: 23,
      freshness: 16,
      ageRelevance: 12,
      readability: 7,
    },
    publishedAt: '2026-02-25',
    updatedAt: '2026-02-25',
    imageUrl: '/articles/screen-time.jpg',
    readingTime: 8,
    tags: ['スクリーンタイム', 'デジタルリテラシー', 'WHO', 'メディア'],
    relatedArticleIds: ['art-011'],
  },
  // Upper Stage articles
  {
    id: 'art-011',
    slug: 'junior-high-exam-vs-public',
    title: '中学受験と公立進学、どう考える？：メリット・デメリット比較',
    excerpt: '中学受験を検討するご家庭が増えています。公立中学との違い、費用、子どもへの影響を中立的にまとめました。',
    content: `中学受験をするかどうかは、家庭の教育方針やお子さんの気持ちによって答えが変わる大きな選択ですよね。

## 中学受験のメリット
- 学習習慣が身につく
- 学力の高い仲間と切磋琢磨できる
- 一貫教育のカリキュラム

## 中学受験のデメリット
- 経済的負担が大きい
- 子どもへの精神的プレッシャー
- 遊び・友達との時間が減少

## 公立中学のメリット
- 多様な環境で社会性が育つ
- 経済的負担が少ない
- 地域コミュニティとのつながり

## どう判断する？
「正解」はひとつではありません。お子さんの性格、ご家庭の状況、地域の教育環境を総合的に考えて、お子さんと一緒に話し合ってみてくださいね。`,
    stage: 'upper',
    categories: ['education'],
    source: {
      name: '中学受験・進学に関する各種情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「学校基本調査」',
        '各種教育関連メディアの受験・進学に関する調査',
      ],
    },
    score: {
      total: 80,
      reliability: 23,
      neutrality: 23,
      freshness: 18,
      ageRelevance: 11,
      readability: 5,
    },
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-01',
    imageUrl: '/articles/exam-vs-public.jpg',
    readingTime: 12,
    tags: ['中学受験', '公立中学', '進学', '教育費'],
    relatedArticleIds: ['art-012', 'art-009'],
  },
  {
    id: 'art-012',
    slug: 'self-study-skills-upper-elementary',
    title: '自主学習力の育て方：小学校高学年から始める自立した学び',
    excerpt: '中学進学を見据え、自分で計画・実行・振り返りができる学習スキルの身につけ方をまとめました。',
    content: `小学校高学年は、「教えられる学び」から「自分で学ぶ」への転換期です。

## 自主学習の3つの柱
1. **計画力**: 週間・日別の学習計画を立てる
2. **実行力**: 計画に沿って集中して取り組む
3. **振り返り力**: 何がわかって何がわからないかを把握する

## 親のサポート方法
- 答えを教えるのではなく、調べ方を教える
- 過程を認め、結果だけで評価しない
- 失敗を学びの機会として捉える姿勢を見せる

少しずつ手を離していく時期。見守る勇気も大切ですね。`,
    stage: 'upper',
    categories: ['education'],
    source: {
      name: '自主学習・学習指導に関する公的情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省 学習指導要領',
        '各種教育研究機関の自主学習に関する調査',
      ],
    },
    score: {
      total: 82,
      reliability: 26,
      neutrality: 21,
      freshness: 17,
      ageRelevance: 12,
      readability: 6,
    },
    publishedAt: '2026-03-02',
    updatedAt: '2026-03-02',
    imageUrl: '/articles/self-study.jpg',
    readingTime: 7,
    tags: ['自主学習', '高学年', '学習法', '自立'],
    relatedArticleIds: ['art-011', 'art-008'],
  },
  {
    id: 'art-013',
    slug: 'bullying-prevention-response',
    title: 'いじめの早期発見と対応：親ができること・学校との連携方法',
    excerpt: 'いじめのサインの見つけ方、子どもへの寄り添い方、学校や相談機関との連携方法をまとめました。',
    content: `いじめは、どの子どもにも起こりうる問題です。早期発見と適切な対応がとても大切です。

## いじめのサイン
- 学校の話をしなくなる
- 持ち物がなくなる・壊れる
- 体調不良を訴える頻度が増す
- 食欲がなくなる
- 表情が暗くなる

## 親ができること
1. 日頃から話しやすい関係を築く
2. サインに気づいたら落ち着いて聞く
3. 子どもを責めない
4. 学校と連携する
5. 必要に応じて専門機関に相談

## 相談窓口
- 24時間子供SOSダイヤル: 0120-0-78310
- 法務局子どもの人権110番: 0120-007-110

一人で抱え込まないでくださいね。頼れる場所はたくさんあります。`,
    stage: 'upper',
    categories: ['mental'],
    source: {
      name: 'いじめ防止に関する公的情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「いじめ防止対策推進法」関連資料',
        '法務省 子どもの人権に関する情報',
      ],
    },
    score: {
      total: 88,
      reliability: 28,
      neutrality: 24,
      freshness: 17,
      ageRelevance: 12,
      readability: 7,
    },
    publishedAt: '2026-02-28',
    updatedAt: '2026-02-28',
    imageUrl: '/articles/bullying.jpg',
    readingTime: 10,
    tags: ['いじめ', 'メンタルヘルス', '不登校', '相談窓口'],
    relatedArticleIds: ['art-014'],
  },
  {
    id: 'art-014',
    slug: 'child-self-esteem',
    title: '子どもの自己肯定感を育む：日常でできる10のアプローチ',
    excerpt: '自己肯定感が高い子どもは困難に強い。日常生活の中で実践できる育み方をまとめました。',
    content: `自己肯定感は「自分は大丈夫」「自分には価値がある」と感じられる力です。

## 自己肯定感を育む10のアプローチ

1. **存在を認める言葉がけ**: 「あなたがいてくれてうれしい」
2. **プロセスをほめる**: 結果ではなく努力を認める
3. **選択肢を与える**: 自分で決める経験を増やす
4. **失敗を許容する**: 「失敗しても大丈夫」の環境づくり
5. **気持ちを言語化する**: 感情を受け止め、名前をつける手助け
6. **お手伝いの機会**: 家庭での役割が自信につながる
7. **比較しない**: きょうだい・友達との比較を避ける
8. **スキンシップ**: 年齢に合ったスキンシップ
9. **得意を伸ばす**: 好きなことに没頭できる環境
10. **親自身のセルフケア**: パパ・ママが元気でいることも大切

完璧をめざさなくて大丈夫。できることから少しずつ取り入れてみてくださいね。`,
    stage: 'mid',
    categories: ['mental'],
    source: {
      name: '子どもの心理・自己肯定感に関する研究等',
      url: 'https://www.mhlw.go.jp/',
      references: [
        '厚生労働省「健やか親子21」関連資料',
        '各種心理学研究における自己肯定感に関する知見',
      ],
    },
    score: {
      total: 84,
      reliability: 25,
      neutrality: 22,
      freshness: 18,
      ageRelevance: 12,
      readability: 7,
    },
    publishedAt: '2026-02-18',
    updatedAt: '2026-02-18',
    imageUrl: '/articles/self-esteem.jpg',
    readingTime: 9,
    tags: ['自己肯定感', 'メンタルヘルス', '子育て', '心理'],
    relatedArticleIds: ['art-013'],
  },
  {
    id: 'art-015',
    slug: 'programming-education-kids',
    title: '小学生のプログラミング教育：自宅でできる学習方法と教材ガイド',
    excerpt: '必修化されたプログラミング教育。家庭でも楽しく学べる方法とおすすめの教材をまとめました。',
    content: `プログラミング教育は「プログラマーを育てる」ことが目的ではなく、論理的に考える力を養うことが大切にされています。

## 年齢別おすすめ学習方法

### 6〜8歳
- Scratch Jr（ビジュアルプログラミング）
- ロボットプログラミング玩具

### 9〜10歳
- Scratch（MITメディアラボ開発）
- マインクラフト Education

### 11〜12歳
- Python入門
- Webサイト作成（HTML/CSS）

## 大切な姿勢
- 正解を急がせない
- 「動かない→なぜ？→直す」のサイクルを楽しむ
- 子どもの「やってみたい！」を大切に

親子で一緒に取り組むと、子どもも楽しく続けられますよ。`,
    stage: 'early',
    categories: ['digital', 'education'],
    source: {
      name: 'プログラミング教育に関する公的情報',
      url: 'https://www.mext.go.jp/',
      references: [
        '文部科学省「小学校プログラミング教育の手引」',
        '総務省「プログラミング教育の推進」関連資料',
      ],
    },
    score: {
      total: 79,
      reliability: 24,
      neutrality: 20,
      freshness: 16,
      ageRelevance: 12,
      readability: 7,
    },
    publishedAt: '2026-02-22',
    updatedAt: '2026-02-22',
    imageUrl: '/articles/programming.jpg',
    readingTime: 8,
    tags: ['プログラミング', 'STEM教育', 'Scratch', 'デジタル教育'],
    relatedArticleIds: ['art-010'],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByStage(stage: string): Article[] {
  return ARTICLES.filter((a) => a.stage === stage);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.categories.includes(category as never));
}

export function getFeaturedArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.score.total - a.score.total).slice(0, 6);
}

export function getLatestArticles(count: number = 10): Article[] {
  return [...ARTICLES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}
