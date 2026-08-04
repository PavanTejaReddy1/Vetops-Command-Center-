import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, Calendar } from 'lucide-react';
import { forecastsApi } from '../../lib/api/forecasts';

export default function ForecastCapacityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [appointmentTrends, setAppointmentTrends] = useState([]);
  const [veterinarianWorkload, setVeterinarianWorkload] = useState([]);
  const [predictionTrends, setPredictionTrends] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [taskTrends, setTaskTrends] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('daily');

  const fetchForecastData = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [summaryData, appointmentData, workloadData, predictionData, riskData, taskData] = await Promise.all([
        forecastsApi.getForecastSummary(params),
        forecastsApi.getAppointmentTrends({ ...params, period }),
        forecastsApi.getVeterinarianWorkload(params),
        forecastsApi.getPredictionTrends({ ...params, period }),
        forecastsApi.getRiskDistribution(params),
        forecastsApi.getTaskTrends({ ...params, period }),
      ]);

      setSummary(summaryData.data);
      setAppointmentTrends(appointmentData.data);
      setVeterinarianWorkload(workloadData.data);
      setPredictionTrends(predictionData.data);
      setRiskDistribution(riskData.data);
      setTaskTrends(taskData.data);
    } catch (err) {
      console.error('Failed to fetch forecast data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastData();
  }, [startDate, endDate, period]);

  const handleExport = () => {
    const data = {
      summary,
      appointmentTrends,
      veterinarianWorkload,
      predictionTrends,
      riskDistribution,
      taskTrends,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Forecast & Capacity"
        description="Demand forecasting against current staffing capacity, updated hourly."
        actions={
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Export Data
          </Button>
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
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border border-border bg-canvas px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <Button variant="ghost" size="sm" onClick={() => { setStartDate(''); setEndDate(''); }}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LoadingSkeleton variant="kpi" />
          <LoadingSkeleton variant="kpi" />
          <LoadingSkeleton variant="kpi" />
          <LoadingSkeleton variant="kpi" />
        </div>
      ) : summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Total Appointments</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{summary.appointments.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{summary.appointments.completionRate}% completion rate</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">AI Predictions</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{summary.predictions.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{summary.predictions.highRiskRate}% high risk</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Tasks</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{summary.tasks.total}</p>
              <p className="mt-1 text-xs text-ink-faint">{summary.tasks.completionRate}% completion rate</p>
            </div>
          </Card>
          <Card padded>
            <div>
              <p className="text-sm text-ink-muted">Active Veterinarians</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{summary.veterinarians.active}</p>
              <p className="mt-1 text-xs text-ink-faint">Currently on duty</p>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Appointment Trends */}
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>Patient volume over time</CardDescription>
              </div>
              <Badge variant="brand">Live data</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0">
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className="h-64 px-2 pb-5 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentTrends} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#0D7C73" strokeWidth={2} dot={false} name="Total" />
                  <Line type="monotone" dataKey="completed" stroke="#3B6E91" strokeWidth={2} dot={false} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Prediction Trends */}
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>AI Prediction Trends</CardTitle>
                <CardDescription>Prediction volume over time</CardDescription>
              </div>
              <Badge variant="amber">AI insights</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0">
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className="h-64 px-2 pb-5 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionTrends} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#E2A63B" strokeWidth={2} dot={false} name="Total" />
                  <Line type="monotone" dataKey="highRisk" stroke="#E53935" strokeWidth={2} dot={false} name="High Risk" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Risk Distribution */}
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Prediction risk levels breakdown</CardDescription>
              </div>
              <Badge variant="rose">Risk analysis</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0">
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className="h-64 px-2 pb-5 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="riskLevel" tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#E53935" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Task Trends */}
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>Task Trends</CardTitle>
                <CardDescription>Task completion over time</CardDescription>
              </div>
              <Badge variant="brand">Productivity</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0">
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className="h-64 px-2 pb-5 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskTrends} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#0D7C73" strokeWidth={2} dot={false} name="Total" />
                  <Line type="monotone" dataKey="completed" stroke="#3B6E91" strokeWidth={2} dot={false} name="Completed" />
                  <Line type="monotone" dataKey="pending" stroke="#E2A63B" strokeWidth={2} dot={false} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Veterinarian Workload */}
      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Veterinarian Workload</CardTitle>
            <CardDescription>Appointment distribution by veterinarian</CardDescription>
          </div>
        </CardHeader>

        {isLoading ? (
          <LoadingSkeleton variant="list" rows={5} />
        ) : veterinarianWorkload.length === 0 ? (
          <p className="text-center text-ink-muted py-8">No workload data available</p>
        ) : (
          <div className="flex flex-col gap-3">
            {veterinarianWorkload.map((vet) => (
              <div key={vet.veterinarianId} className="flex items-center gap-4">
                <div className="w-48 shrink-0">
                  <p className="truncate text-sm font-medium text-ink">{vet.veterinarianName}</p>
                  <p className="truncate text-xs text-ink-faint">{vet.specialization}</p>
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full ${
                      vet.completionRate >= 90 ? 'bg-signal-rose' : vet.completionRate >= 75 ? 'bg-signal-amber' : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(vet.completionRate, 100)}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right">
                  <span className="font-mono text-sm text-ink-muted">{vet.totalAppointments} appts</span>
                  <span className="ml-2 font-mono text-xs text-ink-faint">{vet.completionRate.toFixed(1)}%</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
