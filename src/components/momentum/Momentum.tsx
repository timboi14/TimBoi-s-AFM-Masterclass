import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/lib/db/events';
import {
  computeStreak, heatMap, readWeeklyGoal, recapHeadline, recapPair, weekProgress, FREEZE_CAP,
} from '@/lib/habits';
import { dueCardCount } from '@/lib/db/bootstrap';

/**
 * Momentum board: the learner's habit evidence in one glance.
 *
 * Everything shown derives from the study event log, so the board can only
 * report work that actually happened. The copy never scolds a quiet week;
 * it names the next useful action instead.
 */

const DAY_INITIAL = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function longDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function Momentum() {
  const events = useEvents();
  const goal = readWeeklyGoal();
  const { streak, week, grid, pair, due } = useMemo(() => ({
    streak: computeStreak(events),
    week: weekProgress(events, goal),
    grid: heatMap(events, 12),
    pair: recapPair(events),
    due: dueCardCount(),
  }), [events, goal]);

  const ringPct = Math.min(1, week.done / week.goal);
  const R = 46;
  const C = 2 * Math.PI * R;
  const headline = recapHeadline(pair, week);
  const t = pair.thisWeek;
  const l = pair.lastWeek;
  const delta = t.actions - l.actions;

  // Month labels sit above the first column that starts a new month.
  const monthLabels = grid.map((col, i) => {
    const m = Number(col[0].day.slice(5, 7)) - 1;
    const prev = i > 0 ? Number(grid[i - 1][0].day.slice(5, 7)) - 1 : -1;
    return m !== prev ? MONTH[m] : '';
  });

  const next = streak.activeToday
    ? due > 0
      ? { to: '/memory-lab', label: `Clear ${due} due card${due === 1 ? '' : 's'}`, note: 'Today is banked. Extra reps compound.' }
      : { to: '/past-papers', label: 'Sit a timed question', note: 'Today is banked. Pressure practice is the next lever.' }
    : due > 0
      ? { to: '/memory-lab', label: `Review ${due} due card${due === 1 ? '' : 's'}`, note: 'About five minutes keeps the run alive.' }
      : { to: '/training', label: 'Start a ten-minute session', note: 'One short session counts as today.' };

  return (
    <div className="mo" data-testid="momentum" data-va-skip>
      {/* Streak */}
      <section className="mo__streak" aria-label="Study streak">
        <p className="mo__label">Study streak</p>
        <div className="mo__streak-row">
          <strong className={`mo__streak-num${streak.atRisk ? ' is-risk' : ''}`}>{streak.current}</strong>
          <div className="mo__streak-meta">
            <span>day{streak.current === 1 ? '' : 's'}</span>
            <span className="mo__best">best {streak.best}</span>
          </div>
        </div>
        <div className="mo__freezes" role="img" aria-label={`${streak.freezes} of ${FREEZE_CAP} streak freezes banked`}>
          {Array.from({ length: FREEZE_CAP }, (_, i) => (
            <span key={i} className={`mo__freeze${i < streak.freezes ? ' is-banked' : ''}`} aria-hidden>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M12 6l-2.5-2.5M12 6l2.5-2.5M12 18l-2.5 2.5M12 18l2.5 2.5" />
              </svg>
            </span>
          ))}
          <span className="mo__freeze-note">
            {streak.freezes === 0 ? 'No freeze banked. Five study days earn one.' : `${streak.freezes} freeze${streak.freezes === 1 ? '' : 's'} banked. A missed day spends one, not the run.`}
          </span>
        </div>
        <p className="mo__status">
          {streak.current === 0
            ? 'Study today to start a run.'
            : streak.atRisk
              ? 'Nothing logged yet today. The run is still yours to keep.'
              : 'Today is logged.'}
        </p>
      </section>

      {/* Weekly goal */}
      <section className="mo__week" aria-label="Weekly goal">
        <p className="mo__label">This week</p>
        <div className="mo__ring-row">
          <svg className="mo__ring" viewBox="0 0 110 110" role="img" aria-label={`${week.done} of ${week.goal} study days this week`}>
            <circle cx="55" cy="55" r={R} className="mo__ring-track" />
            <circle
              cx="55" cy="55" r={R}
              className={`mo__ring-fill${week.met ? ' is-met' : ''}`}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ringPct)}
              transform="rotate(-90 55 55)"
            />
            <text x="55" y="53" textAnchor="middle" className="mo__ring-num">{week.done}</text>
            <text x="55" y="72" textAnchor="middle" className="mo__ring-of">of {week.goal} days</text>
          </svg>
          <ol className="mo__dots" aria-hidden>
            {week.days.map((d, i) => (
              <li key={d.day} className={`${d.active ? 'is-active' : ''}${d.isToday ? ' is-today' : ''}${d.isFuture ? ' is-future' : ''}`}>
                <i />
                <span>{DAY_INITIAL[i]}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mo__status">{headline}</p>
        <Link to="/settings#goal" className="mo__quiet-link">Change weekly goal</Link>
      </section>

      {/* Heat map */}
      <section className="mo__heat" aria-label="Study activity, last twelve weeks">
        <div className="mo__heat-head">
          <p className="mo__label">Last twelve weeks</p>
          <div className="mo__legend" aria-hidden>
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((n) => <i key={n} data-level={n} />)}
            <span>More</span>
          </div>
        </div>
        <div className="mo__months" aria-hidden>
          {monthLabels.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <div className="mo__grid" role="img" aria-label={`${t.actions} study actions this week, ${l.actions} last week`}>
          {grid.map((col, i) => (
            <div key={i} className="mo__col">
              {col.map((cell) => (
                <i
                  key={cell.day}
                  data-level={cell.level}
                  className={cell.isFuture ? 'is-future' : undefined}
                  title={cell.isFuture ? undefined : `${longDay(cell.day)}: ${cell.count} action${cell.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
        <dl className="mo__recap">
          <div><dt>Cards</dt><dd>{t.cards}</dd></div>
          <div><dt>Questions</dt><dd>{t.questions}</dd></div>
          <div><dt>Drills</dt><dd>{t.drills}</dd></div>
          <div><dt>Avg mark</dt><dd>{t.avgScore === null ? '–' : `${t.avgScore}%`}</dd></div>
          <div className="mo__recap-delta">
            <dt>vs last week</dt>
            <dd className={delta > 0 ? 'is-up' : delta < 0 ? 'is-down' : ''}>
              {l.actions === 0 && t.actions === 0 ? '–' : `${delta > 0 ? '+' : ''}${delta}`}
            </dd>
          </div>
        </dl>
      </section>

      {/* Next action */}
      <Link to={next.to} className="mo__next">
        <span>
          <strong>{next.label}</strong>
          <em>{next.note}</em>
        </span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
