interface IllustrationProps {
  className?: string;
  size?: number;
}

export function BabyIllustration({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="#FFF0F0" />
      {/* Baby face */}
      <circle cx="60" cy="55" r="28" fill="#FFE4D6" />
      {/* Cheeks */}
      <circle cx="46" cy="60" r="5" fill="#FFB3B3" opacity="0.6" />
      <circle cx="74" cy="60" r="5" fill="#FFB3B3" opacity="0.6" />
      {/* Eyes */}
      <circle cx="50" cy="52" r="3" fill="#2d2a26" />
      <circle cx="70" cy="52" r="3" fill="#2d2a26" />
      <circle cx="51" cy="51" r="1" fill="white" />
      <circle cx="71" cy="51" r="1" fill="white" />
      {/* Smile */}
      <path d="M54 62 Q60 68 66 62" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hair tuft */}
      <path d="M52 30 Q55 22 60 28 Q65 22 68 30" stroke="#C4A882" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Stars */}
      <circle cx="25" cy="30" r="3" fill="#FFD9A0" />
      <circle cx="95" cy="35" r="2" fill="#FFB3B3" />
      <circle cx="90" cy="85" r="3" fill="#A8E6CF" />
      {/* Zzz */}
      <text x="82" y="30" fontSize="12" fill="#A0C4FF" fontWeight="bold" fontFamily="sans-serif">z</text>
      <text x="90" y="24" fontSize="10" fill="#A0C4FF" fontWeight="bold" fontFamily="sans-serif">z</text>
    </svg>
  );
}

export function ToddlerIllustration({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="60" r="56" fill="#FFF8ED" />
      {/* Body */}
      <rect x="46" y="68" width="28" height="24" rx="8" fill="#FFD9A0" />
      {/* Head */}
      <circle cx="60" cy="48" r="22" fill="#FFE4D6" />
      {/* Hair */}
      <path d="M40 42 Q42 28 60 26 Q78 28 80 42" fill="#8B6F47" />
      {/* Eyes */}
      <circle cx="52" cy="48" r="2.5" fill="#2d2a26" />
      <circle cx="68" cy="48" r="2.5" fill="#2d2a26" />
      {/* Smile */}
      <path d="M52 56 Q60 62 68 56" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hands up (playing) */}
      <circle cx="34" cy="65" r="6" fill="#FFE4D6" />
      <circle cx="86" cy="65" r="6" fill="#FFE4D6" />
      {/* Block toy */}
      <rect x="78" y="82" width="14" height="14" rx="2" fill="#A8E6CF" />
      <rect x="28" y="85" width="12" height="12" rx="2" fill="#FFB3B3" />
      {/* Stars */}
      <circle cx="22" cy="25" r="3" fill="#FFD9A0" />
      <circle cx="98" cy="28" r="2" fill="#A0C4FF" />
    </svg>
  );
}

export function ChildIllustration({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="60" r="56" fill="#FFFEF0" />
      {/* Body */}
      <rect x="44" y="62" width="32" height="30" rx="8" fill="#A0C4FF" />
      {/* Head */}
      <circle cx="60" cy="42" r="22" fill="#FFE4D6" />
      {/* Hair */}
      <path d="M38 36 Q40 20 60 18 Q80 20 82 36" fill="#4A3728" />
      {/* Eyes */}
      <ellipse cx="52" cy="42" rx="2" ry="2.5" fill="#2d2a26" />
      <ellipse cx="68" cy="42" rx="2" ry="2.5" fill="#2d2a26" />
      {/* Smile */}
      <path d="M52 50 Q60 56 68 50" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Backpack */}
      <rect x="72" y="60" width="16" height="20" rx="4" fill="#FFD9A0" />
      {/* Book */}
      <rect x="24" y="78" width="18" height="14" rx="2" fill="#FFFAA0" />
      <line x1="33" y1="78" x2="33" y2="92" stroke="#E8D98A" strokeWidth="1" />
      {/* Pencil */}
      <line x1="88" y1="90" x2="96" y2="82" stroke="#e07b4c" strokeWidth="3" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="20" cy="20" r="3" fill="#FFFAA0" />
      <circle cx="100" cy="25" r="2" fill="#A8E6CF" />
    </svg>
  );
}

