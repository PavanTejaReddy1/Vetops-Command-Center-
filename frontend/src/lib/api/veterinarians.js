import { apiClient } from './axiosClient';

export const veterinariansApi = {
  async list(params = {}) {
    const response = await apiClient.get('/veterinarians', { params });
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/veterinarians/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/veterinarians', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/veterinarians/${id}`, data);
    return response.data;
  },

  async remove(id) {
    const response = await apiClient.delete(`/veterinarians/${id}`);
    return response.data;
  },
};
