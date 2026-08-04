import axios from 'axios';

/**
 * Pre-configured Axios instance for all future API calls.
 *
 * Phase 1 note: nothing in this app calls this client yet — every page
 * reads from src/data (dummy data). This exists so Phase 2 can wire real
 * endpoints in one place (base URL, auth header, error interceptor)
 * without touching page components.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token when an auth system exists.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vetops_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error normalization so pages can rely on a consistent shape.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('vetops_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const normalized = {
      message: error.response?.data?.message || error.message || 'Unexpected error',
      status: error.response?.status ?? null,
      original: error,
    };
    return Promise.reject(normalized);
  }
);

export default apiClient;
