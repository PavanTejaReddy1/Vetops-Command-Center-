/**
 * Dummy data — Predictive operational alerts
 * `severity` maps to signal colors: rose (critical), amber (watch), blue (info)
 */
export const alerts = [
  {
    id: 'alr-01',
    severity: 'critical',
    title: 'ER capacity projected to exceed threshold by 2:00 PM',
    detail: 'Emergency intake rate is trending 34% above the 4-week average for a Tuesday afternoon.',
    module: 'Forecast & Capacity',
    predictedFor: '2026-08-04T14:00:00',
    confidence: 88,
  },
  {
    id: 'alr-02',
    severity: 'watch',
    title: 'Dr. Marcus Webb approaching sustained overutilization',
    detail: 'Utilization has stayed above 90% for 3 consecutive shifts, raising fatigue-related risk.',
    module: 'Task Assignment',
    predictedFor: '2026-08-04T20:00:00',
    confidence: 76,
  },
  {
    id: 'alr-03',
    severity: 'watch',
    title: 'Exam Room 2 turnover time trending upward',
    detail: 'Average room turnover has increased from 9 to 15 minutes over the past week.',
    module: 'Workflow Queue',
    predictedFor: '2026-08-04T13:00:00',
    confidence: 71,
  },
  {
    id: 'alr-04',
    severity: 'info',
    title: 'Vaccination demand expected to rise next week',
    detail: 'Seasonal pattern suggests a 20% increase in vaccination bookings starting Monday.',
    module: 'Predictions',
    predictedFor: '2026-08-11T00:00:00',
    confidence: 64,
  },
];
