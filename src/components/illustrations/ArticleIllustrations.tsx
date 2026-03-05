import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

// 1. Baby Sleep
function BabySleepIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#EEF0FF" />
      {/* Moon */}
      <path d="M140 40 Q160 60 150 85 Q130 75 120 55 Q115 40 140 40" fill="#FFD9A0" />
      {/* Stars */}
      <circle cx="60" cy="35" r="3" fill="#FFD9A0" />
      <circle cx="80" cy="50" r="2" fill="#FFD9A0" />
      <circle cx="170" cy="55" r="2.5" fill="#FFD9A0" />
      <circle cx="45" cy="60" r="2" fill="#FFD9A0" />
      {/* Blanket */}
      <ellipse cx="100" cy="130" rx="55" ry="30" fill="#C5CAF5" />
      {/* Baby face peeking */}
      <circle cx="100" cy="110" r="24" fill="#FFE4D6" />
      {/* Closed eyes */}
      <path d="M89 108 Q93 112 97 108" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M103 108 Q107 112 111 108" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="87" cy="114" r="4" fill="#FFB3B3" opacity="0.5" />
      <circle cx="113" cy="114" r="4" fill="#FFB3B3" opacity="0.5" />
      {/* Zzz */}
      <text x="130" y="90" fontSize="18" fill="#A0C4FF" fontWeight="bold" fontFamily="sans-serif">Z</text>
      <text x="142" y="78" fontSize="14" fill="#A0C4FF" fontWeight="bold" fontFamily="sans-serif">z</text>
      <text x="150" y="68" fontSize="10" fill="#A0C4FF" fontWeight="bold" fontFamily="sans-serif">z</text>
    </svg>
  );
}

// 2. Weaning Food
function WeaningFoodIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFF8ED" />
      {/* Bowl */}
      <ellipse cx="100" cy="120" rx="50" ry="16" fill="#FFD9A0" />
      <path d="M50 120 Q50 150 100 150 Q150 150 150 120" fill="#FFD9A0" />
      {/* Food in bowl */}
      <ellipse cx="100" cy="118" rx="42" ry="12" fill="#FFE8C0" />
      {/* Rice */}
      <circle cx="85" cy="115" r="5" fill="white" opacity="0.8" />
      <circle cx="100" cy="112" r="5" fill="white" opacity="0.8" />
      <circle cx="115" cy="115" r="5" fill="white" opacity="0.8" />
      {/* Carrot */}
      <rect x="90" y="108" width="6" height="10" rx="2" fill="#e07b4c" />
      {/* Spoon */}
      <line x1="130" y1="90" x2="155" y2="65" stroke="#C0C0C0" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="128" cy="92" rx="8" ry="6" fill="#D0D0D0" />
      {/* Steam */}
      <path d="M80 95 Q78 85 82 80" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M100 90 Q98 80 102 75" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M120 95 Q118 85 122 80" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Baby bib */}
      <path d="M55 50 Q60 40 70 45 Q65 55 55 50" fill="#A8E6CF" />
    </svg>
  );
}

// 3. Development Milestones
function DevelopmentMilestonesIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#EEFAF4" />
      {/* Growth chart */}
      <line x1="40" y1="160" x2="40" y2="40" stroke="#4A8C5C" strokeWidth="2" />
      <line x1="40" y1="160" x2="170" y2="160" stroke="#4A8C5C" strokeWidth="2" />
      {/* Growth curve */}
      <path d="M40 150 Q70 145 85 120 Q100 95 130 70 Q150 55 170 45" stroke="#A8E6CF" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Milestone dots */}
      <circle cx="55" cy="148" r="6" fill="#FFB3B3" />
      <circle cx="85" cy="120" r="6" fill="#FFD9A0" />
      <circle cx="130" cy="70" r="6" fill="#A0C4FF" />
      <circle cx="170" cy="45" r="6" fill="#A8E6CF" />
      {/* Labels */}
      <text x="48" y="168" fontSize="10" fill="#666" fontFamily="sans-serif">0m</text>
      <text x="78" y="140" fontSize="10" fill="#666" fontFamily="sans-serif">6m</text>
      <text x="123" y="90" fontSize="10" fill="#666" fontFamily="sans-serif">1y</text>
      {/* Stars */}
      <circle cx="160" cy="35" r="3" fill="#FFD9A0" />
      <circle cx="175" cy="50" r="2" fill="#FFB3B3" />
    </svg>
  );
}

