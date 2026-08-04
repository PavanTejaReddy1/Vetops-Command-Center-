import { forecastService } from '../services/forecast.service.js';

export const forecastController = {
  async getForecastSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const summary = await forecastService.getForecastSummary({ startDate, endDate });
      res.json({ data: summary });
    } catch (error) {
      console.error('Get forecast summary error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch forecast summary' });
    }
  },

  async getAppointmentTrends(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      const trends = await forecastService.getAppointmentTrends({ startDate, endDate, period });
      res.json({ data: trends });
    } catch (error) {
      console.error('Get appointment trends error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch appointment trends' });
    }
  },

  async getVeterinarianWorkload(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const workload = await forecastService.getVeterinarianWorkload({ startDate, endDate });
      res.json({ data: workload });
    } catch (error) {
      console.error('Get veterinarian workload error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch veterinarian workload' });
    }
  },

  async getPredictionTrends(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      const trends = await forecastService.getPredictionTrends({ startDate, endDate, period });
      res.json({ data: trends });
    } catch (error) {
      console.error('Get prediction trends error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch prediction trends' });
    }
  },

  async getRiskDistribution(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const distribution = await forecastService.getRiskDistribution({ startDate, endDate });
      res.json({ data: distribution });
    } catch (error) {
      console.error('Get risk distribution error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch risk distribution' });
    }
  },

  async getTaskTrends(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      const trends = await forecastService.getTaskTrends({ startDate, endDate, period });
      res.json({ data: trends });
    } catch (error) {
      console.error('Get task trends error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch task trends' });
    }
  },

  async getPerformanceMetrics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await forecastService.getPerformanceMetrics({ startDate, endDate });
      res.json({ data: metrics });
    } catch (error) {
      console.error('Get performance metrics error:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch performance metrics' });
    }
  },
};
