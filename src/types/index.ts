// Age stage definitions
export type AgeStage = '0stage' | 'pre' | 'early' | 'mid' | 'upper';

export interface AgeStageInfo {
  id: AgeStage;
  label: string;
  labelEn: string;
  ageRange: string;
  ageMin: number;
  ageMax: number;
  description: string;
  color: string;
  colorLight: string;
  themes: string[];
}

// Content categories
export type ContentCategory =
  | 'development'
  | 'nutrition'
  | 'education'
  | 'health'
  | 'mental'
  | 'digital'
  | 'social'
  | 'expert';

export interface CategoryInfo {
  id: ContentCategory;
  label: string;
  icon: string;
  description: string;
}

// Article types
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  stage: AgeStage;
  categories: ContentCategory[];
  source: ArticleSource;
  score: QualityScore;
  author?: Expert;
  supervisor?: Expert;
  publishedAt: string;
  updatedAt: string;
  imageUrl: string;
  readingTime: number;
  tags: string[];
  relatedArticleIds: string[];
}

export interface ArticleSource {
  name: string;
  url: string;
  organization: string;
  publishedDate: string;
}

export interface QualityScore {
  total: number;
  reliability: number;
  neutrality: number;
  freshness: number;
  ageRelevance: number;
  readability: number;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  speciality: string;
  imageUrl: string;
  bio: string;
}

// Search & filter
export interface ArticleFilter {
  stage?: AgeStage;
  category?: ContentCategory;
  query?: string;
  sort?: 'newest' | 'popular' | 'score';
}

// Age selector
export interface ChildProfile {
  id: string;
  name: string;
  ageYears: number;
  ageMonths: number;
}
