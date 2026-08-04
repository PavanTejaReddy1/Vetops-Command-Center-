import { apiClient } from './axiosClient';

export const tasksApi = {
  async list(params = {}) {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await apiClient.get('/tasks/dashboard-stats');
    return response.data;
  },
};
