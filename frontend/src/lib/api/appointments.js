import { apiClient } from './axiosClient';

export const appointmentsApi = {
  async list(params = {}) {
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data;
  },

  async cancel(id) {
    const response = await apiClient.patch(`/appointments/${id}/cancel`);
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await apiClient.get('/appointments/dashboard-stats');
    return response.data;
  },
};
