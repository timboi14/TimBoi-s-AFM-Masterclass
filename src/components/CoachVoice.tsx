import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askCoach, COACH_SUGGESTIONS, type CoachReply } from '@/lib/coach-ai';
import { detectPaperReference } from '@/lib/coach-paper-scaffold';
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
import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';
import { cn } from '@/lib/cn';

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'coach'; text: string; cite?: string[]; ts: number; spotlight?: Spotlight; streaming?: boolean };

const STORAGE_KEY = 'tba_coach_log_v1';
const PREFS_KEY = 'tba_coach_prefs_v2';

/**
 * Trigger phrases that force Model Answer Mode — the message is routed
 * directly to /api/coach (DeepSeek) with no fallback to the local KB.
 * The local scaffold produces a canned marking-guide reference, which is
 * useful for quick lookups but is NOT what someone asking for a "model
 * answer" wants.
 */
const MODEL_ANSWER_TRIGGERS: RegExp[] = [
  /\bmodel answer\b/i,
  /\bexaminer[\s-]?grade(?:d)? answer\b/i,
  /\b10\s*\/\s*10\s*answer\b/i,
  /\bten[\s-]?out[\s-]?of[\s-]?ten answer\b/i,
  /\bfull[\s-]?marks? answer\b/i,
  /\btop[\s-]?scorer answer\b/i,
  /\bperfect response\b/i,
  /\bbenchmark answer\b/i,
];

function isModelAnswerRequest(msg: string): boolean {
  return MODEL_ANSWER_TRIGGERS.some((rx) => rx.test(msg));
}

interface Prefs {
  speak: boolean;
  rate: number;
  voiceName: string | null;
  recentSpotlightIds: string[];
}

const DEFAULT_PREFS: Prefs = { speak: true, rate: 0.96, voiceName: null, recentSpotlightIds: [] };

function loadPrefs(): Prefs {
  // Spread merge so a partial blob from an older app version still hydrates new defaults.
  return { ...DEFAULT_PREFS, ...safeReadJson<Partial<Prefs>>(PREFS_KEY, {}) };
}

