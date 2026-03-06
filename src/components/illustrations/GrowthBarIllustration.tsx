interface GrowthBarProps {
  className?: string;
  size?: number;
}

// SVG logo badge - lightweight replacement for the 6MB PNG
function LogoSvg({ size = 200, className = '' }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="58" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="2" />
      {/* Growth bars */}
      <rect x="22" y="72" width="16" height="24" rx="4" fill="#A0C4FF" />
      <rect x="44" y="52" width="16" height="44" rx="4" fill="#7BC67E" />
      <rect x="66" y="32" width="16" height="64" rx="4" fill="#E8943D" />
      {/* Leaf/sprout on tallest bar */}
      <path d="M74 32 C74 22 82 18 82 18 C82 18 78 26 74 32" fill="#7BC67E" />
      <path d="M74 32 C74 22 66 18 66 18 C66 18 70 26 74 32" fill="#A8E6CF" />
      {/* Star */}
      <path d="M96 28 L98 34 L104 34 L99 38 L101 44 L96 40 L91 44 L93 38 L88 34 L94 34 Z" fill="#FFD700" />
    </svg>
  );
}

export default function GrowthBarIllustration({ className = '', size = 200 }: GrowthBarProps) {
  return <LogoSvg size={size} className={className} />;
}

export function GrowthBarLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return <LogoSvg size={size} className={className} />;
}
