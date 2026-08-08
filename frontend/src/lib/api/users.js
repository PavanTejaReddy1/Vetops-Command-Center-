import { apiClient } from './axiosClient';

export const usersApi = {
  async list(params = {}) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  async invite(data) {
    const response = await apiClient.post('/users/invite', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  async toggleActive(id, isActive) {
    const response = await apiClient.patch(`/users/${id}/toggle-active`, { isActive });
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
