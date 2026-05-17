import { useEffect, useMemo, useState } from 'react';
import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';

/**
 * Memory Lab — Leitner / Palace / Feynman.
 *
 * Work Item 1 of the Platinum-tier upgrade. Three sub-tabs with hash routing:
 *   /memory-lab#leitner   (5-stage spaced-repetition queue)
 *   /memory-lab#palace    (10-room method-of-loci builder)
 *   /memory-lab#feynman   (4-sentence plain-English explainer)
 *
 * All state persists in localStorage under tba.memorylab.*.v1.
 */

type Tab = 'leitner' | 'palace' | 'feynman';
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'leitner', label: 'Leitner', icon: 'fa-layer-group' },
  { id: 'palace', label: 'Memory palace', icon: 'fa-building-columns' },
  { id: 'feynman', label: 'Feynman', icon: 'fa-comments' },
];

interface FlipCard {
  id: string;
  front: string;
  back: string;
  deck: string;
}

const ALL_CARDS: FlipCard[] = [
  // Biases
  { id: 'b-anchoring', deck: 'Biases', front: 'Anchoring', back: 'Over-weighting an irrelevant reference such as the asking price.' },
  { id: 'b-hubris', deck: 'Biases', front: 'Hubris', back: 'Overconfidence in own ability to predict and control. Common in M&A overpayment.' },
  { id: 'b-loss', deck: 'Biases', front: 'Loss aversion', back: 'Pain of loss roughly twice the pleasure of equivalent gain.' },
  { id: 'b-herd', deck: 'Biases', front: 'Herd', back: 'Mimicking actions of a larger group. Drives M&A waves and bubbles.' },
  { id: 'b-sunk', deck: 'Biases', front: 'Entrapment', back: 'Sunk-cost fallacy. Continuing because of past commitment, not future expected value.' },
  // Z-scores
  { id: 'z-95', deck: 'Z-scores', front: 'z at 95% one-tail', back: '1.645' },
  { id: 'z-99', deck: 'Z-scores', front: 'z at 99% one-tail', back: '2.326 (or 2.33)' },
  { id: 'z-scale', deck: 'Z-scores', front: 'T-day VaR scaling', back: 'VaR_T = VaR_1 × √T. Assumes returns are iid.' },
  // Hedging side
  { id: 'h-borrower', deck: 'Hedging', front: 'Borrower fearing rate rises', back: 'Buy FRA · Buy puts on bond futures · Pay-fixed swap.' },
  { id: 'h-depositor', deck: 'Hedging', front: 'Depositor fearing rate falls', back: 'Sell FRA · Buy calls on bond futures · Pay-floating swap.' },
  { id: 'h-receiver', deck: 'Hedging', front: 'GBP firm receiving USD', back: 'Sell USD forward · Sell USD futures · Buy USD put.' },
  { id: 'h-payer', deck: 'Hedging', front: 'GBP firm paying USD', back: 'Buy USD forward · Buy USD futures · Buy USD call.' },
  // Formulas
  { id: 'f-wacc', deck: 'Formulas', front: 'WACC', back: '(E/V)·Ke + (D/V)·Kd·(1-T)' },
  { id: 'f-capm', deck: 'Formulas', front: 'CAPM', back: 'Ke = Rf + βe·(Rm - Rf)' },
  { id: 'f-ungear', deck: 'Formulas', front: 'M&M2 ungear', back: 'βa = βe · E / (E + D·(1-T))' },
  { id: 'f-irp', deck: 'Formulas', front: 'IRP forward', back: 'F = S · (1 + iq) / (1 + ib)' },
  { id: 'f-fisher', deck: 'Formulas', front: 'Fisher', back: '(1+i) = (1+r)·(1+h)' },
  { id: 'f-bsop', deck: 'Formulas', front: 'Black-Scholes call', back: 'C = Pa·N(d1) - Pe·e^(-rt)·N(d2)' },
  { id: 'f-gordon', deck: 'Formulas', front: 'Gordon dividend', back: 'P0 = D1 / (Ke - g)' },
  // Pitfalls
  { id: 'p-fisher', deck: 'Pitfalls', front: 'Fisher trap', back: 'Mixing real cash flows with nominal discount rate. Stay in ONE world.' },
  { id: 'p-papa', deck: 'Pitfalls', front: 'Pa vs Pe in BSOP', back: 'Pa = what you GET on exercise. Pe = what you PAY. Never flip.' },
  { id: 'p-bookmkt', deck: 'Pitfalls', front: 'WACC weights', back: 'Use MARKET values for E and D, not book values.' },
  { id: 'p-shield', deck: 'Pitfalls', front: 'APV tax shield', back: 'Discount tax shield at Kd or Rf — NOT WACC (it already embeds the shield).' },
];

