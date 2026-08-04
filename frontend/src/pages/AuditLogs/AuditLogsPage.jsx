import { useEffect, useState } from 'react';
import { ScrollText, Download, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { auditLogsApi } from '../../lib/api/auditLogs';
import { formatDate, formatTime } from '../../lib/utils/formatters';

const MODULE_OPTIONS = [
  { label: 'All Modules', value: '' },
  { label: 'Auth', value: 'auth' },
  { label: 'Users', value: 'users' },
  { label: 'Veterinarians', value: 'veterinarians' },
  { label: 'Appointments', value: 'appointments' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Predictions', value: 'predictions' },
  { label: 'Forecasts', value: 'forecasts' },
  { label: 'Reports', value: 'reports' },
  { label: 'Settings', value: 'settings' },
  { label: 'System', value: 'system' },
];

export default function AuditLogsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const params = { page, search, module, action };
      const result = await auditLogsApi.list(params);
      setLogs(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, module, action]);

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      const params = { search, module, action };
      const response = await auditLogsApi.export(format, params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="A record of every system and data change, for compliance and traceability."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Download} onClick={() => handleExport('csv')} isLoading={isExporting}>
              Export CSV
            </Button>
            <Button variant="secondary" icon={Download} onClick={() => handleExport('json')} isLoading={isExporting}>
              Export JSON
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-4" padded>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Action filter..."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-4">
          {isLoading ? (
            <LoadingSkeleton variant="list" rows={5} />
          ) : logs.length === 0 ? (
            <EmptyState icon={ScrollText} title="No matching log entries" description="Try different search or filter criteria." />
          ) : (
            <>
              <ul className="flex flex-col gap-2">
                {logs.map((log) => (
                  <li key={log._id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="flex-1">
                      <p className="text-sm text-ink">
                        <span className="font-medium">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</span> — {log.action}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint">{log.description}</p>
                      {log.resourceId && (
                        <p className="mt-0.5 text-xs font-mono text-ink-faint">ID: {log.resourceId}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant="neutral">{log.module}</Badge>
                      <span className="font-mono text-xs text-ink-faint">
                        {formatDate(log.createdAt)} {formatTime(log.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

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
      </Card>
    </div>
  );
}
