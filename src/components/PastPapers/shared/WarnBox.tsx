import { bionicHTML } from '@/utils/bionic';

interface Props { text: string; }

export function WarnBox({ text }: Props) {
  return (
    <div className="warn-box" role="note">
      <span className="warn-box__icon" aria-hidden>⚠</span>
      <p className="warn-box__text bionic-text" {...bionicHTML(text)} />
    </div>
  );
}
