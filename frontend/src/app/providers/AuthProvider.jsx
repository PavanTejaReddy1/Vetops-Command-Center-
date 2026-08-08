import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('vetops_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await apiClient.get('/auth/profile');
      setUser(response.data.user);
    } catch (_) {
      localStorage.removeItem('vetops_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('vetops_token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      // err is already normalised by axiosClient interceptor
      const msg = err.message || 'Login failed. Check your credentials.';
      setError(msg);
      return { success: false, error: msg };
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
      const msg = err.message || 'Signup failed.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (_) {
      // ignore errors — always clear local state
    } finally {
      localStorage.removeItem('vetops_token');
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, clearError, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
