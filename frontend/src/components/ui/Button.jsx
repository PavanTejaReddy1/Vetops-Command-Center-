import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils/cn';

const VARIANTS = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-xs disabled:bg-brand-500/50',
  secondary:
    'bg-surface text-ink border border-border-strong hover:bg-canvas active:bg-border/40',
  ghost: 'text-ink-muted hover:bg-canvas hover:text-ink',
  danger: 'bg-signal-rose text-white hover:bg-signal-rose-deep shadow-xs',
  link: 'text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline p-0 h-auto',
};

const SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  icon: 'h-9 w-9 justify-center',
};

/**
 * Base Button — every clickable action in the app should use this rather
 * than a raw <button> so focus states, disabled states, and loading states
 * stay consistent.
 */
export const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', loading = false, disabled, children, icon: Icon, iconPosition = 'left', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center rounded-md font-medium transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0" />}
    </button>
  );
});
