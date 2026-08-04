import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

/**
 * EmptyState — shown when a list/table has no data (or a module has no
 * content yet). The interface should always tell the person what to do
 * next, so `action` is a first-class slot, not an afterthought.
 */
export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong px-6 py-14 text-center', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-ink-faint">
        <Icon className="h-5 w-5" />
      </div>
      <div className="max-w-sm">
        <p className="font-display text-sm font-semibold text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
