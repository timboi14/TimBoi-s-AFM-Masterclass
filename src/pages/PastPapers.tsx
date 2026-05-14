import { motion } from 'framer-motion';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { PastPapersView } from '@/components/PastPapers';
import { PAPERS } from '@/data/pastpapers/papers';

export function PastPapersPage() {
  const sectionA = PAPERS.filter((p) => p.paperSection === 'A').length;
  const sectionB = PAPERS.filter((p) => p.paperSection === 'B').length;

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 relative overflow-hidden border-l-4 border-l-primary">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[260px]">
              <Pill variant="primary" className="mb-2">
                {PAPERS.length} verified papers · bionic reading
              </Pill>
              <h1 className="font-display text-4xl tracking-wide uppercase">
                Past papers, source-verified.
              </h1>
              <p className="text-text/80 mt-2 max-w-2xl leading-relaxed">
                Every number traced to a source file:{' '}
                <b className="text-primary">Q-pack</b> (OCR-verified),{' '}
                <b className="text-sky-600">ACCA Model Answer</b>, or{' '}
                <b className="text-muted">Examiner Report</b>. Each paper opens a four-tab dive:
                Scenario walkthrough → Question → Solution → Examiner says.
                Body text is rendered in bionic font so your eye stops slowing down.
              </p>
            </div>
            <div className="flex gap-2 text-[12px]">
              <span className="chip">Sec A · {sectionA}</span>
              <span className="chip">Sec B · {sectionB}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-5">
        <PastPapersView />
      </motion.div>
    </motion.div>
  );
}
