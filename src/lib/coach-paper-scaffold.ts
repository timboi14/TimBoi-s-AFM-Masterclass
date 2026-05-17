/**
 * Coach scaffold builder for past-paper questions.
 *
 * When the user names a specific paper (e.g. "para fuels co question a"),
 * Coach generates a model-answer-style response in the voice of a
 * top-achieving candidate, with the marking key shown at the BOTTOM so
 * the user can see where each mark would be awarded.
 *
 * NO refusal policy here. Coach is the user's benchmark generator — the
 * whole point is to produce the kind of answer an exam-ready candidate
 * would write under timed conditions. If higher-quality LLM-generated
 * prose is needed (DEEPSEEK_API_KEY is configured), the chat layer
 * routes paper requests to /api/coach instead of this local builder.
 */

import { PAPERS } from '@/data/pastpapers/papers';
import type { Paper, QuestionPart } from '@/data/pastpapers/schema';

export interface ScaffoldMatch {
  paper: Paper;
  partLabel?: string;
}

/**
 * Try to detect a specific paper + optional part the user is asking about.
 * Returns null if nothing recognisable found.
 */
export function detectPaperReference(message: string): ScaffoldMatch | null {
  const m = message.toLowerCase();

  // Score each paper by how specifically the message names it.
  let best: { paper: Paper; score: number } | null = null;

  for (const p of PAPERS) {
    const name = p.name.toLowerCase();
    const nameNoCo = name.replace(/\bco\b/g, '').replace(/\s+/g, ' ').trim();
    const idAsWords = p.id.replace(/[_-]/g, ' ');

    let score = 0;
    if (m.includes(name)) score += 10;
    else if (nameNoCo.length > 3 && m.includes(nameNoCo)) score += 9;
    else if (idAsWords !== name && idAsWords !== nameNoCo && m.includes(idAsWords)) {
      score += 8;
    } else {
      const segments = nameNoCo
        .split(/[\/&,]/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 4);
      for (const seg of segments) {
        if (m.includes(seg)) {
          score = Math.max(score, 7);
          break;
        }
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { paper: p, score };
    }
  }

  if (!best) return null;

  const partLabel = detectPartLabel(m, best.paper);
  return { paper: best.paper, partLabel };
}

function detectPartLabel(messageLower: string, paper: Paper): string | undefined {
  for (const part of paper.questionParts) {
    const lbl = part.label.toLowerCase();
    if (messageLower.includes(lbl)) return part.label;
  }
  const loose = /\b(?:part|question|requirement|section)\s*\(?\s*([a-z](?:\(?[iv]+\)?)?)\s*\)?/i.exec(
    messageLower,
  );
  if (loose) {
    const want = `(${loose[1].toLowerCase()})`;
    for (const part of paper.questionParts) {
      if (part.label.toLowerCase().startsWith(want)) return part.label;
    }
  }
  return undefined;
}

/**
 * Build the local scaffold reply for a paper + optional part.
 * Format: model-answer-style walkthrough first, marking key at the BOTTOM.
 *
 * This is the offline fallback. When /api/coach is reachable, the chat
 * layer streams a richer top-achiever prose answer from DeepSeek instead.
 */
export function buildScaffold({
  paper,
  partLabel,
}: {
  paper: Paper;
  partLabel?: string;
}): string {
  const lines: string[] = [];

  if (partLabel) {
    const part = paper.questionParts.find((p) => p.label === partLabel);
    if (part) {
      lines.push(`**${paper.name} — Part ${part.label} (${part.marks} marks)**`);
      lines.push(`*${paper.session} · Section ${paper.paperSection}*`);
      lines.push('');
      lines.push(`**Requirement:**`);
      lines.push(`> ${trimText(part.requirement)}`);
      lines.push('');

      // Model-answer-style body — turn each marking point into an
      // exam-prose sentence a top-achieving candidate would write.
      lines.push(`**Model answer (top-achiever style, ${marksTimeBudget(part.marks)} budget):**`);
      lines.push('');
      lines.push(...synthesisedAnswerBody(part));
      lines.push('');

      // Where most candidates lose marks — context, not a refusal.
      if (part.examinerCommentary?.trim()) {
        lines.push(`**Watch-out from the ACCA examiner:**`);
        lines.push(`> ${part.examinerCommentary.trim()}`);
        lines.push('');
      }

      // Marking key at the BOTTOM, as requested.
      if (part.markingPoints && part.markingPoints.length > 0) {
        const total = part.markingPoints.reduce((n, mp) => n + mp.marks, 0);
        lines.push('---');
        lines.push('');
        lines.push(`**Marking key (${total}/${part.marks} marks broken down):**`);
        for (const mp of part.markingPoints) {
          lines.push(`- (${mp.marks} mark${mp.marks === 1 ? '' : 's'}) ${mp.description}`);
        }
        lines.push('');
      }
    }
  } else {
    // No specific part named — list parts so the user can pick.
    lines.push(`**${paper.name} — ${paper.session} (Section ${paper.paperSection}, ${paper.totalMarks} marks)**`);
    lines.push('');
    lines.push(`**Parts in this question:**`);
    for (const part of paper.questionParts) {
      const shortReq = trimText(part.requirement, 110);
      lines.push(`- **${part.label}** (${part.marks} marks) — ${shortReq}`);
    }
    lines.push('');
    lines.push(
      `Ask for a specific part (e.g. "${paper.name} part ${paper.questionParts[0]?.label ?? '(a)'}") and I'll write you the model answer with the marking key.`,
    );
  }

  if (paper.keyAnswerTips?.trim()) {
    lines.push('');
    lines.push(`**Kaplan key answer tip:**`);
    lines.push(`> ${paper.keyAnswerTips.trim()}`);
  }

  lines.push('');
  lines.push(
    `Open the **⏱ Practice (CBE)** tab on this paper to write your own attempt — the AI marker can then grade you against this benchmark.`,
  );

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Turn the per-mark marking points into a flowing exam-prose answer
 * body. Each marking point becomes one sentence in the model answer.
 * Not as polished as LLM-generated prose, but technically correct.
 */
function synthesisedAnswerBody(part: QuestionPart): string[] {
  const out: string[] = [];

  if (!part.markingPoints || part.markingPoints.length === 0) {
    out.push(
      'No per-mark Kaplan marking guide is available for this part. Use the requirement above as your scaffold and structure your answer to mirror the verbs used (calculate, discuss, evaluate, recommend).',
    );
    return out;
  }

  // Group points into "calculation-style" vs "discussion-style" based on the
  // verbs the marking guide uses. Calculation parts get a numbered list;
  // discussion parts get prose bullets.
  const isCalc = /^(calculate|estimate|compute|determine|prepare|build|workings)/i.test(
    part.requirement,
  );

  if (isCalc) {
    out.push('Set out the working as a clear numbered table or schedule:');
    out.push('');
    part.markingPoints.forEach((mp, i) => {
      out.push(`${i + 1}. ${prosifyMarkPoint(mp.description)}`);
    });
  } else {
    part.markingPoints.forEach((mp) => {
      out.push(`- ${prosifyMarkPoint(mp.description)}`);
    });
  }

  return out;
}

/**
 * Lightweight transform from a Kaplan marking-point description (often
 * written in note form like "Sales revenue years 1–4 correctly inflated
 * at 5% per year") into a sentence a candidate would actually write.
 *
 * Heuristic only — finishes the sentence with a period if missing,
 * capitalises the first letter, and trims trailing fragments.
 */
function prosifyMarkPoint(desc: string): string {
  let t = desc.trim();
  if (!t) return '';
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t = `${t}.`;
  return t;
}

function marksTimeBudget(marks: number): string {
  // Examiner standard: 1.8 minutes per mark for AFM CBE.
  const mins = Math.round(marks * 1.8);
  return `${mins}-min`;
}

function trimText(text: string, max = 800): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
