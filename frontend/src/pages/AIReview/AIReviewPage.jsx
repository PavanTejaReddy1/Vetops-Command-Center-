import { useEffect, useState } from 'react';
import { ShieldCheck, Check, X, Minus, Sparkles, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { FilterBar } from '../../components/ui/FilterBar';
import { aiReviewsApi } from '../../lib/api/aiReviews';
import { formatDate, formatTime } from '../../lib/utils/formatters';
import { cn } from '../../lib/utils/cn';

const SEVERITY_VARIANT = { critical: 'rose', watch: 'amber', info: 'blue' };
const STATUS_VARIANT = { pending: 'amber', approved: 'success', rejected: 'rose', dismissed: 'neutral' };
const SEVERITY_ICON = { critical: AlertTriangle, watch: AlertTriangle, info: Info };

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Dismissed', value: 'dismissed' },
];

const SEVERITY_OPTIONS = [
  { label: 'Critical', value: 'critical' },
  { label: 'Watch', value: 'watch' },
  { label: 'Info', value: 'info' },
];

function ReviewActionModal({ isOpen, onClose, review, actionType, onSubmit, isSubmitting }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) setNote('');
  }, [isOpen]);

  const requiresNote = actionType === 'reject';
  const titles = { approve: 'Approve Recommendation', reject: 'Reject Recommendation', dismiss: 'Dismiss Recommendation' };
  const descriptions = {
    approve: 'Confirm you want to approve and act on this AI recommendation.',
    reject: 'Provide a mandatory reason for rejecting this recommendation.',
    dismiss: 'Dismiss this recommendation without action. Add an optional note.',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titles[actionType] || 'Review Action'}
      description={descriptions[actionType]}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant={actionType === 'approve' ? 'primary' : actionType === 'reject' ? 'danger' : 'secondary'}
            onClick={() => onSubmit(note)}
            isLoading={isSubmitting}
            disabled={requiresNote && !note.trim()}
          >
            {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Dismiss'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {review && (
          <div className="rounded-md bg-canvas p-3 text-sm text-ink-muted border border-border">
            <p className="font-medium text-ink">{review.title}</p>
            <p className="mt-1">{review.description}</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            {requiresNote ? 'Reason (required)' : 'Note (optional)'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={requiresNote ? 'Enter the reason for rejection...' : 'Add an optional note...'}
            className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
    </Modal>
  );
}

