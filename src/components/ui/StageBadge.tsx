import { AgeStage } from '@/types';
import { getStageById } from '@/data/stages';

interface StageBadgeProps {
  stage: AgeStage;
  size?: 'sm' | 'md' | 'lg';
}

export default function StageBadge({ stage, size = 'sm' }: StageBadgeProps) {
  const info = getStageById(stage);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]}`}
      style={{ backgroundColor: info.color, color: '#1a1a2e' }}
    >
      {info.ageRange}
    </span>
  );
}
