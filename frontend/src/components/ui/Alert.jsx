import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

const VARIANTS = {
  info: { icon: Info, wrap: 'bg-signal-blue-soft border-signal-blue/30 text-signal-blue-deep' },
  success: { icon: CheckCircle2, wrap: 'bg-signal-success-soft border-signal-success/30 text-signal-success-deep' },
  warning: { icon: AlertTriangle, wrap: 'bg-signal-amber-soft border-signal-amber/30 text-signal-amber-deep' },
  error: { icon: XCircle, wrap: 'bg-signal-rose-soft border-signal-rose/30 text-signal-rose-deep' },
  critical: { icon: XCircle, wrap: 'bg-signal-rose-soft border-signal-rose/30 text-signal-rose-deep' },
};

/** Alert — inline banner for page-level or section-level messages. */
export function Alert({ variant = 'info', title, children, className, action }) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border px-4 py-3', config.wrap, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 text-sm">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5 opacity-90')}>{children}</div>}
      </div>
      {action}
    </div>
  );
}
