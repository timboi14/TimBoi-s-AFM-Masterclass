import { Link } from 'react-router-dom';
import { AppIcon } from '@/components/AppIcon';
import { CenteredHero, HeroGold, SectionShell, StickySubNav } from '@/components/Blocks';
import { SITTING, SYLLABUS } from '@/config/sitting';
import { store, useStore } from '@/lib/store';

const PRIORITIES = [
  { rank: 1, code: 'B', title: 'Advanced investment appraisal', body: 'NPV with inflation and tax, APV, real options, sensitivity and international investment. Build the cash-flow table cleanly, then explain the commercial decision.', to: '/topic/npv' },
  { rank: 2, code: 'E', title: 'Treasury and risk management', body: 'FX and interest-rate hedging, futures, options, swaps and the recommendation. Calculation earns entry; comparison and judgement finish the answer.', to: '/topic/fx' },
  { rank: 3, code: 'C–D', title: 'M&A, valuation and reconstruction', body: 'Value each side, isolate synergy, set the negotiation range and discuss financing, control and stakeholder consequences.', to: '/topic/mna' },
  { rank: 4, code: 'A', title: 'Senior adviser judgement', body: 'Governance, ethics, sustainability and professional advice run through the whole paper. Make every recommendation board-ready.', to: '/topic/adviser' },
] as const;

const anchors = [
  { id: 'next-moves', label: 'Next 3 moves' },
  { id: 'exam-shape', label: 'Exam shape' },
  { id: 'priority-map', label: 'Priority map' },
  { id: 'match-plan', label: 'Match plan' },
];

export function LeaveItToUsPage() {
  const state = useStore();
  const entered = Boolean(state.examEntryConfirmedAt);

  return (
    <>
      <StickySubNav title="Leave it to us" anchors={anchors} />
      <SectionShell tone="navy" pad="xl" aura>
        <CenteredHero
          eyebrow={<><AppIcon name="sparkles" size={14} /> Your {SITTING.label} pass plan</>}
          headline={<>Stop planning the plan. <HeroGold>Do the next rep.</HeroGold></>}
          subline={<>A current-sitting AFM route built around the exam shape, the highest-transfer skills and the evidence already saved on this device.</>}
          actions={<>
            <Link className="btn btn-primary" to="/start/diagnostic">Run the 10-question calibration</Link>
            <Link className="btn btn-secondary" to="/training">Start a timed drill</Link>
          </>}
        />
      </SectionShell>

      <SectionShell tone="white" pad="lg">
        <div id="next-moves" className="max-w-5xl mx-auto">
          <p className="kicker">Your next three moves</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mt-2">Action before architecture.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Move n="01" urgent={!entered} title={entered ? 'Entry confirmed' : 'Confirm exam entry'} body={entered ? `${SITTING.examDayLabel} is locked in. Keep the docket time as the final authority.` : `Standard entry closes 27 July. Confirm in myACCA before study work gets another minute.`} to={entered ? '/settings' : 'https://myacca.accaglobal.com'} external={!entered} />
            <Move n="02" title={state.weakAreas.length ? 'Attack the weakest area' : 'Calibrate the engine'} body={state.weakAreas.length ? `Your device has flagged ${state.weakAreas[0]}. Turn that evidence into one focused rep.` : 'Ten adaptive questions create a useful starting signal instead of guessing what to revise.'} to="/start/diagnostic" />
            <Move n="03" title="Produce 25 minutes of evidence" body="Plan or write one requirement in the CBE workspace, then record one strength and one leak." to="/practice" />
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="mist" pad="lg">
        <div id="exam-shape" className="max-w-5xl mx-auto">
          <p className="kicker">The paper you are training for</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mt-2">100 marks. 195 minutes. One professional voice.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Shape mark="50" title="Section A" body="One compulsory case. 40 technical marks plus 10 professional-skills marks." />
            <Shape mark="25" title="Section B · Q2" body="One compulsory question. 20 technical marks plus 5 professional-skills marks." />
            <Shape mark="25" title="Section B · Q3" body="One compulsory question. 20 technical marks plus 5 professional-skills marks." />
          </div>
          <p className="mt-5 text-sm text-muted">At roughly 1.95 minutes per mark, planning, calculations and writing all share the same clock. Professional skills are embedded in the response—not a separate appendix.</p>
        </div>
      </SectionShell>

      <SectionShell tone="white" pad="lg">
        <div id="priority-map" className="max-w-5xl mx-auto">
          <p className="kicker">Priority map</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mt-2">
            <h2 className="font-display text-3xl md:text-5xl text-ink">Train transferable marks first.</h2>
            <span className="chip">{SYLLABUS.label} · no syllabus changes</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {PRIORITIES.map((item) => (
              <Link key={item.rank} to={item.to} className="group rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[.15em] text-primary">PRIORITY {item.rank}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-accent font-display">{item.code}</span></div>
                <h3 className="font-display text-2xl text-ink mt-5">{item.title}</h3>
                <p className="text-sm leading-6 text-muted mt-2">{item.body}</p>
                <span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-primary">Open training route <AppIcon name="arrowRight" size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="black" pad="lg">
        <div id="match-plan" className="max-w-5xl mx-auto text-white">
          <p className="kicker text-accent">The weekly match plan</p>
          <h2 className="font-display text-3xl md:text-5xl mt-2">Understand → calculate → advise → repair.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            {[
              ['Mon–Tue', 'Build', 'Learn one method and reproduce its skeleton from memory.'],
              ['Wed–Thu', 'Apply', 'Complete two requirements with scenario-specific judgement.'],
              ['Friday', 'Pressure', 'Sit 50 marks in the CBE workspace without pausing.'],
              ['Weekend', 'Repair', 'Self-mark, log the leak and schedule the next recall.'],
            ].map(([day, title, body]) => <div key={day} className="rounded-2xl border border-white/15 bg-white/5 p-5"><span className="text-xs font-black tracking-widest text-accent">{day}</span><h3 className="font-display text-2xl mt-3">{title}</h3><p className="text-sm leading-6 text-white/70 mt-2">{body}</p></div>)}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link className="btn btn-primary" to="/past-papers">Choose a full sitting</Link>
            <button className="btn btn-secondary" type="button" onClick={() => store.set({ examEntryConfirmedAt: new Date().toISOString() })}>I&apos;m entered</button>
          </div>
        </div>
      </SectionShell>
    </>
  );
}

function Move({ n, title, body, to, urgent, external }: { n: string; title: string; body: string; to: string; urgent?: boolean; external?: boolean }) {
  const cls = `rounded-3xl border p-6 ${urgent ? 'border-red-300 bg-red-50' : 'border-border bg-white'}`;
  const content = <><span className="font-display text-4xl text-primary/30">{n}</span><h3 className="font-display text-2xl text-ink mt-4">{title}</h3><p className="text-sm leading-6 text-muted mt-2">{body}</p><span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-primary">Do this now <AppIcon name="arrowRight" size={14} /></span></>;
  return external ? <a className={cls} href={to} target="_blank" rel="noreferrer">{content}</a> : <Link className={cls} to={to}>{content}</Link>;
}

function Shape({ mark, title, body }: { mark: string; title: string; body: string }) {
  return <div className="rounded-3xl border border-border bg-white p-6"><span className="font-display text-6xl text-primary">{mark}</span><span className="text-xs font-black text-muted"> MARKS</span><h3 className="font-display text-2xl text-ink mt-4">{title}</h3><p className="text-sm leading-6 text-muted mt-2">{body}</p></div>;
}
