export const HERO_PHOTO = '/photos/hero-main.webp';

export const CATEGORY_PHOTOS: Record<string, string> = {
  development: '/photos/cat-development.webp',
  nutrition: '/photos/cat-nutrition.webp',
  education: '/photos/cat-education.webp',
  health: '/photos/cat-health.webp',
  mental: '/photos/cat-mental.webp',
  digital: '/photos/cat-digital.webp',
  social: '/photos/cat-social.webp',
  lifestyle: '/photos/cat-lifestyle.webp',
  pregnancy: '/photos/cat-pregnancy.webp',
};

export const STAGE_PHOTOS: Record<string, string> = {
  '0stage': '/photos/stage-0.webp',
  pre: '/photos/stage-pre.webp',
  early: '/photos/stage-early.webp',
  mid: '/photos/stage-mid.webp',
  upper: '/photos/stage-upper.webp',
};

export const STAGE_ICON_PHOTOS: Record<string, string> = {
  '0stage': '/photos/stage-icon-0.webp',
  pre: '/photos/stage-icon-pre.webp',
  early: '/photos/stage-icon-early.webp',
  mid: '/photos/stage-icon-mid.webp',
  upper: '/photos/stage-icon-upper.webp',
};

export const ABOUT_PHOTO = '/photos/about-mission.webp';
export const BOKEH_TEXTURE = '/photos/texture-warm-bokeh.webp';

export const SEASONAL_BANNER_PHOTOS: Record<string, string> = {
  spring: '/photos/seasonal-spring.webp',
  summer: '/photos/seasonal-summer.webp',
  autumn: '/photos/seasonal-autumn.webp',
  winter: '/photos/seasonal-winter.webp',
};

/**
 * 月から季節バナー画像を取得
 * テーマの months 配列の先頭月を基準に季節を判定
 */
export function getSeasonalBannerPhoto(months: number[]): string {
  const month = months[0];
  if ([3, 4, 2].includes(month)) return SEASONAL_BANNER_PHOTOS.spring;
  if ([5, 6, 7, 8].includes(month)) return SEASONAL_BANNER_PHOTOS.summer;
  if ([9, 10, 11].includes(month)) return SEASONAL_BANNER_PHOTOS.autumn;
  return SEASONAL_BANNER_PHOTOS.winter;
}

export function getCategoryPhoto(categoryId: string): string | undefined {
  return CATEGORY_PHOTOS[categoryId];
}

export function getStagePhoto(stageId: string): string | undefined {
  return STAGE_PHOTOS[stageId];
}
