import { useMemo, useState } from 'react';
import type { Sitting } from '@/lib/sittings';
import type { Paper } from '@/data/pastpapers/schema';
import { loadWorkspace } from '@/lib/cbe-storage';
import { bionicHTML } from '@/utils/bionic';
import { loadSelfMark, saveSelfMark, type SelfMarkMap } from './self-mark';

interface Props {
  sitting: Sitting;
  guestId: string;
  /** Question index to scroll to on open, if any. */
  focusIndex?: number;
}

interface FlatPoint {
  idx: number;
  partLabel: string;
  description: string;
  marks: number;
}

function flatPoints(paper: Paper): FlatPoint[] {
  const out: FlatPoint[] = [];
  let idx = 0;
  for (const part of paper.questionParts) {
    for (const mp of part.markingPoints ?? []) {
      out.push({ idx: idx++, partLabel: part.label, description: mp.description, marks: mp.marks });
    }
  }
  return out;
}

/** Read-only render of the candidate's saved answer for one paper. */
function AnswerView({ guestId, paperId }: { guestId: string; paperId: string }) {
  const ws = useMemo(() => loadWorkspace(guestId, paperId), [guestId, paperId]);
  const wordText = ws.word.replace(/<[^>]*>/g, '').trim();
  const sheetRows = ws.sheet.filter((row) => row.some((c) => c.trim().length > 0));
  const hasWord = wordText.length > 0;

  if (!hasWord && sheetRows.length === 0) {
    return <p className="marking__noanswer">You did not write an answer for this question.</p>;
  }

  return (
    <div className="marking__answer">
      {hasWord && (
        <div className="marking__answer-word" dangerouslySetInnerHTML={{ __html: ws.word }} />
      )}
      {sheetRows.length > 0 && (
        <table className="marking__answer-sheet">
          <tbody>
            {sheetRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function QuestionMark({
  paper,
  qLabel,
  guestId,
  ticked,
  onToggle,
}: {
  paper: Paper;
  qLabel: string;
  guestId: string;
  ticked: number[];
  onToggle: (idx: number) => void;
}) {
  const points = useMemo(() => flatPoints(paper), [paper]);
  const guideMax = points.reduce((n, p) => n + p.marks, 0);
  const score = points.filter((p) => ticked.includes(p.idx)).reduce((n, p) => n + p.marks, 0);

  return (
    <div className="marking-card">
      <div className="marking-card__head">
        <div>
          <span className="marking-card__q">{qLabel}</span>{' '}
          <span className="marking-card__name">{paper.name}</span>
          <span className="marking-card__meta">
            {' '}
            · Section {paper.paperSection} · {paper.totalMarks} marks
          </span>
        </div>
        {guideMax > 0 && (
          <div className="marking-card__score">
            <span className="marking-card__score-num">{score}</span>
            <span className="marking-card__score-den">/ {guideMax} guide marks</span>
          </div>
        )}
      </div>

      <details className="marking-card__block" open>
        <summary className="marking-card__summary">Your answer</summary>
        <AnswerView guestId={guestId} paperId={paper.id} />
      </details>

      {points.length > 0 ? (
        <div className="marking-card__block">
          <p className="marking-card__summary marking-card__summary--static">
            Marking guide · tick each point you genuinely earned
          </p>
          <ul className="marking-checklist">
            {points.map((p) => {
              const on = ticked.includes(p.idx);
              return (
                <li key={p.idx} className={`marking-checklist__item ${on ? 'marking-checklist__item--on' : ''}`}>
                  <label>
                    <input type="checkbox" checked={on} onChange={() => onToggle(p.idx)} />
                    <span className="marking-checklist__marks">{p.marks}m</span>
                    <span className="marking-checklist__part">{p.partLabel}</span>
                    <span className="marking-checklist__desc bionic-text" {...bionicHTML(p.description)} />
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="marking-card__nopoints">
          No per-mark guide was captured for this question. Mark against the model answer and
          examiner notes below.
        </p>
      )}

      {paper.modelAnswerText && (
        <details className="marking-card__block">
          <summary className="marking-card__summary">Sample answer (model)</summary>
          <div className="marking-card__model">
            {paper.modelAnswerText.split('\n\n').map((para, i) => (
              <p key={i} className="bionic-text" {...bionicHTML(para)} />
            ))}
          </div>
        </details>
      )}

      <details className="marking-card__block">
        <summary className="marking-card__summary">Examiner says</summary>
        <div className="marking-card__examiner">
          <p>
            <strong>Did well:</strong>{' '}
            <span className="bionic-text" {...bionicHTML(paper.examinerFeedback.didWell)} />
          </p>
          <p>
            <strong>Common errors:</strong>{' '}
            <span className="bionic-text" {...bionicHTML(paper.examinerFeedback.commonErrors)} />
          </p>
          <p>
            <strong>Tutor tip:</strong>{' '}
            <span className="bionic-text" {...bionicHTML(paper.examinerFeedback.tutorTip)} />
          </p>
        </div>
      </details>
    </div>
  );
}

export function MarkingDashboard({ sitting, guestId }: Props) {
  const [map, setMap] = useState<SelfMarkMap>(() => loadSelfMark(guestId, sitting.id));

  const toggle = (paperId: string, idx: number) => {
    setMap((prev) => {
      const current = prev[paperId] ?? [];
      const next = current.includes(idx) ? current.filter((i) => i !== idx) : [...current, idx];
      const updated = { ...prev, [paperId]: next };
      saveSelfMark(guestId, sitting.id, updated);
      return updated;
    });
  };

  const totals = useMemo(() => {
    let score = 0;
    let guideMax = 0;
    for (const sq of sitting.questions) {
      const pts = flatPoints(sq.paper);
      const ticked = map[sq.paper.id] ?? [];
      guideMax += pts.reduce((n, p) => n + p.marks, 0);
      score += pts.filter((p) => ticked.includes(p.idx)).reduce((n, p) => n + p.marks, 0);
    }
    return { score, guideMax };
  }, [sitting.questions, map]);

  const pct = totals.guideMax > 0 ? Math.round((totals.score / totals.guideMax) * 100) : null;

  return (
    <div className="marking-dashboard">
      <div className="marking-dashboard__banner">
        <div>
          <p className="marking-dashboard__title">Self-marking</p>
          <p className="marking-dashboard__sub">
            In the live exam an expert marks you. Here you mark yourself: read each model answer and
            marking guide, then tick only the points you truly made. Be your own toughest marker.
          </p>
        </div>
        {pct !== null && (
          <div className="marking-dashboard__tally">
            <span className="marking-dashboard__pct">{pct}%</span>
            <span className="marking-dashboard__tally-sub">
              {totals.score} / {totals.guideMax} guide marks
            </span>
          </div>
        )}
      </div>

      {sitting.questions.map((sq) => (
        <QuestionMark
          key={sq.paper.id}
          paper={sq.paper}
          qLabel={sq.label}
          guestId={guestId}
          ticked={map[sq.paper.id] ?? []}
          onToggle={(idx) => toggle(sq.paper.id, idx)}
        />
      ))}
    </div>
  );
}

