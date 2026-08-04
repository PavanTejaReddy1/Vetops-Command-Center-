import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { KpiCard } from '../../components/ui/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { kpiMetrics, forecastSeries, caseloadByDepartment } from '../../data/kpiMetrics';
import { alerts } from '../../data/alerts';
import { appointments } from '../../data/appointments';
import { formatTime } from '../../lib/utils/formatters';

const SEVERITY_VARIANT = { critical: 'rose', watch: 'amber', info: 'blue' };

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

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
          {kpiMetrics.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Forecast chart */}
        <Card className="xl:col-span-2" padded={false}>
          <div className="p-5 pb-0">
            <CardHeader className="mb-1">
              <div>
                <CardTitle>Predicted vs. Actual Caseload</CardTitle>
                <CardDescription>Today, by hour — model refreshed 05:00</CardDescription>
              </div>
              <Badge variant="brand">Live model</Badge>
            </CardHeader>
          </div>
          {isLoading ? (
            <div className="p-5 pt-0">
              <LoadingSkeleton variant="card" />
            </div>
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
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="#0D7C73" strokeWidth={2} fill="url(#predictedFill)" name="Predicted" />
                  <Area type="monotone" dataKey="actual" stroke="#3B6E91" strokeWidth={2} fill="none" strokeDasharray="4 3" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Predictive alerts */}
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <CardTitle>Predictive Alerts</CardTitle>
            <Link to="/predictions" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="p-5">
              <LoadingSkeleton variant="list" rows={3} />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={AlertTriangle} title="No active alerts" description="The model hasn't flagged any risk in the next 24 hours." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {alerts.slice(0, 4).map((alert) => (
                <li key={alert.id} className="flex gap-3 p-4">
                  <span className="mt-0.5">
                    <Badge variant={SEVERITY_VARIANT[alert.severity]}>{alert.severity}</Badge>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{alert.module} · {alert.confidence}% confidence</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Caseload by department */}
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardTitle>Caseload by Department</CardTitle>
            <CardDescription>Currently open cases</CardDescription>
          </div>
          {isLoading ? (
            <div className="p-5">
              <LoadingSkeleton variant="card" />
            </div>
          ) : (
            <div className="h-56 px-2 pb-4 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseloadByDepartment} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--color-border))" />
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgb(var(--color-ink-faint))' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    cursor={{ fill: 'rgb(var(--color-border))', opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid rgb(var(--color-border))',
                      background: 'rgb(var(--color-surface-raised))',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="cases" fill="#0D7C73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
            <div className="p-5">
              <LoadingSkeleton variant="list" rows={4} />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {appointments.slice(0, 5).map((apt) => (
                <li key={apt.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {apt.animalName} <span className="font-normal text-ink-faint">— {apt.type}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {apt.vetName} · {apt.room} · {formatTime(apt.scheduledAt)}
                    </p>
                  </div>
                  <StatusBadge status={apt.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