// ────────────────────────────────────────────────────────────────────
// Tab helpers
// ────────────────────────────────────────────────────────────────────
function useHashTab(): [Tab, (t: Tab) => void] {
  const read = (): Tab => {
    const h = (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '') as Tab;
    return (['leitner', 'palace', 'feynman'] as Tab[]).includes(h) ? h : 'leitner';
  };
  const [tab, setTabState] = useState<Tab>(read);
  useEffect(() => {
    const onHash = () => setTabState(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const setTab = (t: Tab) => {
    setTabState(t);
    history.replaceState(null, '', `#${t}`);
  };
  return [tab, setTab];
}

export function MemoryLabPage() {
  const [tab, setTab] = useHashTab();
  return (
    <>
      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Spaced repetition · Method of loci · Feynman</>}
          headline={<>The <HeroGold>Memory Lab</HeroGold>.</>}
          subline={
            <>
              Three retrieval techniques in one workshop. Cards graduate through the Leitner queue,
              formulas anchor to a 10-room palace, and the Feynman pad makes you explain it cold.
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <div role="tablist" aria-label="Memory Lab tabs" className="flex flex-wrap gap-1 border-b border-border">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-t-lg text-[13px] font-bold inline-flex items-center gap-2 ${
                  active ? 'bg-white text-primary border border-b-white border-border -mb-px' : 'text-muted hover:text-ink'
                }`}
              >
                <i className={`fa-solid ${t.icon}`} aria-hidden /> {t.label}
              </button>
            );
          })}
        </div>
        <div className="bg-white border-x border-b border-border rounded-b-2xl p-5">
          {tab === 'leitner' && <LeitnerTab />}
          {tab === 'palace' && <PalaceTab />}
          {tab === 'feynman' && <FeynmanTab />}
        </div>
      </SectionShell>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────
// Leitner (5-stage queue: 0d → 1d → 3d → 7d → 14d)
// ────────────────────────────────────────────────────────────────────
const LEITNER_KEY = 'tba.memorylab.leitner.v1';
const STAGE_DAYS = [0, 1, 3, 7, 14] as const;

interface LeitnerEntry {
  cardId: string;
  stage: number;     // 0..4
  nextDueIso: string;
}
interface LeitnerStore {
  entries: Record<string, LeitnerEntry>;
}

function loadLeitner(): LeitnerStore {
  return safeReadJson<LeitnerStore>(LEITNER_KEY, { entries: {} });
}

function isDue(entry: LeitnerEntry): boolean {
  return +new Date(entry.nextDueIso) <= +new Date();
}

function LeitnerTab() {
  const [store, setStore] = useState<LeitnerStore>(() => loadLeitner());
  const [revealed, setRevealed] = useState(false);

  useEffect(() => safeWriteJson(LEITNER_KEY, store), [store]);

  // Initialise any missing card entries at stage 0, due now.
  useEffect(() => {
    setStore((s) => {
      const entries = { ...s.entries };
      let changed = false;
      for (const c of ALL_CARDS) {
        if (!entries[c.id]) {
          entries[c.id] = { cardId: c.id, stage: 0, nextDueIso: new Date(0).toISOString() };
          changed = true;
        }
      }
      return changed ? { entries } : s;
    });
  }, []);

  const due = ALL_CARDS.filter((c) => {
    const e = store.entries[c.id];
    return e && isDue(e);
  });
  const card = due[0];

  const grade = (correct: boolean) => {
    if (!card) return;
    setStore((s) => {
      const cur = s.entries[card.id] ?? { cardId: card.id, stage: 0, nextDueIso: new Date(0).toISOString() };
      const newStage = correct ? Math.min(4, cur.stage + 1) : 0;
      const days = STAGE_DAYS[newStage];
      const next = new Date(Date.now() + days * 86_400_000).toISOString();
      return {
        entries: {
          ...s.entries,
          [card.id]: { cardId: card.id, stage: newStage, nextDueIso: next },
        },
      };
    });
    setRevealed(false);
  };

  const stageCounts = STAGE_DAYS.map((_, idx) =>
    Object.values(store.entries).filter((e) => e.stage === idx).length,
  );

  return (
    <div>
      <p className="text-[12.5px] uppercase tracking-wider text-muted font-bold mb-2">
        Leitner 5-stage queue · {due.length} card{due.length === 1 ? '' : 's'} due now
      </p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {STAGE_DAYS.map((days, i) => (
          <div key={i} className="rounded-lg bg-slate-50 border border-border p-2 text-center">
            <div className="text-[10.5px] uppercase tracking-wider text-muted font-bold">Stage {i + 1}</div>
            <div className="text-[11.5px] text-ink">{days === 0 ? 'now' : `${days}d`}</div>
            <div className="font-display text-lg text-primary leading-none mt-1">{stageCounts[i]}</div>
          </div>
        ))}
      </div>

      {card ? (
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">{card.deck}</div>
          <div className="font-display text-2xl text-ink mb-3">{card.front}</div>
          {revealed ? (
            <div className="text-[14px] leading-relaxed text-ink bg-primary/5 rounded-lg p-3 border border-primary/20">
              {card.back}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="px-4 py-2 rounded-lg bg-ink text-white font-bold text-[13px] hover:brightness-110"
            >
              Reveal answer
            </button>
          )}
          {revealed && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => grade(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-danger text-white font-bold text-[13px] hover:brightness-110"
              >
                Wrong — back to stage 1
              </button>
              <button
                type="button"
                onClick={() => grade(true)}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-bold text-[13px] hover:brightness-110"
              >
                Right — promote
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-primary/5 p-5 text-center">
          <p className="text-[14px] text-ink">
            <i className="fa-solid fa-check-circle text-primary mr-1.5" /> All cards graduated. Come back tomorrow for the next stage.
          </p>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Memory palace (10 rooms)
// ────────────────────────────────────────────────────────────────────
const PALACE_KEY = 'tba.memorylab.palace.v1';
const ROOMS = [
  'Tunnel',
  'Dressing Room',
  'Pitch',
  'Dugout',
  'Stand',
  'Press Box',
  'Boardroom',
  'Trophy Room',
  'Medical Room',
  'Car Park',
] as const;

const FORMULA_OPTIONS = [
  '',
  'WACC — (E/V)Ke + (D/V)Kd(1-T)',
  'CAPM — Ke = Rf + β(Rm-Rf)',
  'M&M2 ungear — βa = βe·E/(E + D(1-T))',
  'IRP forward — F = S·(1+iq)/(1+ib)',
  'Fisher — (1+i) = (1+r)(1+h)',
  'Black-Scholes call — C = Pa·N(d1) - Pe·e^(-rt)·N(d2)',
  'Gordon — P0 = D1/(Ke-g)',
  'VaR — z·σ·V (one-tail)',
  'FRA settlement — (rref-rfra)·N·(d/360) / (1+rref·d/360)',
  'APV — base + PV(tax shield) - issue costs',
  'Max bid — stand-alone + acquirer share of synergy',
];

interface PalaceStore {
  assignments: Record<string, string>;
}

function PalaceTab() {
  const [s, setS] = useState<PalaceStore>(() => safeReadJson<PalaceStore>(PALACE_KEY, { assignments: {} }));
  useEffect(() => safeWriteJson(PALACE_KEY, s), [s]);

  return (
    <div>
      <p className="text-[12.5px] uppercase tracking-wider text-muted font-bold mb-3">
        Method of loci · 10 rooms · {Object.values(s.assignments).filter(Boolean).length} of {ROOMS.length} filled
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {ROOMS.map((room) => (
          <div key={room} className="rounded-xl border border-border bg-white p-3">
            <label className="block text-[11px] uppercase tracking-wider text-primary font-bold mb-1">{room}</label>
            <select
              value={s.assignments[room] ?? ''}
              onChange={(e) =>
                setS({ assignments: { ...s.assignments, [room]: e.target.value } })
              }
              className="w-full px-2 py-1.5 rounded-md border border-border bg-white text-[13px]"
            >
              {FORMULA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt || '— assign a formula —'}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted">
        Tip: walk the route mentally — front door → kitchen → bedroom — and you'll recall the formula slot by slot under exam pressure.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Feynman pad
// ────────────────────────────────────────────────────────────────────
const FEYNMAN_KEY = 'tba.memorylab.feynman.v1';
const CONCEPTS = [
  'WACC',
  'M&M2 with tax',
  'APV tax shield',
  'BSOP for real options',
  'IRP forward',
  'Fisher trap',
  'VaR (one-tail)',
  'FRA settlement',
  'FCFE vs FCFF',
  'Sukuk principles',
];

interface FeynmanEntry { concept: string; text: string; iso: string }
interface FeynmanStore { entries: FeynmanEntry[] }

function FeynmanTab() {
  const [s, setS] = useState<FeynmanStore>(() => safeReadJson<FeynmanStore>(FEYNMAN_KEY, { entries: [] }));
  const [concept, setConcept] = useState(CONCEPTS[0]);
  const [text, setText] = useState('');

  useEffect(() => safeWriteJson(FEYNMAN_KEY, s), [s]);

  const last5 = useMemo(() => s.entries.slice(-5).reverse(), [s.entries]);

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setS({ entries: [...s.entries, { concept, text: trimmed, iso: new Date().toISOString() }] });
    setText('');
  };

  return (
    <div>
      <p className="text-[12.5px] uppercase tracking-wider text-muted font-bold mb-2">
        Feynman pad · 4 sentences for a Year-10 reader · {s.entries.length} explanations saved
      </p>
      <label className="block text-[11px] uppercase tracking-wider text-primary font-bold mb-1">Concept</label>
      <select
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        className="w-full md:w-1/2 px-2 py-1.5 rounded-md border border-border bg-white text-[13px] mb-3"
      >
        {CONCEPTS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="block text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
        Explain in 4 sentences (no jargon)
      </label>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Explain ${concept} in 4 plain-English sentences as if to a Year-10 student.`}
        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-[14px] focus:outline-none focus:border-primary"
      />
      <button
        type="button"
        onClick={save}
        disabled={!text.trim()}
        className="mt-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-[13px] hover:brightness-110 disabled:opacity-40"
      >
        Save explanation
      </button>

      {last5.length > 0 && (
        <div className="mt-5">
          <h3 className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Last {last5.length} attempts</h3>
          <div className="space-y-2">
            {last5.map((e, i) => (
              <div key={i} className="rounded-lg border border-border bg-slate-50 p-3 text-[13px] leading-relaxed text-ink">
                <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                  {e.concept} · {new Date(e.iso).toLocaleString('en-GB')}
                </div>
                {e.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