function loadLog(): Msg[] {
  return safeReadJson<Msg[]>(STORAGE_KEY, []);
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
  const [disabled, setDisabled] = useState<boolean>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('tba.coach.disabled') === '1',
  );
  // Poll the disabled flag so the FAB greys out the instant a mock starts/ends.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tick = () => setDisabled(sessionStorage.getItem('tba.coach.disabled') === '1');
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, []);
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
  useEffect(() => { safeWriteJson(STORAGE_KEY, messages.slice(-30)); }, [messages]);
  useEffect(() => { safeWriteJson(PREFS_KEY, prefs); }, [prefs]);

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

  /* Honour the #coach hash so any link like <a href="#coach"> opens the
     panel (used by the Debrief honour-rule callout, the keyboard-help
     overlay, etc.). */
  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#coach') {
        setOpen(true);
        // Clear the hash so re-clicking the same link reopens it.
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

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

  // Coach send / answer
  const send = async (raw: string) => {
    const q = raw.trim();
    if (!q || thinking) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', text: q };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setPartial('');
    setThinking(true);

    const paperRef = detectPaperReference(q);
    const wantsModelAnswer = isModelAnswerRequest(q);

    // Model Answer Mode: explicit trigger phrases ("model answer", "10/10
    // answer", "examiner-grade answer", …) ALWAYS route to /api/coach and
    // never fall back to the local scaffold. The whole point of these
    // triggers is the LLM-quality answer; silently degrading to a canned
    // marking guide would defeat the feature.
    if (wantsModelAnswer) {
      if (!paperRef) {
        const helpMsg: Msg = {
          id: crypto.randomUUID(),
          role: 'coach',
          text:
            "I can write you a top-scorer model answer for any past-paper requirement. " +
            "Tell me which paper and part — for example:\n\n" +
            "- **\"Model answer for Para Fuels Co part (a)\"**\n" +
            "- **\"Examiner-grade answer for Fondir Co (b)(i)\"**\n" +
            "- **\"10/10 answer for Lough Co part (a)\"**",
          ts: Date.now(),
        };
        setMessages((m) => [...m, helpMsg]);
        setThinking(false);
        return;
      }
      const ok = await streamPaperAnswer(q, paperRef);
      if (!ok) {
        const errMsg: Msg = {
          id: crypto.randomUUID(),
          role: 'coach',
          text:
            "Model Answer Mode is temporarily unavailable — the AI service didn't respond. " +
            "Try again in a moment. If it keeps failing, the site owner needs to check that " +
            "`DEEPSEEK_API_KEY` is set in the Vercel project settings.",
          ts: Date.now(),
        };
        setMessages((m) => [...m, errMsg]);
      }
      setThinking(false);
      return;
    }

    // No trigger phrase: stay on the fast local path (KB for concepts,
    // scaffold for papers). Users who want the LLM model answer have to
    // ask for it explicitly with a trigger phrase. This keeps "Para
    // Fuels (a)" as a quick reference lookup and protects the API budget.
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

  /**
   * Stream the top-achiever model answer from /api/coach into a single
   * coach message that grows as tokens arrive. Returns true if the stream
   * produced any tokens; false on configuration or network failure (in
   * which case the caller falls back to the local on-device scaffold).
   */
  const streamPaperAnswer = async (
    rawQuestion: string,
    paperRef: ReturnType<typeof detectPaperReference>,
  ): Promise<boolean> => {
    if (!paperRef) return false;
    const { paper, partLabel } = paperRef;
    const part = partLabel
      ? paper.questionParts.find((p) => p.label === partLabel)
      : undefined;

    const messageId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      {
        id: messageId,
        role: 'coach',
        text: '',
        cite: paper.topics,
        ts: Date.now(),
        streaming: true,
      },
    ]);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          paperName: paper.name,
          paperSession: paper.session,
          partLabel: part?.label,
          partMarks: part?.marks,
          partRequirement: part?.requirement,
          markingPoints: part?.markingPoints,
          examinerCommentary: part?.examinerCommentary,
          keyAnswerTips: paper.keyAnswerTips,
          paperContext: rawQuestion,
        }),
      });

      if (!res.ok || !res.body) {
        const txt = await res.text().catch(() => '');
        setMessages((m) => m.filter((msg) => msg.id !== messageId));
        // 503 means env var missing — fall back silently.
        if (res.status === 503) return false;
        // Other failures: surface a short note then fall back.
        if (txt) console.warn('[coach] /api/coach failed:', res.status, txt.slice(0, 200));
        return false;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setMessages((m) =>
          m.map((msg) => (msg.id === messageId && msg.role === 'coach' ? { ...msg, text: acc } : msg)),
        );
      }
      // Mark streaming complete.
      setMessages((m) =>
        m.map((msg) =>
          msg.id === messageId && msg.role === 'coach' ? { ...msg, streaming: false } : msg,
        ),
      );
      if (prefs.speak && supportsTTS) speakNow(acc);
      return acc.trim().length > 0;
    } catch (e) {
      console.warn('[coach] stream threw:', e);
      setMessages((m) => m.filter((msg) => msg.id !== messageId));
      return false;
    }
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

  // Voice dictation
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

  // Teach me something
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

  // Render
  return (
    <>
      {/* FAB */}
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          'fixed bottom-5 right-5 z-40 group',
          'h-14 w-14 md:h-16 md:w-16 rounded-2xl',
          'flex items-center justify-center text-white',
          'shadow-[0_18px_40px_-12px_rgba(0,163,71,0.55)]',
          'transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]',
          disabled && 'opacity-40 grayscale cursor-not-allowed hover:scale-100',
        )}
        style={{ backgroundImage: 'linear-gradient(135deg, #00b54e 0%, #008f3d 55%, #f5b800 140%)' }}
        aria-label={disabled ? 'Coach off during mocks. Available again on submission.' : 'Open Coach AI'}
        title={disabled ? 'Coach off during mocks. Available again on submission.' : 'Open Coach AI'}
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="coach-dialog-title"
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
                    <div id="coach-dialog-title" className="font-display text-lg tracking-wide uppercase text-white leading-none">Coach AI</div>
                    <div className="text-[11px] text-white/60 tracking-wider uppercase mt-1 inline-flex items-center gap-1.5">
                      {speaking ? 'Speaking…' : listening ? 'Listening…' : 'On-device coach · curated AFM technique'}
                      <span title="On-device for concept questions; routes paper-specific model-answer requests to the AI service when one is configured." className="cursor-help text-white/50 hover:text-white">
                        <i className="fa-solid fa-circle-info" />
                      </span>
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

              {/* Body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfd]">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-accent/40 bg-accent/[0.08] p-4">
                      <div className="text-[11px] uppercase tracking-wider text-accent-dark font-bold mb-1">
                        <i className="fa-solid fa-bullseye mr-1.5" /> Model Answer Mode available
                      </div>
                      <p className="text-[13.5px] leading-relaxed text-ink">
                        Ask for a <strong>"model answer"</strong>, <strong>"examiner-grade answer"</strong>, or <strong>"10/10 answer"</strong>
                        {' '}on any past-paper requirement and Coach will produce a top-scorer response with a marking key.
                        Use the <strong>Debrief</strong> page to mark your own attempts.
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

// bubble

/**
 * Best-effort "Download as audio" for a coach answer (Work Item 14.2).
 *
 * Web Speech API doesn't expose the synthesised audio to JavaScript, so a
 * pure-browser capture requires the user to grant `getDisplayMedia` audio
 * permission (screen-share). We try that path; on rejection or unsupported
 * browser we surface a clear message rather than failing silently.
 */
async function downloadAnswerAsAudio(markdown: string, topicHint?: string): Promise<void> {
  if (!('speechSynthesis' in window)) {
    alert('This browser has no built-in text-to-speech. Try Chrome or Edge.');
    return;
  }
  // Strip markdown to make the readback sound natural.
  const plain = markdown
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*]\s+/gm, '');

  let stream: MediaStream;
  try {
    // The user must pick "share audio" in the dialog.
    stream = await (navigator.mediaDevices as MediaDevices & {
      getDisplayMedia: (opts: DisplayMediaStreamOptions) => Promise<MediaStream>;
    }).getDisplayMedia({ video: true, audio: true });
  } catch {
    alert(
      'Audio capture needs screen-share permission with audio enabled. ' +
        'When the picker opens, choose a tab AND tick "Share tab audio".',
    );
    return;
  }
  const audioTracks = stream.getAudioTracks();
  if (audioTracks.length === 0) {
    stream.getTracks().forEach((t) => t.stop());
    alert('No audio track was shared. Re-pick the tab and tick "Share tab audio".');
    return;
  }
  const audioStream = new MediaStream(audioTracks);
  const recorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  const finished = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  recorder.start();

  const utter = new SpeechSynthesisUtterance(plain);
  utter.rate = 0.97;
  await new Promise<void>((resolve) => {
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
  recorder.stop();
  await finished;
  audioTracks.forEach((t) => t.stop());

  const blob = new Blob(chunks, { type: 'audio/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = (topicHint || 'answer').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'answer';
  a.download = `coach-${slug}-${Date.now()}.webm`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

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
        <div className="prose-coach text-[13.5px] leading-relaxed text-ink coach-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ node: _node, ...props }) => (
                <div className="coach-table-scroll">
                  <table className="coach-table" {...props} />
                </div>
              ),
              th: ({ node: _node, ...props }) => <th className="coach-th" {...props} />,
              td: ({ node: _node, ...props }) => <td className="coach-td" {...props} />,
              code: ({ node: _node, ...props }) => <code className="coach-code" {...props} />,
              h1: ({ node: _node, ...props }) => <h3 className="coach-h coach-h1" {...props} />,
              h2: ({ node: _node, ...props }) => <h3 className="coach-h coach-h2" {...props} />,
              h3: ({ node: _node, ...props }) => <h3 className="coach-h coach-h3" {...props} />,
              h4: ({ node: _node, ...props }) => <h4 className="coach-h coach-h4" {...props} />,
              a: ({ node: _node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
            }}
          >
            {m.text}
          </ReactMarkdown>
          {m.streaming && (
            <span
              className="inline-block w-2 h-4 bg-primary/60 align-text-bottom ml-0.5 animate-pulse"
              aria-label="streaming"
            />
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted flex-wrap">
          <button onClick={onReplay} className="inline-flex items-center gap-1 hover:text-primary">
            <i className="fa-solid fa-volume-high" /> Replay
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(m.text)}
            className="inline-flex items-center gap-1 hover:text-primary"
            title="Copy raw markdown to clipboard"
          >
            <i className="fa-regular fa-copy" /> Copy
          </button>
          <button
            onClick={() => downloadAnswerAsAudio(m.text, m.cite?.[0])}
            className="inline-flex items-center gap-1 hover:text-primary"
            title="Capture this answer as a .webm via screen-share audio"
          >
            <i className="fa-solid fa-download" /> Audio
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

