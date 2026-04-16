interface ReadingTimeProps {
  minutes: number;
  variant?: 'default' | 'short';
}

export default function ReadingTime({ minutes, variant = 'default' }: ReadingTimeProps) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-foreground-muted)]">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{variant === 'short' ? `${minutes}分` : `${minutes}分で読めます`}</span>
    </span>
  );
}
