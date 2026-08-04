import { cn } from '../../lib/utils/cn';

/**
 * StatusBadge — a dot + label indicator for operational states
 * (appointments, tasks, staff shift status). Central map here means a new
 * status only needs to be registered once to render consistently everywhere.
 */
const STATUS_MAP = {
  // appointment / case states
  scheduled: { label: 'Scheduled', dot: 'bg-signal-blue', text: 'text-signal-blue-deep', bg: 'bg-signal-blue-soft' },
  waiting: { label: 'Waiting', dot: 'bg-signal-amber', text: 'text-signal-amber-deep', bg: 'bg-signal-amber-soft' },
  'in-progress': { label: 'In Progress', dot: 'bg-brand-500', text: 'text-brand-700', bg: 'bg-brand-50' },
  delayed: { label: 'Delayed', dot: 'bg-signal-amber', text: 'text-signal-amber-deep', bg: 'bg-signal-amber-soft' },
  critical: { label: 'Critical', dot: 'bg-signal-rose animate-breathe', text: 'text-signal-rose-deep', bg: 'bg-signal-rose-soft' },
  completed: { label: 'Completed', dot: 'bg-signal-success', text: 'text-signal-success-deep', bg: 'bg-signal-success-soft' },

  // task states
  open: { label: 'Open', dot: 'bg-ink-faint', text: 'text-ink-muted', bg: 'bg-canvas' },
  blocked: { label: 'Blocked', dot: 'bg-signal-rose', text: 'text-signal-rose-deep', bg: 'bg-signal-rose-soft' },

  // staff shift states
  'on-shift': { label: 'On Shift', dot: 'bg-signal-success', text: 'text-signal-success-deep', bg: 'bg-signal-success-soft' },
  'on-break': { label: 'On Break', dot: 'bg-signal-amber', text: 'text-signal-amber-deep', bg: 'bg-signal-amber-soft' },
  'off-shift': { label: 'Off Shift', dot: 'bg-ink-faint', text: 'text-ink-muted', bg: 'bg-canvas' },
};

export function StatusBadge({ status, className }) {
  const config = STATUS_MAP[status] ?? { label: status, dot: 'bg-ink-faint', text: 'text-ink-muted', bg: 'bg-canvas' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
