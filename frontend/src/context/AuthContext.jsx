// Global authentication state using React Context
// Wraps the whole app to share user/token everywhere

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const token = localStorage.getItem('spendwise_token');
    const savedUser = localStorage.getItem('spendwise_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('spendwise_token');
        localStorage.removeItem('spendwise_user');
      }
    }
    setLoading(false);
  }, []);

  // Login: call API, save token + user
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('spendwise_token', data.token);
    localStorage.setItem('spendwise_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Register: same as login but POST to /register
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('spendwise_token', data.token);
    localStorage.setItem('spendwise_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Logout: tell backend, clear local storage
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if API fails, clear local session
    }
    localStorage.removeItem('spendwise_token');
    localStorage.removeItem('spendwise_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};