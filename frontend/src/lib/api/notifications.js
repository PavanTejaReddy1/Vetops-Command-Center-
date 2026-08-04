import { apiClient } from './axiosClient';

export const notificationsApi = {
  async list(params = {}) {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },

  async markAsRead(id) {
    const response = await apiClient.patch(`/notifications/${id}/mark-read`);
    return response.data;
  },

  async markAllAsRead(recipient) {
    const response = await apiClient.post('/notifications/mark-all-read', { recipient });
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  async getUnreadCount(params = {}) {
    const response = await apiClient.get('/notifications/unread-count', { params });
    return response.data;
  },
};
