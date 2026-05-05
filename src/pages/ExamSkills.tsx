import { motion } from 'framer-motion';
import { Card, CoachTip, Pill, fadeUp, stagger } from '@/components/primitives';

export function ExamSkillsPage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 border-l-4 border-l-accent">
          <Pill variant="accent" className="mb-2">Coach&apos;s playbook</Pill>
          <h1 className="font-display text-4xl tracking-wide uppercase">Technique &gt; Knowledge</h1>
          <p className="text-text/80 mt-2 max-w-2xl">
            Knowledge gets you to 50%. Technique gets you to 65. This page is the technique playbook,
            distilled in the Andrew Mower style: structure the answer, lead with the recommendation,
            quote scenario figures, defend with sensitivity. Memorise the templates.
          </p>
        </Card>
      </motion.div>

      {/* NEA FRAMEWORK */}
      <motion.div variants={fadeUp} className="mt-8">
        <h2 className="font-display text-3xl tracking-wide uppercase mb-4">The N-E-A framework</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {([
            { letter: 'N', label: 'Name it', body: 'Use the precise ACCA term. "Agency cost" not "manager problem". "Riba" not "interest". "Loss aversion" not "fear of losing".', color: 'primary' },
            { letter: 'E', label: 'Explain it', body: 'One sentence of mechanism. Use linkers: because, this leads to, resulting in. Tight cause-effect.', color: 'accent' },
            { letter: 'A', label: 'Apply it', body: 'Quote a scenario figure, name, fact. The £8m abatement, Drimpton 30% gearing, the £14m synergy estimate.', color: 'primary' },
          ] as const).map((b) => (
            <Card key={b.letter}>
              <span className={`font-display text-7xl leading-none ${b.color === 'primary' ? 'text-primary' : 'text-accent'}`}>
                {b.letter}
              </span>
              <h3 className="font-display text-xl tracking-wide uppercase mt-2">{b.label}</h3>
              <p className="text-text/80 text-[14px] leading-relaxed mt-2">{b.body}</p>
            </Card>
          ))}
        </div>

        {/* WORKED EXAMPLE */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-danger">
            <Pill variant="danger" className="mb-2">Bad answer, 1 of 5</Pill>
            <p className="italic text-text/85 leading-relaxed">
              "Synergy is often overestimated. Companies pay too much for acquisitions. Sometimes deals
              fail because of integration problems. Managers are sometimes overconfident. Advisers can
              be biased. Cultural differences cause issues."
            </p>
            <div className="mt-3 text-xs text-danger">
              Six bullets, no NAMING, no EXPLAINING, no APPLYING. Examiner ticks 1 conceptual mark.
            </div>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <Pill variant="primary" className="mb-2">Good answer, 5 of 5</Pill>
            <div className="text-text/90 text-[13.5px] leading-relaxed grid gap-3">
              <p>
                <b>1. M&amp;A waves and cheap credit.</b> [N] M&amp;A activity tends to peak with cheap
                credit; [E] competition for targets pushes premiums above realistic synergy; [A] given
                Hav Co is bidding during a low-rate period and the deal is the third in 18 months,
                premium overpayment is likely.
              </p>
              <p>
                <b>2. Adviser conflict of interest.</b> [N] Investment banks earn fees on completion;
                [E] their valuation advice is biased toward closing; [A] Hav Co should ensure the bank
                advising on synergy is separate from the team executing the deal.
              </p>
              <p>
                <b>3. Hubris and overconfidence.</b> [N] Acquirers overestimate synergy and underestimate
                integration time; [E] reluctance to admit mistakes once committed compounds the loss;
                [A] Hav Co&apos;s track record (4 of 6 past deals destroyed value) signals this risk is live,
                not theoretical.
              </p>
              <p className="pt-1 border-t border-border">
                <b>Steps to address:</b> allocate synergy ownership to a senior manager with measurable
                targets; commission independent due diligence; set a board-approved walk-away premium and
                enforce it.
              </p>
            </div>
          </Card>
        </div>

        <CoachTip title="Mower template">
          Drop these phrases into the start of every paragraph: "The first concept is [N]. This means [E].
          In the case, [A]." Each paragraph then earns 3 marks instead of 1. Memorise the rhythm.
        </CoachTip>
      </motion.div>

      {/* PROFESSIONAL SKILLS */}
      <motion.div variants={fadeUp} className="mt-12">
        <h2 className="font-display text-3xl tracking-wide uppercase mb-4">Professional skills, 20 marks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { skill: 'Communication', body: 'Headings, signposted bullets, audience-fit tone. Lead with the recommendation.', icon: 'fa-comments' },
            { skill: 'Analysis', body: 'Compare alternatives in numbers AND words. Sensitivities are gold.', icon: 'fa-chart-pie' },
            { skill: 'Scepticism', body: 'Stress-test assumptions. Flag bias. Synergy looks aggressive given...', icon: 'fa-magnifying-glass' },
            { skill: 'Commercial', body: 'Industry context. Implementation feasibility. Stakeholder pushback.', icon: 'fa-briefcase' },
          ].map((s) => (
            <Card key={s.skill}>
              <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center text-accent mb-3">
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <h3 className="font-display text-lg tracking-wide uppercase">{s.skill}</h3>
              <p className="text-text/80 text-[13.5px] mt-2 leading-relaxed">{s.body}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* TIME MANAGEMENT */}
      <motion.div variants={fadeUp} className="mt-12">
        <h2 className="font-display text-3xl tracking-wide uppercase mb-4">Time strategy: 3 hours 15 minutes</h2>
        <Card>
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.16em] text-muted">
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Activity</th>
                <th className="text-left p-3">Mower note</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['00:00 to 00:15', 'Reading time + plan structure', 'Read the requirements first, scenario second. Build a one-page plan.'],
                ['00:15 to 01:45', 'Section A 50-mark case', '90 minutes for 50 marks at 1.8 minutes per mark. Lead with recommendation.'],
                ['01:45 to 02:30', 'Section B Q1 25 marks', '45 minutes. Tabulate alternatives. Recommend at the bottom.'],
                ['02:30 to 03:15', 'Section B Q2 25 marks', '45 minutes. Same discipline. Quote scenario figures every paragraph.'],
              ].map(([t, a, n]) => (
                <tr key={t} className="border-t border-border/50">
                  <td className="p-3 font-mono text-accent">{t}</td>
                  <td className="p-3 font-bold">{a}</td>
                  <td className="p-3 text-text/80 text-[13.5px]">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* DISCUSSION TEMPLATES */}
      <motion.div variants={fadeUp} className="mt-12">
        <h2 className="font-display text-3xl tracking-wide uppercase mb-4">Discussion-mark templates</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              topic: 'M&A',
              steps: [
                'State stand-alone, with-synergy and max bid in one paragraph each.',
                'Sources of synergy: revenue (sceptical), cost, financial.',
                'Recommend bid at the lower end of max bid range.',
                'Risks: integration, culture, retention.',
              ],
            },
            {
              topic: 'ESG',
              steps: [
                'Identify SPECIFIC issue from scenario (carbon, supply chain, governance).',
                'Recommend specific costed action.',
                'Quantify outcome: NPV impact, reputational, regulatory.',
                'Name the stakeholder (community, regulator, investor).',
              ],
            },
            {
              topic: 'Dividend policy',
              steps: [
                'M&M: irrelevance under perfect markets.',
                'Real-world factors: tax, brokerage, info asymmetry, investment opportunities.',
                'Apply to scenario: this firm has X NPV opportunities, retain.',
                'Recommend payout level with reasoning.',
              ],
            },
            {
              topic: 'Capital structure',
              steps: [
                'M&M2 with tax: WACC falls with gearing because of tax shield.',
                'Trade-off theory: bankruptcy and agency costs cap optimal gearing.',
                'Apply: this firms current gearing is X, optimal range Y.',
                'Recommend movement toward optimal.',
              ],
            },
          ].map((t) => (
            <Card key={t.topic}>
              <Pill variant="accent" className="mb-2">{t.topic}</Pill>
              <h3 className="font-display text-xl tracking-wide uppercase mb-2">Discussion template</h3>
              <ol className="grid gap-2 list-decimal list-inside text-[13.5px] leading-relaxed text-text/85">
                {t.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* NIGHT BEFORE */}
      <motion.div variants={fadeUp} className="mt-12">
        <h2 className="font-display text-3xl tracking-wide uppercase mb-4">The night before</h2>
        <Card>
          <ul className="grid gap-3 text-[14px] leading-relaxed">
            <li><i className="fa-solid fa-check text-primary mr-2" /> Read the formula sheet. Test yourself blank.</li>
            <li><i className="fa-solid fa-check text-primary mr-2" /> Recite z values: 1.645 at 95%, 2.326 at 99%.</li>
            <li><i className="fa-solid fa-check text-primary mr-2" /> Recite NEA framework: Name. Explain. Apply.</li>
            <li><i className="fa-solid fa-check text-primary mr-2" /> One discussion template per topic, written from memory.</li>
            <li><i className="fa-solid fa-check text-primary mr-2" /> Sleep 8 hours. No new content. Confidence over content.</li>
            <li><i className="fa-solid fa-check text-primary mr-2" /> Pack ID, calculator, water, snack.</li>
          </ul>
          <CoachTip title="On the morning">
            Eat something. Drink water. Read every requirement twice. Time-box rigorously. The exam rewards
            the candidate who structures the answer, not the one who knows the most.
          </CoachTip>
        </Card>
      </motion.div>
    </motion.div>
  );
}
