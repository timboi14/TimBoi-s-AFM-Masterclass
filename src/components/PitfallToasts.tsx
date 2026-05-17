import { useEffect, useState } from 'react';

/**
 * Pitfall auto-surface toasts (Work Item 7).
 *
 * Given the freeform AI marker feedback text, match against a curated
 * regex table and surface up to 3 dismissable toasts at the foot of the
 * marker output. Extras collapse behind a "+N more" expander.
 *
 * Click "Read the fix" → opens /scout/pitfalls#{id} in a new tab.
 * Dismissal is per-session via sessionStorage.
 */

interface PitfallTrigger {
  id: string;
  title: string;
  rx: RegExp;
}

const PITFALL_TRIGGERS: PitfallTrigger[] = [
  { id: 'fisher', title: 'Fisher trap — real vs nominal mismatch', rx: /fisher|real.*nominal|nominal.*real/i },
  { id: 'tad-not-cash', title: 'Tax-allowable depreciation treated as cash', rx: /tax[- ]allow\w*\s*depreciat|TAD.*cash/i },
  { id: 'book-vs-market', title: 'Book vs market value weights', rx: /book value|market value.*weight/i },
  { id: 'apv-tax-shield', title: 'APV tax shield discounted at WACC', rx: /tax shield.*WACC|shield.*discount/i },
  { id: 'pa-pe-flip', title: 'BSOP Pa / Pe flip', rx: /\bPa\b.*\bPe\b|asset price.*exercise price/i },
  { id: 'bsop-discrete', title: 'Discrete instead of continuous discounting', rx: /e\^|continuous discount/i },
  { id: 'max-bid', title: 'Bid above maximum bid price', rx: /max(?:imum)? bid/i },
  { id: 'fx-bid-ask', title: 'Wrong side of bid / ask', rx: /bid.*ask|offer.*forward/i },
  { id: 'option-premium-fv', title: 'Option premium not future-valued', rx: /future.value.*premium|premium.*future.value/i },
  { id: 'fra-side', title: 'FRA — borrow vs deposit side mix-up', rx: /\bFRA\b.*(?:borrow|deposit)/i },
  { id: 'var-z-tail', title: 'VaR — one-tail vs two-tail z mix-up', rx: /\bz\b.*(?:one.tail|two.tail)|VaR.*tail/i },
  { id: 'esg-generic', title: 'Generic ESG prose without scenario figure', rx: /generic ESG|issue.*action.*outcome/i },
  { id: 'real-options-vol', title: 'Real-options volatility from wrong underlying', rx: /volatility.*underlying|project vol/i },
  { id: 'recommendation-buried', title: 'Recommendation buried in the answer', rx: /recommend.*paragraph (?:3|4|five|first)/i },
];

const SS_PREFIX = 'tba.pitfall-toast.dismissed.';

interface Props {
  feedback: string;
  busy: boolean;
}

export function PitfallToasts({ feedback, busy }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [, forceRender] = useState(0);

  // Reset the "expanded" view each time a fresh feedback run comes in.
  useEffect(() => {
    setExpanded(false);
  }, [feedback]);

  if (busy || !feedback) return null;

  // Match each trigger against the feedback once.
  const allMatches = PITFALL_TRIGGERS.filter((t) => t.rx.test(feedback));
  if (allMatches.length === 0) return null;

  const visible = allMatches.filter(
    (t) => typeof window === 'undefined' || sessionStorage.getItem(SS_PREFIX + t.id) !== '1',
  );
  if (visible.length === 0) return null;

  const shown = expanded ? visible : visible.slice(0, 3);
  const extras = visible.length - shown.length;

  const dismiss = (id: string) => {
    sessionStorage.setItem(SS_PREFIX + id, '1');
    forceRender((n) => n + 1);
  };

  return (
    <div className="mt-4 space-y-2" role="region" aria-label="Pitfall warnings">
      <p className="text-[11px] uppercase tracking-wider text-danger font-bold">
        <i className="fa-solid fa-triangle-exclamation mr-1.5" aria-hidden />
        {visible.length} pitfall{visible.length === 1 ? '' : 's'} matched in this feedback
      </p>
      {shown.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 rounded-xl border-l-4 border-l-danger bg-danger/[0.04] px-3 py-2.5"
        >
          <div className="flex-1 text-[13px] text-ink leading-snug">
            <strong className="text-danger">{t.title}</strong>
            <div className="mt-0.5">
              <a
                href={`/scout/pitfalls#${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline focus-visible:underline text-[12.5px]"
              >
                Read the fix <i className="fa-solid fa-arrow-up-right-from-square text-[10px] ml-0.5" aria-hidden />
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label={`Dismiss ${t.title}`}
            className="text-muted hover:text-ink px-1.5 py-0.5 -mt-0.5"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>
      ))}
      {extras > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[12px] text-primary font-bold hover:underline focus-visible:underline px-1"
        >
          + {extras} more pitfall{extras === 1 ? '' : 's'} flagged
        </button>
      )}
    </div>
  );
}
