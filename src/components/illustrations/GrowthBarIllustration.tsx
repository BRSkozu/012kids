interface GrowthBarProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function GrowthBarIllustration({ className = '', size = 200, animate = false }: GrowthBarProps) {
  return (
    <svg
      width={size}
      height={size * 0.95}
      viewBox="0 0 260 247"
      fill="none"
      className={className}
      aria-label="012.kids - 子どもの成長を表すイラスト"
    >
      <defs>
        {/* Gold gradient for border */}
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A842" />
          <stop offset="40%" stopColor="#F0D060" />
          <stop offset="60%" stopColor="#C8962E" />
          <stop offset="100%" stopColor="#D4A842" />
        </linearGradient>
        <linearGradient id="goldFill" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#E8C84A" />
          <stop offset="50%" stopColor="#D4A842" />
          <stop offset="100%" stopColor="#C09030" />
        </linearGradient>
      </defs>

      {/* Gold staircase outline shape */}
      <path
        d="M12 230 L12 170 Q12 162 20 162 L62 162 L62 115 Q62 107 70 107 L118 107 L118 58 Q118 50 126 50 L240 50 Q248 50 248 58 L248 230 Q248 238 240 238 L20 238 Q12 238 12 230 Z"
        fill="url(#goldFill)"
        stroke="url(#gold)"
        strokeWidth="3"
      />

      {/* Inner background - warm cream */}
      <path
        d="M22 225 L22 172 Q22 167 27 167 L67 167 L67 117 Q67 112 72 112 L123 112 L123 60 Q123 55 128 55 L238 55 Q243 55 243 60 L243 225 Q243 230 238 230 L27 230 Q22 230 22 225 Z"
        fill="#F5EDDA"
      />

      {/* Bar 0 - blue */}
      <rect x="32" y="172" width="38" height="53" rx="4" fill="#A8D4F5" />

      {/* Bar 1 - green */}
      <rect x="77" y="117" width="42" height="108" rx="4" fill="#8ED08E" />

      {/* Bar 2 - orange */}
      <rect x="130" y="60" width="48" height="165" rx="4" fill="#EFA040" />

      {/* === Child 0 - small blue figure === */}
      <g>
        {/* Head */}
        <circle cx="51" cy="155" r="16" fill="#A0CFEE" stroke="url(#gold)" strokeWidth="2" />
        {/* Face */}
        <circle cx="45" cy="152" r="2" fill="#7BA8C8" />
        <circle cx="57" cy="152" r="2" fill="#7BA8C8" />
        <path d="M45 160 Q51 165 57 160" stroke="#7BA8C8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Body */}
        <path
          d="M37 171 L37 198 Q37 204 43 204 L59 204 Q65 204 65 198 L65 171"
          fill="#A0CFEE"
          stroke="url(#gold)"
          strokeWidth="2"
        />
        {/* Arms */}
        <path d="M37 178 L28 188 Q26 191 29 192 L32 192" fill="#A0CFEE" stroke="url(#gold)" strokeWidth="1.5" />
        <path d="M65 178 L74 188 Q76 191 73 192 L70 192" fill="#A0CFEE" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Legs */}
        <path d="M42 204 L42 216 Q42 220 46 220 L48 220" fill="#A0CFEE" stroke="url(#gold)" strokeWidth="1.5" />
        <path d="M60 204 L60 216 Q60 220 56 220 L54 220" fill="#A0CFEE" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Number 0 */}
        <text x="51" y="194" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#7BA8C8" fontFamily="sans-serif">0</text>
      </g>

      {/* === Child 1 - medium green figure === */}
      <g>
        {/* Head */}
        <circle cx="103" cy="94" r="18" fill="#6EBE6E" stroke="url(#gold)" strokeWidth="2" />
        {/* Face */}
        <circle cx="96" cy="91" r="2.2" fill="#4A8E4A" />
        <circle cx="110" cy="91" r="2.2" fill="#4A8E4A" />
        <path d="M96 99 Q103 105 110 99" stroke="#4A8E4A" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Body */}
        <path
          d="M87 112 L87 155 Q87 162 94 162 L112 162 Q119 162 119 155 L119 112"
          fill="#6EBE6E"
          stroke="url(#gold)"
          strokeWidth="2"
        />
        {/* Arms */}
        <path d="M87 120 L76 132 Q73 136 77 137 L80 137" fill="#6EBE6E" stroke="url(#gold)" strokeWidth="1.5" />
        <path d="M119 120 L130 132 Q133 136 129 137 L126 137" fill="#6EBE6E" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Legs */}
        <path d="M94 162 L94 178 Q94 182 98 182 L100 182" fill="#6EBE6E" stroke="url(#gold)" strokeWidth="1.5" />
        <path d="M112 162 L112 178 Q112 182 108 182 L106 182" fill="#6EBE6E" stroke="url(#gold)" strokeWidth="1.5" />
        {/* Number 1 */}
        <text x="103" y="145" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#4A8E4A" fontFamily="sans-serif">1</text>
      </g>

      {/* === Child 2 - large orange figure === */}
      <g>
        {/* Head */}
        <circle cx="168" cy="32" r="22" fill="#EF9A36" stroke="url(#gold)" strokeWidth="2.5" />
        {/* Face */}
        <circle cx="159" cy="28" r="2.8" fill="#C07020" />
        <circle cx="177" cy="28" r="2.8" fill="#C07020" />
        <path d="M159 38 Q168 45 177 38" stroke="#C07020" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Body */}
        <path
          d="M148 55 L148 115 Q148 123 157 123 L179 123 Q188 123 188 115 L188 55"
          fill="#EF9A36"
          stroke="url(#gold)"
          strokeWidth="2.5"
        />
        {/* Arms */}
        <path d="M148 65 L135 80 Q131 85 136 86 L140 86" fill="#EF9A36" stroke="url(#gold)" strokeWidth="2" />
        <path d="M188 65 L201 80 Q205 85 200 86 L196 86" fill="#EF9A36" stroke="url(#gold)" strokeWidth="2" />
        {/* Legs */}
        <path d="M157 123 L157 145 Q157 150 162 150 L165 150" fill="#EF9A36" stroke="url(#gold)" strokeWidth="2" />
        <path d="M179 123 L179 145 Q179 150 174 150 L171 150" fill="#EF9A36" stroke="url(#gold)" strokeWidth="2" />
        {/* Number 2 */}
        <text x="168" y="100" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#C07020" fontFamily="sans-serif">2</text>
      </g>

      {/* === Leaves === */}
      {/* Left leaf */}
      <g transform="translate(18, 208)">
        <path d="M0 12 Q8 -4 16 12" fill="#1B7A3D" />
        <line x1="8" y1="12" x2="8" y2="2" stroke="#146630" strokeWidth="1.2" />
      </g>
      {/* Leaf between 0 and 1 */}
      <g transform="translate(68, 198)">
        <path d="M0 14 Q10 -6 20 14" fill="#228B3A" />
        <line x1="10" y1="14" x2="10" y2="2" stroke="#1A6B2E" strokeWidth="1.2" />
        <path d="M6 18 Q12 6 18 18" fill="#1B7A3D" />
      </g>
      {/* Leaf cluster center */}
      <g transform="translate(120, 185)">
        <path d="M0 18 Q12 -2 24 18" fill="#228B3A" />
        <line x1="12" y1="18" x2="12" y2="4" stroke="#1A6B2E" strokeWidth="1.3" />
        <path d="M-6 22 Q2 10 10 22" fill="#1B7A3D" />
        <path d="M16 22 Q24 10 32 22" fill="#1B7A3D" />
      </g>
      {/* Right leaf */}
      <g transform="translate(195, 200)">
        <path d="M0 14 Q8 0 16 14" fill="#228B3A" />
        <line x1="8" y1="14" x2="8" y2="3" stroke="#1A6B2E" strokeWidth="1.2" />
      </g>

      {/* ".kids" text */}
      <text x="145" y="225" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#9B8EC2" fontFamily="sans-serif" letterSpacing="1">.kids</text>

      {/* Animated sparkles */}
      {animate && (
        <>
          <circle cx="220" cy="42" r="3" fill="#F0D060" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="232" cy="80" r="2" fill="#F0D060" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="160" r="2" fill="#F0D060" opacity="0.6">
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
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-label="012.kids"
    >
      <defs>
        <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A842" />
          <stop offset="50%" stopColor="#F0D060" />
          <stop offset="100%" stopColor="#C8962E" />
        </linearGradient>
      </defs>
      {/* Staircase shape outline */}
      <path
        d="M2 32 L2 22 Q2 20 4 20 L10 20 L10 14 Q10 12 12 12 L22 12 L22 5 Q22 3 24 3 L32 3 Q34 3 34 5 L34 32 Q34 34 32 34 L4 34 Q2 34 2 32 Z"
        fill="url(#logoGold)"
        opacity="0.3"
      />
      {/* Bar 0 */}
      <rect x="4" y="22" width="7" height="11" rx="1.5" fill="#A0CFEE" />
      {/* Bar 1 */}
      <rect x="13" y="14" width="8" height="19" rx="1.5" fill="#6EBE6E" />
      {/* Bar 2 */}
      <rect x="23" y="5" width="9" height="28" rx="1.5" fill="#EF9A36" />
      {/* Tiny child heads */}
      <circle cx="7.5" cy="19" r="3.5" fill="#A0CFEE" stroke="url(#logoGold)" strokeWidth="0.8" />
      <circle cx="17" cy="11" r="3.8" fill="#6EBE6E" stroke="url(#logoGold)" strokeWidth="0.8" />
      <circle cx="27.5" cy="2" r="4" fill="#EF9A36" stroke="url(#logoGold)" strokeWidth="0.8" />
    </svg>
  );
}
