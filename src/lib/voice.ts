/**
 * Web Speech API helpers. Pure browser, no backend, no API keys.
 * - SpeechRecognition: dictation (mic -> text)
 * - SpeechSynthesis: text-to-speech (coach reply -> spoken words)
 *
 * Both are wrapped behind feature-detection so the UI can hide voice
 * entirely on browsers that don't support it (Firefox, older Safari, etc).
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
}: {
  onPartial?: (text: string) => void;
  onFinal?: (text: string) => void;
  onState?: (state: RecognitionState) => void;
  onError?: (msg: string) => void;
  lang?: string;
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
  r.continuous = false;
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

/**
 * Speak the supplied text. Trims markdown fluff so the synthesizer
 * doesn't read out the asterisks and code-fences literally.
 */
export function speak(
  text: string,
  opts: { voiceName?: string; rate?: number; pitch?: number } = {},
): { stop: () => void } {
  if (!isSpeechSynthesisSupported()) return { stop: () => {} };
  const synth = window.speechSynthesis;
  synth.cancel();
  const cleaned = text
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\|.*\|/g, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const u = new SpeechSynthesisUtterance(cleaned);
  u.rate = opts.rate ?? 1.02;
  u.pitch = opts.pitch ?? 1.0;
  const voices = synth.getVoices();
  if (opts.voiceName) {
    const v = voices.find((v) => v.name === opts.voiceName);
    if (v) u.voice = v;
  } else {
    const preferred =
      voices.find((v) => /UK English|en-GB.*Male/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-GB') ||
      voices.find((v) => v.lang?.startsWith('en'));
    if (preferred) u.voice = preferred;
  }
  synth.speak(u);
  return { stop: () => synth.cancel() };
}
