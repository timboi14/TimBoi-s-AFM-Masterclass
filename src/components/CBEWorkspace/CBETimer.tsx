import { useEffect, useRef } from 'react';
import { DEFAULT_DURATION_SECONDS, formatHMS } from '@/lib/cbe-storage';

interface Props {
  secondsRemaining: number;
  running: boolean;
  /** Called every second when running, with the new secondsRemaining (after −1). */
  onTick: (newSeconds: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

/**
 * ACCA-CBE-style countdown timer. Sits in the top-right of the workspace
 * with a colour ramp: green > 30 min, amber 5–30 min, red < 5 min, slate when 0.
 */
export function CBETimer({ secondsRemaining, running, onTick, onStart, onPause, onReset }: Props) {
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!running || secondsRemaining <= 0) return;
    const id = window.setInterval(() => {
      tickRef.current(Math.max(0, secondsRemaining - 1));
    }, 1000);
    return () => window.clearInterval(id);
    // We deliberately depend only on `running`. The ref above pulls the latest
    // secondsRemaining into the interval callback without re-creating it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, secondsRemaining]);

  const phase: 'safe' | 'warn' | 'danger' | 'done' =
    secondsRemaining <= 0
      ? 'done'
      : secondsRemaining <= 5 * 60
        ? 'danger'
        : secondsRemaining <= 30 * 60
          ? 'warn'
          : 'safe';

  const pctRemaining = (secondsRemaining / DEFAULT_DURATION_SECONDS) * 100;

  return (
    <div className={`cbe-timer cbe-timer--${phase}`} role="timer" aria-live="off">
      <div className="cbe-timer__bar">
        <div className="cbe-timer__bar-fill" style={{ width: `${pctRemaining}%` }} />
      </div>
      <div className="cbe-timer__row">
        <div className="cbe-timer__display" aria-label={`Time remaining: ${formatHMS(secondsRemaining)}`}>
          <span className="cbe-timer__label">Time remaining</span>
          <span className="cbe-timer__hms">{formatHMS(secondsRemaining)}</span>
        </div>
        <div className="cbe-timer__controls">
          {!running ? (
            <button
              type="button"
              onClick={onStart}
              disabled={secondsRemaining <= 0}
              className="cbe-timer__btn cbe-timer__btn--primary"
              aria-label="Start timer"
            >
              <span aria-hidden>▶</span> Start
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="cbe-timer__btn"
              aria-label="Pause timer"
            >
              <span aria-hidden>⏸</span> Pause
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className="cbe-timer__btn"
            aria-label="Reset timer to 3 hours 15 minutes"
          >
            <span aria-hidden>↺</span> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
