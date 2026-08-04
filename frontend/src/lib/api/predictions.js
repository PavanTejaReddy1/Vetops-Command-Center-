import { apiClient } from './axiosClient';

export const predictionsApi = {
  async list(params = {}) {
    const response = await apiClient.get('/predictions', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/predictions/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/predictions', data);
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/predictions/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await apiClient.get('/predictions/dashboard-stats');
    return response.data;
  },
};
