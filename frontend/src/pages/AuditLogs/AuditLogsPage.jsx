import { useEffect, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { FilterBar } from '../../components/ui/FilterBar';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatTime } from '../../lib/utils/formatters';

const AUDIT_LOG = [
  { id: 'log-01', actor: 'Dr. Elena Marsh', action: 'Updated patient record', target: 'Biscuit (ani-001)', category: 'clinical', timestamp: '2026-08-04T08:41:00' },
  { id: 'log-02', actor: 'System', action: 'AI recommendation approved by Jordan Blake', target: 'Alert alr-02', category: 'ai', timestamp: '2026-08-04T07:55:00' },
  { id: 'log-03', actor: 'Priya Shah', action: 'Rescheduled appointment', target: 'apt-1006', category: 'scheduling', timestamp: '2026-08-04T07:20:00' },
  { id: 'log-04', actor: 'System', action: 'Nightly forecast model refresh', target: 'Forecast engine', category: 'system', timestamp: '2026-08-04T05:00:00' },
  { id: 'log-05', actor: 'Chris Nolan', action: 'Marked task complete', target: 'tsk-206', category: 'task', timestamp: '2026-08-04T08:47:00' },
];

const CATEGORY_OPTIONS = [
  { label: 'Clinical', value: 'clinical' },
  { label: 'AI', value: 'ai' },
  { label: 'Scheduling', value: 'scheduling' },
  { label: 'System', value: 'system' },
  { label: 'Task', value: 'task' },
];

export default function AuditLogsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = AUDIT_LOG.filter((log) => category === 'all' || log.category === category);

  return (
    <div>
      <PageHeader title="Audit Logs" description="A record of every system and data change, for compliance and traceability." />

      <Card padded={false}>
        <div className="border-b border-border p-4">
          <FilterBar
            filters={[{ id: 'category', label: 'Category', value: category, options: CATEGORY_OPTIONS, onChange: setCategory }]}
            onClearAll={() => setCategory('all')}
          />
        </div>

        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton variant="list" rows={5} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={ScrollText} title="No matching log entries" description="Try a different category filter." />
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm text-ink">
                      <span className="font-medium">{log.actor}</span> — {log.action}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">{log.target}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant="neutral">{log.category}</Badge>
                    <span className="font-mono text-xs text-ink-faint">
                      {formatDate(log.timestamp)} {formatTime(log.timestamp)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
