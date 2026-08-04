import { useEffect, useState } from 'react';
import { Download, FileBarChart2, Calendar, Printer } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { reportsApi } from '../../lib/api/reports';

const mockAnalytics = {
  appointments: { total: 156, completed: 142, cancelled: 8, completionRate: 91 },
  predictions: { total: 45, highRisk: 12, mediumRisk: 20, lowRisk: 13 },
  tasks: { total: 89, completed: 76, pending: 10, overdue: 3 },
};

const REPORT_TEMPLATES = [
  { id: 'appointments', name: 'Appointment Report', description: 'Appointment statistics and distribution' },
  { id: 'veterinarians', name: 'Veterinarian Performance', description: 'Staff performance metrics' },
  { id: 'predictions', name: 'AI Prediction Report', description: 'Prediction analytics and risk distribution' },
  { id: 'tasks', name: 'Task Report', description: 'Task completion and category breakdown' },
  { id: 'system', name: 'System Activity', description: 'Overall system activity summary' },
];

const PERIOD_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('daily');
  const [isExporting, setIsExporting] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const data = await reportsApi.getAnalyticsSummary({ period });
      setAnalytics(data.data);
    } catch (err) {
      console.error('Failed to fetch analytics, using mock data:', err);
      setAnalytics(mockAnalytics);
    }
  };

  const fetchReport = async (reportType) => {
    try {
      setIsLoading(true);
      const params = { startDate, endDate };
      let data;
      switch (reportType) {
        case 'appointments':
          data = await reportsApi.getAppointmentReport(params);
          break;
        case 'veterinarians':
          data = await reportsApi.getVeterinarianPerformanceReport(params);
          break;
        case 'predictions':
          data = await reportsApi.getPredictionReport(params);
          break;
        case 'tasks':
          data = await reportsApi.getTaskReport(params);
          break;
        case 'system':
          data = await reportsApi.getSystemActivityReport(params);
          break;
        default:
          return;
      }
      setReportData(data.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  useEffect(() => {
    if (selectedReport) {
      fetchReport(selectedReport);
    }
  }, [selectedReport, startDate, endDate]);

  const handleExport = async (format) => {
    if (!selectedReport) return;
    try {
      setIsExporting(true);
      const params = { startDate, endDate };
      const response = await reportsApi.exportReport(selectedReport, format, params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport}-report-${Date.now()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (selectedReport) {
      case 'appointments':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ink-muted">Total Appointments</p>
                <p className="text-2xl font-semibold text-ink">{reportData.total}</p>
              </div>
              <div>
                <p className="text-sm text-ink-muted">By Status</p>
                <ul className="mt-2 space-y-1">
                  {reportData.byStatus.map((item) => (
                    <li key={item._id} className="text-sm text-ink-muted">
                      {item._id}: {item.count}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">By Veterinarian</p>
              <ul className="space-y-1">
                {reportData.byVeterinarian.map((item) => (
                  <li key={item.veterinarianName} className="text-sm text-ink-muted">
                    {item.veterinarianName}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'veterinarians':
        return (
          <div className="space-y-4">
            {reportData.map((vet) => (
              <div key={vet.veterinarianId} className="border-b border-border pb-3">
                <p className="font-medium text-ink">{vet.veterinarianName}</p>
                <p className="text-sm text-ink-muted">{vet.specialization}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-ink-muted">Total:</span> {vet.totalAppointments}
                  </div>
                  <div>
                    <span className="text-ink-muted">Completed:</span> {vet.completedAppointments}
                  </div>
                  <div>
                    <span className="text-ink-muted">Rate:</span> {vet.completionRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'predictions':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ink-muted">Total Predictions</p>
                <p className="text-2xl font-semibold text-ink">{reportData.total}</p>
              </div>
              <div>
                <p className="text-sm text-ink-muted">Avg Confidence</p>
                <p className="text-2xl font-semibold text-ink">{reportData.avgConfidence.toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">By Risk Level</p>
              <ul className="space-y-1">
                {reportData.byRiskLevel.map((item) => (
                  <li key={item._id} className="text-sm text-ink-muted">
                    {item._id || 'Unknown'}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">By Species</p>
              <ul className="space-y-1">
                {reportData.bySpecies.map((item) => (
                  <li key={item._id} className="text-sm text-ink-muted">
                    {item._id}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-ink-muted">Total Tasks</p>
              <p className="text-2xl font-semibold text-ink">{reportData.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">By Status</p>
              <ul className="space-y-1">
                {reportData.byStatus.map((item) => (
                  <li key={item._id} className="text-sm text-ink-muted">
                    {item._id}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-ink mb-2">By Category</p>
              <ul className="space-y-1">
                {reportData.byCategory.map((item) => (
                  <li key={item._id} className="text-sm text-ink-muted">
                    {item._id}: {item.count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-ink-muted">Total Activities</p>
              <p className="text-2xl font-semibold text-ink">{reportData.totalActivities}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Appointments</p>
              <p className="text-2xl font-semibold text-ink">{reportData.appointments}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Predictions</p>
              <p className="text-2xl font-semibold text-ink">{reportData.predictions}</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Tasks</p>
              <p className="text-2xl font-semibold text-ink">{reportData.tasks}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-ink-muted">Active Veterinarians</p>
              <p className="text-2xl font-semibold text-ink">{reportData.activeVeterinarians}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Operational and financial reporting, generated on schedule."
        actions={
          selectedReport && (
            <div className="flex gap-2">
              <Button variant="secondary" icon={Download} onClick={() => handleExport('csv')} isLoading={isExporting}>
                Export CSV
              </Button>
              <Button variant="secondary" icon={Download} onClick={() => handleExport('json')} isLoading={isExporting}>
                Export JSON
              </Button>
              <Button variant="ghost" icon={Printer} onClick={handlePrint}>
                Print
              </Button>
            </div>
          )
        }
      />

      {/* Date Range Filter */}
      <Card className="mb-4" padded={false}>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ink-muted" />
            <span className="text-sm font-medium text-ink">Date Range</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button variant="ghost" size="sm" onClick={() => { setStartDate(''); setEndDate(''); }}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Analytics Summary */}
      {isLoading ? (
        <LoadingSkeleton variant="kpi" />
      ) : analytics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Appointments ({analytics.period})</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{analytics.appointments.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{analytics.appointments.completed} completed</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Predictions ({analytics.period})</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{analytics.predictions.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{analytics.predictions.highRisk} high risk</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Tasks ({analytics.period})</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{analytics.tasks.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{analytics.tasks.completed} completed</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Top Veterinarians</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{analytics.topVeterinarians.length}</p>
              <p className="mt-1 text-xs text-ink-faint">Active this period</p>
            </div>
          </Card>
        </div>
      )}

      {/* Period Selector */}
      <Card className="mt-4" padded>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-ink">Analytics Period:</span>
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  period === opt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-canvas text-ink hover:bg-surface-raised'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Templates */}
      <Card className="mt-4" padded={false}>
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Generate and export operational reports</CardDescription>
          </div>
        </div>

        <ul className="divide-y divide-border">
          {REPORT_TEMPLATES.map((report) => (
            <li key={report.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-ink">{report.name}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{report.description}</p>
              </div>
              <Button
                variant={selectedReport === report.id ? 'brand' : 'secondary'}
                size="sm"
                onClick={() => setSelectedReport(report.id)}
              >
                {selectedReport === report.id ? 'Viewing' : 'Generate'}
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Report Content */}
      {selectedReport && (
        <Card className="mt-4" padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <CardTitle>
                {REPORT_TEMPLATES.find((r) => r.id === selectedReport)?.name}
              </CardTitle>
              <CardDescription>
                {startDate && `From ${startDate}`} {startDate && endDate && ' to '} {endDate && `To ${endDate}`}
              </CardDescription>
            </div>
            <Badge variant="brand">Live Data</Badge>
          </div>

          <div className="p-5">
            {isLoading ? (
              <LoadingSkeleton variant="card" />
            ) : reportData ? (
              renderReportContent()
            ) : (
              <EmptyState icon={FileBarChart2} title="No data available" description="Select a date range to generate the report." />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
