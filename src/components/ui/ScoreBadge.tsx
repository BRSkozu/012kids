interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
}

export default function ScoreBadge({ score, showLabel = true }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getColor()}`}>
      {showLabel && <span>信頼度</span>}
      <span>{score}</span>
    </span>
  );
}
