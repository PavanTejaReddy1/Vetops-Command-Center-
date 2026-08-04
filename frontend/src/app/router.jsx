import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

// Route-level code splitting — each module page loads on demand.
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const WorkflowQueuePage = lazy(() => import('../pages/WorkflowQueue/WorkflowQueuePage'));
const ForecastCapacityPage = lazy(() => import('../pages/ForecastCapacity/ForecastCapacityPage'));
const TaskAssignmentPage = lazy(() => import('../pages/TaskAssignment/TaskAssignmentPage'));
const PredictionsPage = lazy(() => import('../pages/Predictions/PredictionsPage'));
const AIReviewPage = lazy(() => import('../pages/AIReview/AIReviewPage'));
const ReportsPage = lazy(() => import('../pages/Reports/ReportsPage'));
const NotificationsPage = lazy(() => import('../pages/Notifications/NotificationsPage'));
const UsersPage = lazy(() => import('../pages/Users/UsersPage'));
const AuditLogsPage = lazy(() => import('../pages/AuditLogs/AuditLogsPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

function PageFallback() {
  return (
    <div className="flex flex-col gap-4">
      <LoadingSkeleton variant="kpi" />
      <LoadingSkeleton variant="card" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'workflow-queue', element: withSuspense(WorkflowQueuePage) },
      { path: 'forecast-capacity', element: withSuspense(ForecastCapacityPage) },
      { path: 'task-assignment', element: withSuspense(TaskAssignmentPage) },
      { path: 'predictions', element: withSuspense(PredictionsPage) },
      { path: 'ai-review', element: withSuspense(AIReviewPage) },
      { path: 'reports', element: withSuspense(ReportsPage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
      { path: 'users', element: withSuspense(UsersPage) },
      { path: 'audit-logs', element: withSuspense(AuditLogsPage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);
