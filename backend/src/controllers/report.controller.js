import { reportService } from '../services/report.service.js';

export const reportController = {
  async getAppointmentReport(req, res) {
    try {
      const { startDate, endDate, veterinarian, status, department } = req.query;
      const report = await reportService.getAppointmentReport({ startDate, endDate, veterinarian, status, department });
      res.json({ data: report });
    } catch (error) {
      console.error('Get appointment report error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch appointment report' });
    }
  },

  async getVeterinarianPerformanceReport(req, res) {
    try {
      const { startDate, endDate, veterinarian } = req.query;
      const report = await reportService.getVeterinarianPerformanceReport({ startDate, endDate, veterinarian });
      res.json({ data: report });
    } catch (error) {
      console.error('Get veterinarian performance report error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch veterinarian performance report' });
    }
  },

  async getPredictionReport(req, res) {
    try {
      const { startDate, endDate, riskLevel, species } = req.query;
      const report = await reportService.getPredictionReport({ startDate, endDate, riskLevel, species });
      res.json({ data: report });
    } catch (error) {
      console.error('Get prediction report error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch prediction report' });
    }
  },

  async getTaskReport(req, res) {
    try {
      const { startDate, endDate, status, category, assignee } = req.query;
      const report = await reportService.getTaskReport({ startDate, endDate, status, category, assignee });
      res.json({ data: report });
    } catch (error) {
      console.error('Get task report error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch task report' });
    }
  },

  async getSystemActivityReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.getSystemActivityReport({ startDate, endDate });
      res.json({ data: report });
    } catch (error) {
      console.error('Get system activity report error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch system activity report' });
    }
  },

  async getAnalyticsSummary(req, res) {
    try {
      const { period } = req.query;
      const summary = await reportService.getAnalyticsSummary({ period });
      res.json({ data: summary });
    } catch (error) {
      console.error('Get analytics summary error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch analytics summary' });
    }
  },

  async exportReport(req, res) {
    try {
      const { type, format } = req.params;
      const { startDate, endDate, ...filters } = req.query;

      let reportData;
      switch (type) {
        case 'appointments':
          reportData = await reportService.getAppointmentReport({ startDate, endDate, ...filters });
          break;
        case 'veterinarians':
          reportData = await reportService.getVeterinarianPerformanceReport({ startDate, endDate, ...filters });
          break;
        case 'predictions':
          reportData = await reportService.getPredictionReport({ startDate, endDate, ...filters });
          break;
        case 'tasks':
          reportData = await reportService.getTaskReport({ startDate, endDate, ...filters });
          break;
        case 'system':
          reportData = await reportService.getSystemActivityReport({ startDate, endDate });
          break;
        default:
          return res.status(400).json({ message: 'Invalid report type' });
      }

      if (format === 'csv') {
        const csv = convertToCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${Date.now()}.csv"`);
        return res.send(csv);
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${type}-report-${Date.now()}.json"`);
        return res.json(reportData);
      } else {
        return res.status(400).json({ message: 'Invalid format. Use csv or json' });
      }
    } catch (error) {
      console.error('Export report error:', error);
      res.status(500).json({ message: error.message || 'Failed to export report' });
    }
  },
};

function convertToCSV(data) {
  const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const nested = flattenObject(obj[key], prefix + key + '.');
        Object.assign(result, nested);
      } else if (Array.isArray(obj[key])) {
        result[prefix + key] = JSON.stringify(obj[key]);
      } else {
        result[prefix + key] = obj[key];
      }
    }
    return result;
  };

  const items = Array.isArray(data) ? data : [data];
  if (items.length === 0) return '';

  const flattened = items.map(item => flattenObject(item));
  const headers = Object.keys(flattened[0]).join(',');
  const rows = flattened.map(item => Object.values(item).join(','));
  
  return [headers, ...rows].join('\n');
}
