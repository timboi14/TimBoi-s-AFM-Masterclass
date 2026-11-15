import { Link } from 'react-router-dom';
import { AppIcon } from '@/components/AppIcon';
import '@/styles/study-library.css';

/**
 * Slim route into the personal study room. Uses the navy board language of
 * the Momentum panel so it reads as part of the cockpit, not a notice.
 */
export function LibraryEntry() {
  return (
    <section className="sl-home-link" aria-label="Personal study plan" data-va-skip>
      <Link to="/study-room">
        <span className="sl-home-link__icon" aria-hidden="true">
          <AppIcon name="book" size={18} />
        </span>
        <span className="sl-home-link__copy">
          <strong>Your March 2027 study room</strong>
          <em>Original books, source-linked lessons and kit questions. Planned around work, 07:00–18:00.</em>
        </span>
        <span className="sl-home-link__cta">
          Open your plan <AppIcon name="arrowRight" size={16} />
        </span>
      </Link>
    </section>
  );
}
