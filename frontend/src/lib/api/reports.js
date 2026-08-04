import { apiClient } from './axiosClient';

export const reportsApi = {
  async getAppointmentReport(params = {}) {
    const response = await apiClient.get('/reports/appointments', { params });
    return response.data;
  },

  async getVeterinarianPerformanceReport(params = {}) {
    const response = await apiClient.get('/reports/veterinarians', { params });
    return response.data;
  },

  async getPredictionReport(params = {}) {
    const response = await apiClient.get('/reports/predictions', { params });
    return response.data;
  },

  async getTaskReport(params = {}) {
    const response = await apiClient.get('/reports/tasks', { params });
    return response.data;
  },

  async getSystemActivityReport(params = {}) {
    const response = await apiClient.get('/reports/system', { params });
    return response.data;
  },

  async getAnalyticsSummary(params = {}) {
    const response = await apiClient.get('/reports/analytics/summary', { params });
    return response.data;
  },

  async exportReport(type, format, params = {}) {
    const response = await apiClient.get(`/reports/export/${type}/${format}`, {
      params,
      responseType: 'blob',
    });
    return response;
  },
};