export function PreteenIllustration({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="60" r="56" fill="#EEF4FF" />
      {/* Body */}
      <rect x="42" y="58" width="36" height="34" rx="8" fill="#A8E6CF" />
      {/* Head */}
      <circle cx="60" cy="38" r="22" fill="#FFE4D6" />
      {/* Hair */}
      <path d="M38 32 Q40 16 60 14 Q80 16 82 32 L82 38 Q78 34 60 32 Q42 34 38 38 Z" fill="#2D1B10" />
      {/* Eyes */}
      <ellipse cx="52" cy="38" rx="2" ry="3" fill="#2d2a26" />
      <ellipse cx="68" cy="38" rx="2" ry="3" fill="#2d2a26" />
      {/* Glasses */}
      <circle cx="52" cy="38" r="7" stroke="#e07b4c" strokeWidth="1.5" fill="none" />
      <circle cx="68" cy="38" r="7" stroke="#e07b4c" strokeWidth="1.5" fill="none" />
      <line x1="59" y1="38" x2="61" y2="38" stroke="#e07b4c" strokeWidth="1.5" />
      {/* Smile */}
      <path d="M54 46 Q60 50 66 46" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Laptop */}
      <rect x="22" y="82" width="22" height="14" rx="2" fill="#A0C4FF" />
      <rect x="20" y="96" width="26" height="3" rx="1" fill="#8AAFE0" />
      {/* Soccer ball */}
      <circle cx="94" cy="92" r="8" fill="white" stroke="#2d2a26" strokeWidth="1" />
      <path d="M90 88 L94 92 L98 88 M90 96 L94 92 L98 96" stroke="#2d2a26" strokeWidth="0.8" />
    </svg>
  );
}

// Category-specific illustrations

export function HealthIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#FFF0F0" />
      {/* Stethoscope */}
      <path d="M30 25 Q30 45 40 50 Q50 45 50 25" stroke="#e07b4c" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="52" r="6" stroke="#e07b4c" strokeWidth="2.5" fill="#FFE4D6" />
      {/* Heart */}
      <path d="M36 34 Q36 30 40 34 Q44 30 44 34 Q44 38 40 42 Q36 38 36 34" fill="#FFB3B3" />
      {/* Cross */}
      <rect x="56" y="18" width="4" height="12" rx="1" fill="#A8E6CF" />
      <rect x="52" y="22" width="12" height="4" rx="1" fill="#A8E6CF" />
    </svg>
  );
}

export function NutritionIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#FFF8ED" />
      {/* Apple */}
      <circle cx="34" cy="42" r="14" fill="#FFB3B3" />
      <path d="M34 28 Q36 24 38 28" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="34" cy="38" rx="3" ry="4" fill="#FF9E9E" opacity="0.5" />
      {/* Carrot */}
      <path d="M56 30 L62 55 L50 55 Z" fill="#e07b4c" />
      <path d="M54 30 Q56 24 58 30" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 30 Q56 22 60 30" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" />
      {/* Bowl */}
      <ellipse cx="40" cy="62" rx="18" ry="6" fill="#FFD9A0" />
      <path d="M22 62 Q22 72 40 72 Q58 72 58 62" fill="#FFD9A0" />
    </svg>
  );
}

