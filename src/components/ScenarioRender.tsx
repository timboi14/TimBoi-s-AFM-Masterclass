import type { CSSProperties } from 'react';
import { Cite, type CiteSource } from './Cite';

/**
 * Token-replacing renderer for scenario prose strings.
 *
 * Source-of-truth scenarios are stored as plain strings in
 * src/data/pastpapers/papers.ts. To embed inline source citations
 * without rewriting that file as JSX, scenario text uses the token:
 *
 *   {{cite:source|paper|note:label}}
 *
 *   - source = qpack | acca | kaplan | examiner
 *   - paper  = display name (e.g. "Lough Co Sep/Dec 2022")
 *   - note   = source-locator (e.g. "Note 3 — FX rates")
 *   - label  = the visible text (the actual number / phrase)
 *
 * The renderer splits the input on these tokens, leaves the surrounding
 * prose untouched, and renders each match as a <Cite> with dotted
 * underline + tooltip on hover/focus. Returns a React fragment
 * suitable for rendering inside <p>.
 *
 * Work Item 13 / Fix 3.
 */
const RX = /\{\{cite:(qpack|acca|kaplan|examiner)\|([^|]+)\|([^:]+):([^}]+)\}\}/g;

export function ScenarioRender({ text, style }: { text: string; style?: CSSProperties }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(RX)) {
    const [whole, source, paper, note, label] = m;
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    out.push(
      <Cite key={`c${key++}`} source={source as CiteSource} paper={paper} note={note}>
        {label}
      </Cite>,
    );
    last = idx + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <span style={style}>{out}</span>;
}

/**
 * Heuristic: returns true if `text` contains at least one {{cite:...}}
 * token, so callers can decide between the legacy renderer (e.g. the
 * bionic HTML inserter) and the citation-aware one.
 */
export function hasCiteTokens(text: string): boolean {
  return /\{\{cite:/i.test(text);
}
