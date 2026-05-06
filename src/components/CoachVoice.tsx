import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { askCoach, COACH_SUGGESTIONS, type CoachReply } from '@/lib/coach-ai';
import {
  createRecognition,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  listVoices,
  pickDefaultVoice,
  speak,
  type VoiceOption,
} from '@/lib/voice';
import { pickRandomSpotlight, SPOTLIGHT_CATEGORY_LABELS, type Spotlight } from '@/data/spotlights';
import { cn } from '@/lib/cn';

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'coach'; text: string; cite?: string[]; ts: number; spotlight?: Spotlight };

const STORAGE_KEY = 'tba_coach_log_v1';
const PREFS_KEY = 'tba_coach_prefs_v2';

interface Prefs {
  speak: boolean;
  rate: number;
  voiceName: string | null;
  recentSpotlightIds: string[];
}

function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return { speak: true, rate: 0.96, voiceName: null, recentSpotlightIds: [] };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return { ...{ speak: true, rate: 0.96, voiceName: null, recentSpotlightIds: [] }, ...JSON.parse(raw) };
  } catch {}
  return { speak: true, rate: 0.96, voiceName: null, recentSpotlightIds: [] };
}

function loadLog(): Msg[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

/**
 * Floating, voice-first AI Coach.
 * - Push-to-talk big primary button + global hold-spacebar hotkey
 * - Voice picker (neural voices preferred)
 * - "Teach me something" button speaks a curated AFM nugget on demand
 * - Honour-rule disclaimer always visible
 */
export function CoachVoice() {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [messages, setMessages] = useState<Msg[]>(() => loadLog());
  const [text, setText] = useState('');
  const [partial, setPartial] = useState('');
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [supportsVoice] = useState(() => isSpeechRecognitionSupported());
  const [supportsTTS] = useState(() => isSpeechSynthesisSupported());
  const speakingRef = useRef<{ stop: () => void } | null>(null);
  const recRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const heldRef = useRef(false);

  /* Persist */
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30))); } catch {} }, [messages]);
  useEffect(() => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {} }, [prefs]);

  /* Load voices on mount and when the engine populates async */
  useEffect(() => {
    if (!supportsTTS) return;
    const refresh = () => {
      const v = listVoices();
      setVoices(v);
      // Auto-pick a default the first time
      if (!prefs.voiceName && v.length > 0) {
        const def = pickDefaultVoice();
        if (def) setPrefs((p) => ({ ...p, voiceName: def }));
      }
    };
    refresh();
    window.speechSynthesis?.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportsTTS]);

  /* Auto-scroll on changes */
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(id);
  }, [open, messages, partial, thinking]);

  useEffect(() => { if (open && pulse) setPulse(false); }, [open, pulse]);

  /* Hotkeys
     - "/" opens the panel (when not in a field)
     - Esc closes
     - Hold Space (panel open) = push-to-talk
  */
  useEffect(() => {
    const inField = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      return t && /input|textarea|select/i.test(t.tagName);
    };
    const onDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !inField(e.target) && !open) { e.preventDefault(); setOpen(true); return; }
      if (e.key === 'Escape' && open) { setOpen(false); return; }
      if (e.code === 'Space' && open && !inField(e.target) && !heldRef.current && supportsVoice) {
        e.preventDefault();
        heldRef.current = true;
        startVoice();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && open && heldRef.current && supportsVoice) {
        e.preventDefault();
        heldRef.current = false;
        stopVoice();
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, supportsVoice]);

  /* ── Coach send / answer ─────────────────────────────────── */
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
      id: crypto.randomUUID(), role: 'coach', text: reply.text, cite: reply.cite, ts: Date.now(),
    };
    setMessages((m) => [...m, coachMsg]);
    if (prefs.speak && supportsTTS) speakNow(reply.text);
  };

  const speakNow = (msg: string) => {
    speakingRef.current?.stop();
    setSpeaking(true);
    speakingRef.current = speak(msg, { rate: prefs.rate, voiceName: prefs.voiceName });
    // crude end detection: poll until synthesis is done
    const id = setInterval(() => {
      if (!window.speechSynthesis?.speaking) { clearInterval(id); setSpeaking(false); }
    }, 350);
  };
  const stopSpeaking = () => { speakingRef.current?.stop(); setSpeaking(false); };

  /* ── Voice dictation ─────────────────────────────────────── */
  const startVoice = () => {
    if (!supportsVoice || listening) return;
    stopSpeaking();
    if (!recRef.current) {
      recRef.current = createRecognition({
        lang: 'en-GB',
        onPartial: (t) => setPartial(t),
        onFinal: (t) => { setPartial(''); setText(''); setListening(false); send(t); },
        onState: (s) => setListening(s === 'listening'),
        onError: () => setListening(false),
      });
    }
    setListening(true);
    recRef.current.start();
  };
  const stopVoice = () => { recRef.current?.stop(); setListening(false); };

  /* ── Teach me something ──────────────────────────────────── */
  const teachMe = () => {
    const s = pickRandomSpotlight(prefs.recentSpotlightIds);
    setPrefs((p) => ({ ...p, recentSpotlightIds: [s.id, ...p.recentSpotlightIds].slice(0, 8) }));
    const msg: Msg = {
      id: crypto.randomUUID(), role: 'coach', text: s.body,
      cite: s.ties || [], ts: Date.now(), spotlight: s,
    };
    setMessages((m) => [...m, msg]);
    if (prefs.speak && supportsTTS) speakNow(s.body);
  };

  const hint = useMemo(() => COACH_SUGGESTIONS[Math.floor(Math.random() * COACH_SUGGESTIONS.length)], [open]);

  /* ── Render ─────────────────────────────────────────────── */
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
        style={{ backgroundImage: 'linear-gradient(135deg, #00b54e 0%, #008f3d 55%, #f5b800 140%)' }}
        aria-label="Open Coach AI"
      >
        <span className="relative">
          <i className="fa-solid fa-headset text-xl md:text-2xl" />
          {pulse && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-white animate-ping" />}
        </span>
        <span className="hidden md:block absolute right-[110%] top-1/2 -translate-y-1/2 mr-1 px-2.5 py-1 rounded-md bg-ink text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Coach AI · press /
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cn(
                'absolute right-2 left-2 bottom-2 md:right-5 md:left-auto md:bottom-5',
                'md:w-[460px] max-h-[92vh] flex flex-col',
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
                    <div className="font-display text-lg tracking-wide uppercase text-white leading-none">Coach AI</div>
                    <div className="text-[11px] text-white/60 tracking-wider uppercase mt-1">
                      {speaking ? 'Speaking…' : listening ? 'Listening…' : 'AFM tactics on tap'}
                    </div>
                  </div>
                  {supportsTTS && (
                    <button
                      onClick={() => setShowSettings((s) => !s)}
                      className="text-white/60 hover:text-white px-2 py-1.5"
                      aria-label="Voice settings"
                      title="Voice settings"
                    >
                      <i className="fa-solid fa-sliders" />
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" aria-label="Close">
                    <i className="fa-solid fa-xmark text-lg" />
                  </button>
                </div>

                {/* Settings panel */}
                <AnimatePresence>
                  {showSettings && supportsTTS && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="relative mt-3 overflow-hidden"
                    >
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] uppercase tracking-wider text-white/70 font-bold">Voice</label>
                          <select
                            value={prefs.voiceName || ''}
                            onChange={(e) => setPrefs((p) => ({ ...p, voiceName: e.target.value || null }))}
                            className="text-[12px] flex-1 max-w-[260px] px-2 py-1.5 rounded-md bg-white text-ink border border-white/10"
                          >
                            {voices.length === 0 && <option value="">Default</option>}
                            {voices.map((v) => (
                              <option key={v.name} value={v.name}>
                                {v.quality === 'neural' ? '★ ' : ''}{v.name} · {v.lang}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] uppercase tracking-wider text-white/70 font-bold">Pace</label>
                          <input
                            type="range" min={0.7} max={1.2} step={0.02}
                            value={prefs.rate}
                            onChange={(e) => setPrefs((p) => ({ ...p, rate: Number(e.target.value) }))}
                            className="flex-1 max-w-[200px] accent-accent"
                          />
                          <span className="text-[11px] font-mono text-white/70 w-10 text-right">{prefs.rate.toFixed(2)}×</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                          <button
                            onClick={() => setPrefs((p) => ({ ...p, speak: !p.speak }))}
                            className={cn('text-[11px] inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-bold uppercase tracking-wider',
                              prefs.speak ? 'bg-accent text-ink' : 'bg-white/10 text-white/70')}
                          >
                            <i className={`fa-solid ${prefs.speak ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
                            Read aloud {prefs.speak ? 'on' : 'off'}
                          </button>
                          <button
                            onClick={() => speakNow('Hello. This is a quick test of the selected voice. Tap and hold to ask me anything about A F M.')}
                            className="text-[11px] inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 text-white hover:bg-white/20"
                          >
                            <i className="fa-solid fa-play" /> Test voice
                          </button>
                          <button
                            onClick={() => { setMessages([]); stopSpeaking(); }}
                            className="text-[11px] inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                          >
                            <i className="fa-solid fa-broom" /> Clear
                          </button>
                        </div>
                        <p className="text-[10.5px] text-white/50 leading-snug">
                          Voices marked ★ are neural / online quality and sound the most human. Pace 0.94–0.98 sounds most natural.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Honour-rule disclaimer */}
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11.5px] leading-snug text-amber-900">
                <i className="fa-solid fa-shield-halved text-amber-700" /> <strong>Coach won&apos;t write your homework.</strong>{' '}
                For your own attempts use the <span className="font-bold">Debrief</span> page.
              </div>

              {/* Body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfd]">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
                      <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                        Two ways to start
                      </div>
                      <p className="text-[13.5px] leading-relaxed text-ink">
                        Hold the green mic below and speak your question, or tap <strong>Teach me something</strong>
                        to hear a curated AFM nugget.
                      </p>
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-muted font-bold pl-1">Or try one of these</div>
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
                  <Bubble key={m.id} m={m} onReplay={() => m.role === 'coach' && speakNow(m.text)} />
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-muted text-sm pl-1">
                    <span className="wave text-primary"><span /><span /><span /><span /><span /></span>
                    Coach is drawing on the tactics board…
                  </div>
                )}
              </div>

              {/* Action row: Teach me + Stop speaking */}
              <div className="px-3 pt-2 border-t border-border bg-white flex items-center gap-2">
                <button
                  onClick={teachMe}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-accent text-ink font-bold text-[13px] hover:brightness-105"
                >
                  <i className="fa-solid fa-lightbulb" /> Teach me something AFM
                </button>
                {speaking && (
                  <button
                    onClick={stopSpeaking}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-danger text-white font-bold text-[12px]"
                    aria-label="Stop speaking"
                  >
                    <i className="fa-solid fa-stop" /> Stop voice
                  </button>
                )}
              </div>

              {/* Push-to-talk + composer */}
              <div className="border-t border-border bg-white p-3">
                {listening && (
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-primary">
                    <span className="wave"><span /><span /><span /><span /><span /></span>
                    <span className="font-bold">Listening…</span>
                    {partial && <span className="text-muted truncate">{partial}</span>}
                  </div>
                )}

                {/* Voice-first push-to-talk */}
                {supportsVoice && (
                  <button
                    onMouseDown={startVoice}
                    onMouseUp={stopVoice}
                    onMouseLeave={() => { if (listening) stopVoice(); }}
                    onTouchStart={(e) => { e.preventDefault(); startVoice(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopVoice(); }}
                    className={cn(
                      'w-full mb-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-[14px] select-none transition-all',
                      listening
                        ? 'bg-danger text-white scale-[0.98]'
                        : 'bg-primary text-white hover:brightness-105 active:scale-[0.98]',
                    )}
                    style={{ boxShadow: listening ? '0 0 0 4px rgba(220,38,38,0.18)' : '0 8px 20px -6px rgba(0,163,71,0.45)' }}
                  >
                    <i className={`fa-solid ${listening ? 'fa-circle' : 'fa-microphone'}`} />
                    {listening ? 'Release to send' : 'Hold to talk · or hold Space'}
                  </button>
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
                    placeholder={listening ? 'Speaking…' : `Or type: ${hint}`}
                    className="flex-1 resize-none px-3 py-2.5 rounded-xl border border-border bg-white text-[14px] focus:outline-none focus:border-primary max-h-32"
                  />
                  <button
                    onClick={() => send(text)}
                    disabled={!text.trim() || thinking}
                    className="h-10 px-3 rounded-xl bg-primary text-white font-bold disabled:opacity-40 hover:bg-primary-dark"
                    aria-label="Send"
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-muted flex items-center justify-between">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">/</kbd> opens ·
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">Hold Space</kbd> talk ·
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">Enter</kbd> sends
                  </span>
                  <span>{supportsVoice ? 'Mic ready' : 'Mic unavailable'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── bubble ─── */

function Bubble({ m, onReplay }: { m: Msg; onReplay: () => void }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] bg-ink text-white">{m.text}</div>
      </div>
    );
  }
  const meta = m.spotlight ? SPOTLIGHT_CATEGORY_LABELS[m.spotlight.category] : null;
  return (
    <div className="flex">
      <div className="max-w-[92%] rounded-2xl px-3.5 py-3 bg-white border border-border shadow-sm w-full">
        {m.spotlight && meta && (
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider"
                  style={{ background: `${meta.color}1a`, color: meta.color, border: `1px solid ${meta.color}55` }}>
              <i className={`fa-solid ${meta.icon}`} /> {meta.label} spotlight
            </span>
            <span className="text-[12px] font-bold text-ink">{m.spotlight.title}</span>
          </div>
        )}
        {m.spotlight && (
          <p className="text-[12.5px] text-muted italic mb-2 leading-snug">{m.spotlight.hookLine}</p>
        )}
        <div className="prose-coach text-[13.5px] leading-relaxed text-ink whitespace-pre-wrap">
          {renderMarkdown(m.text)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted flex-wrap">
          <button onClick={onReplay} className="inline-flex items-center gap-1 hover:text-primary">
            <i className="fa-solid fa-volume-high" /> Replay
          </button>
          <button onClick={() => navigator.clipboard?.writeText(m.text)} className="inline-flex items-center gap-1 hover:text-primary">
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
  const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(part)) return <code key={i}>{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}
