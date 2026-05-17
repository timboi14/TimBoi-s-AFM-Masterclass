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
 *   DEEPSEEK_MODEL   — defaults to 'deepseek-chat' (V3). Use
 *                      'deepseek-reasoner' for the R1 model (slower,
 *                      stronger reasoning, slightly higher cost).
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

  const userPrompt = buildPrompt(body);
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const upstream = await fetch(ENDPOINT, {
    method: 'POST',
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

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
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
