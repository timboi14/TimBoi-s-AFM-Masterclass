/**
 * Web Speech API helpers. Pure browser, no backend, no API keys.
 * - SpeechRecognition: dictation (mic -> text)
 * - SpeechSynthesis: text-to-speech (coach reply -> spoken words)
 *
 * Voice quality strategy: prefer NEURAL ("Online (Natural)" / "Premium")
 * voices when the OS exposes them. On Windows the Microsoft *Online
 * Natural* voices (Aria, Libby, Ryan, Sonia) sound far more human than
 * legacy David/Zira. On macOS we prefer Daniel / Serena / Oliver.
 */

type RecognitionState = 'idle' | 'listening' | 'error';

export interface RecognitionHandle {
  start: () => void;
  stop: () => void;
  supported: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export function createRecognition({
  onPartial,
  onFinal,
  onState,
  onError,
  lang = 'en-GB',
  continuous = false,
}: {
  onPartial?: (text: string) => void;
  onFinal?: (text: string) => void;
  onState?: (state: RecognitionState) => void;
  onError?: (msg: string) => void;
  lang?: string;
  continuous?: boolean;
}): RecognitionHandle {
  const w = (typeof window !== 'undefined' ? window : {}) as any;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SR) {
    return {
      start: () => onError?.('Voice not supported on this browser. Try Chrome or Edge.'),
      stop: () => {},
      supported: false,
    };
  }
  const r: any = new SR();
  r.lang = lang;
  r.continuous = continuous;
  r.interimResults = true;
  r.maxAlternatives = 1;

  r.onstart = () => onState?.('listening');
  r.onend = () => onState?.('idle');
  r.onerror = (e: any) => {
    onState?.('error');
    onError?.(e?.error || 'Speech recognition error.');
  };
  r.onresult = (e: any) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) final += res[0].transcript;
      else interim += res[0].transcript;
    }
    if (interim) onPartial?.(interim.trim());
    if (final) onFinal?.(final.trim());
  };

  return {
    start: () => {
      try { r.start(); } catch (err: any) {
        onError?.(err?.message || 'Could not start microphone');
      }
    },
    stop: () => { try { r.stop(); } catch {} },
    supported: true,
  };
}

/* ─── voice catalogue + picker ─────────────────────────────── */

export interface VoiceOption {
  name: string;
  lang: string;
  quality: 'neural' | 'enhanced' | 'standard';
  gender?: 'male' | 'female' | 'unknown';
}

const NEURAL_PATTERNS = [
  /Online \(Natural\)/i,    // Microsoft Edge Online voices
  /Natural/i,
  /Neural/i,
  /Premium/i,
  /Enhanced/i,
  /Online/i,                // Edge web voices
];
const PREFERRED_NAMES = [
  // Microsoft Edge neural (Windows)
  'Microsoft Sonia Online', 'Microsoft Libby Online', 'Microsoft Aria Online',
  'Microsoft Ryan Online', 'Microsoft Guy Online', 'Microsoft Jenny Online',
  // Apple high-quality
  'Daniel', 'Serena', 'Oliver', 'Kate', 'Stephanie',
  // Google
  'Google UK English Female', 'Google UK English Male',
  'Google US English',
];
const FEMALE_HINTS = /aria|jenny|libby|sonia|kate|serena|stephanie|female|allison|samantha|fiona|veena/i;
const MALE_HINTS = /ryan|guy|daniel|oliver|tom|alex|david|male|fred/i;

function classifyVoice(v: SpeechSynthesisVoice): VoiceOption {
  const isNeural = NEURAL_PATTERNS.some((p) => p.test(v.name));
  const quality: VoiceOption['quality'] = isNeural ? 'neural' : (v as any).localService ? 'standard' : 'enhanced';
  let gender: VoiceOption['gender'] = 'unknown';
  if (FEMALE_HINTS.test(v.name)) gender = 'female';
  else if (MALE_HINTS.test(v.name)) gender = 'male';
  return { name: v.name, lang: v.lang, quality, gender };
}

