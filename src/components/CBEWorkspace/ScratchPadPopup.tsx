import { useEffect, useRef, useState } from 'react';
import { DraggablePopup } from './DraggablePopup';
import { useCBE } from './cbe-context';
import { loadScratch, saveScratch } from '@/lib/cbe-tools-storage';

export function ScratchPadPopup() {
  const { closePopup, guestId, paperId } = useCBE();
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(() => loadScratch(guestId, paperId));

  // Re-hydrate if the paper/guest changes underneath an open pad.
  useEffect(() => {
    setText(loadScratch(guestId, paperId));
  }, [guestId, paperId]);

  const update = (val: string) => {
    setText(val);
    saveScratch(guestId, paperId, val);
  };

  const focusTa = () => taRef.current?.focus();

  const cut = () => { focusTa(); document.execCommand('cut'); };
  const copy = () => { focusTa(); document.execCommand('copy'); };
  const paste = async () => {
    focusTa();
    try {
      const clip = await navigator.clipboard.readText();
      const ta = taRef.current;
      if (!ta) return;
      const s = ta.selectionStart ?? ta.value.length;
      const e = ta.selectionEnd ?? ta.value.length;
      const next = ta.value.slice(0, s) + clip + ta.value.slice(e);
      update(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + clip.length;
      });
    } catch {
      document.execCommand('paste');
    }
  };
  const undo = () => { focusTa(); document.execCommand('undo'); };
  const redo = () => { focusTa(); document.execCommand('redo'); };

  return (
    <DraggablePopup
      id="scratchpad"
      title="✏ Scratch Pad"
      onClose={() => closePopup('scratchpad')}
      width={600}
      height={400}
      resizable
    >
      <div className="cbe-scratch">
        <div className="cbe-scratch__toolbar" role="toolbar" aria-label="Scratch pad">
          <button type="button" className="cbe-tool-btn" onClick={cut}>✂ Cut</button>
          <button type="button" className="cbe-tool-btn" onClick={copy}>⧉ Copy</button>
          <button type="button" className="cbe-tool-btn" onClick={paste}>📋 Paste</button>
          <button type="button" className="cbe-tool-btn" onClick={undo}>↶ Undo</button>
          <button type="button" className="cbe-tool-btn" onClick={redo}>↷ Redo</button>
        </div>
        <textarea
          ref={taRef}
          className="cbe-scratch__area"
          value={text}
          onChange={(e) => update(e.target.value)}
          placeholder="Scratch workings here — saved automatically, separate from your answer."
          aria-label="Scratch pad"
        />
      </div>
    </DraggablePopup>
  );
}
