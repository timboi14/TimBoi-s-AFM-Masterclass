import { SITTING, SITTINGS, SITTING_IS_CHOSEN, chooseSitting } from '@/config/sitting';

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/** Pick which exam sitting every countdown, deadline and course week targets. */
export function SittingPanel() {
  const now = Date.now();
  return (
    <section className="st-card" id="sitting" aria-labelledby="st-sitting-title">
      <header className="st-card__head">
        <h2 id="st-sitting-title">Exam sitting</h2>
        <p>Every countdown, deadline and course week follows the sitting you pick here.</p>
      </header>
      <div className="st-sittings" role="radiogroup" aria-label="Exam sitting">
        {SITTINGS.map((s) => {
          const active = s.id === SITTING.id;
          const examPast = +new Date(s.examAt) <= now;
          const entryClosed = +new Date(s.lateEntryDeadlineAt) <= now;
          const days = Math.ceil((+new Date(s.examAt) - now) / 86_400_000);
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={examPast}
              className={`st-sitting${active ? ' is-active' : ''}`}
              onClick={() => { if (!active) chooseSitting(s.id); }}
            >
              <span className="st-sitting__top">
                <strong>{s.label}</strong>
                <em>{examPast ? 'Sat' : `${days} days`}</em>
              </span>
              <span className="st-sitting__row"><i>Exam</i>{s.examDayConfirmed ? fmt(s.examAt) : s.examDayLabel}</span>
              <span className="st-sitting__row">
                <i>Entry</i>
                {entryClosed ? 'Closed. Choose this only if you are already entered.' : `Closes ${fmt(s.entryDeadlineAt)} (late ${fmt(s.lateEntryDeadlineAt)})`}
              </span>
              <span className="st-sitting__row"><i>Results</i>{fmt(s.resultsAt)}</span>
              {active && <span className="st-sitting__badge">{SITTING_IS_CHOSEN ? 'Your sitting' : 'Default'}</span>}
            </button>
          );
        })}
      </div>
      <p className="st-note">
        Dates checked against ACCA&apos;s timetable on 14 November 2026. Start times are provisional: confirm yours in myACCA.
        Switching sitting reloads the app and clears the &ldquo;I&apos;m entered&rdquo; confirmation.
      </p>
    </section>
  );
}
