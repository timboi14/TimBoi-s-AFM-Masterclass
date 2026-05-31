import { useEffect, useRef, useState } from 'react';
import { useCBE } from './cbe-context';

interface Props {
  value: string;
  onChange: (html: string) => void;
  /** Section A papers get the "Board paper skeleton" macro button. */
  paperSection?: 'A' | 'B';
}

/**
 * Board paper skeleton inserted by the toolbar macro on Section A papers.
 * One execCommand call keeps Ctrl-Z behaviour as a single undo step.
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
  const { registerWordEditor, reportFocus } = useCBE();
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });

  useEffect(() => {
    registerWordEditor(ref.current);
    return () => registerWordEditor(null);
  }, [registerWordEditor]);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const sync = () => { if (ref.current) onChange(ref.current.innerHTML); };

  const cmd = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    sync();
  };

  const insertHTML = (html: string) => {
    ref.current?.focus();
    document.execCommand('insertHTML', false, html);
    sync();
  };

  const paste = async () => {
    ref.current?.focus();
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
      sync();
    } catch {
      document.execCommand('paste');
      sync();
    }
  };

  const insertBoardPaperSkeleton = () => {
    if (!ref.current) return;
    ref.current.focus();
    document.execCommand('insertHTML', false, BOARD_PAPER_SKELETON_HTML);
    onChange(ref.current.innerHTML);
    const paras = ref.current.querySelectorAll('p');
    const recoP = Array.from(paras).reverse().find((p) => /RECOMMENDATION/i.test(p.textContent || ''));
    if (recoP) {
      const range = document.createRange();
      range.selectNodeContents(recoP);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const runReplaceAll = () => {
    if (!ref.current || !findText) return;
    const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);
    const targets: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) targets.push(n as Text);
    const needle = findText.toLowerCase();
    for (const t of targets) {
      if (t.data.toLowerCase().includes(needle)) {
        // case-insensitive global replace preserving nothing fancy
        const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        t.data = t.data.replace(re, replaceText);
      }
    }
    sync();
  };

  const insertTable = (rows: number, cols: number) => {
    const cell = '<td style="border:1px solid #999;padding:4px;min-width:40px">&nbsp;</td>';
    const row = `<tr>${cell.repeat(cols)}</tr>`;
    insertHTML(`<table style="border-collapse:collapse;margin:6px 0">${row.repeat(rows)}</table><p><br></p>`);
    setShowTable(false);
  };

  const newDoc = () => {
    if (window.confirm('Start a new document? Current content is cleared.')) onChange('');
  };

  const T = ({ on, label, children, title }: { on: () => void; label: string; children: React.ReactNode; title?: string }) => (
    <button type="button" onClick={on} className="cbe-word__tool" aria-label={label} title={title ?? label}>
      {children}
    </button>
  );
  const Sep = () => <span className="cbe-word__sep" aria-hidden />;

  return (
    <div className="cbe-word">
      <div className="cbe-word__toolbar cbe-word__toolbar--row1" role="toolbar" aria-label="Formatting row 1">
        <T on={newDoc} label="New document">📄</T>
        <T on={() => cmd('cut')} label="Cut">✂</T>
        <T on={() => cmd('copy')} label="Copy">⧉</T>
        <T on={paste} label="Paste">📋</T>
        <Sep />
        <T on={() => cmd('undo')} label="Undo">↶</T>
        <T on={() => cmd('redo')} label="Redo">↷</T>
        <T on={() => setShowFind((s) => !s)} label="Find and replace">🔍</T>
        <Sep />
        <T on={() => cmd('bold')} label="Bold"><b>B</b></T>
        <T on={() => cmd('italic')} label="Italic"><i>I</i></T>
        <T on={() => cmd('underline')} label="Underline"><u>U</u></T>
        <T on={() => cmd('strikeThrough')} label="Strikethrough"><s>S</s></T>
        <T on={() => cmd('subscript')} label="Subscript">x₂</T>
        <T on={() => cmd('superscript')} label="Superscript">x²</T>
        <T on={() => cmd('removeFormat')} label="Clear formatting" title="Clear formatting">T̶ₓ</T>
      </div>

      {showFind && (
        <div className="cbe-word__find">
          <input value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find" aria-label="Find" />
          <input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace with" aria-label="Replace" />
          <button type="button" className="cbe-btn cbe-btn--primary" onClick={runReplaceAll}>Replace all</button>
          <button type="button" className="cbe-btn" onClick={() => setShowFind(false)}>Close</button>
        </div>
      )}

      <div className="cbe-word__toolbar cbe-word__toolbar--row2" role="toolbar" aria-label="Formatting row 2">
        <select
          className="cbe-word__select"
          aria-label="Paragraph style"
          defaultValue="p"
          onChange={(e) => cmd('formatBlock', e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <span className="cbe-word__tablewrap">
          <T on={() => setShowTable((s) => !s)} label="Insert table">▦ Table ▾</T>
          {showTable && (
            <div className="cbe-word__tablepick" onMouseLeave={() => setTableHover({ r: 0, c: 0 })}>
              {Array.from({ length: 5 }, (_, r) => (
                <div key={r} className="cbe-word__tablepick-row">
                  {Array.from({ length: 5 }, (_, c) => (
                    <span
                      key={c}
                      className={`cbe-word__tablepick-cell ${r < tableHover.r && c < tableHover.c ? 'is-on' : ''}`}
                      onMouseEnter={() => setTableHover({ r: r + 1, c: c + 1 })}
                      onClick={() => insertTable(r + 1, c + 1)}
                    />
                  ))}
                </div>
              ))}
              <div className="cbe-word__tablepick-label">{tableHover.r} × {tableHover.c}</div>
            </div>
          )}
        </span>
        <Sep />
        <T on={() => cmd('justifyLeft')} label="Align left">⯇</T>
        <T on={() => cmd('justifyCenter')} label="Align centre">≡</T>
        <T on={() => cmd('justifyRight')} label="Align right">⯈</T>
        <T on={() => cmd('justifyFull')} label="Justify">▤</T>
        <Sep />
        <T on={() => cmd('insertUnorderedList')} label="Bulleted list">• List</T>
        <T on={() => cmd('insertOrderedList')} label="Numbered list">1. List</T>
        <T on={() => cmd('outdent')} label="Outdent">⇤</T>
        <T on={() => cmd('indent')} label="Indent">⇥</T>
        {paperSection === 'A' && (
          <>
            <Sep />
            <button
              type="button"
              onClick={insertBoardPaperSkeleton}
              className="cbe-word__tool"
              aria-label="Insert Section A board paper skeleton"
              title="Drops a TO / FROM / SUBJECT / EXEC SUMMARY / METHODOLOGY / ANALYSIS / DISCUSSION / RECOMMENDATION scaffold."
            >
              📋 Board paper skeleton
            </button>
          </>
        )}
        <Sep />
        <button
          type="button"
          onClick={() => { if (window.confirm('Clear all word-processor content for this paper?')) onChange(''); }}
          className="cbe-word__tool cbe-word__tool--danger"
          aria-label="Clear all content"
        >
          ✕ Clear
        </button>
      </div>

      <div
        ref={ref}
        className="cbe-word__area wp-editor"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onInput={sync}
        onBlur={sync}
        onFocus={() => ref.current && reportFocus(ref.current, 'word')}
        aria-label="Word processor"
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
}
