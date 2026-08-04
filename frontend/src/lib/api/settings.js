import { apiClient } from './axiosClient';

export const settingsApi = {
  async getAll() {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  async getByCategory(category) {
    const response = await apiClient.get(`/settings/${category}`);
    return response.data;
  },

  async update(key, value) {
    const response = await apiClient.put(`/settings/${key}`, { value });
    return response.data;
  },

  async updateCategory(category, updates) {
    const response = await apiClient.put(`/settings/category/${category}`, updates);
    return response.data;
  },

  async reset(category) {
    const response = await apiClient.post(`/settings/${category}/reset`);
    return response.data;
  },
};
