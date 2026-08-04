/**
 * Dummy data — KPI metrics for the Dashboard header row.
 * `trend` is a small sparkline series consumed by the KpiCard's VitalPulse accent.
 */
export const kpiMetrics = [
  {
    id: 'kpi-active-cases',
    label: 'Active Cases',
    value: 23,
    unit: '',
    delta: 8,
    deltaDirection: 'up',
    trend: [14, 15, 13, 17, 19, 18, 21, 23],
    tone: 'brand',
  },
  {
    id: 'kpi-avg-wait',
    label: 'Avg. Wait Time',
    value: 17,
    unit: 'min',
    delta: -4,
    deltaDirection: 'down',
    trend: [24, 22, 23, 20, 19, 18, 19, 17],
    tone: 'success',
  },
  {
    id: 'kpi-capacity',
    label: 'Capacity Utilization',
    value: 84,
    unit: '%',
    delta: 6,
    deltaDirection: 'up',
    trend: [70, 72, 75, 74, 78, 80, 82, 84],
    tone: 'amber',
  },
  {
    id: 'kpi-predicted-bottlenecks',
    label: 'Predicted Bottlenecks (24h)',
    value: 3,
    unit: '',
    delta: 1,
    deltaDirection: 'up',
    trend: [1, 1, 2, 1, 2, 2, 3, 3],
    tone: 'rose',
  },
];

export const forecastSeries = [
  { hour: '7a', predicted: 12, actual: 11 },
  { hour: '8a', predicted: 18, actual: 20 },
  { hour: '9a', predicted: 24, actual: 26 },
  { hour: '10a', predicted: 27, actual: 25 },
  { hour: '11a', predicted: 25, actual: null },
  { hour: '12p', predicted: 30, actual: null },
  { hour: '1p', predicted: 34, actual: null },
  { hour: '2p', predicted: 38, actual: null },
  { hour: '3p', predicted: 33, actual: null },
  { hour: '4p', predicted: 27, actual: null },
];

export const caseloadByDepartment = [
  { department: 'General', cases: 34 },
  { department: 'Emergency', cases: 21 },
  { department: 'Surgery', cases: 9 },
  { department: 'Dermatology', cases: 12 },
  { department: 'Cardiology', cases: 6 },
];
