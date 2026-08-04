import { forwardRef } from 'react';
import { cn } from '../../lib/utils/cn';

/**
 * Input — text field with label/error/hint slots, forwardRef'd so it drops
 * straight into react-hook-form's register().
 */
export const Input = forwardRef(function Input(
  { className, label, error, hint, id, icon: Icon, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-faint',
            'transition-colors focus:border-brand-500 focus:outline-none',
            Icon && 'pl-9',
            error && 'border-signal-rose focus:border-signal-rose',
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-signal-rose">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-ink-faint">
          {hint}
        </p>
      )}
    </div>
  );
});