// 4. Play Learning
function PlayLearningIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFFEF0" />
      {/* Building blocks */}
      <rect x="60" y="120" width="30" height="30" rx="4" fill="#FFB3B3" />
      <rect x="95" y="120" width="30" height="30" rx="4" fill="#A0C4FF" />
      <rect x="78" y="88" width="30" height="30" rx="4" fill="#A8E6CF" />
      <rect x="88" y="58" width="25" height="28" rx="4" fill="#FFD9A0" />
      {/* Crayons */}
      <rect x="140" y="100" width="8" height="45" rx="3" fill="#FF9E9E" transform="rotate(-15 144 122)" />
      <rect x="152" y="102" width="8" height="45" rx="3" fill="#A0C4FF" transform="rotate(5 156 124)" />
      {/* Music note */}
      <circle cx="45" cy="65" r="5" fill="#C5CAF5" />
      <line x1="50" y1="65" x2="50" y2="42" stroke="#C5CAF5" strokeWidth="2" />
      <path d="M50 42 Q58 38 56 46" fill="#C5CAF5" />
      {/* Stars */}
      <circle cx="160" cy="45" r="3" fill="#FFD9A0" />
      <circle cx="40" cy="140" r="2.5" fill="#A8E6CF" />
    </svg>
  );
}

// 5. Kindergarten
function KindergartenIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFF8F0" />
      {/* Building */}
      <rect x="55" y="75" width="90" height="70" rx="4" fill="#FFE8C0" />
      <rect x="60" y="80" width="80" height="4" rx="2" fill="#FFD9A0" />
      {/* Roof */}
      <path d="M45 78 L100 45 L155 78" fill="#e07b4c" />
      {/* Door */}
      <rect x="85" y="110" width="30" height="35" rx="4" fill="#A0C4FF" />
      <circle cx="108" cy="128" r="3" fill="#8AAFE0" />
      {/* Windows */}
      <rect x="65" y="92" width="18" height="16" rx="2" fill="#A0C4FF" />
      <rect x="117" y="92" width="18" height="16" rx="2" fill="#A0C4FF" />
      {/* Flag */}
      <line x1="100" y1="45" x2="100" y2="28" stroke="#666" strokeWidth="2" />
      <rect x="100" y="28" width="16" height="10" rx="1" fill="#FFB3B3" />
      {/* Flowers */}
      <circle cx="50" cy="155" r="5" fill="#FFB3B3" />
      <circle cx="60" cy="158" r="5" fill="#FFD9A0" />
      <circle cx="140" cy="155" r="5" fill="#A8E6CF" />
      <circle cx="150" cy="158" r="5" fill="#C5CAF5" />
    </svg>
  );
}

// 6. Food Allergy
function FoodAllergyIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFF0F0" />
      {/* Shield */}
      <path d="M100 40 L140 60 L140 110 Q140 145 100 160 Q60 145 60 110 L60 60 Z" fill="#A8E6CF" opacity="0.3" stroke="#4A8C5C" strokeWidth="2" />
      {/* Checkmark */}
      <path d="M82 105 L95 118 L120 85" stroke="#4A8C5C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Food items around */}
      <circle cx="40" cy="60" r="10" fill="#FFE4D6" />
      <text x="36" y="64" fontSize="12" fontFamily="sans-serif">🥚</text>
      <circle cx="160" cy="65" r="10" fill="#FFE4D6" />
      <text x="156" y="69" fontSize="12" fontFamily="sans-serif">🥛</text>
      <circle cx="45" cy="150" r="10" fill="#FFE4D6" />
      <text x="41" y="154" fontSize="12" fontFamily="sans-serif">🌾</text>
    </svg>
  );
}

