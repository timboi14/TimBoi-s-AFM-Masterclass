import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { TOPIC_LIST } from '@/data/topics';
import { THEORY } from '@/data/theory';
import { GoalBurst } from '@/components/Confetti';
import { store } from '@/lib/store';
import { cn } from '@/lib/cn';

interface FlipCard { front: string; back: string; tag: string; }

const DECKS: { key: string; label: string; icon: string; build: () => FlipCard[] }[] = [
  {
    key: 'biases',
    label: 'Behavioural biases',
    icon: 'fa-brain',
    build: () => [
      { front: 'Anchoring', back: 'Over-weighting an irrelevant reference such as the asking price.', tag: 'Behavioural' },
      { front: 'Availability bias', back: 'Over-weighting recent or vivid news in expectations.', tag: 'Behavioural' },
      { front: 'Hubris', back: 'Overconfidence in own ability to predict and control. Common in M&A overpayment.', tag: 'Behavioural' },
      { front: 'Loss aversion', back: 'Pain of loss roughly twice the pleasure of equivalent gain. Skews holding losers too long.', tag: 'Behavioural' },
      { front: 'Herd behaviour', back: 'Mimicking actions of a larger group. Drives M&A waves and bubbles.', tag: 'Behavioural' },
      { front: 'Gamblers fallacy', back: 'Believing past outcomes change future probabilities of independent events.', tag: 'Behavioural' },
      { front: 'Entrapment', back: 'Sunk-cost fallacy. Continuing because of past commitment, not future expected value.', tag: 'Behavioural' },
    ],
  },
  {
    key: 'z',
    label: 'Z-values and VaR',
    icon: 'fa-shield-halved',
    build: () => [
      { front: 'z at 95% one-tail', back: '1.645', tag: 'VaR' },
      { front: 'z at 99% one-tail', back: '2.326 (or 2.33)', tag: 'VaR' },
      { front: 'T-day VaR scaling', back: 'VaR_T = VaR_1 * sqrt(T). Assumes returns are iid.', tag: 'VaR' },
      { front: 'VaR formula', back: 'VaR = z * sigma * Value, one-tail.', tag: 'VaR' },
    ],
  },
  {
    key: 'hedging',
    label: 'Hedging side',
    icon: 'fa-money-bill-transfer',
    build: () => [
      { front: 'Borrower fearing rates rise', back: 'Buy FRA. Buy puts on bond futures. Pay-fixed receive-floating swap.', tag: 'IR' },
      { front: 'Depositor fearing rates fall', back: 'Sell FRA. Buy calls on bond futures. Pay-floating receive-fixed swap.', tag: 'IR' },
      { front: 'GBP firm receiving USD', back: 'Sell USD forward. Sell USD futures. Buy USD put.', tag: 'FX' },
      { front: 'GBP firm paying USD', back: 'Buy USD forward. Buy USD futures. Buy USD call.', tag: 'FX' },
    ],
  },
  {
    key: 'formulas',
    label: 'Formula recall',
    icon: 'fa-square-root-variable',
    build: () => [
      { front: 'WACC', back: '(E/V) Ke + (D/V) Kd (1 - T)', tag: 'CoC' },
      { front: 'CAPM', back: 'Ke = Rf + Beta_e (Rm - Rf)', tag: 'CoC' },
      { front: 'M&M2 ungear', back: 'Beta_a = Beta_e * E / (E + D (1 - T))', tag: 'CoC' },
      { front: 'IRP forward', back: 'F = S * (1 + i_q) / (1 + i_b)', tag: 'FX' },
      { front: 'Fisher', back: '(1 + i) = (1 + r) (1 + h)', tag: 'NPV' },
      { front: 'Black-Scholes call', back: 'C = Pa N(d1) - Pe e^(-rt) N(d2)', tag: 'Options' },
      { front: 'Gordon dividend', back: 'P_0 = D_1 / (Ke - g)', tag: 'Valuation' },
      { front: 'FCFE perpetuity', back: 'V_E = FCFE_1 / (Ke - g)', tag: 'Valuation' },
    ],
  },
  {
    key: 'pitfalls',
    label: 'Examiner pitfalls',
    icon: 'fa-triangle-exclamation',
    build: () =>
      TOPIC_LIST.flatMap((t) => t.pitfalls.map((p) => ({ front: p.title, back: p.body, tag: t.title }))),
  },
  {
    key: 'theory',
    label: 'Theory micro-recalls',
    icon: 'fa-book',
    build: () =>
      THEORY.slice(0, 16).map((t) => ({
        front: t.q,
        back: t.bullets.split('\n')[0] + '...',
        tag: 'Theory',
      })),
  },
];

