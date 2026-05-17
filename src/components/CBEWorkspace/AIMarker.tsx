import { useMemo, useRef, useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { SHEET_COLS, SHEET_ROWS, colLabel } from '@/lib/cbe-storage';

interface Props {
  paper: Paper;
  word: string;
  sheet: string[][];
}

/**
 * AI marker button + part picker + streamed feedback panel.
 * Posts to /api/mark which proxies to DeepSeek. Streams the response
 * chunk-by-chunk so feedback appears as it generates.
 */
export function AIMarker({ paper, word, sheet }: Props) {
  const [partLabel, setPartLabel] = useState<string>(paper.questionParts[0]?.label ?? '');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const selectedPart = useMemo(
    () => paper.questionParts.find((p) => p.label === partLabel) ?? paper.questionParts[0],
    [paper.questionParts, partLabel],
  );

  const hasAnswer = word.trim().length > 0 || sheet.some((row) => row.some((c) => c.trim().length > 0));

  const runMark = async () => {
    if (!selectedPart) return;
    setError(null);
    setFeedback('');
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const studentSheet = formatSheetForPrompt(sheet);
      const res = await fetch('/api/mark', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          paperName: paper.name,
          paperSession: paper.session,
          partLabel: selectedPart.label,
          partMarks: selectedPart.marks,
          partRequirement: selectedPart.requirement,
          markingPoints: selectedPart.markingPoints,
          examinerCommentary: selectedPart.examinerCommentary,
          modelAnswerExtract: undefined, // schema doesn't yet split model answer by part — examiner notes carry most of it
          studentWord: htmlToPlainText(word),
          studentSheet,
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Server error (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setFeedback((prev) => prev + chunk);
      }
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // User cancelled — no error UI needed.
      } else {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(msg);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div className="ai-marker">
      <div className="ai-marker__header">
        <div className="ai-marker__title">
          <span aria-hidden>🤖</span> AI marker (DeepSeek)
        </div>
        <span className="ai-marker__sub">
          Marks your answer against the Kaplan marking guide and the verbatim ACCA examiner notes.
        </span>
      </div>

      <div className="ai-marker__controls">
        <label className="ai-marker__label" htmlFor="ai-marker-part">
          Mark this part:
        </label>
        <select
          id="ai-marker-part"
          className="ai-marker__select"
          value={partLabel}
          onChange={(e) => setPartLabel(e.target.value)}
          disabled={busy}
        >
          {paper.questionParts.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label} — {p.marks} mark{p.marks === 1 ? '' : 's'}
            </option>
          ))}
        </select>
        {!busy ? (
          <button
            type="button"
            className="ai-marker__go"
            onClick={runMark}
            disabled={!hasAnswer}
            title={hasAnswer ? '' : 'Write something in the workspace first'}
          >
            Mark with AI
          </button>
        ) : (
          <button type="button" className="ai-marker__cancel" onClick={cancel}>
            Stop
          </button>
        )}
      </div>

      {!hasAnswer && !feedback && !busy && (
        <p className="ai-marker__hint">
          Tip: start typing your answer in the word processor or fill in the spreadsheet, then click <strong>Mark with AI</strong>.
        </p>
      )}

      {error && (
        <div className="ai-marker__error" role="alert">
          <strong>Couldn&apos;t reach the AI marker:</strong> {error}
          {error.includes('not configured') && (
            <div className="ai-marker__error-hint">
              The site owner needs to add a <code>DEEPSEEK_API_KEY</code> environment variable in Vercel.
            </div>
          )}
        </div>
      )}

      {(busy || feedback) && (
        <div className="ai-marker__feedback" aria-live="polite">
          {busy && !feedback && (
            <p className="ai-marker__streaming">
              <span className="ai-marker__dot" /> Marking your answer for {selectedPart?.label}…
            </p>
          )}
          {feedback && <FeedbackMarkdown text={feedback} />}
        </div>
      )}
    </div>
  );
}

/** Renders the AI's lightweight Markdown response — **bold**, headings, bullet lists. */
function FeedbackMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: Array<{ kind: 'heading' | 'para' | 'list'; content: string[] }> = [];
  let current: { kind: 'heading' | 'para' | 'list'; content: string[] } | null = null;

  const flush = () => {
    if (current) blocks.push(current);
    current = null;
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
      flush();
      blocks.push({ kind: 'heading', content: [t.slice(2, -2)] });
      continue;
    }
    if (t.startsWith('- ') || t.startsWith('• ')) {
      if (!current || current.kind !== 'list') {
        flush();
        current = { kind: 'list', content: [] };
      }
      current.content.push(t.slice(2));
      continue;
    }
    if (!current || current.kind !== 'para') {
      flush();
      current = { kind: 'para', content: [] };
    }
    current.content.push(line);
  }
  flush();

  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === 'heading') {
          return (
            <h4 key={i} className="ai-marker__heading">
              {renderInline(block.content[0])}
            </h4>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={i} className="ai-marker__list">
              {block.content.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="ai-marker__para">
            {block.content.map((line, j) => (
              <span key={j}>
                {renderInline(line)}
                {j < block.content.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

/** Bare-bones inline **bold** parser. Anything else passes through. */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let i = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) parts.push(text.slice(i, m.index));
    parts.push(<strong key={parts.length}>{m[1]}</strong>);
    i = m.index + m[0].length;
  }
  if (i < text.length) parts.push(text.slice(i));
  return parts.length > 0 ? parts : text;
}

function htmlToPlainText(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  // Convert block elements to newlines so paragraphs survive.
  div.querySelectorAll('p, li, h1, h2, h3, h4, br').forEach((el) => {
    el.append('\n');
  });
  return (div.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
}

function formatSheetForPrompt(sheet: string[][]): string {
  const rows: string[] = [];
  for (let r = 0; r < SHEET_ROWS && r < sheet.length; r++) {
    for (let c = 0; c < SHEET_COLS && c < sheet[r].length; c++) {
      const v = sheet[r][c]?.trim();
      if (v) rows.push(`${colLabel(c)}${r + 1}: ${v}`);
    }
  }
  return rows.join('\n');
}
