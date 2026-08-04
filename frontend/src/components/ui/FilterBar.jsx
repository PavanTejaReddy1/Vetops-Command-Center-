import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

/**
 * FilterBar — a row of lightweight dropdown filters, driven by a config
 * array so list pages can declare filters without hand-building selects.
 *
 * filters: [{ id, label, value, options: [{label, value}], onChange }]
 */
export function FilterBar({ filters = [], onClearAll, className }) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== 'all');

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="h-9 appearance-none rounded-md border border-border-strong bg-surface pl-3 pr-8 text-sm text-ink focus:border-brand-500 focus:outline-none"
            aria-label={filter.label}
          >
            <option value="all">{filter.label}: All</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {filter.label}: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
        </div>
      ))}

      {hasActiveFilters && onClearAll && (
        <button onClick={onClearAll} className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Clear filters
        </button>
      )}
    </div>
  );
}
