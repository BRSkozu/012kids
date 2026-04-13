import type { AgeStage, ContentCategory } from '@/types';

interface Props {
  stage: AgeStage;
  category: ContentCategory;
  size?: number;
  className?: string;
}

/**
 * Stage × Category illustration matrix.
 * Generates 45 unique SVG variations (5 stages × 9 categories) by layering:
 *  - stage-specific background wash + silhouette colors
 *  - category-specific motif (book / stethoscope / sprout etc.)
 *  - per-cell accent shapes so no two cards look identical.
 *
 * Keeps bundle size tiny by composing shared SVG primitives rather than
 * shipping 45 separate raster images.
 */

// ---- Stage palette (background wash, silhouette body color, accent color) ----
const STAGE_PALETTES: Record<AgeStage, { bg: string; body: string; accent: string; dot: string }> = {
  '0stage': { bg: '#FFF0F0', body: '#FFB3B3', accent: '#FF8A8A', dot: '#FFD9A0' },
  pre:      { bg: '#FFF8ED', body: '#FFD9A0', accent: '#E8943D', dot: '#FFB3B3' },
  early:    { bg: '#FFFEF0', body: '#FFFAA0', accent: '#DDB84D', dot: '#A8E6CF' },
  mid:      { bg: '#EEFAF4', body: '#A8E6CF', accent: '#4FAE84', dot: '#A0C4FF' },
  upper:    { bg: '#EEF4FF', body: '#A0C4FF', accent: '#5A82D4', dot: '#FFD9A0' },
};

// A tiny silhouette per stage (cute, head + body)
function StageSilhouette({ stage, cx, cy, scale = 1 }: { stage: AgeStage; cx: number; cy: number; scale?: number }) {
  const p = STAGE_PALETTES[stage];
  const s = scale;
  switch (stage) {
    case '0stage':
      // baby: round head + swaddle
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <ellipse cx="0" cy="8" rx="14" ry="10" fill={p.body} />
          <circle cx="0" cy="-6" r="11" fill="#FFE4D6" />
          <circle cx="-4" cy="-6" r="1.4" fill="#2d2a26" />
          <circle cx="4" cy="-6" r="1.4" fill="#2d2a26" />
          <path d="M-3 -2 Q0 0 3 -2" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'pre':
      // toddler: head + body + tuft of hair
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <rect x="-10" y="2" width="20" height="16" rx="5" fill={p.body} />
          <circle cx="0" cy="-6" r="11" fill="#FFE4D6" />
          <path d="M-9 -10 Q-7 -16 0 -15 Q7 -16 9 -10 Z" fill="#8B6F47" />
          <circle cx="-4" cy="-6" r="1.4" fill="#2d2a26" />
          <circle cx="4" cy="-6" r="1.4" fill="#2d2a26" />
          <path d="M-3 -2 Q0 1 3 -2" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'early':
      // young kid: school-ish, book hinted
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <rect x="-11" y="0" width="22" height="18" rx="4" fill={p.body} />
          <circle cx="0" cy="-7" r="10" fill="#FFE4D6" />
          <path d="M-10 -11 Q-7 -17 0 -16 Q7 -17 10 -11 L10 -7 Q5 -11 0 -10 Q-5 -11 -10 -7 Z" fill="#4A3728" />
          <circle cx="-3.5" cy="-7" r="1.3" fill="#2d2a26" />
          <circle cx="3.5" cy="-7" r="1.3" fill="#2d2a26" />
          <path d="M-3 -3 Q0 0 3 -3" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'mid':
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <rect x="-12" y="-2" width="24" height="20" rx="5" fill={p.body} />
          <circle cx="0" cy="-9" r="10" fill="#FFE4D6" />
          <path d="M-10 -13 Q-8 -19 0 -18 Q8 -19 10 -13 L10 -9 Q6 -13 0 -12 Q-6 -13 -10 -9 Z" fill="#2D1B10" />
          <circle cx="-3.5" cy="-9" r="1.3" fill="#2d2a26" />
          <circle cx="3.5" cy="-9" r="1.3" fill="#2d2a26" />
          <path d="M-3 -5 Q0 -2 3 -5" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'upper':
      return (
        <g transform={`translate(${cx} ${cy}) scale(${s})`}>
          <rect x="-12" y="-2" width="24" height="22" rx="5" fill={p.body} />
          <circle cx="0" cy="-10" r="10" fill="#FFE4D6" />
          <path d="M-10 -14 Q-8 -20 0 -19 Q8 -20 10 -14 L10 -10 Q6 -14 0 -13 Q-6 -14 -10 -10 Z" fill="#1E1309" />
          {/* tiny glasses */}
          <circle cx="-3.5" cy="-10" r="2.4" stroke={p.accent} strokeWidth="0.8" fill="none" />
          <circle cx="3.5" cy="-10" r="2.4" stroke={p.accent} strokeWidth="0.8" fill="none" />
          <line x1="-1" y1="-10" x2="1" y2="-10" stroke={p.accent} strokeWidth="0.6" />
          <path d="M-3 -5 Q0 -3 3 -5" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );
  }
}

