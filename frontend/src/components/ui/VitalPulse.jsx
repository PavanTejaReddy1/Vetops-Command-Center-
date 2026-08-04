import { cn } from '../../lib/utils/cn';

const TONE_STROKE = {
  brand: 'stroke-brand-500',
  success: 'stroke-signal-success',
  amber: 'stroke-signal-amber',
  rose: 'stroke-signal-rose',
  blue: 'stroke-signal-blue',
  muted: 'stroke-ink-faint',
};

/**
 * VitalPulse — the app's signature motif.
 * A minimal heartbeat-line sparkline, echoing a vitals monitor to tie the
 * "operational health" concept back to the veterinary subject matter.
 * Used under KPI cards as a trend line, and (animated) as a loading cue.
 */
export function VitalPulse({ data = [], tone = 'brand', className, animated = false }) {
  const width = 120;
  const height = 32;
  const padding = 3;

  const points = buildPoints(data, width, height, padding);
  const path = points.length ? `M${points.map((p) => `${p.x},${p.y}`).join(' L')}` : '';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-8 w-full overflow-visible', className)}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {path && (
        <path
          d={path}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(TONE_STROKE[tone] ?? TONE_STROKE.brand, animated && 'animate-pulse-line')}
          strokeDasharray={animated ? 240 : undefined}
        />
      )}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="2.5"
          className={cn(TONE_STROKE[tone] ?? TONE_STROKE.brand, 'fill-current')}
        />
      )}
    </svg>
  );
}

function buildPoints(data, width, height, padding) {
  if (!data || data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = (width - padding * 2) / (data.length - 1 || 1);

  return data.map((value, i) => {
    const x = padding + step * i;
    const normalized = (value - min) / range;
    const y = height - padding - normalized * (height - padding * 2);
    return { x, y };
  });
}

/** Standalone animated loading pulse — used inside skeletons and buttons. */
export function VitalPulseLoader({ className, tone = 'brand' }) {
  return (
    <svg viewBox="0 0 120 32" className={cn('h-6 w-20', className)} aria-hidden="true">
      <path
        d="M2 16 L28 16 L36 4 L46 28 L54 16 L118 16"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="240"
        className={cn(TONE_STROKE[tone] ?? TONE_STROKE.brand, 'animate-pulse-line')}
      />
    </svg>
  );
}
