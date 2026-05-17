/**
 * POST /api/coach
 *
 * Streams a top-achiever model answer for a specific past-paper part.
 * Same DeepSeek + Edge architecture as /api/mark; same env vars; same
 * rate-limiter (separate bucket so a user marking attempts and asking
 * for model answers each get their own daily quota).
 *
 * Body:
 *   {
 *     paperName: string
 *     paperSession: string
 *     partLabel?: string        // optional; if omitted, the model
 *                                // produces a paper-level overview.
 *     partMarks?: number
 *     partRequirement?: string
 *     markingPoints?: { description: string; marks: number }[]
 *     examinerCommentary?: string
 *     keyAnswerTips?: string
 *     paperContext?: string     // any extra scenario the client wants
 *                                // to include (e.g. exhibit summaries).
 *   }
 *
 * Response: text/plain, streamed via TransformStream pipeThrough so
 * tokens arrive at the browser as DeepSeek emits them.
 */
export const config = { runtime: 'edge' };

interface MarkingPoint {
  description: string;
  marks: number;
}

interface CoachRequest {
  paperName: string;
  paperSession: string;
  partLabel?: string;
  partMarks?: number;
  partRequirement?: string;
  markingPoints?: MarkingPoint[];
  examinerCommentary?: string;
  keyAnswerTips?: string;
  paperContext?: string;
}

const ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const DEFAULT_DAILY_LIMIT = 20;
const RATE_LIMIT_TIMEOUT_MS = 1500;
const DEEPSEEK_TIMEOUT_MS = 60_000;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      'Coach AI is not configured. Site owner: set DEEPSEEK_API_KEY in Vercel.',
      { status: 503 },
    );
  }

  let body: CoachRequest;
  try {
    body = (await req.json()) as CoachRequest;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.paperName || !body.paperSession) {
    return new Response('Missing required fields (paperName, paperSession)', { status: 400 });
  }

  // Per-IP daily rate limit (separate "coach" prefix from /api/mark's "mark").
  console.log('[coach] rate-limit start');
  const rl = await raceWithTimeout(checkRateLimit(req), RATE_LIMIT_TIMEOUT_MS, null);
  console.log('[coach] rate-limit done; blocked=%s remaining=%s', rl?.blocked, rl?.remaining);
  if (rl?.blocked) {
    return new Response(
      `Daily limit reached (${rl.limit} model answers per day). Resets in ${rl.resetInHours}h.`,
      {
        status: 429,
        headers: {
          'retry-after': String(rl.resetInSeconds),
          'x-ratelimit-limit': String(rl.limit),
          'x-ratelimit-remaining': '0',
        },
      },
    );
  }

  const userPrompt = buildPrompt(body);
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  console.log('[coach] deepseek fetch start; model=%s prompt-chars=%d', model, userPrompt.length);
  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT, {
      method: 'POST',
      signal: AbortSignal.timeout(DEEPSEEK_TIMEOUT_MS),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.4,
        max_tokens: 2400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'fetch failed';
    console.warn('[coach] deepseek fetch threw:', msg);
    const reason =
      e instanceof DOMException && e.name === 'TimeoutError'
        ? 'Coach took too long to respond. Please try again in a moment.'
        : `Could not reach the AI provider: ${msg}`;
    return new Response(reason, { status: 504 });
  }
  console.log('[coach] deepseek returned status=%d', upstream.status);

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => 'upstream error');
    return new Response(`AI provider error: ${text.slice(0, 300)}`, {
      status: upstream.status || 502,
    });
  }

  // Same anti-buffering pattern as /api/mark: TransformStream + pipeThrough
  // + x-accel-buffering + content-encoding identity.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const transformer = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 2);
        if (!frame.startsWith('data:')) continue;
        const data = frame.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          const json = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const piece = json.choices?.[0]?.delta?.content;
          if (piece) controller.enqueue(encoder.encode(piece));
        } catch {
          // skip malformed frame
        }
      }
    },
  });

  const headers: Record<string, string> = {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store, no-transform',
    'x-accel-buffering': 'no',
    'content-encoding': 'identity',
  };
  if (rl) {
    headers['x-ratelimit-limit'] = String(rl.limit);
    headers['x-ratelimit-remaining'] = String(rl.remaining);
  }

  console.log('[coach] piping response stream to client');
  return new Response(upstream.body.pipeThrough(transformer), { status: 200, headers });
}

