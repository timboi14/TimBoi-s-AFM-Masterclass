import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppIcon, type AppIconName } from '@/components/AppIcon';
import { dueCardCount } from '@/lib/db/bootstrap';
import { useEvents } from '@/lib/db/events';

/**
 * Thumb-reach tab bar for phones. The five tabs are the daily loop: plan,
 * learn, recall, practise, review. Everything else stays in the header menu.
 * The Recall tab carries a badge with the cards due now, which is the
 * strongest honest reason to come back today.
 */
const TABS: Array<{ to: string; label: string; icon: AppIconName; matches: string[] }> = [
  { to: '/', label: 'Home', icon: 'home', matches: [] },
  { to: '/course', label: 'Learn', icon: 'graduation', matches: ['/course', '/champions-league', '/topic', '/theory', '/playbook'] },
  { to: '/memory-lab', label: 'Recall', icon: 'brain', matches: ['/memory', '/boot-room', '/cards'] },
  { to: '/past-papers', label: 'Papers', icon: 'files', matches: ['/past-papers', '/training', '/practice', '/mock', '/debrief', '/revision'] },
  { to: '/form-guide', label: 'Progress', icon: 'chart', matches: ['/form-guide', '/progress', '/settings'] },
];

export function BottomTabs() {
  const { pathname } = useLocation();
  const events = useEvents();
  const [due, setDue] = useState(0);
  useEffect(() => { setDue(dueCardCount()); }, [events, pathname]);

  return (
    <nav className="bt" aria-label="Main sections">
      {TABS.map((tab) => {
        const active = tab.to === '/' ? pathname === '/' : tab.matches.some((m) => pathname.startsWith(m));
        const badge = tab.to === '/memory-lab' && due > 0 ? (due > 99 ? '99+' : String(due)) : '';
        return (
          <NavLink key={tab.to} to={tab.to} className={active ? 'bt__tab is-active' : 'bt__tab'} aria-current={active ? 'page' : undefined}>
            <span className="bt__icon">
              <AppIcon name={tab.icon} size={20} />
              {badge && <b aria-label={`${due} cards due`}>{badge}</b>}
            </span>
            <span className="bt__label">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
