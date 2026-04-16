interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
}

export default function ScoreBadge({ score, showLabel = true }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-[#DFEBE0] text-[#3A6B42] border-[#C5DCC7]';
    if (score >= 70) return 'bg-[#F7EED2] text-[#7A6315] border-[#E5D9B0]';
    return 'bg-[var(--color-warm-cream)] text-[var(--color-foreground-soft)] border-[var(--color-paper-edge)]';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${getColor()}`}>
      {showLabel && <span>信頼度</span>}
      <span>{score}</span>
    </span>
  );
}
