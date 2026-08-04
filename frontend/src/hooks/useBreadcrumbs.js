import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { findNavItemByPath } from '../lib/constants/navigation';

/**
 * Derives a breadcrumb trail from the current URL against the nav registry.
 * Home is always the root crumb; the matched nav item (if any) is appended.
 * Falls back gracefully for unregistered/deep routes.
 */
export function useBreadcrumbs() {
  const { pathname } = useLocation();

  return useMemo(() => {
    const crumbs = [{ label: 'Command Center', path: '/' }];

    if (pathname === '/') return crumbs;

    const match = findNavItemByPath(pathname);
    if (match) {
      crumbs.push({ label: match.label, path: match.path });
    } else {
      const segment = pathname.split('/').filter(Boolean).pop();
      crumbs.push({
        label: segment ? segment.replace(/-/g, ' ') : 'Page',
        path: pathname,
      });
    }
    return crumbs;
  }, [pathname]);
}
