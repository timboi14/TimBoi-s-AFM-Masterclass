import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { askCoach, COACH_SUGGESTIONS, type CoachReply } from '@/lib/coach-ai';
import {
  createRecognition,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speak,
} from '@/lib/voice';
import { cn } from '@/lib/cn';

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'coach'; text: string; cite?: string[]; ts: number };

const STORAGE_KEY = 'tba_coach_log_v1';
const PREFS_KEY = 'tba_coach_prefs_v1';

interface Prefs {
  speak: boolean;
  rate: number;
}

function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return { speak: true, rate: 1.05 };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { speak: true, rate: 1.05 };
}

function loadLog(): Msg[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

/**
 * Floating, voice-enabled AI Coach.
 * - Dictation via SpeechRecognition (Chrome / Edge)
 * - Text-to-speech reply via SpeechSynthesis
 * - Per-browser session log in localStorage
 */
export function CoachVoice() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [messages, setMessages] = useState<Msg[]>(() => loadLog());
  const [text, setText] = useState('');
  const [partial, setPartial] = useState('');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());
  const [supportsVoice] = useState(() => isSpeechRecognitionSupported());
  const [supportsTTS] = useState(() => isSpeechSynthesisSupported());
  const speakingRef = useRef<{ stop: () => void } | null>(null);
  const recRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch {}
  }, [messages]);
  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(id);
  }, [open, messages, partial, thinking]);

  // Stop pulse after first open
  useEffect(() => {
    if (open && pulse) setPulse(false);
  }, [open, pulse]);

  // Hotkey: '/' opens, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField = target && /input|textarea/i.test(target.tagName);
      if (e.key === '/' && !inField && !open) { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', text: q };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setPartial('');
    setThinking(true);
    let reply: CoachReply;
    try { reply = await askCoach(q); }
    catch { reply = { text: 'Coach is offline right now. Try again in a moment.' }; }
    setThinking(false);
    const coachMsg: Msg = {
      id: crypto.randomUUID(),
      role: 'coach',
      text: reply.text,
      cite: reply.cite,
      ts: Date.now(),
    };
    setMessages((m) => [...m, coachMsg]);
    if (prefs.speak && supportsTTS) {
      speakingRef.current?.stop();
      speakingRef.current = speak(reply.text, { rate: prefs.rate });
    }
  };

  const startVoice = () => {
    if (!supportsVoice || listening) return;
    speakingRef.current?.stop();
    if (!recRef.current) {
      recRef.current = createRecognition({
        lang: 'en-GB',
        onPartial: (t) => setPartial(t),
        onFinal: (t) => {
          setPartial('');
          setText('');
          setListening(false);
          send(t);
        },
        onState: (s) => setListening(s === 'listening'),
        onError: () => setListening(false),
      });
    }
    setListening(true);
    recRef.current.start();
  };
  const stopVoice = () => {
    recRef.current?.stop();
    setListening(false);
  };
  const stopSpeaking = () => speakingRef.current?.stop();

  const hint = useMemo(
    () => COACH_SUGGESTIONS[Math.floor(Math.random() * COACH_SUGGESTIONS.length)],
    [open],
  );

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-5 right-5 z-40 group',
          'h-14 w-14 md:h-16 md:w-16 rounded-2xl',
          'flex items-center justify-center text-white',
          'shadow-[0_18px_40px_-12px_rgba(0,163,71,0.55)]',
          'transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]',
        )}
        style={{
          backgroundImage: 'linear-gradient(135deg, #00b54e 0%, #008f3d 55%, #f5b800 140%)',
        }}
        aria-label="Open Coach AI"
      >
        <span className="relative">
          <i className="fa-solid fa-headset text-xl md:text-2xl" />
          {pulse && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-white animate-ping" />
          )}
        </span>
        <span className="hidden md:block absolute right-[110%] top-1/2 -translate-y-1/2 mr-1 px-2.5 py-1 rounded-md bg-ink text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Coach AI · press /
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cn(
                'absolute right-2 left-2 bottom-2 md:right-5 md:left-auto md:bottom-5',
                'md:w-[440px] max-h-[90vh] flex flex-col',
                'rounded-3xl border border-border bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]',
                'overflow-hidden',
              )}
            >
              {/* Header */}
              <div className="relative p-4 border-b border-border" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #122046 100%)' }}>
                <div className="absolute inset-0 opacity-30 pitch-grid" />
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: 'linear-gradient(135deg, #00b54e 0%, #f5b800 140%)' }}>
                    <i className="fa-solid fa-headset" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-lg tracking-wide uppercase text-white leading-none">
                      Coach AI
                    </div>
                    <div className="text-[11px] text-white/60 tracking-wider uppercase mt-1">
                      AFM tactics on tap · {supportsVoice ? 'voice ready' : 'voice off'}
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" aria-label="Close">
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>
                <div className="relative mt-3 flex flex-wrap gap-1.5 text-[10px]">
                  {supportsTTS && (
                    <button
                      onClick={() => setPrefs((p) => ({ ...p, speak: !p.speak }))}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-bold uppercase tracking-wider',
                        prefs.speak ? 'bg-accent text-ink' : 'bg-white/10 text-white/70',
                      )}
                    >
                      <i className={`fa-solid ${prefs.speak ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
                      Voice {prefs.speak ? 'on' : 'off'}
                    </button>
                  )}
                  <button
                    onClick={() => { setMessages([]); stopSpeaking(); }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 text-white/70 font-bold uppercase tracking-wider hover:bg-white/20"
                  >
                    <i className="fa-solid fa-broom" /> Clear
                  </button>
                </div>
              </div>

              {/* Honour-rule disclaimer — always visible */}
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11.5px] leading-snug text-amber-900">
                <i className="fa-solid fa-shield-halved text-amber-700" /> <strong>Coach won&apos;t write your homework.</strong>
                {' '}It teaches AFM technique, examiner patterns and memorisation. For your <em>own</em> attempts use the
                <span className="font-bold"> Debrief </span> page.
              </div>

              {/* Body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfd]">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-border bg-white p-4">
                      <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                        Welcome
                      </div>
                      <p className="text-sm leading-relaxed text-ink">
                        Ask me about NPV, APV, real options, hedging, M&amp;A, ESG, behavioural biases,
                        memorisation tricks — anything in the AFM syllabus. Tap the mic to dictate.
                      </p>
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-muted font-bold pl-1">
                      Try
                    </div>
                    <div className="grid gap-2">
                      {COACH_SUGGESTIONS.slice(0, 4).map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-left text-[13px] rounded-xl border border-border bg-white px-3 py-2 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <i className="fa-solid fa-arrow-right text-primary mr-2" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <Bubble key={m.id} m={m} onReplay={() => prefs.speak && speak(m.role === 'coach' ? m.text : '', { rate: prefs.rate })} />
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-muted text-sm pl-1">
                    <span className="wave text-primary"><span /><span /><span /><span /><span /></span>
                    Coach is drawing on the tactics board…
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border bg-white p-3">
                {listening && (
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-primary">
                    <span className="wave"><span /><span /><span /><span /><span /></span>
                    <span className="font-bold">Listening…</span>
                    {partial && <span className="text-muted truncate">{partial}</span>}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send(text);
                      }
                    }}
                    rows={1}
                    placeholder={listening ? 'Speaking…' : `Ask: ${hint}`}
                    className="flex-1 resize-none px-3 py-2.5 rounded-xl border border-border bg-white text-[14px] focus:outline-none focus:border-primary max-h-32"
                  />
                  {supportsVoice && (
                    <button
                      onClick={listening ? stopVoice : startVoice}
                      className={cn(
                        'h-10 w-10 rounded-xl grid place-items-center transition-colors',
                        listening ? 'bg-danger text-white' : 'bg-slate-100 text-ink hover:bg-primary hover:text-white',
                      )}
                      aria-label={listening ? 'Stop dictation' : 'Start dictation'}
                    >
                      <i className={`fa-solid ${listening ? 'fa-stop' : 'fa-microphone'}`} />
                    </button>
                  )}
                  <button
                    onClick={() => send(text)}
                    disabled={!text.trim() || thinking}
                    className="h-10 px-3 rounded-xl bg-primary text-white font-bold disabled:opacity-40 hover:bg-primary-dark"
                    aria-label="Send"
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">/</kbd> opens ·
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">Enter</kbd> sends ·
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">Shift+Enter</kbd> newline
                  </span>
                  <span>{supportsVoice ? 'Mic ready' : 'Mic unavailable on this browser'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ m, onReplay }: { m: Msg; onReplay: () => void }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] bg-ink text-white">
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex">
      <div className="max-w-[92%] rounded-2xl px-3.5 py-3 bg-white border border-border shadow-sm">
        <div className="prose-coach text-[13.5px] leading-relaxed text-ink whitespace-pre-wrap">
          {renderMarkdown(m.text)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
          <button onClick={onReplay} className="inline-flex items-center gap-1 hover:text-primary">
            <i className="fa-solid fa-volume-high" /> Replay
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(m.text)}
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <i className="fa-regular fa-copy" /> Copy
          </button>
          {m.cite && m.cite.length > 0 && (
            <span className="ml-auto inline-flex items-center gap-1">
              <i className="fa-solid fa-link" />
              {m.cite.map((c) => (
                <a key={c} href={`/topic/${c}`} className="text-primary hover:underline">{c}</a>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(s: string) {
  // Tiny inline markdown: **bold**, `code`, line-by-line.
  const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^`[^`]+`$/.test(part)) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}
