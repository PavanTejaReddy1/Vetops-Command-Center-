import { useEffect, useState } from 'react';
import { Bell, Sparkles, ListChecks, AlertTriangle, Calendar, Search, Trash2, Check } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { notificationsApi } from '../../lib/api/notifications';
import { formatRelativeTime } from '../../lib/utils/formatters';
import { cn } from '../../lib/utils/cn';

const TYPE_ICON = {
  success: Check,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Bell,
  appointments: Calendar,
  tasks: ListChecks,
  predictions: Sparkles,
  forecasts: Bell,
  reports: Bell,
  system: Bell,
};

const TYPE_VARIANT = {
  success: 'success',
  warning: 'amber',
  error: 'rose',
  info: 'blue',
};

const MODULE_OPTIONS = [
  { label: 'All Modules', value: '' },
  { label: 'Appointments', value: 'appointments' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Predictions', value: 'predictions' },
  { label: 'Forecasts', value: 'forecasts' },
  { label: 'Reports', value: 'reports' },
  { label: 'System', value: 'system' },
];

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params = { page, search, module: moduleFilter, read: readFilter };
      const result = await notificationsApi.list(params);
      setNotifications(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const result = await notificationsApi.getUnreadCount();
      setUnreadCount(result.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [page, search, moduleFilter, readFilter]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsApi.remove(id);
      setNotifications(notifications.filter(n => n._id !== id));
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Everything the system has flagged for your attention."
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )
        }
      />

      {/* Filters */}
      <Card className="mb-4" padded>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Status</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <LoadingSkeleton variant="list" rows={5} />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here as they happen." />
      ) : (
        <>
          <Card padded={false}>
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || TYPE_ICON[n.module] || Bell;
                return (
                  <li key={n._id} className={cn('flex items-start gap-3 p-4', !n.read && 'bg-brand-50/40 dark:bg-brand-900/10')}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-muted">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm', n.read ? 'text-ink-muted' : 'font-medium text-ink')}>{n.title}</p>
                        <div className="flex items-center gap-2">
                          {n.module && <Badge variant="neutral" className="text-xs">{n.module}</Badge>}
                          <Badge variant={TYPE_VARIANT[n.type] || 'neutral'} className="text-xs">{n.type}</Badge>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-ink-faint">{n.message}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">{formatRelativeTime(n.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="text-xs text-ink-muted hover:text-ink"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-ink-muted">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
