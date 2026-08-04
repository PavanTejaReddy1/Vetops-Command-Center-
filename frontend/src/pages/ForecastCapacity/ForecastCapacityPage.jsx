import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Badge } from '../../components/ui/Badge';
import { veterinarians } from '../../data/veterinarians';
import { forecastSeries } from '../../data/kpiMetrics';

export default function ForecastCapacityPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <PageHeader
        title="Forecast & Capacity"
        description="Demand forecasting against current staffing capacity, updated hourly."
      />

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHeader className="mb-1">
            <div>
              <CardTitle>Demand Forecast (Next 10 Hours)</CardTitle>
              <CardDescription>Predicted patient volume vs. staffed capacity ceiling</CardDescription>
            </div>
            <Badge variant="amber">Capacity model</Badge>
          </CardHeader>
        </div>
        {isLoading ? (
          <div className="p-5 pt-0">
            <LoadingSkeleton variant="card" />
          </div>
        ) : (
          <div className="h-72 px-2 pb-5 pt-2 sm:px-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastSeries} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
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
                <Line type="monotone" dataKey="predicted" stroke="#E2A63B" strokeWidth={2} dot={false} name="Predicted demand" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Staff Capacity Today</CardTitle>
            <CardDescription>Utilization by veterinarian, current shift</CardDescription>
          </div>
        </CardHeader>

        {isLoading ? (
          <LoadingSkeleton variant="list" rows={5} />
        ) : (
          <div className="flex flex-col gap-3">
            {veterinarians.map((vet) => (
              <div key={vet.id} className="flex items-center gap-4">
                <div className="w-40 shrink-0">
                  <p className="truncate text-sm font-medium text-ink">{vet.name}</p>
                  <p className="truncate text-xs text-ink-faint">{vet.specialty}</p>
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full ${
                      vet.utilization >= 90 ? 'bg-signal-rose' : vet.utilization >= 75 ? 'bg-signal-amber' : 'bg-brand-500'
                    }`}
                    style={{ width: `${vet.utilization}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-sm text-ink-muted">{vet.utilization}%</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
