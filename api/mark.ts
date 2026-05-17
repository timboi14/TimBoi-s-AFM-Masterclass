/**
 * POST /api/mark
 *
 * AI marker for the CBE practice workspace. Takes the candidate's answer
 * to a specific question part + the Kaplan marking guide + examiner notes,
 * and streams back structured feedback from DeepSeek.
 *
 * Env vars required:
 *   DEEPSEEK_API_KEY — get one at https://platform.deepseek.com
 *
 * Optional:
 *   DEEPSEEK_MODEL              — defaults to 'deepseek-chat' (V3). Use
 *                                 'deepseek-reasoner' for R1 (slower, stronger).
 *   UPSTASH_REDIS_REST_URL      — paste from console.upstash.com to enable
 *   UPSTASH_REDIS_REST_TOKEN      per-IP rate limiting. Both vars must be set.
 *   MARK_DAILY_LIMIT            — calls per IP per day; defaults to 20.
 *   MARK_MAX_WORD_CHARS         — request body cap; defaults to 8000.
 *   MARK_MIN_WORD_CHARS         — minimum answer length; defaults to 20.
 *
 * Runs on Vercel's edge runtime so the response can stream as the model
 * generates. Plain-text chunks are written to the body; the client just
 * reads them in order and appends to the UI.
 */
export const config = { runtime: 'edge' };

interface MarkingPoint {
  description: string;
  marks: number;
}

interface MarkRequest {
  paperName: string;
  paperSession: string;
  partLabel: string;
  partMarks: number;
  partRequirement: string;
  markingPoints?: MarkingPoint[];
  examinerCommentary?: string;
  modelAnswerExtract?: string;
  /** plain-text version of the candidate's word-processor pane */
  studentWord: string;
  /** non-empty cells from the candidate's spreadsheet, formatted as A1: value */
  studentSheet: string;
}

const ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const DEFAULT_DAILY_LIMIT = 20;
const DEFAULT_MIN_WORD_CHARS = 20;
const DEFAULT_MAX_WORD_CHARS = 8000;
const RATE_LIMIT_TIMEOUT_MS = 1500;   // never wait longer than this for Upstash
const DEEPSEEK_TIMEOUT_MS = 60_000;   // hard ceiling on the upstream connect

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(
      'AI marker is not configured. Site owner: set DEEPSEEK_API_KEY in Vercel.',
      { status: 503 },
    );
  }

  let body: MarkRequest;
  try {
    body = (await req.json()) as MarkRequest;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Basic shape check — keeps the prompt clean if the client misbehaves.
  if (!body.paperName || !body.partLabel || !body.partRequirement) {
    return new Response('Missing required fields', { status: 400 });
  }

  // Answer-size guards — cheap rejection before we even hit the upstream.
  const minChars = numEnv('MARK_MIN_WORD_CHARS', DEFAULT_MIN_WORD_CHARS);
  const maxChars = numEnv('MARK_MAX_WORD_CHARS', DEFAULT_MAX_WORD_CHARS);
  const wordLen = (body.studentWord ?? '').length;
  const sheetLen = (body.studentSheet ?? '').length;
  if (wordLen + sheetLen < minChars) {
    return new Response(
      `Answer too short to mark (minimum ${minChars} characters across the word processor + spreadsheet).`,
      { status: 400 },
    );
  }
  if (wordLen > maxChars) {
    return new Response(
      `Answer too long (${wordLen} chars). Maximum is ${maxChars} characters in the word processor.`,
      { status: 413 },
    );
  }

  // Optional per-IP daily rate limit via Upstash Redis REST API. Only enforced
  // when both env vars are set, so the API works without an Upstash account.
  //
  // Hard 1.5s timeout via Promise.race — fail-open if Upstash hangs.
  // This is the fix for the 300s FUNCTION_INVOCATION_TIMEOUT bug we hit when
  // the Redis DB was provisioned in af-south-1 and the function ran in lhr1;
  // the long-haul fetch occasionally never resolved under Edge runtime.
  console.log('[mark] rate-limit start');
  const rl = await raceWithTimeout(checkRateLimit(req), RATE_LIMIT_TIMEOUT_MS, null);
  console.log('[mark] rate-limit done; blocked=%s remaining=%s', rl?.blocked, rl?.remaining);
  if (rl?.blocked) {
    return new Response(
      `Daily limit reached (${rl.limit} marks per day). Resets in ${rl.resetInHours}h.`,
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

  console.log('[mark] deepseek fetch start; model=%s prompt-chars=%d', model, userPrompt.length);
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
        temperature: 0.3,
        max_tokens: 1600,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'fetch failed';
    console.warn('[mark] deepseek fetch threw:', msg);
    const reason =
      e instanceof DOMException && e.name === 'TimeoutError'
        ? 'AI provider did not respond in time. Please try again.'
        : `Could not reach the AI provider: ${msg}`;
    return new Response(reason, { status: 504 });
  }
  console.log('[mark] deepseek returned status=%d', upstream.status);

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => 'upstream error');
    return new Response(`AI provider error: ${text.slice(0, 300)}`, {
      status: upstream.status || 502,
    });
  }

  // Transform OpenAI/DeepSeek SSE chunks into plain text chunks the client
  // can simply append. Keeps the client code trivial.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      // SSE frames are separated by \n\n.
      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 2);
        if (!frame.startsWith('data:')) continue;
        const data = frame.slice(5).trim();
        if (data === '[DONE]') {
          controller.close();
          return;
        }
        try {
          const json = JSON.parse(data) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const piece = json.choices?.[0]?.delta?.content;
          if (piece) controller.enqueue(encoder.encode(piece));
        } catch {
          // Skip malformed frame — keep going.
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => undefined);
    },
  });

  const headers: Record<string, string> = {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
  };
  if (rl) {
    headers['x-ratelimit-limit'] = String(rl.limit);
    headers['x-ratelimit-remaining'] = String(rl.remaining);
  }

  return new Response(stream, { status: 200, headers });
}

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

