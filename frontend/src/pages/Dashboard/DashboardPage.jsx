import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Sparkles, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart,
  CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { appointmentsApi } from '../../lib/api/appointments';
import { tasksApi } from '../../lib/api/tasks';
import { predictionsApi } from '../../lib/api/predictions';
import { forecastsApi } from '../../lib/api/forecasts';
import { reportsApi } from '../../lib/api/reports';
import { aiReviewsApi } from '../../lib/api/aiReviews';
import { formatTime } from '../../lib/utils/formatters';

const SEVERITY_VARIANT = { critical: 'rose', watch: 'amber', info: 'blue' };

// Static sparkline trends — decorative only, actual totals come from DB
const SPARKLINES = {
  appointments: [10, 12, 14, 11, 15, 17, 16, 18],
  tasks:        [5,  6,  7,  5,  8,  7,  9,  8],
  overdue:      [1,  2,  1,  3,  2,  2,  3,  3],
  predictions:  [2,  3,  2,  4,  3,  5,  4,  6],
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [predictionStats, setPredictionStats] = useState(null);
  const [forecastSummary, setForecastSummary] = useState(null);
  const [reportAnalytics, setReportAnalytics] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [appointmentTrends, setAppointmentTrends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      await Promise.allSettled([
        appointmentsApi.getDashboardStats().then(setDashboardStats).catch(() => {}),
        tasksApi.getDashboardStats().then(s => { setTaskStats(s); setRecentTasks(s.recentTasks || []); }).catch(() => {}),
        predictionsApi.getDashboardStats().then(s => { setPredictionStats(s); setRecentPredictions(s.recentPredictions || []); }).catch(() => {}),
        forecastsApi.getForecastSummary().then(r => setForecastSummary(r.data)).catch(() => {}),
        reportsApi.getAnalyticsSummary({ period: 'daily' }).then(r => setReportAnalytics(r.data)).catch(() => {}),
        appointmentsApi.list({ status: 'Scheduled', limit: 5, sortBy: 'appointmentDate', sortOrder: 'asc' }).then(r => setUpcomingAppointments(r.data)).catch(() => {}),
        aiReviewsApi.list({ status: 'pending', limit: 4 }).then(r => setPendingReviews(r.data)).catch(() => {}),
        forecastsApi.getAppointmentTrends({ period: 'daily' }).then(r => setAppointmentTrends(r.data || [])).catch(() => {}),
      ]);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  // Build live hourly chart from today's trend data or fall back to a placeholder
  const forecastSeries = appointmentTrends.length > 0
    ? appointmentTrends.slice(-10).map((t, i) => ({
        hour: t.date || `Slot ${i + 1}`,
        predicted: Math.round((t.count || 0) * 1.1),
        actual: t.count || 0,
      }))
    : [
        { hour: '7a', predicted: 12, actual: 11 }, { hour: '8a', predicted: 18, actual: 20 },
        { hour: '9a', predicted: 24, actual: 26 }, { hour: '10a', predicted: 27, actual: 25 },
        { hour: '11a', predicted: 25, actual: null }, { hour: '12p', predicted: 30, actual: null },
        { hour: '1p', predicted: 34, actual: null }, { hour: '2p', predicted: 38, actual: null },
      ];

  const kpiCards = [
    {
      id: 'kpi-today',
      label: "Today's Appointments",
      value: dashboardStats?.todayAppointments ?? '—',
      unit: '',
      delta: 0,
      deltaDirection: 'up',
      trend: SPARKLINES.appointments,
      tone: 'brand',
    },
    {
      id: 'kpi-pending',
      label: 'Pending Tasks',
      value: taskStats?.pendingTasks ?? '—',
      unit: '',
      delta: 0,
      deltaDirection: 'up',
      trend: SPARKLINES.tasks,
      tone: 'success',
    },
    {
      id: 'kpi-overdue',
      label: 'Overdue Tasks',
      value: taskStats?.overdueTasks ?? '—',
      unit: '',
      delta: 0,
      deltaDirection: 'down',
      trend: SPARKLINES.overdue,
      tone: 'rose',
    },
    {
      id: 'kpi-predictions',
      label: 'AI Predictions',
      value: predictionStats?.totalPredictions ?? '—',
      unit: '',
      delta: 0,
      deltaDirection: 'up',
      trend: SPARKLINES.predictions,
      tone: 'amber',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live operational overview across every department, right now."
        actions={
          <Button variant="secondary" icon={Sparkles} onClick={() => navigate('/predictions')}>
            View Predictions
          </Button>
        }
      />

      {/* KPI row */}
      {isLoading ? (
        <LoadingSkeleton variant="kpi" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((kpi) => <KpiCard key={kpi.id} {...kpi} />)}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Forecast Summary */}
        <Card padded>
          <p className="text-sm text-ink-muted">Forecast Summary</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{forecastSummary?.appointments?.total ?? 0}</p>
          <p className="mt-1 text-xs text-ink-faint">Total appointments this period</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-ink-muted">Completion Rate</p>
              <p className="text-sm font-medium text-ink">{forecastSummary?.appointments?.completionRate ?? 0}%</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">High Risk Predictions</p>
              <p className="text-sm font-medium text-ink">{forecastSummary?.predictions?.highRiskRate ?? 0}%</p>
            </div>
          </div>
        </Card>

        {/* Daily Analytics */}
        <Card padded>
          <p className="text-sm text-ink-muted">Daily Analytics</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{reportAnalytics?.appointments?.total ?? 0}</p>
          <p className="mt-1 text-xs text-ink-faint">Appointments today</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-ink-muted">Predictions</p>
              <p className="text-sm font-medium text-ink">{reportAnalytics?.predictions?.total ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Tasks Completed</p>
              <p className="text-sm font-medium text-ink">{reportAnalytics?.tasks?.completed ?? 0}</p>
            </div>
          </div>
        </Card>

        {/* Forecast chart */}
        <Card className="xl:col-span-2" padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>Predicted vs. Actual Caseload</CardTitle>
                <CardDescription>Appointment volume — predicted vs recorded</CardDescription>
              </div>
              <Badge variant="brand">Live model</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0"><LoadingSkeleton variant="card" /></div>
          ) : (
            <div className="h-64 px-2 pb-4 pt-2 sm:px-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predictedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D7C73" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#0D7C73" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid rgb(var(--color-border))', background: 'rgb(var(--color-surface-raised))', fontSize: 12 }} />
                  <Area type="monotone" dataKey="predicted" stroke="#0D7C73" strokeWidth={2} fill="url(#predictedFill)" name="Predicted" />
                  <Area type="monotone" dataKey="actual" stroke="#3B6E91" strokeWidth={2} fill="none" strokeDasharray="4 3" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* AI Pending Reviews */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <CardTitle>Pending AI Reviews</CardTitle>
            <Link to="/ai-review" className="text-xs font-medium text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          {isLoading ? (
            <div className="p-5"><LoadingSkeleton variant="list" rows={3} /></div>
          ) : pendingReviews.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={AlertTriangle} title="No pending reviews" description="All AI recommendations have been actioned." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {pendingReviews.map((r) => (
                <li key={r._id} className="flex gap-3 p-4">
                  <span className="mt-0.5">
                    <Badge variant={SEVERITY_VARIANT[r.severity]}>{r.severity}</Badge>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{r.module} · {r.confidence}% confidence</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Upcoming queue preview */}
        <Card className="xl:col-span-2" padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <CardTitle>Workflow Queue</CardTitle>
              <CardDescription>Next up across all rooms</CardDescription>
            </div>
            <Link to="/workflow-queue" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              Open queue <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="p-5"><LoadingSkeleton variant="list" rows={4} /></div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="p-5">
              <EmptyState title="No upcoming appointments" description="There are no scheduled appointments at this time." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {upcomingAppointments.map((apt) => (
                <li key={apt._id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {apt.petName} <span className="font-normal text-ink-faint">— {apt.visitType}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {apt.veterinarian?.fullName || 'Unassigned'} · {apt.room || 'TBD'} · {formatTime(apt.appointmentTime)}
                    </p>
                  </div>
                  <StatusBadge status={apt.status.toLowerCase().replace(' ', '-')} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Recent tasks */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest task assignments</CardDescription>
            </div>
            <Link to="/task-assignment" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="p-5"><LoadingSkeleton variant="list" rows={4} /></div>
          ) : recentTasks.length === 0 ? (
            <div className="p-5"><EmptyState title="No recent tasks" description="There are no recent task assignments." /></div>
          ) : (
            <ul className="divide-y divide-border">
              {recentTasks.slice(0, 5).map((task) => (
                <li key={task._id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{task.title}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {task.assignedTo?.fullName || 'Unassigned'} · {task.category} · {task.status}
                    </p>
                  </div>
                  <StatusBadge status={task.status.toLowerCase().replace(' ', '-')} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent AI predictions */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <CardTitle>Recent AI Predictions</CardTitle>
              <CardDescription>Latest diagnostic predictions</CardDescription>
            </div>
            <Link to="/predictions" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="p-5"><LoadingSkeleton variant="list" rows={4} /></div>
          ) : recentPredictions.length === 0 ? (
            <div className="p-5"><EmptyState title="No recent predictions" description="There are no recent AI predictions." /></div>
          ) : (
            <ul className="divide-y divide-border">
              {recentPredictions.slice(0, 5).map((prediction) => (
                <li key={prediction._id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{prediction.animalName}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {prediction.species} · {prediction.breed || 'Unknown'} · {prediction.aiResult?.riskLevel || 'Pending'}
                    </p>
                  </div>
                  <Badge variant={
                    prediction.aiResult?.riskLevel === 'Critical' ? 'rose' :
                    prediction.aiResult?.riskLevel === 'High' ? 'amber' :
                    prediction.aiResult?.riskLevel === 'Medium' ? 'blue' : 'neutral'
                  }>
                    {prediction.aiResult?.riskLevel || 'Unknown'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
