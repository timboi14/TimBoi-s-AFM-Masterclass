interface Props { level: 1 | 2 | 3 | 4 | 5; }

export function DifficultyDots({ level }: Props) {
  return (
    <div className="difficulty-dots" aria-label={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`difficulty-dot ${n <= level ? 'difficulty-dot--filled' : ''}`}
        />
      ))}
    </div>
  );
}
