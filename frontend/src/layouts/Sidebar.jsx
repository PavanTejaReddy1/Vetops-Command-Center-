import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, X } from 'lucide-react';
import { cn } from '../lib/utils/cn';
import { NAV_ITEMS } from '../lib/constants/navigation';
import { SITE_CONFIG } from '../config/site';

/**
 * Sidebar — primary navigation. Renders the same NAV_ITEMS list for desktop
 * (fixed, collapsible to an icon rail) and mobile (off-canvas drawer).
 */
export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 lg:flex',
          collapsed ? 'w-[76px]' : 'w-[248px]'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onCloseMobile} aria-hidden="true" />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 top-0 flex h-full w-[260px] flex-col bg-surface shadow-popover"
          >
            <div className="flex items-center justify-between px-4 pt-4">
              <Logo />
              <button onClick={onCloseMobile} aria-label="Close menu" className="rounded-md p-1.5 text-ink-faint hover:bg-canvas">
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarNav collapsed={false} onNavigate={onCloseMobile} />
          </motion.aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ collapsed, onToggleCollapse }) {
  return (
    <>
      <div className={cn('flex h-16 items-center border-b border-border px-4', collapsed && 'justify-center px-0')}>
        <Logo collapsed={collapsed} />
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className="mt-auto border-t border-border p-3">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-ink-faint transition-colors hover:bg-canvas hover:text-ink"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronsLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      </div>
    </>
  );
}

function SidebarNav({ collapsed, onNavigate }) {
  return (
    <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4">
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0 py-2.5',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'text-ink-muted hover:bg-canvas hover:text-ink'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-brand-600 dark:text-brand-300')} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-brand-500" />
        <path
          d="M4 17H10L13 9L18 24L21 17H28"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {!collapsed && (
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-ink">{SITE_CONFIG.appName}</p>
          <p className="text-[11px] text-ink-faint">Command Center</p>
        </div>
      )}
    </div>
  );
}
