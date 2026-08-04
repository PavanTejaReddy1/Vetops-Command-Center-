import { cn } from '../../lib/utils/cn';

function Shimmer({ className }) {
  return <div className={cn('animate-breathe rounded-md bg-border', className)} />;
}

/**
 * LoadingSkeleton — placeholder shapes shown while data is (or would be)
 * loading. `variant` picks a layout that matches the content it stands in
 * for, so pages don't hand-roll skeleton markup.
 */
export function LoadingSkeleton({ variant = 'card', rows = 4 }) {
  if (variant === 'table') {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex gap-4 border-b border-border bg-canvas px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 border-b border-border px-4 py-3.5 last:border-0">
            {Array.from({ length: 5 }).map((_, c) => (
              <Shimmer key={c} className="h-3.5 w-20" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'kpi') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-6 w-16" />
            <Shimmer className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
            <Shimmer className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3 w-1/3" />
              <Shimmer className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default: card
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <Shimmer className="mb-3 h-4 w-1/3" />
      <Shimmer className="mb-2 h-3 w-full" />
      <Shimmer className="h-3 w-2/3" />
    </div>
  );
}