export function EducationIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#FFFEF0" />
      {/* Open book */}
      <path d="M16 52 L40 48 L64 52 L64 24 L40 20 L16 24 Z" fill="white" stroke="#e07b4c" strokeWidth="1.5" />
      <line x1="40" y1="20" x2="40" y2="48" stroke="#e07b4c" strokeWidth="1.5" />
      {/* Lines on pages */}
      <line x1="22" y1="30" x2="36" y2="28" stroke="#FFD9A0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="36" x2="36" y2="34" stroke="#FFD9A0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="42" x2="36" y2="40" stroke="#FFD9A0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="28" x2="58" y2="30" stroke="#A8E6CF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="34" x2="58" y2="36" stroke="#A8E6CF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pencil */}
      <line x1="52" y1="58" x2="66" y2="44" stroke="#FFFAA0" strokeWidth="4" strokeLinecap="round" />
      <line x1="66" y1="44" x2="68" y2="42" stroke="#e07b4c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DevelopmentIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#EEFAF4" />
      {/* Sprout/plant */}
      <line x1="40" y1="58" x2="40" y2="34" stroke="#4A8C5C" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 42 Q28 38 30 28 Q38 30 40 42" fill="#A8E6CF" />
      <path d="M40 36 Q52 32 50 22 Q42 24 40 36" fill="#8BD4B0" />
      {/* Pot */}
      <path d="M28 58 Q28 68 40 68 Q52 68 52 58" fill="#e07b4c" />
      <rect x="26" y="56" width="28" height="4" rx="2" fill="#c4623a" />
      {/* Growth arrow */}
      <path d="M60 50 L60 20 L54 26" stroke="#FFD9A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M60 20 L66 26" stroke="#FFD9A0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Stars */}
      <circle cx="22" cy="22" r="2.5" fill="#FFD9A0" />
      <circle cx="64" cy="14" r="2" fill="#FFB3B3" />
    </svg>
  );
}

export function MentalIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#F0FFF4" />
      {/* Heart */}
      <path d="M28 35 Q28 22 40 32 Q52 22 52 35 Q52 48 40 56 Q28 48 28 35" fill="#A8E6CF" />
      <path d="M32 34 Q32 28 40 34" fill="#8BD4B0" opacity="0.5" />
      {/* Hands holding */}
      <path d="M18 50 Q22 42 28 46" stroke="#FFE4D6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M62 50 Q58 42 52 46" stroke="#FFE4D6" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Sparkles */}
      <circle cx="20" cy="20" r="2" fill="#FFD9A0" />
      <circle cx="60" cy="18" r="2.5" fill="#FFB3B3" />
      <circle cx="66" cy="60" r="2" fill="#A0C4FF" />
    </svg>
  );
}

export function DigitalIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#EEF4FF" />
      {/* Tablet/screen */}
      <rect x="22" y="20" width="36" height="28" rx="4" fill="white" stroke="#A0C4FF" strokeWidth="2" />
      {/* Screen content - code blocks */}
      <rect x="26" y="26" width="16" height="3" rx="1" fill="#A8E6CF" />
      <rect x="26" y="32" width="24" height="3" rx="1" fill="#FFD9A0" />
      <rect x="26" y="38" width="12" height="3" rx="1" fill="#FFB3B3" />
      {/* Stand */}
      <rect x="36" y="48" width="8" height="6" fill="#A0C4FF" />
      <rect x="30" y="54" width="20" height="3" rx="1.5" fill="#8AAFE0" />
      {/* Robot character */}
      <rect x="56" y="58" width="16" height="16" rx="4" fill="#A8E6CF" />
      <circle cx="61" cy="64" r="2" fill="#2d2a26" />
      <circle cx="67" cy="64" r="2" fill="#2d2a26" />
      <path d="M60 70 Q64 73 68 70" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="64" y1="58" x2="64" y2="54" stroke="#A8E6CF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="64" cy="52" r="2" fill="#FFD9A0" />
    </svg>
  );
}

