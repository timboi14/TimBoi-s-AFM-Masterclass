import { useCallback, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { useCBE, type PopupId } from './cbe-context';

interface Props {
  id: PopupId;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  height?: number;
  /** Show a bottom-right resize handle (Scratch Pad). */
  resizable?: boolean;
  className?: string;
  /** Override the initial top (px). Used by the calculator so it spawns below the ribbon. */
  spawnTop?: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
}

/**
 * Shared floating-popup chrome for the CBE tools. Draggable by its title bar
 * (pointer-capture), clamped to the viewport, brought to front on any pointer
 * down, optional bottom-right resize handle. Spawns centred.
 */
export function DraggablePopup({ id, title, onClose, children, width = 360, height, resizable, className, spawnTop }: Props) {
  const { zOf, bringToFront } = useCBE();
  const [pos, setPos] = useState(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      x: Math.max(8, (vw - width) / 2),
      y: spawnTop ?? Math.max(8, (vh - (height ?? 420)) / 3),
    };
  });
  const [size, setSize] = useState({ w: width, h: height });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);

  const onTitlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      // Don't start a drag (or capture the pointer) when pressing the close button
      // or any control in the bar — let its click fire normally.
      if ((e.target as HTMLElement).closest('button')) return;
      bringToFront(id);
      drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [bringToFront, id, pos.x, pos.y],
  );

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (drag.current) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPos({
        x: clamp(e.clientX - drag.current.dx, 8 - (size.w ?? 360) + 40, vw - 40),
        y: clamp(e.clientY - drag.current.dy, 8, vh - 36),
      });
    } else if (resize.current) {
      const r = resize.current;
      setSize({
        w: clamp(r.sw + (e.clientX - r.sx), 260, window.innerWidth - 40),
        h: clamp(r.sh + (e.clientY - r.sy), 200, window.innerHeight - 40),
      });
    }
  }, [size.w]);

  const onPointerUp = useCallback((e: ReactPointerEvent) => {
    drag.current = null;
    resize.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
  }, []);

  const onResizePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      e.stopPropagation();
      bringToFront(id);
      resize.current = { sx: e.clientX, sy: e.clientY, sw: size.w ?? 360, sh: size.h ?? 400 };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [bringToFront, id, size.w, size.h],
  );

  return (
    <div
      className={`cbe-popup ${className ?? ''}`}
      role="dialog"
      aria-label={typeof title === 'string' ? title : id}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: zOf(id),
      }}
      onPointerDownCapture={() => bringToFront(id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="cbe-popup__bar" onPointerDown={onTitlePointerDown}>
        <span className="cbe-popup__title">{title}</span>
        <button
          type="button"
          className="cbe-popup__close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="cbe-popup__body">{children}</div>
      {resizable && (
        <div
          className="cbe-popup__resize"
          onPointerDown={onResizePointerDown}
          aria-hidden
          title="Resize"
        />
      )}
    </div>
  );
}
