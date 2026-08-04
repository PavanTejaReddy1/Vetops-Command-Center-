import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';

/**
 * Breadcrumbs — derived from the current route via useBreadcrumbs().
 * Rendered inside every PageHeader; also usable standalone in the topbar.
 */
export function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-faint">
      <Home className="h-3.5 w-3.5" />
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="font-medium capitalize text-ink">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="capitalize hover:text-ink">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
