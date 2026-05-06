/**
 * Generic, name-free source labels for pitfall / technique entries.
 * Internal IDs stay as-is for compatibility; only the visible label changes.
 */

export type SourceId = 'examiner' | 'mower' | 'acowtancy' | 'tba';

export const SOURCE_LABELS: Record<SourceId, { label: string; tooltip: string; icon: string }> = {
  examiner: { label: 'ACCA Examiner', tooltip: 'Flagged in published ACCA examiner reports', icon: 'fa-file-signature' },
  mower:    { label: 'Coach',         tooltip: 'Distilled from established AFM coaching technique', icon: 'fa-chalkboard-user' },
  acowtancy:{ label: 'External',      tooltip: 'Drawn from external AFM tuition resources', icon: 'fa-graduation-cap' },
  tba:      { label: 'TBA',           tooltip: 'TimBoi\'s Academy original', icon: 'fa-shield-halved' },
};
