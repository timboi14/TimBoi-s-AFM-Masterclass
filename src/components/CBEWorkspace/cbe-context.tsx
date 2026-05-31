import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  serializeRange,
  wrapRange,
  type StoredHighlight,
} from '@/lib/cbe-highlight';
import { loadHighlights, saveHighlights, loadFlag, saveFlag } from '@/lib/cbe-tools-storage';

export type PopupId = 'calculator' | 'scratchpad' | 'symbol' | 'navigator';
type EditorKind = 'word' | 'sheet';

export interface CBEContextValue {
  paperId: string;
  guestId: string;
  /* popups */
  isOpen: (id: PopupId) => boolean;
  openPopup: (id: PopupId) => void;
  closePopup: (id: PopupId) => void;
  togglePopup: (id: PopupId) => void;
  closeAll: () => void;
  /* z-index */
  zOf: (id: PopupId) => number;
  bringToFront: (id: PopupId) => void;
  /* editor wiring */
  registerWordEditor: (el: HTMLElement | null) => void;
  registerScenarioPanel: (el: HTMLElement | null) => void;
  reportFocus: (el: HTMLElement, kind: EditorKind) => void;
  insertAtCaret: (text: string) => void;
  /* highlight + strike */
  highlightColor: string;
  setHighlightColor: (c: string) => void;
  applyHighlight: () => void;
  applyStrikethrough: () => void;
  /* flag */
  flagged: boolean;
  toggleFlag: () => void;
}

const noop = () => {};
const DEFAULT: CBEContextValue = {
  paperId: '',
  guestId: '',
  isOpen: () => false,
  openPopup: noop,
  closePopup: noop,
  togglePopup: noop,
  closeAll: noop,
  zOf: () => 50,
  bringToFront: noop,
  registerWordEditor: noop,
  registerScenarioPanel: noop,
  reportFocus: noop,
  insertAtCaret: noop,
  highlightColor: '#FFFF00',
  setHighlightColor: noop,
  applyHighlight: noop,
  applyStrikethrough: noop,
  flagged: false,
  toggleFlag: noop,
};

const Ctx = createContext<CBEContextValue>(DEFAULT);
export const useCBE = () => useContext(Ctx);

/** Fire a synthetic input event so a contentEditable's React onInput saves. */
function notifyInput(el: HTMLElement) {
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

export function CBEProvider({
  paperId,
  guestId,
  children,
}: {
  paperId: string;
  guestId: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState<Set<PopupId>>(() => new Set());
  const [z, setZ] = useState<Record<string, number>>({});
  const topZ = useRef(50);
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [flagged, setFlagged] = useState(() => loadFlag(paperId));

  const wordEditorRef = useRef<HTMLElement | null>(null);
  const scenarioPanelRef = useRef<HTMLElement | null>(null);
  const lastFocus = useRef<{ el: HTMLElement; kind: EditorKind } | null>(null);

  const bringToFront = useCallback((id: PopupId) => {
    topZ.current += 1;
    setZ((prev) => ({ ...prev, [id]: topZ.current }));
  }, []);

  const openPopup = useCallback(
    (id: PopupId) => {
      setOpen((prev) => new Set(prev).add(id));
      bringToFront(id);
    },
    [bringToFront],
  );
  const closePopup = useCallback((id: PopupId) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  const togglePopup = useCallback(
    (id: PopupId) => {
      setOpen((prev) => {
        if (prev.has(id)) {
          const next = new Set(prev);
          next.delete(id);
          return next;
        }
        const next = new Set(prev).add(id);
        return next;
      });
      bringToFront(id);
    },
    [bringToFront],
  );
  const closeAll = useCallback(() => setOpen(new Set()), []);

  const insertAtCaret = useCallback((text: string) => {
    let target = lastFocus.current ?? (wordEditorRef.current ? { el: wordEditorRef.current, kind: 'word' as const } : null);
    // If the last-focused cell input has unmounted (the sheet commits on blur),
    // fall back to the word processor so the symbol still lands somewhere.
    if (target && !target.el.isConnected) {
      target = wordEditorRef.current ? { el: wordEditorRef.current, kind: 'word' } : null;
    }
    if (!target) return;
    target.el.focus();
    if (target.kind === 'sheet' && target.el instanceof HTMLInputElement) {
      const input = target.el;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      input.setRangeText(text, start, end, 'end');
      notifyInput(input);
    } else {
      // contentEditable
      document.execCommand('insertText', false, text);
      if (wordEditorRef.current) notifyInput(wordEditorRef.current);
    }
  }, []);

  const applyHighlight = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const inWord = wordEditorRef.current?.contains(range.commonAncestorContainer);
    const inScenario = scenarioPanelRef.current?.contains(range.commonAncestorContainer);
    if (inWord && wordEditorRef.current) {
      wrapRange(range, highlightColor);
      notifyInput(wordEditorRef.current);
      sel.removeAllRanges();
    } else if (inScenario && scenarioPanelRef.current) {
      const serialised = serializeRange(scenarioPanelRef.current, range);
      wrapRange(range, highlightColor);
      if (serialised) {
        const entry: StoredHighlight = { ...serialised, color: highlightColor };
        saveHighlights(guestId, paperId, [...loadHighlights(guestId, paperId), entry]);
      }
      sel.removeAllRanges();
    }
  }, [highlightColor, guestId, paperId]);

  const applyStrikethrough = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (wordEditorRef.current?.contains(range.commonAncestorContainer)) {
      wordEditorRef.current.focus();
      document.execCommand('strikeThrough');
      notifyInput(wordEditorRef.current);
    }
  }, []);

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = !prev;
      saveFlag(paperId, next);
      return next;
    });
  }, [paperId]);

  const value = useMemo<CBEContextValue>(
    () => ({
      paperId,
      guestId,
      isOpen: (id) => open.has(id),
      openPopup,
      closePopup,
      togglePopup,
      closeAll,
      zOf: (id) => z[id] ?? 50,
      bringToFront,
      registerWordEditor: (el) => {
        wordEditorRef.current = el;
      },
      registerScenarioPanel: (el) => {
        scenarioPanelRef.current = el;
      },
      reportFocus: (el, kind) => {
        lastFocus.current = { el, kind };
      },
      insertAtCaret,
      highlightColor,
      setHighlightColor,
      applyHighlight,
      applyStrikethrough,
      flagged,
      toggleFlag,
    }),
    [
      paperId, guestId, open, z, openPopup, closePopup, togglePopup, closeAll,
      bringToFront, insertAtCaret, highlightColor, applyHighlight, applyStrikethrough,
      flagged, toggleFlag,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
