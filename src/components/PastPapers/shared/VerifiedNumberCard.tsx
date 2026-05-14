import type { VerifiedNumber } from '@/data/pastpapers/schema';
import { SourceBadge } from './SourceBadge';

interface Props { number: VerifiedNumber; }

export function VerifiedNumberCard({ number }: Props) {
  return (
    <div className="verified-card">
      <div className="verified-card__value">{number.value}</div>
      <div className="verified-card__desc">{number.description}</div>
      <SourceBadge source={number.source} compact />
    </div>
  );
}
