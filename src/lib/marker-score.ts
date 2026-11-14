/**
 * Read the score out of AI marker feedback.
 *
 * The marker is asked to finish with one machine-readable line:
 *
 *   SCORE_JSON: {"awarded":7,"available":10,"points":[{"n":1,"awarded":2,"available":3}]}
 *
 * That line is authoritative. Older responses and model slips fall back to
 * the "Marks awarded: X / Y" heading. The previous extractor took the first
 * "number / number" anywhere in the text, so a phrase like "a 50/50 split" or
 * "ROI of 12/15%" in the feedback was recorded as the learner's score.
 */

export interface PointScore {
  /** 1-based index into the marking guide. */
  n: number;
  awarded: number;
  available: number;
}

export interface MarkerScore {
  awarded: number;
  available: number;
  /** 0-100, one decimal. */
  pct: number;
  /** Per-marking-point breakdown when the model supplied one. */
  points: PointScore[];
  /** Where the score came from, for diagnostics. */
  source: 'json' | 'heading';
}

const SCORE_LINE_RX = /^[ \t]*SCORE_JSON:[ \t]*(\{.*\})[ \t]*$/m;
const HEADING_RX = /marks?\s+awarded\s*:?\s*\**\s*(\d+(?:\.\d+)?)\s*(?:\/|out\s+of)\s*(\d+(?:\.\d+)?)/i;

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);

function build(awarded: number, available: number, points: PointScore[], source: MarkerScore['source']): MarkerScore | null {
  if (available <= 0) return null;
  const capped = Math.min(awarded, available);
  return { awarded: capped, available, pct: Math.round((capped / available) * 1000) / 10, points, source };
}

export function parseMarkerScore(feedback: string): MarkerScore | null {
  const line = feedback.match(SCORE_LINE_RX);
  if (line) {
    try {
      const data = JSON.parse(line[1]) as { awarded?: unknown; available?: unknown; points?: unknown };
      const awarded = num(data.awarded);
      const available = num(data.available);
      if (awarded !== null && available !== null) {
        const points: PointScore[] = [];
        if (Array.isArray(data.points)) {
          for (const p of data.points.slice(0, 40)) {
            const n = num((p as PointScore)?.n);
            const a = num((p as PointScore)?.awarded);
            const av = num((p as PointScore)?.available);
            if (n !== null && a !== null && av !== null && av > 0) points.push({ n, awarded: Math.min(a, av), available: av });
          }
        }
        const score = build(awarded, available, points, 'json');
        if (score) return score;
      }
    } catch { /* malformed JSON: fall through to the heading */ }
  }
  const heading = feedback.match(HEADING_RX);
  if (heading) return build(parseFloat(heading[1]), parseFloat(heading[2]), [], 'heading');
  return null;
}

/**
 * Feedback with the machine line removed, for display. Also hides a partial
 * line while it is still streaming in.
 */
export function stripScoreLine(feedback: string): string {
  return feedback.replace(/^[ \t]*SCORE_JSON:.*$/m, '').replace(/\n[ \t]*SCORE_J?S?O?N?_?J?S?O?N?:?[ \t]*$/, '').trimEnd();
}
