import { apiClient } from './axiosClient';

export const auditLogsApi = {
  async list(params = {}) {
    const response = await apiClient.get('/audit-logs', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/audit-logs/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/audit-logs', data);
    return response.data;
  },

  async export(format, params = {}) {
    const response = await apiClient.get(`/audit-logs/export/${format}`, {
      params,
      responseType: 'blob',
    });
    return response;
  },
};
