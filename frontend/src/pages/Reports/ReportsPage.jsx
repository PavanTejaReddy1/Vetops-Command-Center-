import { useEffect, useState } from 'react';
import { Download, FileBarChart2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { kpiMetrics } from '../../data/kpiMetrics';

const REPORT_TEMPLATES = [
  { id: 'rpt-1', name: 'Daily Operations Summary', cadence: 'Daily · 6:00 AM' },
  { id: 'rpt-2', name: 'Staff Utilization Report', cadence: 'Weekly · Monday' },
  { id: 'rpt-3', name: 'Predictive Accuracy Audit', cadence: 'Weekly · Friday' },
  { id: 'rpt-4', name: 'Revenue & Capacity Correlation', cadence: 'Monthly' },
];

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <PageHeader title="Reports" description="Operational and financial reporting, generated on schedule." />

      {isLoading ? (
        <LoadingSkeleton variant="kpi" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiMetrics.map((kpi) => (
            <Card key={kpi.id}>
              <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{kpi.label}</span>
              <p className="mt-2 font-mono text-xl font-semibold text-ink">
                {kpi.value}
                {kpi.unit}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6" padded={false}>
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Standing reports available for export</CardDescription>
          </div>
        </div>

        {isLoading ? (
          <div className="p-5">
            <LoadingSkeleton variant="list" rows={4} />
          </div>
        ) : REPORT_TEMPLATES.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={FileBarChart2} title="No report templates yet" description="Templates configured by your team will appear here." />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {REPORT_TEMPLATES.map((report) => (
              <li key={report.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{report.name}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{report.cadence}</p>
                </div>
                <Button variant="secondary" size="sm" icon={Download}>
                  Export
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
