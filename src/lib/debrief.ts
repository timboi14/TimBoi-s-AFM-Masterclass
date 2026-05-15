/**
 * Self-debrief storage + structural-critique heuristic.
 *
 * HARD RULES (enforced here, not just in UI):
 *  - The critique never rewrites the user's answer.
 *  - The critique never produces a "model answer."
 *  - The user must confirm in writing they have already submitted before
 *    any critique is generated; the function below refuses without it.
 */

export type SkillRating = 1 | 2 | 3 | 4 | 5;

export interface DebriefSession {
  id: string;
  createdAt: number;
  weekNum: number;            // course week (0 = foundations)
  topic: string;              // free text
  marks: number;              // total marks for the question
  timeAllowedMin: number;
  timeTakenMin: number;
  ownWorkConfirmed: boolean;  // gate
  selfRating: {
    communication: SkillRating;
    analysis: SkillRating;
    scepticism: SkillRating;
    commercial: SkillRating;
    calc: SkillRating;
  };
  userAnswer: string;
  critique: StructuralCritique | null;
  actionItems: string[];
}

export interface StructuralCritique {
  generatedAt: number;
  scoreOutOf: number;
  signals: { name: string; verdict: 'strong' | 'weak' | 'absent'; note: string }[];
  professionalSkillsRisks: { skill: string; risk: string }[];
  techniqueGaps: string[];     // referenced technique-page names
  noticesNotReWrite: string;   // disclaimer string echoed in output
}

import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';

const STORE_KEY = 'tba_debrief_v1';

export function loadSessions(): DebriefSession[] {
  return safeReadJson<DebriefSession[]>(STORE_KEY, []);
}

export function saveSession(s: DebriefSession) {
  const all = loadSessions();
  const idx = all.findIndex((x) => x.id === s.id);
  if (idx >= 0) all[idx] = s;
  else all.unshift(s);
  safeWriteJson(STORE_KEY, all.slice(0, 50));
}

export function deleteSession(id: string) {
  const all = loadSessions().filter((x) => x.id !== id);
  safeWriteJson(STORE_KEY, all);
}

/**
 * Structural critique. NOT a rewrite. NOT a model answer.
 * Heuristic-based; runs offline; refuses if ownWorkConfirmed is false.
 *
 * Each "signal" tests for a marker that the examiner rewards or penalises.
 * The user can compare against their own attempt and identify the gap.
 */
