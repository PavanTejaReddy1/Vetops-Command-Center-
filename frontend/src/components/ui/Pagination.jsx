import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

/**
 * Pagination — page controls for tables and lists.
 * Purely presentational: parent owns page state and slices its own data.
 */
export function Pagination({ page, pageCount, totalItems, pageSize, onPageChange }) {
  if (pageCount <= 0) return null;

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 text-sm text-ink-muted sm:flex-row">
      <span>
        Showing <span className="font-medium text-ink">{rangeStart}</span>–
        <span className="font-medium text-ink">{rangeEnd}</span> of{' '}
        <span className="font-medium text-ink">{totalItems}</span>
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-strong text-ink disabled:opacity-40 hover:bg-canvas"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: pageCount }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis-' + p);
            acc.push(p);
            return acc;
          }, [])
          .map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="px-1 text-ink-faint">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium',
                  p === page ? 'bg-brand-500 text-white' : 'text-ink hover:bg-canvas'
                )}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-strong text-ink disabled:opacity-40 hover:bg-canvas"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
