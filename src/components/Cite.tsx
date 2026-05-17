import type { ReactNode } from 'react';

/**
 * Per-claim source citation. Wrap a scenario number/figure to attach a
 * source label (Q-pack OCR / ACCA Model Answer / Kaplan Solution Pack /
 * Examiner Report) plus a paper + note string. Renders as an underlined
 * inline span with a tooltip on hover AND keyboard focus.
 *
 * Work Item 13 of the Platinum-tier upgrade.
 */
export type CiteSource = 'qpack' | 'acca' | 'kaplan' | 'examiner';

const LABEL: Record<CiteSource, string> = {
  qpack: 'Q-pack OCR',
  acca: 'ACCA Model Answer',
  kaplan: 'Kaplan Solution Pack',
  examiner: 'Examiner Report',
};

interface Props {
  source: CiteSource;
  paper: string;
  note: string;
  children: ReactNode;
}

export function Cite({ source, paper, note, children }: Props) {
  const label = LABEL[source];
  return (
    <span
      className={`cite cite-${source}`}
      tabIndex={0}
      aria-label={`Source: ${label} · ${paper} · ${note}`}
      data-cite-source={source}
      data-cite-paper={paper}
      data-cite-note={note}
    >
      {children}
      <span className="cite-tooltip" role="tooltip">
        <strong>{label}</strong> · {paper}
        <br />
        {note}
      </span>
    </span>
  );
}