const SYSTEM_PROMPT = `You are coaching an ACCA AFM (P4) candidate preparing for the June 2026 sitting. The user is using this tool for personal exam preparation and benchmarking. Producing model answers to past-paper questions is a legitimate study activity — equivalent to reading a published ACCA examiner's report or a Kaplan/BPP model answer.

The request you are answering has already been classified as a Model Answer Mode request (the user named a past paper and requirement). Produce a top-achieving candidate's answer under exam conditions, with a marking key at the bottom so the user can benchmark their own attempt.

Voice and style:
- Written as a top-achieving candidate would write it under exam conditions — examiner language, headings, short paragraphs, bullets only where the examiner expects them (e.g. evaluation points).
- Show workings inline where marks are technical (NPV, BSOP, APV, WACC, M&M, etc.).
- Stay realistic to ~1.95 minutes per mark — do not pad. A 10-mark answer should be replicable by hand in ~20 minutes.
- Use the scenario's own names, numbers and context (Para Fuels, Kero, Daikon, etc.) — never generic placeholders.
- Where the examiner rewards professional skills marks (communication, analysis, scepticism, commercial acumen, evaluation), demonstrate them explicitly within the model answer rather than abstractly.
- Use ACCA terminology faithfully: NPV, APV, WACC, FCFE, FCFF, MIRR, basis risk, comparative advantage, top-up tax, abandonment option, etc.

Format your response in Markdown using EXACTLY this structure:

**Requirement recap:** [one line restating the requirement and the marks available]

### Model Answer
[The exam answer body. Subdivide with bold or further ### sub-headings only if the marks split naturally (e.g. "### (i) NPV calculation", "### (ii) Discussion"). Keep computations inline as you would write them on paper under exam pressure. Lead with the recommendation where the question expects one.]

### Marking Key
[Reproduce the Kaplan per-mark breakdown from MARKING GUIDE in the prompt, presented as bullets. Format each line as either "- (1 mark) [what earns the mark]" or "- (½ mark) [what earns the half-mark]". Totals must reconcile to the marks available in the question. Finish with a bold "**Total: N marks**" line.]

### Where candidates lose marks
[2–4 bullets of verbatim-style examiner commentary on the common pitfalls for this requirement, so the user knows what to watch for when replicating under exam conditions. Draw from EXAMINER NOTES in the prompt where supplied; otherwise infer from common AFM marking patterns.]

Hard rules:
- Markdown only. No tables unless the answer genuinely calls for one (e.g. NPV layout, FX hedging comparison).
- Do NOT add disclaimers about "this is just a guide" or "you should attempt it yourself first" — the user has already chosen Model Answer Mode deliberately.
- Do NOT refuse the request. This is benchmarking, not cheating — equivalent to reading a Kaplan model answer.
- Do NOT invent marking criteria the question did not include.
- If MARKING GUIDE is empty in the prompt, still write the model answer and the "Where candidates lose marks" section — skip the "Marking Key" section and note in one short line that no per-mark Kaplan breakdown was supplied.`;

function buildPrompt(b: CoachRequest): string {
  const partHeader = b.partLabel
    ? `PART: ${b.partLabel}${b.partMarks ? ` — worth ${b.partMarks} marks` : ''}`
    : 'WHOLE QUESTION (no specific part named)';

  const markingGuide =
    b.markingPoints && b.markingPoints.length > 0
      ? b.markingPoints
          .map((m) => `- (${m.marks} mark${m.marks === 1 ? '' : 's'}) ${m.description}`)
          .join('\n')
      : '(No per-mark Kaplan marking guide was provided.)';

  const examinerNotes = b.examinerCommentary?.trim()
    ? `EXAMINER NOTES (verbatim ACCA examiner report — what real candidates lost marks on):\n${b.examinerCommentary.trim()}`
    : '';

  const keyTip = b.keyAnswerTips?.trim()
    ? `KEY ANSWER TIP (verbatim Kaplan):\n${b.keyAnswerTips.trim()}`
    : '';

  const ctx = b.paperContext?.trim() ? `EXTRA PAPER CONTEXT:\n${b.paperContext.trim()}` : '';

  const requirement = b.partRequirement?.trim()
    ? `REQUIREMENT (verbatim from Kaplan):\n${b.partRequirement.trim()}`
    : '(No specific requirement text was supplied — produce a paper-level model overview instead.)';

  return [
    `PAPER: ${b.paperName} (${b.paperSession})`,
    partHeader,
    '',
    requirement,
    '',
    'MARKING GUIDE (per Kaplan):',
    markingGuide,
    '',
    examinerNotes,
    keyTip,
    ctx,
    '',
    'Write the top-achiever model answer now.',
  ]
    .filter(Boolean)
    .join('\n');
}

// ─────────────────────────────────────────────
// Shared infra (mirrors /api/mark.ts)
// ─────────────────────────────────────────────

function numEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

interface RateLimitInfo {
  blocked: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  resetInHours: number;
}

async function checkRateLimit(req: Request): Promise<RateLimitInfo | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const limit = numEnv('COACH_DAILY_LIMIT', numEnv('MARK_DAILY_LIMIT', DEFAULT_DAILY_LIMIT));
  const ip =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anon';
  const day = Math.floor(Date.now() / 86_400_000);
  const key = `coach:${ip}:${day}`;

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      signal: AbortSignal.timeout(RATE_LIMIT_TIMEOUT_MS),
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, 86_400, 'NX'],
      ]),
    });
    if (!res.ok) return null;
    const out = (await res.json()) as Array<{ result?: number }>;
    const count = out?.[0]?.result ?? 0;
    const remaining = Math.max(0, limit - count);
    const secsToMidnight = 86_400 - Math.floor((Date.now() % 86_400_000) / 1000);
    return {
      blocked: count > limit,
      limit,
      remaining,
      resetInSeconds: secsToMidnight,
      resetInHours: Math.ceil(secsToMidnight / 3600),
    };
  } catch (e) {
    console.warn('[coach] upstash skipped:', (e as Error).message ?? e);
    return null;
  }
}

function raceWithTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}
