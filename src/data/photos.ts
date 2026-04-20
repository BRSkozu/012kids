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

export const ABOUT_PHOTO = '/photos/about-mission.webp';
export const BOKEH_TEXTURE = '/photos/texture-warm-bokeh.webp';

export function getCategoryPhoto(categoryId: string): string | undefined {
  return CATEGORY_PHOTOS[categoryId];
}

export function getStagePhoto(stageId: string): string | undefined {
  return STAGE_PHOTOS[stageId];
}
