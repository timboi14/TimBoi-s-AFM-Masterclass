/**
 * Coach scaffold builder for past-paper questions.
 *
 * When the user names a specific paper (e.g. "para fuels co question a"),
 * Coach should NOT fall through to the generic topic menu. Instead it
 * synthesises a marking-point checklist + structural outline + worked
 * hint, all from data already in src/data/pastpapers/papers.ts.
 *
 * Refusal policy: we still decline to write the candidate's submission
 * verbatim (the homework banner is correct). But "create a model answer"
 * is treated as a request for an educational scaffold, not ghostwriting.
 * Ghostwriting is detected separately by explicit phrasings like
 * "write the full answer for me" / "I'll paste this as my submission".
 */

import { PAPERS } from '@/data/pastpapers/papers';
import type { Paper } from '@/data/pastpapers/schema';

export interface ScaffoldMatch {
  paper: Paper;
  partLabel?: string;
}

/** True when the message asks Coach to ghostwrite the candidate's submission. */
const GHOSTWRITE_PATTERNS: RegExp[] = [
  /\bwrite (my|the) (full |entire |complete )?answer\b/i,
  /\bdo (this|the) (question|paper|part) for me\b/i,
  /\bpaste(?:able)? answer\b/i,
  /\bsubmit(?:t?ing)? (?:this|my|the) as (?:my|the) (?:answer|submission)\b/i,
  /\b(?:as if|like) (?:i|the candidate) (?:wrote|did)\b/i,
];

export function isGhostwriteRequest(message: string): boolean {
  return GHOSTWRITE_PATTERNS.some((p) => p.test(message));
}

/**
 * Try to detect a specific paper + optional part the user is asking about.
 * Returns null if nothing recognisable found.
 */
export function detectPaperReference(message: string): ScaffoldMatch | null {
  const m = message.toLowerCase();

  // Score each paper by how specifically the message names it. The paper's
  // canonical name (e.g. "Para Fuels Co") is the strongest signal; the
  // paper id (e.g. "para_fuels") is a close second; tags / topics are weaker.
  let best: { paper: Paper; score: number } | null = null;

  for (const p of PAPERS) {
    const name = p.name.toLowerCase();
    const nameNoCo = name.replace(/\bco\b/g, '').replace(/\s+/g, ' ').trim();
    const idAsWords = p.id.replace(/[_-]/g, ' ');

    let score = 0;
    // Strongest: full canonical name including " Co" present in the message.
    if (m.includes(name)) score += 10;
    // Almost-as-strong: name without " Co", which is how people usually talk.
    else if (nameNoCo.length > 3 && m.includes(nameNoCo)) score += 9;
    // Paper id as a phrase (e.g. "para fuels"). Covers slug-style queries.
    else if (idAsWords !== name && idAsWords !== nameNoCo && m.includes(idAsWords)) {
      score += 8;
    }
    // Tail-of-name signal for multi-word names like "Joshua / Fraser Co" —
    // try each segment separately.
    else {
      const segments = nameNoCo
        .split(/[\/&,]/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 4); // avoid matching "co" / "ai"
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

  // Now look for a part label inside the message. Accept several phrasings:
  //   (a) / part (a) / part a / question a / requirement a / (b)(i) / (b)(ii)
  // Falls back to undefined if no part is named — caller can list all parts.
  const partLabel = detectPartLabel(m, best.paper);

  return { paper: best.paper, partLabel };
}

function detectPartLabel(messageLower: string, paper: Paper): string | undefined {
  // Try the explicit bracketed forms first; they're unambiguous.
  for (const part of paper.questionParts) {
    const lbl = part.label.toLowerCase();
    if (messageLower.includes(lbl)) return part.label;
  }
  // Loose phrasings: "part a", "question b", "requirement (a)", "section a"
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
 * Build the scaffold reply for a paper (and optional part).
 * If `refuseGhostwrite` is true, prepend a one-line decline so the user
 * sees the policy without losing the useful scaffold.
 */
export function buildScaffold({
  paper,
  partLabel,
  refuseGhostwrite,
}: {
  paper: Paper;
  partLabel?: string;
  refuseGhostwrite?: boolean;
}): string {
  const lines: string[] = [];

  if (refuseGhostwrite) {
    lines.push(
      `**I won't write your submission for you** — that's what the Debrief page is for. But here's the scaffold examiners want for this part.`,
    );
    lines.push('');
  }

  // Title block.
  if (partLabel) {
    const part = paper.questionParts.find((p) => p.label === partLabel);
    if (part) {
      lines.push(`**${paper.name} — Part ${part.label} (${part.marks} marks)**`);
      lines.push(`*${paper.session} · Section ${paper.paperSection}*`);
      lines.push('');
      lines.push(`**Requirement (verbatim from Kaplan):**`);
      lines.push(`> ${trimRequirement(part.requirement)}`);
      lines.push('');

      // Marking guide.
      if (part.markingPoints && part.markingPoints.length > 0) {
        const total = part.markingPoints.reduce((n, mp) => n + mp.marks, 0);
        lines.push(`**Marking guide (${total} marks broken down):**`);
        for (const mp of part.markingPoints) {
          lines.push(`- (${mp.marks} mark${mp.marks === 1 ? '' : 's'}) ${mp.description}`);
        }
        lines.push('');
      }

      // Structural outline derived from the marking points.
      if (part.markingPoints && part.markingPoints.length > 0) {
        lines.push(`**Structural outline:**`);
        part.markingPoints.slice(0, 5).forEach((mp, i) => {
          const oneSentence = mp.description.split(/[—–\.]/)[0].trim();
          lines.push(`${i + 1}. ${oneSentence}`);
        });
        lines.push('');
      }

      // Worked hint — pull from examiner commentary if available.
      if (part.examinerCommentary?.trim()) {
        lines.push(`**Where most candidates lose marks (verbatim ACCA examiner):**`);
        lines.push(`> ${part.examinerCommentary.trim()}`);
        lines.push('');
      }
    }
  } else {
    // No specific part named — list the parts so the user can pick.
    lines.push(`**${paper.name} — ${paper.session} (Section ${paper.paperSection}, ${paper.totalMarks} marks)**`);
    lines.push('');
    lines.push(`**Parts in this question:**`);
    for (const part of paper.questionParts) {
      const shortReq = trimRequirement(part.requirement, 110);
      lines.push(`- **${part.label}** (${part.marks} marks) — ${shortReq}`);
    }
    lines.push('');
    lines.push(
      `Ask me about a specific part (e.g. "${paper.name} part ${paper.questionParts[0]?.label ?? '(a)'}") and I'll give you the marking-point checklist, structural outline, and the trap candidates fall into.`,
    );
    lines.push('');
  }

  // Paper-level key tip, always useful.
  if (paper.keyAnswerTips?.trim()) {
    lines.push(`**Kaplan key answer tip:**`);
    lines.push(`> ${paper.keyAnswerTips.trim()}`);
    lines.push('');
  }

  // Always remind where to actually attempt it.
  lines.push(
    `Open the **⏱ Practice (CBE)** tab on this paper to attempt it — the workspace auto-saves under your fan name and the AI marker can grade your attempt once you're done.`,
  );

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function trimRequirement(text: string, max = 800): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}
