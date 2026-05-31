/**
 * Highlight persistence for the CBE panes.
 *
 * The bionic Question Reference panel is read-only and React-rendered, so we
 * cannot store highlights in its innerHTML. Instead we record each highlight as
 * absolute character offsets into the panel's text plus a colour, persist that
 * to localStorage, and re-apply by wrapping the matching text nodes in <mark>
 * on mount.
 *
 * GUARDRAIL (spec §13): we never replace innerHTML or strip <b>/<strong>
 * (bionic) wrappers — we only wrap text-node sub-ranges in <mark>, which leaves
 * the bionic bold runs intact.
 */

export interface StoredHighlight {
  start: number;
  end: number;
  color: string;
}

/** Absolute character offset of (node, offset) within container's text. */
function absoluteOffset(container: HTMLElement, node: Node, offset: number): number {
  const r = document.createRange();
  r.selectNodeContents(container);
  try {
    r.setEnd(node, offset);
  } catch {
    return 0;
  }
  return r.toString().length;
}

/** Serialise the current selection (if inside container) to char offsets. */
export function serializeRange(container: HTMLElement, range: Range): StoredHighlight | null {
  const start = absoluteOffset(container, range.startContainer, range.startOffset);
  const end = absoluteOffset(container, range.endContainer, range.endOffset);
  if (end <= start) return null;
  return { start, end, color: '' };
}

/** Build a DOM Range spanning [start,end) chars of container. */
export function rangeFromOffsets(container: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let startNode: Text | null = null;
  let startOff = 0;
  let endNode: Text | null = null;
  let endOff = 0;
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const text = n as Text;
    const len = text.data.length;
    if (!startNode && start < pos + len) {
      startNode = text;
      startOff = Math.max(0, start - pos);
    }
    if (end <= pos + len) {
      endNode = text;
      endOff = Math.max(0, end - pos);
      break;
    }
    pos += len;
  }
  if (!startNode || !endNode) return null;
  const range = document.createRange();
  try {
    range.setStart(startNode, startOff);
    range.setEnd(endNode, endOff);
  } catch {
    return null;
  }
  return range;
}

/**
 * Wrap every text-node segment intersecting `range` in its own
 * <mark data-cbe-hl> so the highlight survives across element boundaries
 * (e.g. bionic <b> runs) without surroundContents throwing.
 */
export function wrapRange(range: Range, color: string): void {
  if (range.collapsed) return;
  const root = range.commonAncestorContainer;
  const textNodes: Text[] = [];
  if (root.nodeType === Node.TEXT_NODE) {
    textNodes.push(root as Text);
  } else {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      if (range.intersectsNode(n)) textNodes.push(n as Text);
    }
  }
  for (const textNode of textNodes) {
    // Skip nodes already inside one of our highlight marks.
    if ((textNode.parentElement as HTMLElement | null)?.dataset?.cbeHl) continue;
    const seg = document.createRange();
    seg.selectNodeContents(textNode);
    if (textNode === range.startContainer) seg.setStart(textNode, range.startOffset);
    if (textNode === range.endContainer) seg.setEnd(textNode, range.endOffset);
    if (seg.collapsed) continue;
    const mark = document.createElement('mark');
    mark.style.background = color;
    mark.dataset.cbeHl = '1';
    try {
      seg.surroundContents(mark);
    } catch {
      /* selection split an element awkwardly — skip this segment */
    }
  }
}

/** Remove all our highlight marks from a container, restoring plain text. */
export function clearHighlightMarks(container: HTMLElement): void {
  const marks = container.querySelectorAll('mark[data-cbe-hl]');
  marks.forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  });
}

/** Re-apply a saved set of highlights to a freshly-rendered container. */
export function applyStoredHighlights(container: HTMLElement, highlights: StoredHighlight[]): void {
  clearHighlightMarks(container);
  // Apply longest-last so overlaps don't disturb earlier offset maths.
  for (const h of [...highlights].sort((a, b) => a.start - b.start)) {
    const range = rangeFromOffsets(container, h.start, h.end);
    if (range) wrapRange(range, h.color);
  }
}
