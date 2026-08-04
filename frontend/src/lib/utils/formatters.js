/**
 * Shared formatting helpers. Centralizing these keeps number/date display
 * consistent across KPI cards, tables, and reports without every page
 * re-implementing Intl calls.
 */

export function formatNumber(value, options = {}) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function formatPercent(value, { signed = false } = {}) {
  if (value === null || value === undefined) return '—';
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value}%`;
}

export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', options).format(d);
}

export function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(d);
}

export function formatRelativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '—';
  const diffMs = d.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const divisions = [
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Infinity, unit: 'year' },
  ];

  let duration = diffMinutes;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), 'year');
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
