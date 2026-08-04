import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

/**
 * SearchBar — controlled search input used in the topbar and on list pages.
 */
export function SearchBar({ value, onChange, placeholder = 'Search…', className, autoFocus = false }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-9 w-full rounded-md border border-border-strong bg-surface pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
