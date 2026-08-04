import {
  LayoutDashboard,
  ListChecks,
  TrendingUp,
  UserCog,
  Sparkles,
  ShieldCheck,
  FileBarChart2,
  Bell,
  Users,
  ScrollText,
  Settings,
} from 'lucide-react';

/**
 * Single source of truth for the primary navigation.
 * Sidebar, breadcrumbs, and the command/search palette all derive from this
 * list so a new module only needs to be registered once.
 */
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'Live operational overview',
  },
  {
    id: 'workflow-queue',
    label: 'Workflow Queue',
    path: '/workflow-queue',
    icon: ListChecks,
    description: 'Active case and visit pipeline',
  },
  {
    id: 'forecast-capacity',
    label: 'Forecast & Capacity',
    path: '/forecast-capacity',
    icon: TrendingUp,
    description: 'Demand forecasting and staffing capacity',
  },
  {
    id: 'task-assignment',
    label: 'Task Assignment',
    path: '/task-assignment',
    icon: UserCog,
    description: 'Assign and balance staff workload',
  },
  {
    id: 'predictions',
    label: 'Predictions',
    path: '/predictions',
    icon: Sparkles,
    description: 'Predictive bottleneck alerts',
  },
  {
    id: 'ai-review',
    label: 'AI Review',
    path: '/ai-review',
    icon: ShieldCheck,
    description: 'Human-in-the-loop AI recommendation review',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: FileBarChart2,
    description: 'Operational and financial reporting',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    description: 'System and workflow notifications',
  },
  {
    id: 'users',
    label: 'Users',
    path: '/users',
    icon: Users,
    description: 'Staff accounts and roles',
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: ScrollText,
    description: 'System and data change history',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Hospital and workspace configuration',
  },
];

export function findNavItemByPath(pathname) {
  // exact match first, then longest-prefix match for nested routes
  return (
    NAV_ITEMS.find((item) => item.path === pathname) ??
    NAV_ITEMS.filter((item) => item.path !== '/' && pathname.startsWith(item.path)).sort(
      (a, b) => b.path.length - a.path.length
    )[0]
  );
}