// 7. School Prep
function SchoolPrepIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFFEF0" />
      {/* Backpack (randoseru) */}
      <rect x="65" y="55" width="70" height="80" rx="12" fill="#FFB3B3" />
      <rect x="70" y="60" width="60" height="30" rx="6" fill="#FF9E9E" />
      {/* Buckle */}
      <rect x="90" y="88" width="20" height="8" rx="4" fill="#FFD9A0" />
      {/* Straps */}
      <path d="M70 60 Q60 55 55 70 L55 110" stroke="#FF9E9E" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M130 60 Q140 55 145 70 L145 110" stroke="#FF9E9E" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Pencil */}
      <rect x="150" y="130" width="6" height="35" rx="2" fill="#FFFAA0" />
      <polygon points="150,165 153,172 156,165" fill="#e07b4c" />
      {/* Notebook */}
      <rect x="35" y="135" width="25" height="32" rx="2" fill="#A0C4FF" />
      <line x1="40" y1="142" x2="55" y2="142" stroke="white" strokeWidth="1.5" />
      <line x1="40" y1="148" x2="55" y2="148" stroke="white" strokeWidth="1.5" />
      <line x1="40" y1="154" x2="55" y2="154" stroke="white" strokeWidth="1.5" />
      {/* Cherry blossom */}
      <circle cx="160" cy="45" r="4" fill="#FFB3B3" opacity="0.6" />
      <circle cx="168" cy="52" r="3" fill="#FFB3B3" opacity="0.4" />
      <circle cx="45" cy="50" r="3" fill="#FFB3B3" opacity="0.5" />
    </svg>
  );
}

// 8. Home Study
function HomeStudyIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFFEF0" />
      {/* Desk */}
      <rect x="30" y="120" width="140" height="8" rx="2" fill="#D4A574" />
      <rect x="35" y="128" width="6" height="40" fill="#D4A574" />
      <rect x="159" y="128" width="6" height="40" fill="#D4A574" />
      {/* Book open on desk */}
      <path d="M55 118 L85 114 L115 118 L115 95 L85 90 L55 95 Z" fill="white" stroke="#e07b4c" strokeWidth="1.5" />
      <line x1="85" y1="90" x2="85" y2="114" stroke="#e07b4c" strokeWidth="1" />
      {/* Pencil holder */}
      <rect x="130" y="100" width="20" height="20" rx="3" fill="#A0C4FF" />
      <line x1="135" y1="100" x2="133" y2="85" stroke="#e07b4c" strokeWidth="2" strokeLinecap="round" />
      <line x1="140" y1="100" x2="140" y2="82" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" />
      <line x1="145" y1="100" x2="147" y2="86" stroke="#A0C4FF" strokeWidth="2" strokeLinecap="round" />
      {/* Lamp */}
      <line x1="45" y1="120" x2="45" y2="80" stroke="#666" strokeWidth="2" />
      <path d="M30 80 L45 70 L60 80" fill="#FFD9A0" />
      {/* Light glow */}
      <circle cx="45" cy="90" r="20" fill="#FFFAA0" opacity="0.2" />
      {/* Clock */}
      <circle cx="160" cy="55" r="14" fill="white" stroke="#e07b4c" strokeWidth="1.5" />
      <line x1="160" y1="55" x2="160" y2="46" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="160" y1="55" x2="167" y2="58" stroke="#2d2a26" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 9. Extracurricular
function ExtracurricularIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#F0F8FF" />
      {/* Piano keys */}
      <rect x="25" y="120" width="50" height="35" rx="2" fill="white" stroke="#666" strokeWidth="1" />
      <rect x="32" y="120" width="7" height="22" fill="#2d2a26" />
      <rect x="44" y="120" width="7" height="22" fill="#2d2a26" />
      <rect x="56" y="120" width="7" height="22" fill="#2d2a26" />
      {/* Soccer ball */}
      <circle cx="155" cy="135" r="18" fill="white" stroke="#2d2a26" strokeWidth="1.5" />
      <path d="M149 125 L155 135 L161 125 M149 145 L155 135 L161 145" stroke="#2d2a26" strokeWidth="1" />
      {/* Paint brush */}
      <line x1="100" y1="45" x2="100" y2="85" stroke="#D4A574" strokeWidth="4" strokeLinecap="round" />
      <path d="M94 85 Q100 100 106 85" fill="#A0C4FF" />
      {/* Paint dots */}
      <circle cx="80" cy="60" r="8" fill="#FFB3B3" opacity="0.6" />
      <circle cx="120" cy="55" r="6" fill="#A8E6CF" opacity="0.6" />
      <circle cx="110" cy="72" r="7" fill="#FFD9A0" opacity="0.6" />
      {/* Swimming */}
      <path d="M40 85 Q55 75 70 85 Q85 95 100 85" stroke="#A0C4FF" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 10. Screen Time
function ScreenTimeIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#EEF4FF" />
      {/* Tablet */}
      <rect x="55" y="50" width="90" height="70" rx="8" fill="#2d2a26" />
      <rect x="60" y="55" width="80" height="58" rx="4" fill="#A0C4FF" />
      {/* Screen content */}
      <circle cx="100" cy="78" r="12" fill="#A8E6CF" />
      <rect x="82" y="95" width="36" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="88" y="102" width="24" height="3" rx="1" fill="white" opacity="0.4" />
      {/* Timer/clock overlay */}
      <circle cx="150" cy="50" r="20" fill="white" stroke="#e07b4c" strokeWidth="2" />
      <line x1="150" y1="50" x2="150" y2="38" stroke="#e07b4c" strokeWidth="2" strokeLinecap="round" />
      <line x1="150" y1="50" x2="160" y2="55" stroke="#FFB3B3" strokeWidth="2" strokeLinecap="round" />
      {/* Nature (outdoor alternative) */}
      <circle cx="50" cy="150" r="4" fill="#4A8C5C" />
      <line x1="50" y1="154" x2="50" y2="165" stroke="#4A8C5C" strokeWidth="2" />
      <circle cx="65" cy="148" r="5" fill="#A8E6CF" />
      <line x1="65" y1="153" x2="65" y2="165" stroke="#4A8C5C" strokeWidth="2" />
      {/* Sun */}
      <circle cx="150" cy="145" r="12" fill="#FFD9A0" />
      <line x1="150" y1="128" x2="150" y2="132" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="150" y1="158" x2="150" y2="162" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="133" y1="145" x2="137" y2="145" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="163" y1="145" x2="167" y2="145" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 11. Exam vs Public
function ExamVsPublicIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFFEF0" />
      {/* Left path */}
      <path d="M100 160 Q60 130 50 90 Q45 70 55 55" stroke="#A0C4FF" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="8 4" />
      {/* Right path */}
      <path d="M100 160 Q140 130 150 90 Q155 70 145 55" stroke="#A8E6CF" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="8 4" />
      {/* Left building (private) */}
      <rect x="35" y="35" width="35" height="28" rx="2" fill="#A0C4FF" />
      <path d="M30 37 L52 22 L75 37" fill="#8AAFE0" />
      <rect x="45" y="45" width="8" height="10" rx="1" fill="white" />
      <rect x="57" y="45" width="8" height="10" rx="1" fill="white" />
      {/* Right building (public) */}
      <rect x="130" y="35" width="35" height="28" rx="2" fill="#A8E6CF" />
      <path d="M125 37 L147 22 L170 37" fill="#8BD4B0" />
      <rect x="140" y="45" width="8" height="10" rx="1" fill="white" />
      <rect x="152" y="45" width="8" height="10" rx="1" fill="white" />
      {/* Person at fork */}
      <circle cx="100" cy="150" r="10" fill="#FFE4D6" />
      <circle cx="97" cy="148" r="1.5" fill="#2d2a26" />
      <circle cx="103" cy="148" r="1.5" fill="#2d2a26" />
      {/* Question mark */}
      <text x="93" y="140" fontSize="16" fill="#e07b4c" fontWeight="bold" fontFamily="sans-serif">?</text>
    </svg>
  );
}

