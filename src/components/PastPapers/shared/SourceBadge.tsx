import type { DataSource } from '@/data/pastpapers/schema';

const SOURCE_LABELS: Record<DataSource, string> = {
  Q: 'Question Pack (OCR verified)',
  A: 'ACCA Model Answer (file verified)',
  S: 'Solution Pack (text verified)',
  E: 'Examiner Report',
};

const SOURCE_LABELS_COMPACT: Record<DataSource, string> = {
  Q: 'Q-pack',
  A: 'ACCA',
  S: 'Soln',
  E: 'Exam.',
};

const SOURCE_COLOURS: Record<DataSource, string> = {
  Q: 'badge-source-q',
  A: 'badge-source-a',
  S: 'badge-source-q',
  E: 'badge-source-e',
};

interface Props {
  source: DataSource;
  compact?: boolean;
}

export function SourceBadge({ source, compact = false }: Props) {
  const label = compact ? SOURCE_LABELS_COMPACT[source] : SOURCE_LABELS[source];
  return (
    <span className={`source-badge ${SOURCE_COLOURS[source]}`}>{label}</span>
  );
}
