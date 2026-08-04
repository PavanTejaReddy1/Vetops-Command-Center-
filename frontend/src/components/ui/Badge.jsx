import { cn } from '../../lib/utils/cn';

const VARIANTS = {
  neutral: 'bg-canvas text-ink-muted border border-border',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
  success: 'bg-signal-success-soft text-signal-success-deep',
  amber: 'bg-signal-amber-soft text-signal-amber-deep',
  rose: 'bg-signal-rose-soft text-signal-rose-deep',
  blue: 'bg-signal-blue-soft text-signal-blue-deep',
};

/** Generic label pill — for tags, categories, and counts. For workflow/task state, prefer StatusBadge. */
export function Badge({ children, variant = 'neutral', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