/** Returns voices sorted by quality (neural first), preferring en-GB. */
export function listVoices(): VoiceOption[] {
  if (!isSpeechSynthesisSupported()) return [];
  const all = window.speechSynthesis.getVoices();
  return all
    .filter((v) => v.lang?.toLowerCase().startsWith('en'))
    .map(classifyVoice)
    .sort((a, b) => {
      const qScore = (q: VoiceOption['quality']) => q === 'neural' ? 3 : q === 'enhanced' ? 2 : 1;
      const langScore = (l: string) => l === 'en-GB' ? 2 : l.startsWith('en') ? 1 : 0;
      const nameScore = (n: string) => {
        const idx = PREFERRED_NAMES.findIndex((p) => n.includes(p));
        return idx === -1 ? 0 : (PREFERRED_NAMES.length - idx);
      };
      const sa = qScore(a.quality) * 100 + langScore(a.lang) * 10 + nameScore(a.name);
      const sb = qScore(b.quality) * 100 + langScore(b.lang) * 10 + nameScore(b.name);
      return sb - sa;
    });
}

/** Best-default voice if the user hasn't picked one yet. */
export function pickDefaultVoice(): string | null {
  const list = listVoices();
  return list[0]?.name || null;
}

/* ─── speech synthesis with natural cadence ───────────────── */

let voicesReadyPromise: Promise<void> | null = null;
function whenVoicesReady(): Promise<void> {
  if (!isSpeechSynthesisSupported()) return Promise.resolve();
  const synth = window.speechSynthesis;
  if (synth.getVoices().length > 0) return Promise.resolve();
  if (voicesReadyPromise) return voicesReadyPromise;
  voicesReadyPromise = new Promise<void>((resolve) => {
    const handler = () => { synth.removeEventListener('voiceschanged', handler); resolve(); };
    synth.addEventListener('voiceschanged', handler);
    setTimeout(resolve, 1500); // fallback if event never fires
  });
  return voicesReadyPromise;
}

/**
 * Speak the supplied text with natural pacing.
 * Splits long passages into sentence-sized utterances so the voice
 * sounds less robotic (mid-paragraph pauses instead of one monotone
 * stream) and so the user can interrupt cleanly.
 */
export function speak(
  text: string,
  opts: { voiceName?: string | null; rate?: number; pitch?: number } = {},
): { stop: () => void } {
  if (!isSpeechSynthesisSupported()) return { stop: () => {} };
  const synth = window.speechSynthesis;
  synth.cancel();

  let cancelled = false;
  const handle = { stop: () => { cancelled = true; synth.cancel(); } };

  const cleaned = text
    .replace(/\*\*/g, '')
    .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
    .replace(/\|.*?\|/g, ' ')                           // strip table rows
    .replace(/^[-*]\s+/gm, '')                          // bullet markers
    .replace(/^\d+\.\s+/gm, '')                         // numbered list markers
    .replace(/[#>]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Sentence-split for natural cadence; cap each chunk at ~280 chars so
  // long monologues breathe between clauses.
  const chunks = splitForSpeech(cleaned, 280);

  whenVoicesReady().then(() => {
    if (cancelled) return;
    const voices = synth.getVoices();
    let chosen: SpeechSynthesisVoice | undefined;
    if (opts.voiceName) chosen = voices.find((v) => v.name === opts.voiceName);
    if (!chosen) {
      const defName = pickDefaultVoice();
      if (defName) chosen = voices.find((v) => v.name === defName);
    }

    chunks.forEach((chunk) => {
      if (cancelled) return;
      const u = new SpeechSynthesisUtterance(chunk);
      // Slightly slower than 1.0 sounds more deliberate / less robotic
      u.rate = opts.rate ?? 0.96;
      u.pitch = opts.pitch ?? 1.0;
      if (chosen) u.voice = chosen;
      u.lang = chosen?.lang || 'en-GB';
      synth.speak(u);
    });
  });

  return handle;
}

function splitForSpeech(text: string, max: number): string[] {
  // First split into sentences, then re-pack into chunks within max chars.
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const out: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > max && buf) { out.push(buf.trim()); buf = s; }
    else buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}