// 12. Self Study
function SelfStudyIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#EEFAF4" />
      {/* Child figure */}
      <circle cx="100" cy="65" r="20" fill="#FFE4D6" />
      <circle cx="94" cy="63" r="2" fill="#2d2a26" />
      <circle cx="106" cy="63" r="2" fill="#2d2a26" />
      <path d="M95 70 Q100 74 105 70" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="82" y="86" width="36" height="40" rx="8" fill="#A8E6CF" />
      {/* Lightbulb */}
      <circle cx="100" cy="30" r="12" fill="#FFD9A0" />
      <rect x="96" y="40" width="8" height="4" rx="1" fill="#FFD9A0" />
      <line x1="100" y1="14" x2="100" y2="18" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="20" x2="88" y2="23" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="115" y1="20" x2="112" y2="23" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      {/* Checklist */}
      <rect x="140" y="80" width="35" height="45" rx="3" fill="white" stroke="#e07b4c" strokeWidth="1.5" />
      <path d="M148 92 L152 96 L160 88" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M148 104 L152 108 L160 100" stroke="#4A8C5C" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="148" y1="116" x2="160" y2="116" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" />
      {/* Books */}
      <rect x="30" y="110" width="30" height="8" rx="1" fill="#A0C4FF" />
      <rect x="32" y="100" width="26" height="8" rx="1" fill="#FFB3B3" />
      <rect x="34" y="90" width="22" height="8" rx="1" fill="#C5CAF5" />
    </svg>
  );
}

// 13. Bullying
function BullyingPreventionIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#F0FFF4" />
      {/* Two figures holding hands */}
      {/* Left figure */}
      <circle cx="70" cy="80" r="16" fill="#FFE4D6" />
      <circle cx="66" cy="78" r="2" fill="#2d2a26" />
      <circle cx="74" cy="78" r="2" fill="#2d2a26" />
      <path d="M66 84 Q70 88 74 84" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="58" y="97" width="24" height="30" rx="6" fill="#A0C4FF" />
      {/* Right figure */}
      <circle cx="130" cy="80" r="16" fill="#FFE4D6" />
      <circle cx="126" cy="78" r="2" fill="#2d2a26" />
      <circle cx="134" cy="78" r="2" fill="#2d2a26" />
      <path d="M126 84 Q130 88 134 84" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="118" y="97" width="24" height="30" rx="6" fill="#A8E6CF" />
      {/* Holding hands */}
      <path d="M82 110 Q100 105 118 110" stroke="#FFE4D6" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Heart above */}
      <path d="M92 60 Q92 50 100 58 Q108 50 108 60 Q108 70 100 76 Q92 70 92 60" fill="#FFB3B3" />
      {/* Shield below */}
      <path d="M100 135 L120 145 L120 160 Q120 172 100 178 Q80 172 80 160 L80 145 Z" fill="#A8E6CF" opacity="0.3" stroke="#4A8C5C" strokeWidth="1.5" />
    </svg>
  );
}

// 14. Self Esteem
function SelfEsteemIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFF8F0" />
      {/* Child figure */}
      <circle cx="100" cy="85" r="22" fill="#FFE4D6" />
      <circle cx="94" cy="82" r="2.5" fill="#2d2a26" />
      <circle cx="106" cy="82" r="2.5" fill="#2d2a26" />
      <path d="M93 90 Q100 96 107 90" stroke="#2d2a26" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="87" cy="88" r="4" fill="#FFB3B3" opacity="0.4" />
      <circle cx="113" cy="88" r="4" fill="#FFB3B3" opacity="0.4" />
      <rect x="80" y="108" width="40" height="35" rx="8" fill="#FFD9A0" />
      {/* Arms raised in triumph */}
      <line x1="78" y1="112" x2="55" y2="85" stroke="#FFE4D6" strokeWidth="6" strokeLinecap="round" />
      <line x1="122" y1="112" x2="145" y2="85" stroke="#FFE4D6" strokeWidth="6" strokeLinecap="round" />
      {/* Stars around */}
      <circle cx="50" cy="70" r="5" fill="#FFD9A0" />
      <circle cx="150" cy="70" r="5" fill="#FFD9A0" />
      <circle cx="40" cy="50" r="3" fill="#A8E6CF" />
      <circle cx="160" cy="50" r="3" fill="#A8E6CF" />
      <circle cx="65" cy="45" r="3.5" fill="#A0C4FF" />
      <circle cx="135" cy="45" r="3.5" fill="#A0C4FF" />
      {/* Sparkle lines */}
      <line x1="46" y1="78" x2="42" y2="82" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
      <line x1="154" y1="78" x2="158" y2="82" stroke="#FFD9A0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 15. Programming
function ProgrammingIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#EEF4FF" />
      {/* Laptop */}
      <rect x="45" y="60" width="110" height="72" rx="6" fill="#2d2a26" />
      <rect x="50" y="65" width="100" height="60" rx="3" fill="#1a1a2e" />
      {/* Code on screen */}
      <rect x="58" y="72" width="40" height="4" rx="1" fill="#A8E6CF" />
      <rect x="62" y="80" width="55" height="4" rx="1" fill="#A0C4FF" />
      <rect x="62" y="88" width="35" height="4" rx="1" fill="#FFD9A0" />
      <rect x="66" y="96" width="50" height="4" rx="1" fill="#FFB3B3" />
      <rect x="62" y="104" width="28" height="4" rx="1" fill="#A8E6CF" />
      <rect x="58" y="112" width="20" height="4" rx="1" fill="#C5CAF5" />
      {/* Keyboard base */}
      <path d="M40 132 L45 132 L155 132 L160 132 L165 140 L35 140 Z" fill="#444" />
      {/* Robot */}
      <rect x="155" y="145" width="24" height="24" rx="6" fill="#A8E6CF" />
      <circle cx="163" cy="154" r="2.5" fill="#2d2a26" />
      <circle cx="171" cy="154" r="2.5" fill="#2d2a26" />
      <path d="M162 162 Q167 166 172 162" stroke="#2d2a26" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="167" y1="145" x2="167" y2="139" stroke="#A8E6CF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="167" cy="137" r="2.5" fill="#FFD9A0" />
      {/* Scratch-like blocks */}
      <rect x="20" y="150" width="28" height="12" rx="3" fill="#FFD9A0" />
      <rect x="24" y="164" width="28" height="12" rx="3" fill="#A0C4FF" />
    </svg>
  );
}

// Social illustration (for categories not covered)
function SocialIllustration({ className = '', size = 200 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="96" fill="#FFF8F0" />
      <circle cx="70" cy="85" r="18" fill="#FFE4D6" />
      <circle cx="130" cy="85" r="18" fill="#FFE4D6" />
      <circle cx="100" cy="75" r="18" fill="#FFE4D6" />
      <path d="M70 105 Q100 120 130 105" stroke="#A8E6CF" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="50" r="3" fill="#FFD9A0" />
      <circle cx="150" cy="50" r="3" fill="#A0C4FF" />
    </svg>
  );
}

// Slug to illustration mapping
const articleIllustrations: Record<string, (props: IllustrationProps) => React.ReactElement> = {
  'baby-sleep-training-guide': BabySleepIllustration,
  'weaning-food-start-guide': WeaningFoodIllustration,
  'infant-development-milestones': DevelopmentMilestonesIllustration,
  'preschool-play-learning': PlayLearningIllustration,
  'kindergarten-preparation': KindergartenIllustration,
  'food-allergy-children': FoodAllergyIllustration,
  'first-grade-preparation': SchoolPrepIllustration,
  'home-study-habits-elementary': HomeStudyIllustration,
  'extracurricular-activities-guide': ExtracurricularIllustration,
  'screen-time-management': ScreenTimeIllustration,
  'junior-high-exam-vs-public': ExamVsPublicIllustration,
  'self-study-skills-upper-elementary': SelfStudyIllustration,
  'bullying-prevention-response': BullyingPreventionIllustration,
  'child-self-esteem': SelfEsteemIllustration,
  'programming-education-kids': ProgrammingIllustration,
};

export function getArticleIllustration(slug: string): (props: IllustrationProps) => React.ReactElement {
  return articleIllustrations[slug] || SocialIllustration;
}
