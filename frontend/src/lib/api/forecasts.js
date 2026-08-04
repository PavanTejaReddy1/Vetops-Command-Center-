import { apiClient } from './axiosClient';

export const forecastsApi = {
  async getForecastSummary(params = {}) {
    const response = await apiClient.get('/forecasts/summary', { params });
    return response.data;
  },

  async getAppointmentTrends(params = {}) {
    const response = await apiClient.get('/forecasts/appointment-trends', { params });
    return response.data;
  },

  async getVeterinarianWorkload(params = {}) {
    const response = await apiClient.get('/forecasts/veterinarian-workload', { params });
    return response.data;
  },

  async getPredictionTrends(params = {}) {
    const response = await apiClient.get('/forecasts/prediction-trends', { params });
    return response.data;
  },

  async getRiskDistribution(params = {}) {
    const response = await apiClient.get('/forecasts/risk-distribution', { params });
    return response.data;
  },

  async getTaskTrends(params = {}) {
    const response = await apiClient.get('/forecasts/task-trends', { params });
    return response.data;
  },

  async getPerformanceMetrics(params = {}) {
    const response = await apiClient.get('/forecasts/performance-metrics', { params });
    return response.data;
  },
};
