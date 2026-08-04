import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { alerts } from '../../data/alerts';
import { formatDate, formatTime } from '../../lib/utils/formatters';

const SEVERITY_VARIANT = { critical: 'rose', watch: 'amber', info: 'blue' };
const SEVERITY_LABEL = { critical: 'Critical', watch: 'Watch', info: 'Informational' };

export default function PredictionsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <PageHeader
        title="Predictions"
        description="AI-generated forecasts of operational bottlenecks before they happen."
      />

      {isLoading ? (
        <LoadingSkeleton variant="list" rows={4} />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No predicted bottlenecks"
          description="The model hasn't identified any operational risk in the current forecast window."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <Badge variant={SEVERITY_VARIANT[alert.severity]} className="mt-0.5 shrink-0">
                  {SEVERITY_LABEL[alert.severity]}
                </Badge>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{alert.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{alert.detail}</p>
                  <p className="mt-2 text-xs text-ink-faint">
                    {alert.module} · Predicted for {formatDate(alert.predictedFor)} at {formatTime(alert.predictedFor)} ·{' '}
                    {alert.confidence}% model confidence
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                Send to AI Review
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