/**
 * Per-IP daily rate limit via Upstash Redis REST API.
 * Returns null if not configured (rate limiting disabled).
 */
async function checkRateLimit(req: Request): Promise<RateLimitInfo | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const limit = numEnv('MARK_DAILY_LIMIT', DEFAULT_DAILY_LIMIT);
  const ip =
    (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anon';
  // Day bucket in UTC so all users share the same midnight boundary.
  const day = Math.floor(Date.now() / 86_400_000);
  const key = `mark:${ip}:${day}`;

  // INCR + EXPIRE in one pipeline call.
  // AbortSignal.timeout is the inner guard; Promise.race at the call site is
  // the outer guard for the rare case where Edge's fetch swallows the signal.
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
    if (!res.ok) return null; // fail-open if Redis is down — don't block users
    const out = (await res.json()) as Array<{ result?: number; error?: string }>;
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
    console.warn('[mark] upstash skipped:', (e as Error).message ?? e);
    return null;
  }
}

/**
 * Belt-and-braces wrapper for the rate-limit call. Even though the inner
 * Upstash fetch now carries AbortSignal.timeout(), Vercel's Edge fetch
 * has been observed to ignore that signal on cross-region long-haul calls
 * (e.g. lhr1 → af-south-1). Promise.race guarantees this call site can
 * never block longer than `timeoutMs`.
 */
function raceWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

const SYSTEM_PROMPT = `You are an experienced ACCA AFM examiner. You mark candidate answers against the published marking guide. Be strict but fair, and link your feedback to the specific marking points and the verbatim ACCA examiner notes when provided.

Output format (Markdown). Use exactly these section headings:

**Marks awarded: X / Y**

**What you got right**
- bullet points tied to specific marking-point lines

**Marks lost / improvements**
- bullet points tied to specific marking-point lines. Be concrete — say what was missing or wrong and what the model answer expected.

**Examiner perspective**
One short paragraph (3–5 sentences) tying the feedback back to the examiner notes, written in the voice of the AFM examining team. Cite the actual numbers / phrases the candidate used.

**Next step**
One sentence — the single most valuable thing this candidate should practise next to improve on this part.

Do not invent marking criteria the question did not include. Do not award marks for points outside the guide. If the candidate's answer is empty or unintelligible, award 0 and explain what a passing answer would have looked like.`;

function buildPrompt(b: MarkRequest): string {
  const markingGuide =
    b.markingPoints && b.markingPoints.length > 0
      ? b.markingPoints
          .map((m) => `- (${m.marks} mark${m.marks === 1 ? '' : 's'}) ${m.description}`)
          .join('\n')
      : '(No per-mark marking points were provided. Mark holistically against the requirement.)';

  const examinerNotes = b.examinerCommentary?.trim()
    ? `EXAMINER NOTES (verbatim from ACCA examiner report):\n${b.examinerCommentary.trim()}`
    : '(No examiner notes available for this specific part.)';

  const modelExtract = b.modelAnswerExtract?.trim()
    ? `KAPLAN MODEL ANSWER EXTRACT (for reference only — do not penalise the candidate for using different valid working):\n${b.modelAnswerExtract.trim()}`
    : '';

  const word = b.studentWord?.trim() || '(Word-processor pane is empty.)';
  const sheet = b.studentSheet?.trim() || '(Spreadsheet pane is empty.)';

  return [
    `PAPER: ${b.paperName} (${b.paperSession})`,
    `PART: ${b.partLabel} — worth ${b.partMarks} marks`,
    '',
    'REQUIREMENT:',
    b.partRequirement.trim(),
    '',
    'MARKING GUIDE (per Kaplan):',
    markingGuide,
    '',
    examinerNotes,
    modelExtract ? `\n${modelExtract}` : '',
    '',
    "CANDIDATE'S ANSWER — WORD PROCESSOR PANE:",
    word,
    '',
    "CANDIDATE'S ANSWER — SPREADSHEET (non-empty cells):",
    sheet,
    '',
    `Now mark this answer out of ${b.partMarks}.`,
  ]
    .filter(Boolean)
    .join('\n');
}
