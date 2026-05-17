import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

/**
 * ACCA-CBE-style word-processor pane. Plain contentEditable with a small
 * toolbar (B / I / U / lists / undo / redo / clear) using execCommand.
 * execCommand is deprecated but still works in every browser shipping
 * today, and matches the ACCA CBE editor's spartan feature set.
 */
export function CBEWordProcessor({ value, onChange }: Props) {
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
