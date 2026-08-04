import { useEffect, useState } from 'react';
import { Bell, Sparkles, ListChecks, AlertTriangle, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { notifications } from '../../data/notifications';
import { formatRelativeTime } from '../../lib/utils/formatters';
import { cn } from '../../lib/utils/cn';

const TYPE_ICON = {
  alert: AlertTriangle,
  task: ListChecks,
  system: Bell,
  'ai-review': Sparkles,
  appointment: Calendar,
};

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Everything the system has flagged for your attention."
        actions={
          <Button variant="secondary" size="sm">
            Mark all as read
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton variant="list" rows={5} />
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here as they happen." />
      ) : (
        <Card padded={false}>
          <ul className="divide-y divide-border">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              return (
                <li key={n.id} className={cn('flex items-start gap-3 p-4', !n.read && 'bg-brand-50/40 dark:bg-brand-900/10')}>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-muted">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className={cn('text-sm', n.read ? 'text-ink-muted' : 'font-medium text-ink')}>{n.title}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{formatRelativeTime(n.timestamp)}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