export function buildCritique(s: Omit<DebriefSession, 'critique'>): StructuralCritique {
  if (!s.ownWorkConfirmed) {
    throw new Error('Debrief refused: own-work confirmation required.');
  }

  const text = s.userAnswer.toLowerCase();
  const signals: StructuralCritique['signals'] = [];
  const psRisks: StructuralCritique['professionalSkillsRisks'] = [];
  const gaps: string[] = [];

  // 1) Recommendation upfront
  const earlyText = text.slice(0, 400);
  const hasRecommendationEarly = /(recommend|advise|conclude|propose|suggest)/.test(earlyText);
  signals.push({
    name: 'Recommendation upfront',
    verdict: hasRecommendationEarly ? 'strong' : 'weak',
    note: hasRecommendationEarly
      ? 'You opened with a recommendation. Examiner-style.'
      : 'No recommendation in the first ~400 chars. Marker rewards leading with the answer.',
  });
  if (!hasRecommendationEarly) psRisks.push({ skill: 'Communication', risk: 'No upfront recommendation; structure mark at risk.' });

  // 2) Workings references (W1, W2, W3...)
  const workingMatches = (s.userAnswer.match(/\b[Ww][1-9]\b/g) || []).length;
  signals.push({
    name: 'Working references (W1, W2…)',
    verdict: workingMatches >= 3 ? 'strong' : workingMatches > 0 ? 'weak' : 'absent',
    note: workingMatches >= 3
      ? `${workingMatches} working refs found.`
      : workingMatches > 0
      ? `Only ${workingMatches} working ref found. Aim for W1–W4 minimum on calc-heavy questions.`
      : 'No labelled workings (W1, W2…). Each working is a separate mark line.',
  });
  if (workingMatches < 3) gaps.push('Answer-plan template (workings table)');

  // 3) Sensitivity / "however" sentence
  const hasSensitivity = /sensitivit|stress[- ]?test|scenario analys|monte carlo|what if/.test(text);
  signals.push({
    name: 'Sensitivity / stress-test',
    verdict: hasSensitivity ? 'strong' : 'weak',
    note: hasSensitivity
      ? 'You acknowledged sensitivity. Good.'
      : 'No sensitivity / stress-test mentioned. AFM rewards "what would have to change for the decision to flip?"',
  });
  if (!hasSensitivity) gaps.push('NPV / APV technique (step 9: sensitivity)');

  const hasHowever = /(however|on the other hand|but|whereas|conversely|nevertheless)/.test(text);
  signals.push({
    name: 'Counter-argument / "however"',
    verdict: hasHowever ? 'strong' : 'weak',
    note: hasHowever
      ? 'You presented a counter-argument. Scepticism mark unlocked.'
      : 'No "however / on the other hand" sentence. Often the easiest scepticism mark.',
  });
  if (!hasHowever) psRisks.push({ skill: 'Scepticism', risk: 'No counter-argument or assumption-challenge sentence.' });

  // 4) Quoted scenario figure
  const numericQuotes = (s.userAnswer.match(/[£$€]\s?[\d,.]+\s?(m|bn|k)?\b/gi) || []).length;
  signals.push({
    name: 'Scenario figures quoted',
    verdict: numericQuotes >= 3 ? 'strong' : numericQuotes > 0 ? 'weak' : 'absent',
    note: numericQuotes >= 3
      ? `${numericQuotes} numeric scenario quotes. Specific = scoring.`
      : numericQuotes > 0
      ? `Only ${numericQuotes} scenario figure quoted. Generic answers cap at the knowledge mark.`
      : 'No scenario figures quoted. Examiner: "answer THIS company in THIS scenario."',
  });
  if (numericQuotes < 3) psRisks.push({ skill: 'Commercial Acumen', risk: 'Insufficient scenario figures quoted.' });

  // 5) Headings / structure
  const lines = s.userAnswer.split(/\n+/);
  const headingLines = lines.filter((l) => /^#{1,3}\s|\*\*[^*]+\*\*$|^[A-Z][A-Z\s]{6,}$/.test(l.trim())).length;
  signals.push({
    name: 'Structured headings',
    verdict: headingLines >= 3 ? 'strong' : headingLines > 0 ? 'weak' : 'absent',
    note: headingLines >= 3
      ? `${headingLines} heading-style lines. Clear structure.`
      : 'Few or no headings. The marker scans for structure first; bold headings unlock communication marks.',
  });
  if (headingLines < 3) psRisks.push({ skill: 'Communication', risk: 'Headings are sparse; flow may be hard to mark.' });

  // 6) ESG / sustainability mention (often a scoring panel)
  const hasEsg = /(esg|sustainab|environment|carbon|emissions|green|stakeholder|social licence)/.test(text);
  signals.push({
    name: 'ESG / stakeholder lens',
    verdict: hasEsg ? 'strong' : 'weak',
    note: hasEsg
      ? 'ESG / stakeholder reference present. Bank the marks.'
      : 'No ESG or stakeholder reference. From SD25 onward, almost every Section A allocates marks here.',
  });
  if (!hasEsg) gaps.push('Behavioural & ESG playbook (Issue → Action → Outcome)');

  // 7) Time discipline
  const expectedMin = s.marks * 1.8;
  const overshoot = s.timeTakenMin > expectedMin * 1.15;
  const undershoot = s.timeTakenMin < expectedMin * 0.7;
  signals.push({
    name: 'Time discipline',
    verdict: !overshoot && !undershoot ? 'strong' : 'weak',
    note: overshoot
      ? `Took ${s.timeTakenMin}m vs target ${Math.round(expectedMin)}m. Rule of thumb: 1.8 min/mark, then move on.`
      : undershoot
      ? `Used only ${s.timeTakenMin}m vs target ${Math.round(expectedMin)}m. Likely under-developed answer.`
      : `Within target window (~${Math.round(expectedMin)}m for ${s.marks} marks).`,
  });

  // 8) Length / depth heuristic
  const wordCount = (s.userAnswer.trim().match(/\S+/g) || []).length;
  const targetWords = s.marks * 30; // rough heuristic: 25-35 words per mark
  signals.push({
    name: 'Answer depth (word count)',
    verdict: wordCount >= targetWords * 0.8 && wordCount <= targetWords * 1.5 ? 'strong' : 'weak',
    note: `Answer is ~${wordCount} words. Heuristic target for ${s.marks} marks is ${targetWords} words. Calc-heavy answers may be lower; discussion answers should hit this.`,
  });

  // Aggregate
  const strong = signals.filter((s) => s.verdict === 'strong').length;

  return {
    generatedAt: Date.now(),
    scoreOutOf: signals.length,
    signals,
    professionalSkillsRisks: psRisks,
    techniqueGaps: Array.from(new Set(gaps)),
    noticesNotReWrite:
      'This critique reviews structure and technique signals only. ' +
      'It does not rewrite your answer or generate a model answer. ' +
      'Use it to identify gaps before your next attempt.',
  };
}

/** Trends across past sessions for the dashboard. */
export interface DebriefTrends {
  total: number;
  averageMarksPercent: number;
  weakestSignals: { name: string; weakCount: number }[];
  weakestSkill: string | null;
}

export function summariseTrends(sessions: DebriefSession[]): DebriefTrends {
  if (sessions.length === 0) return { total: 0, averageMarksPercent: 0, weakestSignals: [], weakestSkill: null };
  const signalCounts = new Map<string, { weak: number; total: number }>();
  const skillSums = { communication: 0, analysis: 0, scepticism: 0, commercial: 0, calc: 0 };
  let percentSum = 0;
  let percentCount = 0;
  for (const s of sessions) {
    if (s.critique) {
      for (const sig of s.critique.signals) {
        const cur = signalCounts.get(sig.name) || { weak: 0, total: 0 };
        cur.total += 1;
        if (sig.verdict !== 'strong') cur.weak += 1;
        signalCounts.set(sig.name, cur);
      }
      const strong = s.critique.signals.filter((x) => x.verdict === 'strong').length;
      percentSum += (strong / s.critique.signals.length) * 100;
      percentCount += 1;
    }
    skillSums.communication += s.selfRating.communication;
    skillSums.analysis += s.selfRating.analysis;
    skillSums.scepticism += s.selfRating.scepticism;
    skillSums.commercial += s.selfRating.commercial;
    skillSums.calc += s.selfRating.calc;
  }
  const weakestSignals = Array.from(signalCounts.entries())
    .map(([name, v]) => ({ name, weakCount: v.weak }))
    .sort((a, b) => b.weakCount - a.weakCount)
    .slice(0, 3);
  const skillEntries = Object.entries(skillSums).sort((a, b) => a[1] - b[1]);
  return {
    total: sessions.length,
    averageMarksPercent: percentCount ? Math.round(percentSum / percentCount) : 0,
    weakestSignals,
    weakestSkill: skillEntries[0] ? skillEntries[0][0] : null,
  };
}
