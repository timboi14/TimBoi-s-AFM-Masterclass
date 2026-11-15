import { useState } from 'react';
import { readWeeklyGoal, writeWeeklyGoal } from '@/lib/habits';

/** Weekly study-day target that drives the Momentum ring on Home. */
export function GoalPanel() {
  const [goal, setGoal] = useState(() => readWeeklyGoal());
  const pick = (n: number) => { writeWeeklyGoal(n); setGoal(n); };
  return (
    <section className="st-card" id="goal" aria-labelledby="st-goal-title">
      <header className="st-card__head">
        <h2 id="st-goal-title">Weekly goal</h2>
        <p>Study days per week. A day counts when you do real work: a card, a drill, a question. Opening the app does not count.</p>
      </header>
      <div className="st-goal" role="radiogroup" aria-label="Study days per week">
        {[2, 3, 4, 5, 6, 7].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={goal === n} className={goal === n ? 'is-active' : ''} onClick={() => pick(n)}>
            {n}
          </button>
        ))}
      </div>
      <p className="st-note">
        {goal <= 3 ? 'A steady base. Good when work is heavy.' : goal <= 5 ? 'The sweet spot for most candidates: frequent enough for spaced recall to work.' : 'Exam-month intensity. Keep a rest day if marks start slipping.'}
      </p>
    </section>
  );
}
