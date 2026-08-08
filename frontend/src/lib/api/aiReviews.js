import { apiClient } from './axiosClient';

export const aiReviewsApi = {
  async list(params = {}) {
    const response = await apiClient.get('/ai-reviews', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/ai-reviews/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/ai-reviews', data);
    return response.data;
  },

  async generate() {
    const response = await apiClient.post('/ai-reviews/generate');
    return response.data;
  },

  async approve(id, note = '') {
    const response = await apiClient.patch(`/ai-reviews/${id}/approve`, { note });
    return response.data;
  },

  async reject(id, note) {
    const response = await apiClient.patch(`/ai-reviews/${id}/reject`, { note });
    return response.data;
  },

  async dismiss(id, note = '') {
    const response = await apiClient.patch(`/ai-reviews/${id}/dismiss`, { note });
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/ai-reviews/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await apiClient.get('/ai-reviews/dashboard-stats');
    return response.data;
  },
};
