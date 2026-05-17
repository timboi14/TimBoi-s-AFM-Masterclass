import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  /** Section A papers get the "Board paper skeleton" macro button. */
  paperSection?: 'A' | 'B';
}

/**
 * Board paper skeleton inserted by the toolbar macro on Section A papers.
 * Standard ACCA Section A board paper structure: headings bolded, sub-bullets
 * are list items. After insertion the caret is placed at the end of the
 * RECOMMENDATION line so the user can start dictating. One execCommand call
 * keeps Ctrl-Z behaviour as a single undo step. (Work Item 5.)
 */
const BOARD_PAPER_SKELETON_HTML = [
  '<p><b>TO:</b> Board of [Company]</p>',
  '<p><b>FROM:</b> Senior Financial Adviser</p>',
  '<p><b>SUBJECT:</b> [one-line recommendation]</p>',
  '<p><b>DATE:</b> [date]</p>',
  '<p><br></p>',
  '<p><b>EXECUTIVE SUMMARY</b></p>',
  '<ul><li>[Recommendation in one sentence — lead with it.]</li><li>[Headline figure that supports the recommendation.]</li><li>[Key risk or sensitivity the board must accept.]</li></ul>',
  '<p><b>METHODOLOGY / APPROACH</b></p>',
  '<ul><li>[Valuation framework chosen and why.]</li><li>[Key assumptions and source.]</li></ul>',
  '<p><b>NUMERICAL ANALYSIS</b></p>',
  '<ul><li>[Workings W1–W4 referenced; main figure with units.]</li><li>[Sensitivity at ±10% on the binding driver.]</li></ul>',
  '<p><b>DISCUSSION</b></p>',
  '<ul><li>[Strategic fit / non-financial factor 1.]</li><li>[Stakeholder tension — owner, regulator, supporter.]</li><li>[ESG dimension with scenario figure.]</li></ul>',
  '<p><b>RECOMMENDATION</b></p>',
].join('');

export function CBEWordProcessor({ value, onChange, paperSection }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Only set innerHTML when the prop value differs from current DOM content,
  // otherwise React's re-renders blow away the cursor on every keystroke.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const cmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };

  const insertBoardPaperSkeleton = () => {
    if (!ref.current) return;
    ref.current.focus();
    // Single execCommand → single undo step.
    document.execCommand('insertHTML', false, BOARD_PAPER_SKELETON_HTML);
    onChange(ref.current.innerHTML);
    // Place caret at end of the inserted RECOMMENDATION line (last <p>).
    const paras = ref.current.querySelectorAll('p');
    const recoP = Array.from(paras).reverse().find((p) =>
      /RECOMMENDATION/i.test(p.textContent || ''),
    );
    if (recoP) {
      const range = document.createRange();
      range.selectNodeContents(recoP);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleInput = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="cbe-word">
      <div className="cbe-word__toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onClick={() => cmd('bold')} className="cbe-word__tool" aria-label="Bold">
          <b>B</b>
        </button>
        <button type="button" onClick={() => cmd('italic')} className="cbe-word__tool" aria-label="Italic">
          <i>I</i>
        </button>
        <button type="button" onClick={() => cmd('underline')} className="cbe-word__tool" aria-label="Underline">
          <u>U</u>
        </button>
        <span className="cbe-word__sep" aria-hidden />
        <button
          type="button"
          onClick={() => cmd('insertUnorderedList')}
          className="cbe-word__tool"
          aria-label="Bulleted list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => cmd('insertOrderedList')}
          className="cbe-word__tool"
          aria-label="Numbered list"
        >
          1. List
        </button>
        <span className="cbe-word__sep" aria-hidden />
        <button type="button" onClick={() => cmd('formatBlock', 'h3')} className="cbe-word__tool" aria-label="Heading">
          H
        </button>
        <button
          type="button"
          onClick={() => cmd('formatBlock', 'p')}
          className="cbe-word__tool"
          aria-label="Paragraph"
        >
          ¶
        </button>
        <span className="cbe-word__sep" aria-hidden />
        <button type="button" onClick={() => cmd('undo')} className="cbe-word__tool" aria-label="Undo">
          ↶
        </button>
        <button type="button" onClick={() => cmd('redo')} className="cbe-word__tool" aria-label="Redo">
          ↷
        </button>
        {paperSection === 'A' && (
          <>
            <span className="cbe-word__sep" aria-hidden />
            <button
              type="button"
              onClick={insertBoardPaperSkeleton}
              className="cbe-word__tool"
              aria-label="Insert Section A board paper skeleton"
              title="Drops a TO / FROM / SUBJECT / EXEC SUMMARY / METHODOLOGY / ANALYSIS / DISCUSSION / RECOMMENDATION scaffold. One Ctrl-Z removes it."
            >
              📋 Board paper skeleton
            </button>
          </>
        )}
        <span className="cbe-word__sep" aria-hidden />
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Clear all word-processor content for this paper?')) {
              onChange('');
            }
          }}
          className="cbe-word__tool cbe-word__tool--danger"
          aria-label="Clear all content"
        >
          ✕ Clear
        </button>
      </div>
      <div
        ref={ref}
        className="cbe-word__area"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onInput={handleInput}
        onBlur={handleInput}
        aria-label="Word processor"
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
}
