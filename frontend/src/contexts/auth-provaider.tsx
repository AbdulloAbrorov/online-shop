import React, {  useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { User } from '../types';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User>('/auth/profile');
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        ['localStorage', 'sessionStorage'].forEach((storageType) => {
          try {
            const storage = window[storageType as 'localStorage' | 'sessionStorage'];
            storage.removeItem('token');
            storage.removeItem('refreshToken');
          } catch (e) {
            console.error(`Error clearing ${storageType}:`, e);
          }
        });
        if (!window.location.pathname.includes('/login')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await api.post<{
      access_token: string;
      refresh_token?: string;
      user: User;
    }>('/auth/login', {
      email,
      password,
      rememberMe,
    });
    
    const { access_token, refresh_token, user: userData } = response.data;
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', access_token);
    if (refresh_token) {
      storage.setItem('refreshToken', refresh_token);
    }
    
    setUser(userData);
    navigate(userData.role === 'ADMIN' ? '/admin' : '/');
  };

  const logout = () => {
    ['localStorage', 'sessionStorage'].forEach((storageType) => {
      try {
        const storage = window[storageType as 'localStorage' | 'sessionStorage'];
        storage.removeItem('token');
        storage.removeItem('refreshToken');
      } catch (e) {
        console.error(`Error clearing ${storageType}:`, e);
      }
    });
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};