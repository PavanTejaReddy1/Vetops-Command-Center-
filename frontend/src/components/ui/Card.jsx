import { cn } from '../../lib/utils/cn';

/**
 * Base Card — the atomic surface unit of the app. KpiCard, tables, and
 * form panels all wrap this rather than redefining border/radius/shadow.
 */
export function Card({ className, children, padded = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface shadow-card',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-display text-sm font-semibold text-ink', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('mt-1 text-sm text-ink-muted', className)} {...props}>
      {children}
    </p>
  );
}