export function SocialIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#F0F4FF" />
      {/* Globe */}
      <circle cx="40" cy="38" r="20" fill="#A0C4FF" opacity="0.3" stroke="#A0C4FF" strokeWidth="2" />
      <ellipse cx="40" cy="38" rx="10" ry="20" stroke="#A0C4FF" strokeWidth="1.5" fill="none" />
      <line x1="20" y1="38" x2="60" y2="38" stroke="#A0C4FF" strokeWidth="1.5" />
      <path d="M24 28 Q40 32 56 28" stroke="#A0C4FF" strokeWidth="1" fill="none" />
      <path d="M24 48 Q40 44 56 48" stroke="#A0C4FF" strokeWidth="1" fill="none" />
      {/* People */}
      <circle cx="22" cy="62" r="5" fill="#FFE4D6" />
      <rect x="18" y="67" width="8" height="8" rx="4" fill="#A8E6CF" />
      <circle cx="40" cy="62" r="5" fill="#FFE4D6" />
      <rect x="36" y="67" width="8" height="8" rx="4" fill="#FFD9A0" />
      <circle cx="58" cy="62" r="5" fill="#FFE4D6" />
      <rect x="54" y="67" width="8" height="8" rx="4" fill="#FFB3B3" />
      {/* Connection lines */}
      <line x1="27" y1="64" x2="35" y2="64" stroke="#A0C4FF" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="45" y1="64" x2="53" y2="64" stroke="#A0C4FF" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

export function LifestyleIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#FFF8F0" />
      {/* House */}
      <path d="M20 42 L40 24 L60 42" stroke="#e07b4c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="26" y="42" width="28" height="22" rx="2" fill="#FFE4D6" />
      <rect x="34" y="50" width="12" height="14" rx="1" fill="#e07b4c" opacity="0.6" />
      {/* Window */}
      <rect x="28" y="46" width="8" height="8" rx="1" fill="#A0C4FF" opacity="0.5" />
      <line x1="32" y1="46" x2="32" y2="54" stroke="white" strokeWidth="1" />
      <line x1="28" y1="50" x2="36" y2="50" stroke="white" strokeWidth="1" />
      {/* Coin/piggy */}
      <circle cx="62" cy="60" r="8" fill="#FFD9A0" />
      <text x="59" y="64" fontSize="10" fill="#c4623a" fontWeight="bold" fontFamily="sans-serif">¥</text>
      {/* Leaf */}
      <path d="M16 30 Q20 22 24 30 Q20 32 16 30" fill="#A8E6CF" />
      {/* Stars */}
      <circle cx="66" cy="22" r="2.5" fill="#FFB3B3" />
      <circle cx="14" cy="50" r="2" fill="#A0C4FF" />
    </svg>
  );
}

export function PregnancyIllustration({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="38" fill="#FFF0F5" />
      {/* Mother silhouette */}
      <circle cx="38" cy="26" r="10" fill="#FFE4D6" />
      <path d="M28 36 Q28 60 38 62 Q42 62 44 56 Q48 62 52 60 Q52 36 44 36 Z" fill="#FFB3B3" opacity="0.6" />
      {/* Baby heart */}
      <path d="M36 48 Q36 44 40 48 Q44 44 44 48 Q44 52 40 54 Q36 52 36 48" fill="#FF9E9E" />
      {/* Stork */}
      <circle cx="62" cy="24" r="6" fill="white" stroke="#A0C4FF" strokeWidth="1.5" />
      <circle cx="64" cy="23" r="1" fill="#2d2a26" />
      <path d="M66 25 L72 27" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      {/* Bundle */}
      <ellipse cx="72" cy="32" rx="6" ry="5" fill="#A8E6CF" opacity="0.6" />
      {/* Stars */}
      <circle cx="18" cy="18" r="2.5" fill="#FFD9A0" />
      <circle cx="66" cy="62" r="2" fill="#A8E6CF" />
      <circle cx="20" cy="58" r="2" fill="#A0C4FF" />
    </svg>
  );
}

// Map functions
export function getCategoryIllustration(category: string) {
  switch (category) {
    case 'health': return HealthIllustration;
    case 'nutrition': return NutritionIllustration;
    case 'education': return EducationIllustration;
    case 'development': return DevelopmentIllustration;
    case 'mental': return MentalIllustration;
    case 'digital': return DigitalIllustration;
    case 'social': return SocialIllustration;
    case 'lifestyle': return LifestyleIllustration;
    case 'pregnancy': return PregnancyIllustration;
    default: return EducationIllustration;
  }
}
