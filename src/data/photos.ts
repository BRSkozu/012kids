const bp = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const HERO_PHOTO = `${bp}/photos/hero-main.webp`;

export const CATEGORY_PHOTOS: Record<string, string> = {
  development: `${bp}/photos/cat-development.webp`,
  nutrition: `${bp}/photos/cat-nutrition.webp`,
  education: `${bp}/photos/cat-education.webp`,
  health: `${bp}/photos/cat-health.webp`,
  mental: `${bp}/photos/cat-mental.webp`,
  digital: `${bp}/photos/cat-digital.webp`,
  social: `${bp}/photos/cat-social.webp`,
  lifestyle: `${bp}/photos/cat-lifestyle.webp`,
  pregnancy: `${bp}/photos/cat-pregnancy.webp`,
};

export const STAGE_PHOTOS: Record<string, string> = {
  '0stage': `${bp}/photos/stage-0.webp`,
  pre: `${bp}/photos/stage-pre.webp`,
  early: `${bp}/photos/stage-early.webp`,
  mid: `${bp}/photos/stage-mid.webp`,
  upper: `${bp}/photos/stage-upper.webp`,
};

export const STAGE_ICON_PHOTOS: Record<string, string> = {
  '0stage': `${bp}/photos/stage-icon-0.webp`,
  pre: `${bp}/photos/stage-icon-pre.webp`,
  early: `${bp}/photos/stage-icon-early.webp`,
  mid: `${bp}/photos/stage-icon-mid.webp`,
  upper: `${bp}/photos/stage-icon-upper.webp`,
};

export const ABOUT_PHOTO = `${bp}/photos/about-mission.webp`;
export const BOKEH_TEXTURE = `${bp}/photos/texture-warm-bokeh.webp`;

export const SEASONAL_BANNER_PHOTOS: Record<string, string> = {
  spring: `${bp}/photos/seasonal-spring.webp`,
  summer: `${bp}/photos/seasonal-summer.webp`,
  autumn: `${bp}/photos/seasonal-autumn.webp`,
  winter: `${bp}/photos/seasonal-winter.webp`,
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
