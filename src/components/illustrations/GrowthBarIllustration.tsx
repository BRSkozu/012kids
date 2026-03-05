interface GrowthBarProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function GrowthBarIllustration({ className = '', size = 200, animate = false }: GrowthBarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 180"
      fill="none"
      className={className}
      aria-label="012.kids - 子どもの成長を表すイラスト"
    >
      {/* Bar 0 - shortest, blue */}
      <rect x="20" y="100" width="44" height="60" rx="6" fill="#A0C4FF" opacity="0.35" />
      <rect x="28" y="108" width="28" height="52" rx="4" fill="#A0C4FF" />

      {/* Bar 1 - medium, green */}
      <rect x="72" y="65" width="44" height="95" rx="6" fill="#7BC67E" opacity="0.35" />
      <rect x="80" y="73" width="28" height="87" rx="4" fill="#7BC67E" />

      {/* Bar 2 - tallest, orange */}
      <rect x="124" y="30" width="44" height="130" rx="6" fill="#E8943D" opacity="0.35" />
      <rect x="132" y="38" width="28" height="122" rx="4" fill="#E8943D" />

      {/* Child 0 - small, blue */}
      <g>
        <circle cx="42" cy="82" r="12" fill="#A0C4FF" />
        {/* Face */}
        <circle cx="42" cy="82" r="10" fill="#FFE8D6" />
        <circle cx="39" cy="80" r="1.5" fill="#2d2a26" />
        <circle cx="45" cy="80" r="1.5" fill="#2d2a26" />
        <path d="M39 85 Q42 88 45 85" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="34" y="94" width="16" height="14" rx="6" fill="#A0C4FF" />
        {/* Number */}
        <text x="42" y="105" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif">0</text>
      </g>

      {/* Child 1 - medium, green */}
      <g>
        <circle cx="94" cy="48" r="13" fill="#7BC67E" />
        {/* Face */}
        <circle cx="94" cy="48" r="11" fill="#FFE8D6" />
        <circle cx="91" cy="46" r="1.5" fill="#2d2a26" />
        <circle cx="97" cy="46" r="1.5" fill="#2d2a26" />
        <path d="M90 51 Q94 55 98 51" stroke="#2d2a26" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="85" y="61" width="18" height="16" rx="7" fill="#7BC67E" />
        {/* Number */}
        <text x="94" y="73" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="sans-serif">1</text>
      </g>

      {/* Child 2 - tall, orange */}
      <g>
        <circle cx="146" cy="12" r="14" fill="#E8943D" />
        {/* Face */}
        <circle cx="146" cy="12" r="12" fill="#FFE8D6" />
        <circle cx="143" cy="10" r="1.8" fill="#2d2a26" />
        <circle cx="149" cy="10" r="1.8" fill="#2d2a26" />
        <path d="M142 15 Q146 20 150 15" stroke="#2d2a26" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="136" y="26" width="20" height="18" rx="8" fill="#E8943D" />
        {/* Number */}
        <text x="146" y="40" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">2</text>
      </g>

      {/* Leaves - growth symbolism */}
      {/* Leaf left */}
      <path d="M10 155 Q18 140 26 155" fill="#2E8B57" />
      <path d="M18 155 L18 145" stroke="#1F6B3D" strokeWidth="1" />
      {/* Leaf between 0 and 1 */}
      <path d="M58 155 Q66 138 74 155" fill="#3DA05C" />
      <path d="M66 155 L66 143" stroke="#2E8B57" strokeWidth="1" />
      {/* Leaf between 1 and 2 */}
      <path d="M108 152 Q116 135 124 152" fill="#2E8B57" />
      <path d="M116 152 L116 140" stroke="#1F6B3D" strokeWidth="1" />
      {/* Small leaf right */}
      <path d="M164 155 Q170 145 176 155" fill="#3DA05C" />
      <path d="M170 155 L170 148" stroke="#2E8B57" strokeWidth="1" />

      {/* Ground line */}
      <line x1="8" y1="160" x2="188" y2="160" stroke="#D4C9A8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Animated sparkles */}
      {animate && (
        <>
          <circle cx="56" cy="90" r="2" fill="#FFD700" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="110" cy="55" r="2.5" fill="#FFD700" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="170" cy="22" r="2" fill="#FFD700" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.15;0.6" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

export function GrowthBarLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="012.kids"
    >
      {/* Bar 0 - short */}
      <rect x="3" y="18" width="7" height="11" rx="1.5" fill="#A0C4FF" />
      {/* Bar 1 - medium */}
      <rect x="12" y="12" width="7" height="17" rx="1.5" fill="#7BC67E" />
      {/* Bar 2 - tall */}
      <rect x="21" y="5" width="7" height="24" rx="1.5" fill="#E8943D" />
      {/* Ground */}
      <line x1="2" y1="30" x2="30" y2="30" stroke="#D4C9A8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* Tiny leaf */}
      <path d="M14 29 Q16 25 18 29" fill="#3DA05C" />
    </svg>
  );
}
