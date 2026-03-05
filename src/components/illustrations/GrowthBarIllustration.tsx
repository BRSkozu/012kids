import Image from 'next/image';

interface GrowthBarProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function GrowthBarIllustration({ className = '', size = 200 }: GrowthBarProps) {
  return (
    <Image
      src="/logo-badge.png"
      alt="012.kids - 子どもの成長を表すロゴ"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function GrowthBarLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo-badge.png"
      alt="012.kids"
      width={size}
      height={size}
      className={className}
    />
  );
}
