import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../../lib/api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('vetops_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/auth/profile');
      setUser(response.data.user);
    } catch (err) {
      localStorage.removeItem('vetops_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/signup', { email, password, firstName, lastName });
      localStorage.setItem('vetops_token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('vetops_token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('vetops_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