export default function AIReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionModal, setActionModal] = useState({ open: false, review: null, actionType: null });

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;
      const result = await aiReviewsApi.list(params);
      setReviews(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch AI reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await aiReviewsApi.getDashboardStats();
      setStats(data);
    } catch (_) {}
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, severityFilter]);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, severityFilter, page]);

  const openAction = (review, actionType) => setActionModal({ open: true, review, actionType });
  const closeAction = () => setActionModal({ open: false, review: null, actionType: null });

  const handleAction = async (note) => {
    const { review, actionType } = actionModal;
    try {
      setIsSubmitting(true);
      if (actionType === 'approve') await aiReviewsApi.approve(review._id, note);
      else if (actionType === 'reject') await aiReviewsApi.reject(review._id, note);
      else if (actionType === 'dismiss') await aiReviewsApi.dismiss(review._id, note);
      closeAction();
      fetchReviews();
      fetchStats();
    } catch (err) {
      setError(err.message || `Failed to ${actionType} review`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const result = await aiReviewsApi.generate();
      fetchReviews();
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to generate AI reviews');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Review"
        description="AI-generated operational recommendations pending human approval."
        actions={
          <Button variant="secondary" icon={Sparkles} onClick={handleGenerate} isLoading={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate from Live Data'}
          </Button>
        }
      />

      <Alert variant="info" title="Human-in-the-loop by design" className="mb-5">
        Every AI-generated recommendation routes here before it can trigger a staffing or scheduling change.
        Nothing is auto-applied — authorised reviewers must approve, reject, or dismiss each item.
      </Alert>

      {/* Stats row */}
      {stats && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: stats.total, variant: 'neutral' },
            { label: 'Pending', value: stats.pending, variant: 'amber' },
            { label: 'Approved', value: stats.approved, variant: 'success' },
            { label: 'Rejected', value: stats.rejected, variant: 'rose' },
          ].map((s) => (
            <Card key={s.label} padded>
              <p className="text-xs text-ink-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{s.value}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card padded={false} className="mb-4">
        <div className="flex flex-wrap gap-3 border-b border-border p-4">
          <FilterBar
            filters={[
              { id: 'status', label: 'Status', value: statusFilter, options: STATUS_OPTIONS, onChange: setStatusFilter },
              { id: 'severity', label: 'Severity', value: severityFilter, options: SEVERITY_OPTIONS, onChange: setSeverityFilter },
            ]}
            onClearAll={() => { setStatusFilter('pending'); setSeverityFilter('all'); }}
          />
        </div>
      </Card>

      {error && (
        <Alert variant="error" title={error} className="mb-4" />
      )}

      {isLoading ? (
        <LoadingSkeleton variant="list" rows={3} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={statusFilter === 'pending' ? 'Review queue is clear' : 'No reviews found'}
          description={statusFilter === 'pending'
            ? 'No AI recommendations are currently awaiting approval. Click "Generate from Live Data" to create new recommendations.'
            : 'Try a different status or severity filter.'}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((item) => {
            const SevIcon = SEVERITY_ICON[item.severity] || Info;
            const isPending = item.status === 'pending';
            return (
              <Card key={item._id} padded={false}>
                <div className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        item.severity === 'critical' ? 'bg-signal-rose-soft text-signal-rose' :
                        item.severity === 'watch' ? 'bg-signal-amber-soft text-signal-amber' :
                        'bg-brand-50 text-brand-600'
                      )}>
                        <SevIcon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{item.title}</p>
                          <Badge variant={SEVERITY_VARIANT[item.severity]}>{item.severity}</Badge>
                          <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">{item.description}</p>

                        {item.recommendation && (
                          <div className="mt-3 rounded-md bg-canvas border border-border p-3 text-sm">
                            <p className="font-medium text-ink">Recommendation</p>
                            <p className="mt-1 text-ink-muted">{item.recommendation}</p>
                          </div>
                        )}

                        {item.expectedImpact && (
                          <p className="mt-2 text-xs text-ink-faint">
                            <span className="font-medium text-ink-muted">Expected impact:</span> {item.expectedImpact}
                          </p>
                        )}

                        {item.aiExplanation && (
                          <p className="mt-1 text-xs text-ink-faint">
                            <span className="font-medium text-ink-muted">AI explanation:</span> {item.aiExplanation.slice(0, 200)}{item.aiExplanation.length > 200 ? '…' : ''}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                          <span>{item.confidence}% confidence</span>
                          <span>·</span>
                          <span>Module: {item.module}</span>
                          <span>·</span>
                          <span>Model: {item.modelVersion}</span>
                          <span>·</span>
                          <span>{formatDate(item.createdAt)} {formatTime(item.createdAt)}</span>
                        </div>

                        {!isPending && item.reviewedBy && (
                          <p className="mt-2 text-xs text-ink-faint">
                            <span className="font-medium text-ink-muted">
                              {item.status === 'approved' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Dismissed'} by
                            </span>{' '}
                            {item.reviewedBy.firstName} {item.reviewedBy.lastName}
                            {item.reviewNote && ` — "${item.reviewNote}"`}
                          </p>
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex shrink-0 gap-2">
                        <Button variant="ghost" size="sm" icon={Minus} onClick={() => openAction(item, 'dismiss')}>
                          Dismiss
                        </Button>
                        <Button variant="secondary" size="sm" icon={X} onClick={() => openAction(item, 'reject')}>
                          Reject
                        </Button>
                        <Button size="sm" icon={Check} onClick={() => openAction(item, 'approve')}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-ink-muted">Page {page} of {pagination.totalPages}</span>
              <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>Next</Button>
            </div>
          )}
        </div>
      )}

      <ReviewActionModal
        isOpen={actionModal.open}
        onClose={closeAction}
        review={actionModal.review}
        actionType={actionModal.actionType}
        onSubmit={handleAction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
