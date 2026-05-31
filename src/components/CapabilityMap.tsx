import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AFM_SYLLABUS, type SyllabusCapability } from '@/data/syllabus';
import { TOPICS } from '@/data/topics';

/**
 * ACCA AFM Capability Map — every A1..E5 capability with its mapped TimBoi topic
 * and drill. Greyed rows are coverage gaps (next content sprint targets).
 *
 * Extracted from the former standalone Syllabus page so it can live inside the
 * Course hub (the syllabus → topic mapping belongs next to the course plan and
 * topic drills, not in its own tab).
 */
const LAST_ATTEMPTED_KEY = 'tba.drills.completion.v1';

interface Completion {
  doneIds: string[];
  /** map of drillId -> ISO timestamp of last attempt */
  lastAttempted?: Record<string, string>;
}

function loadCompletion(): Completion {
  if (typeof window === 'undefined') return { doneIds: [] };
  try {
    const raw = localStorage.getItem(LAST_ATTEMPTED_KEY);
    if (!raw) return { doneIds: [] };
    const parsed = JSON.parse(raw);
    return {
      doneIds: Array.isArray(parsed?.doneIds) ? parsed.doneIds : [],
      lastAttempted: parsed?.lastAttempted && typeof parsed.lastAttempted === 'object' ? parsed.lastAttempted : {},
    };
  } catch {
    return { doneIds: [] };
  }
}

function topicName(id: string | null): string {
  if (!id) return '—';
  const t = (TOPICS as Record<string, { title?: string } | undefined>)[id];
  return t?.title ?? id;
}

function lastAttemptedLabel(drillId: string | null, completion: Completion): string {
  if (!drillId) return '—';
  const iso = completion.lastAttempted?.[drillId];
  if (!iso) return 'Not yet';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Not yet';
  }
}

export function CapabilityMap() {
  const [completion, setCompletion] = useState<Completion>({ doneIds: [] });
  useEffect(() => setCompletion(loadCompletion()), []);

  const sectionPrefix = (ref: string) => ref.charAt(0);
  const grouped: Record<string, SyllabusCapability[]> = {};
  for (const row of AFM_SYLLABUS) {
    const k = sectionPrefix(row.ref);
    (grouped[k] ||= []).push(row);
  }
  const sections = Object.keys(grouped).sort();

  return (
    <div>
      {sections.map((sec) => (
        <div key={sec} className="mb-8">
          <h3 className="font-display text-xl tracking-wide uppercase text-ink mb-3">
            Section {sec}
          </h3>
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <table className="w-full text-[13.5px]" role="table">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-muted font-bold">
                <tr>
                  <th className="text-left px-3 py-2 w-16">Ref</th>
                  <th className="text-left px-3 py-2">Capability</th>
                  <th className="text-left px-3 py-2 w-40">Topic</th>
                  <th className="text-left px-3 py-2 w-32">Drill</th>
                  <th className="text-left px-3 py-2 w-36">Last attempted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {grouped[sec].map((row) => {
                  const isCovered = !!row.tbaTopicId;
                  const linkTarget = row.tbaTopicId ? `/topic/${row.tbaTopicId}` : null;
                  const drillTarget = row.tbaTopicId && row.drillId
                    ? `/topic/${row.tbaTopicId}#drills`
                    : null;
                  const rowClasses = isCovered
                    ? 'hover:bg-primary/5 focus-within:bg-primary/5'
                    : 'opacity-55';
                  return (
                    <tr key={row.ref} className={rowClasses}>
                      <td className="px-3 py-2.5 font-mono font-bold text-primary">{row.ref}</td>
                      <td className="px-3 py-2.5 text-ink">
                        {linkTarget ? (
                          <Link to={linkTarget} className="hover:text-primary focus:text-primary outline-none focus-visible:underline">
                            {row.capability}
                          </Link>
                        ) : (
                          <span>{row.capability}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {isCovered ? (
                          <span className="text-muted">{topicName(row.tbaTopicId)}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] uppercase tracking-wider font-bold bg-slate-100 text-muted border border-border">
                            Coverage pending
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {drillTarget ? (
                          <Link
                            to={drillTarget}
                            className="inline-flex items-center gap-1 text-primary font-bold hover:underline focus-visible:underline"
                          >
                            <i className="fa-solid fa-play text-[10px]" aria-hidden /> {row.drillId}
                          </Link>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted">{lastAttemptedLabel(row.drillId, completion)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
