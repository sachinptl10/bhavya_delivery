import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const isAdmin = user && user.role === 'admin';
  const isUser = user && user.role === 'user';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
