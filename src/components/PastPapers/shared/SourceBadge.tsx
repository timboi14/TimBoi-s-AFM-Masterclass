import type { DataSource } from '@/data/pastpapers/schema';

/**
 * Single source of truth for source-code metadata. Every label, badge,
 * colour, and legend entry on the past-papers page derives from here so
 * the card badges, detail-panel headers, and the legend strip cannot
 * drift apart over time.
 */
export interface SourceMeta {
  /** Full human-readable label for the detail-panel header. */
  label: string;
  /** Compact badge label for the card / inline use. */
  badge: string;
  /** Colour name — also used as the CSS modifier class suffix. */
  colour: 'green' | 'blue' | 'grey';
  /** Short legend phrase used by the source-notice strip on the index. */
  legendNote: string;
}

export const SOURCE_META: Record<DataSource, SourceMeta> = {
  Q: {
    label: 'Question Pack (OCR verified)',
    badge: 'Q-pack',
    colour: 'green',
    legendNote: 'Question Pack (OCR)',
  },
  A: {
    label: 'ACCA Model Answer (file verified)',
    badge: 'ACCA',
    colour: 'blue',
    legendNote: 'ACCA Model Answer',
  },
  S: {
    label: 'Solution Pack (text verified)',
    badge: 'Soln',
    colour: 'green',
    legendNote: 'Kaplan Solution Pack',
  },
  E: {
    label: 'Examiner Report',
    badge: 'Exam.',
    colour: 'grey',
    legendNote: 'Examiner Report',
  },
};

const COLOUR_TO_CLASS: Record<SourceMeta['colour'], string> = {
  green: 'badge-source-q',
  blue: 'badge-source-a',
  grey: 'badge-source-e',
};

interface Props {
  source: DataSource;
  compact?: boolean;
}

export function SourceBadge({ source, compact = false }: Props) {
  const meta = SOURCE_META[source];
  const label = compact ? meta.badge : meta.label;
  return <span className={`source-badge ${COLOUR_TO_CLASS[meta.colour]}`}>{label}</span>;
}
