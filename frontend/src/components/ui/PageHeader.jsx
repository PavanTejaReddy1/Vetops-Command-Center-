import { Breadcrumbs } from '../../layouts/Breadcrumbs';
import { cn } from '../../lib/utils/cn';

/**
 * PageHeader — every module page opens with this: breadcrumbs, title,
 * optional description, and a right-aligned action slot (buttons, filters).
 */
export function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4', className)}>
      <Breadcrumbs />
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
