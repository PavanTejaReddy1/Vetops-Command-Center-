import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { VitalPulse } from './VitalPulse';
import { cn } from '../../lib/utils/cn';
import { formatNumber } from '../../lib/utils/formatters';

const TONE_TEXT = {
  brand: 'text-brand-600',
  success: 'text-signal-success',
  amber: 'text-signal-amber-deep',
  rose: 'text-signal-rose',
  blue: 'text-signal-blue',
};

/**
 * KPI Card — the primary metric tile used on the Dashboard and Reports.
 * `tone` drives the pulse line color; `trend` feeds the VitalPulse sparkline.
 */
export function KpiCard({ label, value, unit = '', delta, deltaDirection = 'up', trend = [], tone = 'brand' }) {
  const isPositiveGood = deltaDirection === 'up';
  const DeltaIcon = deltaDirection === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="flex flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</span>

      <div className="flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
            {formatNumber(value)}
          </span>
          {unit && <span className="text-sm text-ink-muted">{unit}</span>}
        </div>

        {typeof delta === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
              isPositiveGood ? 'bg-signal-success-soft text-signal-success-deep' : 'bg-signal-rose-soft text-signal-rose-deep'
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            {Math.abs(delta)}
            {unit === '%' ? 'pt' : ''}
          </span>
        )}
      </div>

      <VitalPulse data={trend} tone={tone} className={TONE_TEXT[tone]} />
    </Card>
  );
}