export function CardsPage() {
  const [deckKey, setDeckKey] = useState(DECKS[0].key);
  const cards = useMemo(() => DECKS.find((d) => d.key === deckKey)!.build(), [deckKey]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [burst, setBurst] = useState(false);

  const card = cards[idx];

  const next = () => {
    if (idx < cards.length - 1) setIdx((i) => i + 1);
    setFlipped(false);
  };
  const prev = () => {
    if (idx > 0) setIdx((i) => i - 1);
    setFlipped(false);
  };
  const know = () => {
    setScore((s) => ({ ...s, right: s.right + 1 }));
    store.awardCorrect('flashcard', 25);
    setBurst(true);
    setTimeout(next, 350);
  };
  const miss = () => {
    setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    next();
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 border-l-4 border-l-accent">
          <Pill variant="accent" className="mb-2">Flashcard drill station</Pill>
          <h1 className="font-display text-4xl tracking-wide uppercase">Recall, Apply, Repeat</h1>
          <p className="text-text/80 mt-2 max-w-2xl">
            6 decks. Click the card to flip. Mark <b className="text-primary">I know it</b> or
            <b className="text-danger"> I missed it</b>. Use keyboard arrows to flick through.
          </p>
        </Card>
      </motion.div>

      <h2 className="sr-only">Choose a deck</h2>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Flashcard decks">
        {DECKS.map((d) => (
          <button
            key={d.key}
            role="tab"
            aria-selected={deckKey === d.key}
            onClick={() => {
              setDeckKey(d.key);
              setIdx(0);
              setFlipped(false);
              setScore({ right: 0, wrong: 0 });
            }}
            className={cn('pill border border-border', deckKey === d.key && 'bg-primary text-bg')}
          >
            <i className={`fa-solid ${d.icon}`} aria-hidden="true" /> {d.label}
          </button>
        ))}
      </div>

      <h3 className="sr-only">{DECKS.find((d) => d.key === deckKey)!.label} · card {idx + 1} of {cards.length}</h3>

      {/* progress */}
      <div className="mt-6 flex items-center gap-3">
        <span className="font-mono text-sm text-muted">
          {idx + 1} / {cards.length}
        </span>
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((idx + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-[12px] text-primary font-bold">{score.right}/{cards.length} known</span>
      </div>

      {/* card stage */}
      <div className="mt-6 perspective-[1500px]">
        <motion.div
          key={`${deckKey}-${idx}`}
          className="relative w-full h-[280px] md:h-[340px] cursor-pointer"
          onClick={() => setFlipped(!flipped)}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <FlipFace face="front" tag={card.tag} text={card.front} />
          <FlipFace face="back" tag={card.tag} text={card.back} />
          <GoalBurst play={burst} onDone={() => setBurst(false)} />
        </motion.div>
      </div>

      {/* controls */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button className="btn-outline" onClick={prev} disabled={idx === 0}>
          <i className="fa-solid fa-arrow-left" /> Previous
        </button>
        <button className="btn-ghost" onClick={() => setFlipped(!flipped)}>
          <i className="fa-solid fa-rotate" /> Flip
        </button>
        <div className="ml-auto flex gap-2">
          <button className="btn-outline border-danger text-danger" onClick={miss}>
            <i className="fa-solid fa-xmark" /> I missed it
          </button>
          <button className="btn-primary" onClick={know}>
            <i className="fa-solid fa-check" /> I know it
          </button>
          <button className="btn-outline" onClick={next} disabled={idx === cards.length - 1}>
            Next <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>

      {idx === cards.length - 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
          <Card>
            <h3 className="font-display text-xl uppercase tracking-wide">Deck complete</h3>
            <p className="text-text/80 mt-1">
              You knew {score.right} out of {cards.length}. Restart, or try a harder deck.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary" onClick={() => { setIdx(0); setScore({ right: 0, wrong: 0 }); setFlipped(false); }}>
                <i className="fa-solid fa-rotate-left" /> Restart
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function FlipFace({ face, tag, text }: { face: 'front' | 'back'; tag: string; text: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-2',
        face === 'front'
          ? 'bg-gradient-to-br from-card to-bg border-accent/50'
          : 'bg-gradient-to-br from-primary/15 to-card border-primary/50'
      )}
      style={{ backfaceVisibility: 'hidden', transform: face === 'back' ? 'rotateY(180deg)' : undefined }}
    >
      <Pill variant={face === 'front' ? 'accent' : 'primary'} className="mb-4">{tag}</Pill>
      <p className={cn('font-display tracking-wide uppercase leading-tight', face === 'front' ? 'text-3xl md:text-4xl text-text' : 'text-2xl md:text-3xl text-primary')}>
        {text}
      </p>
      <span className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.18em] text-muted">
        {face === 'front' ? 'Tap to reveal' : 'Tap to flip back'}
      </span>
    </div>
  );
}