// Category-specific motif painted in a corner
function CategoryMotif({ category, stage }: { category: ContentCategory; stage: AgeStage }) {
  const p = STAGE_PALETTES[stage];
  switch (category) {
    case 'development':
      return (
        <g>
          {/* sprout */}
          <path d="M22 72 L22 56" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 62 Q14 58 16 50 Q22 54 22 62" fill="#A8E6CF" />
          <path d="M22 58 Q30 52 28 44 Q22 48 22 58" fill="#8BD4B0" />
          <circle cx="90" cy="22" r="3" fill={p.dot} />
        </g>
      );
    case 'nutrition':
      return (
        <g>
          <circle cx="24" cy="74" r="8" fill="#FFB3B3" />
          <path d="M24 65 Q26 61 28 65" stroke="#4A8C5C" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M90 24 L94 36 L86 36 Z" fill="#e07b4c" />
          <path d="M88 24 Q90 20 92 24" stroke="#4A8C5C" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 'education':
      return (
        <g>
          <path d="M14 68 L28 64 L28 78 L14 82 Z" fill="white" stroke={p.accent} strokeWidth="1.2" />
          <path d="M28 64 L42 68 L42 82 L28 78 Z" fill="white" stroke={p.accent} strokeWidth="1.2" />
          <line x1="17" y1="71" x2="25" y2="70" stroke={p.dot} strokeWidth="1" />
          <line x1="31" y1="70" x2="39" y2="71" stroke={p.dot} strokeWidth="1" />
          <circle cx="92" cy="20" r="2.5" fill={p.dot} />
        </g>
      );
    case 'health':
      return (
        <g>
          <path d="M16 62 Q16 74 24 78 Q32 74 32 62" stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="24" cy="80" r="4" stroke={p.accent} strokeWidth="1.5" fill={p.bg} />
          <rect x="88" y="18" width="3" height="10" rx="1" fill="#A8E6CF" />
          <rect x="85" y="21" width="9" height="3" rx="1" fill="#A8E6CF" />
        </g>
      );
    case 'mental':
      return (
        <g>
          <path d="M16 66 Q16 56 22 62 Q28 56 28 66 Q28 74 22 80 Q16 74 16 66" fill="#A8E6CF" />
          <path d="M88 22 Q88 16 92 20 Q96 16 96 22 Q96 28 92 32 Q88 28 88 22" fill="#FFB3B3" opacity="0.7" />
        </g>
      );
    case 'digital':
      return (
        <g>
          <rect x="12" y="60" width="22" height="16" rx="2" fill="white" stroke={p.accent} strokeWidth="1.2" />
          <rect x="15" y="64" width="10" height="2" rx="1" fill="#A8E6CF" />
          <rect x="15" y="68" width="14" height="2" rx="1" fill={p.dot} />
          <rect x="15" y="72" width="8" height="2" rx="1" fill="#FFB3B3" />
          <circle cx="88" cy="22" r="3" fill={p.accent} opacity="0.5" />
        </g>
      );
    case 'social':
      return (
        <g>
          <circle cx="18" cy="70" r="3.5" fill="#FFE4D6" />
          <rect x="14.5" y="73" width="7" height="6" rx="2" fill="#A8E6CF" />
          <circle cx="30" cy="70" r="3.5" fill="#FFE4D6" />
          <rect x="26.5" y="73" width="7" height="6" rx="2" fill={p.dot} />
          <line x1="21.5" y1="72" x2="26.5" y2="72" stroke={p.accent} strokeDasharray="1.5 1.5" strokeWidth="0.8" />
          <circle cx="90" cy="22" r="3" fill={p.dot} />
        </g>
      );
    case 'lifestyle':
      return (
        <g>
          <path d="M12 70 L24 60 L36 70" stroke={p.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="15" y="70" width="18" height="10" rx="1" fill="#FFE4D6" />
          <rect x="21" y="73" width="6" height="7" fill={p.accent} opacity="0.4" />
          <circle cx="90" cy="22" r="3" fill={p.dot} />
        </g>
      );
    case 'pregnancy':
      return (
        <g>
          <circle cx="22" cy="64" r="5" fill="#FFE4D6" />
          <path d="M17 69 Q17 78 22 80 Q24 80 25 77 Q27 80 28 79 Q28 69 25 69 Z" fill="#FFB3B3" opacity="0.6" />
          <path d="M20 74 Q20 72 22 74 Q24 72 24 74 Q24 76 22 77 Q20 76 20 74" fill="#FF9E9E" />
          <circle cx="90" cy="22" r="3" fill={p.dot} />
        </g>
      );
  }
}

// Unique per-cell accent — pattern selected from a stable hash of (stage, category)
function UniqueAccent({ stage, category }: { stage: AgeStage; category: ContentCategory }) {
  const p = STAGE_PALETTES[stage];
  // 45 (stage×cat) → one of 6 accent patterns, deterministic
  const hash =
    (['0stage', 'pre', 'early', 'mid', 'upper'].indexOf(stage) +
      1) * 7 +
    [
      'development',
      'nutrition',
      'education',
      'health',
      'mental',
      'digital',
      'social',
      'lifestyle',
      'pregnancy',
    ].indexOf(category);
  const variant = hash % 6;

  switch (variant) {
    case 0:
      return (
        <g opacity="0.35">
          <circle cx="85" cy="70" r="2" fill={p.accent} />
          <circle cx="94" cy="64" r="1.5" fill={p.dot} />
          <circle cx="78" cy="76" r="1.2" fill={p.accent} />
        </g>
      );
    case 1:
      return (
        <g opacity="0.4">
          <path d="M72 20 L76 14 L80 20 L76 26 Z" fill={p.dot} />
          <path d="M82 64 L86 60 L90 64 L86 68 Z" fill={p.accent} opacity="0.6" />
        </g>
      );
    case 2:
      return (
        <g>
          <path d="M74 18 Q80 12 86 18" stroke={p.accent} strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M74 22 Q80 16 86 22" stroke={p.dot} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case 3:
      return (
        <g opacity="0.5">
          <path d="M80 14 L82 18 L86 18 L83 21 L84 25 L80 22 L76 25 L77 21 L74 18 L78 18 Z" fill={p.dot} />
        </g>
      );
    case 4:
      return (
        <g opacity="0.45">
          <rect x="74" y="60" width="16" height="2" rx="1" fill={p.accent} />
          <rect x="78" y="66" width="12" height="2" rx="1" fill={p.dot} />
          <rect x="82" y="72" width="8" height="2" rx="1" fill={p.accent} />
        </g>
      );
    default:
      return (
        <g opacity="0.4">
          <circle cx="86" cy="18" r="6" fill="none" stroke={p.accent} strokeWidth="1" />
          <circle cx="86" cy="18" r="2" fill={p.dot} />
          <circle cx="14" cy="18" r="3" fill={p.dot} opacity="0.7" />
        </g>
      );
  }
}

export default function StageCategoryIllustration({ stage, category, size = 96, className = '' }: Props) {
  const p = STAGE_PALETTES[stage];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 108 100"
      fill="none"
      className={className}
      role="img"
      aria-label={`${stage}-${category} illustration`}
    >
      <rect x="0" y="0" width="108" height="100" rx="12" fill={p.bg} />
      {/* soft radial overlay */}
      <circle cx="80" cy="20" r="36" fill="white" opacity="0.35" />
      <UniqueAccent stage={stage} category={category} />
      <CategoryMotif category={category} stage={stage} />
      <StageSilhouette stage={stage} cx={64} cy={48} scale={1.2} />
    </svg>
  );
}
