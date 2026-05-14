import type { Paper } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { SourceBadge } from '../shared/SourceBadge';

interface Props { paper: Paper; }

export function ExaminerTab({ paper }: Props) {
  const { examinerFeedback: ef } = paper;
  return (
    <div className="examiner-tab">
      <SourceBadge source="E" />

      <div className="examiner-box examiner-box--good">
        <p className="examiner-box__label">What candidates did well</p>
        <p className="bionic-text" {...bionicHTML(ef.didWell)} />
      </div>

      <div className="examiner-box examiner-box--bad">
        <p className="examiner-box__label">Where most marks were lost</p>
        <p className="bionic-text" {...bionicHTML(ef.commonErrors)} />
      </div>

      <div className="examiner-box examiner-box--tip">
        <p className="examiner-box__label">Tutor tip</p>
        <p className="bionic-text" {...bionicHTML(ef.tutorTip)} />
      </div>
    </div>
  );
}
